const email = document.querySelector("form #email") ;
const motdepasse = document.querySelector("form #password");
const error = document.querySelector(".error");
const connection = document.querySelector("form #connection");

async function getLogin() {
    const url = "http://localhost:5678/api/users/login";
    try {
        // Envoie une requête GET à l'API
        const response = await fetch(url);

        // Vérifie si la réponse est correcte (code HTTP 200-299)
        if (!response.ok) {
            throw new Error(`Erreur : ${response.status}`);
        }

        // Convertit la réponse en JSON
        const json = await response.json();
        console.log(json);
        for (let i = 0; i < json.length; i++) {
            console.log((json[i]));
        }
    } catch (error) {
        // Affiche l'erreur dans la console en cas de problème
        console.error("Erreur lors de la récupération des travaux :", error.message);
    }
}

getLogin();

