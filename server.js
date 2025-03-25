const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors'); // Importer le middleware CORS
const app = express();
const port = 3000;

// Connexion à MySQL avec Sequelize
const sequelize = new Sequelize('MaDB', 'clickezici', 'dB9_888_slip', {
    host: 'localhost',
    dialect: 'mysql',
    dialectOptions: {
        charset: 'utf8mb4' // Assurez-vous que la base de données utilise l'encodage UTF-8
    }
});

// Définition du modèle utilisateur
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Synchroniser le modèle avec la base de données
sequelize.sync()
    .then(() => console.log('Base de données synchronisée'))
    .catch(err => console.error('Erreur de synchronisation de la base de données:', err));

app.use(cors()); // Utiliser le middleware CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'votre_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Utilisez true en production avec HTTPS
}));

// Middleware pour définir l'encodage des réponses
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    next();
});

// Route pour l'inscription
app.post('/signup', async (req, res) => {
    const { newUsername, newPassword } = req.body;
    if (!newUsername || !newPassword) {
        return res.status(400).json({ success: false, message: 'Nom d\'utilisateur et mot de passe requis' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    try {
        const user = await User.create({ username: newUsername, password: hashedPassword });
        res.json({ success: true, redirectUrl: 'http://localhost:3000/hello.html' });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ success: false, message: 'Nom d\'utilisateur déjà pris' });
        } else {
            res.status(500).json({ success: false, message: 'Erreur du serveur' });
        }
    }
});

// Route pour la connexion
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;
            res.json({ success: true, redirectUrl: 'http://localhost:3000/hello.html' });
        } else {
            res.status(401).json({ success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ success: false, message: 'Erreur du serveur' });
    }
});

// Route pour la déconnexion
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion:', err);
            return res.status(500).json({ success: false, message: 'Erreur lors de la déconnexion' });
        }
        res.json({ success: true });
    });
});

// Route pour servir les fichiers HTML avec l'encodage correct
app.get('/*.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.sendFile(path.join(__dirname, 'public', req.path));
});

// Middleware pour gérer les erreurs 404
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'Ressource non trouvée' });
});

// Middleware pour gérer les erreurs serveur
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    res.status(500).json({ success: false, message: 'Erreur du serveur' });
});

app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});