const url = "http://localhost:5678/api";

// Fonction pour récupérer les données des travaux (works) depuis l'API
async function getWorks(filter) {
    document.querySelector(".gallery").innerHTML = '';
    const url = "http://localhost:5678/api/works"; // URL de l'API
    try {
        // Envoie une requête GET à l'API
        const response = await fetch(url);

        // Vérifie si la réponse est correcte (code HTTP 200-299)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        // Convertit la réponse en JSON
        const json = await response.json();
        if (filter) {
            const filtered = json.filter((data) => data.categoryId === filter);
            for (let i = 0; i < filtered.length; i++) {
                setFigure(filtered[i]);
            } 
        }   else {
            // Parcourt les données et ajoute chaque élément à la galerie
            for (let i = 0; i < json.length; i++) {
                setFigure(json[i]); // Appelle la fonction pour créer une figure
            }
        }
    }   catch (error) {
        // Affiche l'erreur dans la console en cas de problème
        console.error("Erreur lors de la récupération des travaux :", error.message);
    }
}

getWorks();


// Fonction pour créer et ajouter une figure dans la galerie
function setFigure(data) {
    // Crée une balise <figure>
    const figure = document.createElement("figure");

    // Ajoute une image et une légende à la figure
    figure.innerHTML = `
        <img src="${data.imageUrl}" alt="${data.title}">
        <figcaption>${data.title}</figcaption>
    `;

    // Sélectionne la galerie et ajoute la figure
    document.querySelector(".gallery").append(figure);
}


async function getCategories() {
    const url = "http://localhost:5678/api/categories";
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
            setFilter(json[i]);
        }
    } catch (error) {
        // Affiche l'erreur dans la console en cas de problème
        console.error("Erreur lors de la récupération des travaux :", error.message);
    }
}

getCategories();

function setFilter(data) {
    console.log(data);
    const div = document.createElement("div");
    div.className = data.id;
    div.addEventListener("click", () => getWorks(data.id));
    div.innerHTML = `${data.name}`;
    document.querySelector(".filters").append(div);
}

document.querySelector(".tous").addEventListener("click", () => getWorks());


// MODAL //

function displayEditMode() {
    if (sessionStorage.getItem("authToken")) {
        const editBanner = document.createElement("div");
        editBanner.classList.add("edit"); 
        editBanner.innerHTML = `
            <p>
                <a href="#modal1" class="js-modal">
                    <i class="fa-regular fa-pen-to-square"></i> Mode édition
                </a>    
            </p>`;    
        document.body.prepend(editBanner);     
    }    
}    



 // OPEN MODAL //
const openModal = function (e) {
    e.preventDefault();
    const href = e.target.closest("a").getAttribute("href");
    const target = document.querySelector(href); 
    if (target) {
        target.style.display = "flex";
        target.setAttribute("aria-hidden", "false");
        target.setAttribute("aria-modal", "true");
    }
};


// CLOSE MODAL //
const closeModal = function () {
    const modal = document.querySelector(".modal");
    if (modal) {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
        modal.removeAttribute("aria-modal");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    displayEditMode();


    document.querySelectorAll(".js-modal").forEach((a) => {
        a.addEventListener("click", openModal);
    });


    document.querySelectorAll(".close-modal").forEach((btn) => {
        btn.addEventListener("click", closeModal);
    });


    window.addEventListener("click", (e) => {
        const modal = document.querySelector(".modal");
        const modalWrapper = document.querySelector(".modal-wrapper");
        if (e.target === modal && !modalWrapper.contains(e.target)) {
            closeModal();
        }
    });
});

function displayEditicone() {
    if (sessionStorage.getItem("authToken")) {
        const iconeModal = document.querySelector(".gallery_modal");
        const editIcone = document.createElement("div");
        editIcone.classList.add("icone_image"); 
        editIcone.innerHTML = ``;    
        document.body.prepend(editIcone);     
    }    
}

async function loadModalGallery() {
    const modalGallery = document.querySelector(".gallery_modal");
    modalGallery.innerHTML = ''; // Vide la galerie avant de charger
    const url = "http://localhost:5678/api/works";

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur : ${response.status}`);
        const works = await response.json();

        works.forEach((work) => {
            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;
            modalGallery.appendChild(img);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des images :", error.message);
    }
}

// Ouvrir la modale et charger la galerie
document.querySelector(".js-modal").addEventListener("click", (e) => {
    e.preventDefault();
    const modal = document.querySelector("#modal1");
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-modal", "true");

    loadModalGallery(); // Charger les images
});

// Fermer la modale
document.querySelector(".close-modal").addEventListener("click", () => {
    const modal = document.querySelector("#modal1");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
});

