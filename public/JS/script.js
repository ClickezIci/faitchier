document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const logoutButton = document.getElementById('logoutButton');

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
                const result = await response.text(); // Utiliser .text() pour voir la réponse brute
                console.log('Réponse du serveur:', result); // Ajouter un journal pour vérifier la réponse
                const jsonResult = JSON.parse(result); // Convertir la réponse en JSON
                if (!response.ok) {
                    throw new Error(jsonResult.message);
                }
                if (jsonResult.success) {
                    window.location.href = jsonResult.redirectUrl;
                } else {
                    alert(jsonResult.message);
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert(error.message); // Afficher le message d'erreur spécifique
            }
        });
    }

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
                const result = await response.text(); // Utiliser .text() pour voir la réponse brute
                console.log('Réponse du serveur:', result); // Ajouter un journal pour vérifier la réponse
                const jsonResult = JSON.parse(result); // Convertir la réponse en JSON
                if (!response.ok) {
                    throw new Error(jsonResult.message);
                }
                if (jsonResult.success) {
                    window.location.href = jsonResult.redirectUrl;
                } else {
                    alert(jsonResult.message);
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert(error.message); // Afficher le message d'erreur spécifique
            }
        });
    }

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
});