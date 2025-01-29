/**
 * 
 * @param {Fonction getWorks récupérer les données des travaux (works) depuis l'API} filter 
 */
async function getWorks(filter) {
    document.querySelector(".gallery").innerHTML = '';
    const url = "http://localhost:5678/api/works"; // URL de l'API
    try {
        /**
         * Envoie une requête GET à l'API
         */
        const response = await fetch(url);

        /**
         * Vérifie si la réponse est correcte
         */
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        /**
         * Convertit la réponse en JSON
         */
        const json = await response.json();
        if (filter) {
            /**
             * Filtre les projets selon leur `categoryId`
             *  */
            const filtered = json.filter((data) => data.categoryId === filter);
            for (let i = 0; i < filtered.length; i++) {
                setFigure(filtered[i]);
            } 
        }   else {
            /**
             * Parcourt les données et ajoute chaque élément à la galerie
             */
            for (let i = 0; i < json.length; i++) {
                setFigure(json[i]); /**
                Appelle la fonction pour créer une figure */
            }
        }
    }   catch (error) {
        console.error("Erreur lors de la récupération des travaux :", error.message);
    }
}

getWorks();



/**
 * Fonction pour créer et ajouter une figure dans la galerie
 */
function setFigure(data) {
    const figure = document.createElement("figure");

    /**
     * Ajoute une image et une légende à la figure
     */
    figure.innerHTML = `
        <img src="${data.imageUrl}" alt="${data.title}">
        <figcaption>${data.title}</figcaption>
    `;

    /**
     * Sélectionne la galerie et ajoute la figure
     */
    document.querySelector(".gallery").append(figure);
}


async function getCategories() {
    const url = "http://localhost:5678/api/categories";
    try {
        /**
         * Envoie une requete a l'API
         */
        const response = await fetch(url);

        /**
         * Vérifie si la réponse est correcte
         */
        if (!response.ok) {
            throw new Error(`Erreur : ${response.status}`);
        }

        /**
         * Convertie la réponse en JSON
         */
        const json = await response.json();
        for (let i = 0; i < json.length; i++) {
            setFilter(json[i]);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des travaux :", error.message);
    }
}

getCategories();

/**
 * 
 * @param {setFilter} data 
 * la function setFilter permet de filtrer les filtres et de clicker sur le bouton "TOUS"
 * et d'afficher toutes les images 
 */
// Fonction pour créer et gérer les filtres
function setFilter(data) {
    const div = document.createElement("div");
    div.classList.add("filter-button"); // Classe générique pour tous les filtres
    div.textContent = data.name;

    div.addEventListener("click", () => {
        // Retire la classe 'filter-active' de TOUS les boutons (y compris "Tous")
        document.querySelectorAll(".filter-button, .tous").forEach(button => button.classList.remove("filter-active"));

        // Ajoute la classe uniquement au bouton sélectionné
        div.classList.add("filter-active");

        // Charge les travaux filtrés
        getWorks(data.id);
    });

    document.querySelector(".filters").append(div);
}


const buttontous = document.querySelector(".tous");

// Gère le clic sur "Tous"
buttontous.addEventListener("click", () => {
    // Retire la classe 'filter-active' de tous les boutons de filtre
    document.querySelectorAll(".filter-button, .tous").forEach(button => button.classList.remove("filter-active"));

    // Active seulement le bouton "Tous"
    buttontous.classList.add("filter-active");

    // Affiche tous les projets
    getWorks();
});


/**
 * la function displayEditMode permet de connecter les Utilisateurs après la connexion
 * sur le login
 */

function displayEditMode() {
    if (sessionStorage.getItem("authToken")) {
        document.querySelector(".filters").style.display = "none";
        document.querySelector(".js-modal-2").style.display = "block";
        const editBanner = document.createElement("div");
        editBanner.classList.add("edit"); 
        editBanner.innerHTML = `
            <p>
                <a href="#modal1" class="js-modal">
                    <i class="fa-regular fa-pen-to-square"></i> Mode édition
                </a>    
            </p>`;    
        document.body.prepend(editBanner);     
        document.querySelector(".login_link").textContent = "logout";
        document.querySelector(".login_link").addEventListener("click", () => {
            sessionStorage.removeItem("authToken");
        });
    }    
}


