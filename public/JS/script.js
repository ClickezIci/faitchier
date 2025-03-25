document.addEventListener('DOMContentLoaded', () => {
    // Récupération des éléments du DOM
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const logoutButton = document.getElementById('logoutButton');
    const menuButton = document.getElementById('menuButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const usernameElement = document.getElementById('username');
    const mySpaceButton = document.getElementById('mySpaceButton'); // Récupération du bouton "Mon espace"

    // Fonction pour récupérer dynamiquement le nom d'utilisateur connecté
    async function fetchUsername() {
        try {
            const response = await fetch('http://localhost:3000/user', { // Endpoint pour récupérer les informations de l'utilisateur
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                usernameElement.textContent = data.username; // Assurez-vous que le serveur renvoie un objet avec une propriété 'username'
            } else {
                console.error('Erreur lors de la récupération du nom d\'utilisateur');
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    // Appeler la fonction pour récupérer le nom d'utilisateur
    fetchUsername();

    // Gestion de la soumission du formulaire de connexion
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = event.target.username.value;
            const password = event.target.password.value;
            try {
                const response = await fetch('http://localhost:3000/login', { // Utiliser le bon port
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                const result = await response.json();
                console.log('Réponse du serveur:', result); // Ajouter un journal pour vérifier la réponse
                if (!response.ok) {
                    throw new Error(result.message);
                }
                if (result.success) {
                    window.location.href = result.redirectUrl;
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert(error.message); // Afficher le message d'erreur spécifique
            }
        });
    }

    // Gestion de la soumission du formulaire d'inscription
    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const newUsername = event.target.newUsername.value;
            const newPassword = event.target.newPassword.value;
            try {
                const response = await fetch('http://localhost:3000/signup', { // Utiliser le bon port
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ newUsername, newPassword })
                });
                const result = await response.json();
                console.log('Réponse du serveur:', result); // Ajouter un journal pour vérifier la réponse
                if (!response.ok) {
                    throw new Error(result.message);
                }
                if (result.success) {
                    window.location.href = result.redirectUrl;
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert(error.message); // Afficher le message d'erreur spécifique
            }
        });
    }

    // Gestion de la déconnexion
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('http://localhost:3000/logout', { // Utiliser le bon port
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    window.location.href = 'http://localhost:3000/index.html'; // Rediriger vers la page d'accueil
                } else {
                    alert('Erreur lors de la déconnexion. Veuillez réessayer.');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Une erreur est survenue. Veuillez réessayer.');
            }
        });
    }

    // Gestion de l'affichage du menu déroulant
    if (menuButton) {
        menuButton.addEventListener('click', () => {
            dropdownMenu.classList.toggle('show');
        });
    }

    // Gestion de la fermeture du menu déroulant en cliquant en dehors
    window.addEventListener('click', (event) => {
        if (!event.target.matches('#menuButton')) {
            const dropdowns = document.getElementsByClassName('dropdown-content');
            for (let i = 0; i < dropdowns.length; i++) {
                const openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    });

    // Gestion de la redirection du bouton "Mon espace"
    if (mySpaceButton) {
        mySpaceButton.addEventListener('click', (event) => {
            event.preventDefault(); // Empêcher le comportement par défaut du lien
            window.location.href = 'http://localhost:3000/espace.html'; // Rediriger vers la page espace.html
        });
    }
});