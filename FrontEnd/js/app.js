// Fonction pour récupérer les données des travaux (works) depuis l'API
async function getWorks() {
    const url = "http://localhost:5678/api/works"; // URL de l'API
    try {
        // Envoie une requête GET à l'API
        const response = await fetch(url);

        // Vérifie si la réponse est correcte (code HTTP 200-299)
        if (!response.ok) {
            throw new Error(`Erreur : ${response.status}`);
        }

        // Convertit la réponse en JSON
        const json = await response.json();

        // Appelle la fonction pour afficher les travaux dans la galerie
        displayWorks(json);
    } catch (error) {
        // Affiche l'erreur dans la console en cas de problème
        console.error("Erreur lors de la récupération des travaux :", error.message);
    }
}

// Fonction pour afficher les travaux dans la galerie
function displayWorks(works) {
    // Crée dynamiquement un conteneur de galerie
    const gallery = document.createElement("div");
    gallery.className = "gallery"; // Ajoute une classe CSS à la galerie
    document.querySelector("#portfolio").appendChild(gallery); // Ajoute la galerie au `<body>`

    // Parcourt les travaux récupérés depuis l'API
    works.forEach(work => {
        // Crée une balise <figure> pour chaque travail
        const figure = document.createElement("figure");

        // Crée une balise <img> pour l'image
        const img = document.createElement("img");
        img.src = work.imageUrl; // Définit l'URL de l'image
        img.alt = work.title; // Définit le texte alternatif

        // Crée une balise <figcaption> pour la légende
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title; // Définit le titre du travail

        // Ajoute l'image et la légende dans la balise <figure>
        figure.appendChild(img);
        figure.appendChild(figcaption);

        // Ajoute la balise <figure> dans la galerie
        gallery.appendChild(figure);
    });
}

// Appelle la fonction pour récupérer et afficher les travaux
getWorks();