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


// utilisateur connecter//

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
/**
 * la fonction loadmodal..
 */
async function loadModalGallery() {
    const modalGallery = document.querySelector(".gallery_modal");
    modalGallery.innerHTML = ''; // Vide la galerie avant de charger
    const url = "http://localhost:5678/api/works";

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur : ${response.status}`);
        const works = await response.json();

        works.forEach((work) => {
            const imageContainer = document.createElement("div");
            imageContainer.classList.add("image-container");

            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;

            const iconTrash = document.createElement("i");
            iconTrash.classList.add("fa-solid", "fa-trash-can", "icon-trash");
            iconTrash.setAttribute("data-id", work.id);

            imageContainer.appendChild(img);
            imageContainer.appendChild(iconTrash);

            modalGallery.appendChild(imageContainer);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des images :", error.message);
    }
}

// Ouvrir la modale et charger la galerie
document.addEventListener("click", (e) => {
    // Vérifie si l'élément cliqué a la classe .js-modal
    if (e.target.closest(".js-modal")) {
        e.preventDefault();

        // Afficher la modale
        const modal = document.querySelector("#modal1");
        modal.style.display = "flex";
        modal.setAttribute("aria-hidden", "false");
        modal.setAttribute("aria-modal", "true");

        // Charger et afficher les images dans la galerie
        loadModalGallery();
    }
});

/**
 * cette fonct
 * @param {int} imageId 
 */

async function deleteImage(imageId) {
    const url = `http://localhost:5678/api/works/${imageId}`;

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'image :", error.message);
    }
}

function deleteImagetrash(e) {
    if (e.target.classList.contains("icon-trash")) {
        const imageId = e.target.getAttribute("data-id"); // Récupère l'ID de l'image
        if (!imageId) return;

        // Confirmation utilisateur avant suppression
        const confirmDelete = confirm("Voulez-vous vraiment supprimer cette image!");
        if (!confirmDelete) return;

        // Supprime l'image côté serveur
        deleteImage(imageId).then((success) => {
            if (success) {
                // Supprime l'élément correspondant dans le DOM
                const imageContainer = e.target.closest(".image-container");
                imageContainer.remove();
            }
        });
    }
}

document.querySelector(".gallery_modal").addEventListener("click", deleteImagetrash);


// Sélection des éléments nécessaires
const galleryModal = document.querySelector(".gallery_modal");
const addModal = document.querySelector(".add-modal");
const modalBackButton = document.querySelector(".js-modal-back");
const modalCloseButton = document.querySelector(".close-modal");
const addPhotoButton = document.querySelector(".add-photo-button");
const buttoninsert = document.querySelector(".button_insert");

// Ouvrir la modale d'ajout
addPhotoButton.addEventListener("click", () => {
    addModal.style.display = "block"; // Affiche la modale d'ajout
    document.querySelector("#modal1 .modal-wrapper").style.display = "none"; // Masque la galerie
});

// Retourner à la galerie
modalBackButton.addEventListener("click", () => {
    addModal.style.display = "none"; // Masque la modale d'ajout
    document.querySelector("#modal1 .modal-wrapper").style.display = "block"; // Réaffiche la galerie
});

// Fermer complètement la modale
modalCloseButton.addEventListener("click", () => {
    const modal = document.querySelector("#modal1");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
});


addPhotoButton.addEventListener("submit", async(e) => {
    e.preventDefault();

    const formData = new FormData(addPhotoButton);

    const fileInput = document.getElementById("#avatar");
    const file = fileInput.files[0];

    formData.append("avatar", file);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
            },
            body: formData,
        });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'image :", error.message);
    }
})