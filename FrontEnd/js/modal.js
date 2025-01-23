/**
 * Open la Modal
 */
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

/**
 * Close la Modal
 */
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

    document.querySelectorAll(".close-modal_1").forEach((btn) => {
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
 * la fonction loadmodal permet de recharger les images dans la modale
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

/**
 * Ouvrir la modale et charger la galerie
 */
document.addEventListener("click", (e) => {
    /**
     * Vérifie si l'élément cliqué a la classe .js-modal
     */
    if (e.target.closest(".js-modal")) {
        e.preventDefault();

        /**
         * Afficher la modale
         */
        const modal = document.querySelector("#modal1");
        modal.style.display = "flex";
        modal.setAttribute("aria-hidden", "false");
        modal.setAttribute("aria-modal", "true");

        /**
         * Charger et afficher les images dans la galerie
         */
        loadModalGallery();
    }
});