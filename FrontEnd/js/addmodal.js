const galleryModal = document.querySelector(".gallery_modal");
const addModal = document.querySelector(".add-modal");
const modalBackButton = document.querySelector(".js-modal-back");
const modalCloseButton = document.querySelector(".close-modal_1");
const addPhotoButton = document.querySelector(".add-photo-button");
const addPhotoForm = document.getElementById("add-photo-form");
/**
 * ajouté la modale
 */
addPhotoButton.addEventListener("click", () => {
    addModal.style.display = "block";
    document.querySelector("#modal1 .modal-wrapper").style.display = "none";
});
/**
 * revenir sur lancienne modale
 */
modalBackButton.addEventListener("click", () => {
    addModal.style.display = "none";
    document.querySelector("#modal1 .modal-wrapper").style.display = "block";
});
/**
 * fermer complétement la modale
 */
modalCloseButton.addEventListener("click", () => { 
    const modal = document.querySelector("#modal1");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
});

const fileInput = document.getElementById("file");
const previewIcon = document.getElementById("preview-icon");
const triggerFileButton = document.getElementById("trigger-file");
const textinsert = document.getElementById("text");
/**
 * accéder aux dossiers pour ajouter une image avec file
 */
triggerFileButton.addEventListener("click", () => {
    fileInput.click();
});

function addimagemodal() {
    let file;
    const img = document.createElement("img");
    const titleInput = document.getElementById("title");
    let titleValue = ""; // valeur saisie pour le titre
    let selectedValue = ""; // valeur saisie de la catégorie

    fileInput.addEventListener("change", function (event) {
        file = event.target.files[0]; // récupère le fichier sélectionner
        const maxFileSize = 4 * 1024 * 1024; // taille maximale 4Mo

        if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
            if (file.size > maxFileSize) {
                alert("La taille de l'image ne doit pas dépasser 4 Mo.");
                return;
            }
            const reader = new FileReader(); // utilise fileReader pour afficher l'image
            reader.onload = (e) => {
                img.src = e.target.result;
                img.alt = "Uploaded Photo";
                img.style.width = "129px";
                img.style.height = "173px";
                document.getElementById("photo-container").appendChild(img); // ajoute l'image
            };
            reader.readAsDataURL(file);
            previewIcon.style.display = "none";
            textinsert.style.display = "none";
            triggerFileButton.style.display = "none";
        } else {
            alert("Veuillez sélectionner une image au format JPG ou PNG.");
        }
    });

    titleInput.addEventListener("input", function () {
        titleValue = titleInput.value;// met à jour la valeur du titre
        updateSubmitButton();// met à jour le bouton
    });

    document.getElementById("category").addEventListener("change", function () {
        selectedValue = this.value;// met à jour la valeur de la catégorie sélectionné
        updateSubmitButton();// met à jour l'état du bouton
    });

    function updateSubmitButton() {
        const submitButton = document.querySelector(".submit-photo-button");
        if (titleValue && selectedValue && file) {
            submitButton.style.backgroundColor = "#1D6154";// bouton activé en vert
            submitButton.disabled = false;// bouton cliquable
        } else {
            submitButton.style.backgroundColor = "grey";// botuon désactivé en gris
            submitButton.disabled = true;// bouton non cliquable
        }
    }

    addPhotoForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        // vérifie si tous les champs sont remplis
        if (!file || !titleValue || !selectedValue) {
            alert("Veuillez remplir tous les champs correctement");
            return;
        }
        // utilisation du FormData pour l'envoie des données
        // le formdata est utilisé pour envoyé des données du formualire fichier, image.
        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", titleValue);
        formData.append("category", selectedValue);
        // récupère le token d'authentification dans 'sessionStorage'
        const token = sessionStorage.getItem("authToken");

        if (!token) {
            console.error("Token d'authentification manquant.");
            return;
        }

        try {
            // effectue une requête post pour envoyer les données
            let response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: { Authorization: "Bearer " + token }, // ajout du token
                body: formData,
            });
            // si la requête est réussie met à jour la galerie
            if (response.status === 201) {
                const newWork = await response.json();
                console.log("Image ajoutée avec succès !");
                ajoutgallerysansrecharge(newWork); // galerie mise à jour
                document.querySelector("#modal1").style.display = "none"; // Ferme la modale
            } else {
                console.error("Erreur lors de l'ajout :", response.statusText);
            }
        } catch (error) {
            console.error("Erreur :", error.message);
        }
    });
}


/**
 * 
 * @param {function pour ajouter l'image sans avoir besoin de recharger la page} newWork 
 */
function ajoutgallerysansrecharge(newWork) {
    const gallery = document.querySelector(".gallery");
    const modalGallery = document.querySelector(".gallery_modal");

    const figure = document.createElement("figure");
    // affiche le titre et l'image et son url
    figure.innerHTML = `<img src="${newWork.imageUrl}" alt="${newWork.title}"><figcaption>${newWork.title}</figcaption>`;
    gallery.appendChild(figure);

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");

    const img = document.createElement("img");
    img.src = newWork.imageUrl;
    img.alt = newWork.title;

    imageContainer.appendChild(img);
    modalGallery.appendChild(imageContainer);
}

addimagemodal();