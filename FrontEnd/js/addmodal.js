/**
 * Récupérer les éléments du html pour pouvoir les utiliser en javascript avec des
 * querySelector
 */
const galleryModal = document.querySelector(".gallery_modal");
const addModal = document.querySelector(".add-modal");
const modalBackButton = document.querySelector(".js-modal-back");
const modalCloseButton = document.querySelector(".close-modal_1");
const addPhotoButton = document.querySelector(".add-photo-button");
const addPhotoForm = document.getElementById("add-photo-form");

/**
 * Ouvrir la modale d'ajout
 */
addPhotoButton.addEventListener("click", () => {
    addModal.style.display = "block"; // Affiche la modale d'ajout
    document.querySelector("#modal1 .modal-wrapper").style.display = "none"; // Masque la galerie
});

/**
 * Retourner à la galerie
 */
modalBackButton.addEventListener("click", () => {
    addModal.style.display = "none"; // Masque la modale d'ajout
    document.querySelector("#modal1 .modal-wrapper").style.display = "block"; // Réaffiche la galerie
});

/**
 * Fermer complètement la modale
 */
modalCloseButton.addEventListener("click", () => {
    const modal = document.querySelector("#modal1");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
});

/**
 * Sélection des éléments nécessaires pour ajouter des images dans la modale
 */
const fileInput = document.getElementById("file");
const imagePreview = document.getElementById("image-preview");
const previewIcon = document.getElementById("preview-icon");
const triggerFileButton = document.getElementById("trigger-file");

/**
 * Ouvrir l'explorateur de fichiers lorsque l'utilisateur clique sur "+ Ajouter une photo"
 */
triggerFileButton.addEventListener("click", () => {
    fileInput.click(); /**
    Déclenche l'ouverture de l'explorateur de fichiers */
});

function addimagemodal() {
    const img = document.createElement("img");
    const fileInput = document.getElementById("file");
    let file; /**
     * On ajoutera dans cette variable la photo qui a été chargée
     */
    fileInput.style.display = "none";
    fileInput.addEventListener("change", function (event) {
      file = event.target.files[0];
      const maxFileSize = 4 * 1024 * 1024;
  
      if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
        if (file.size > maxFileSize) {
          alert("La taille de l'image ne doit pas dépasser 4 Mo.");
          return;
        }
        /**
         * ajuster la taille de l'image et ajouter l'image
         */
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
          img.alt = "Uploaded Photo";
          img.style.width = "129px";
          img.style.height = "173px";
          document.getElementById("photo-container").appendChild(img);
        };
        /**
         * je convertie l'image en une URL 
         */
        reader.readAsDataURL(file);
        document.querySelectorAll(".picture-loaded").forEach((e) => (e.style.display = "none"));
        document.querySelectorAll(".button_insert").forEach((e) => (e.style.display = "none"));
        document.querySelectorAll(".text_insert").forEach((e) => (e.style.display = "none"));// enlever tous ce qu'il ya dans la modale après l'ajout de l'image
      } else {
        alert("Veuillez sélectionner une image au format JPG ou PNG.");
      }
    });
  
    const titleInput = document.getElementById("title");
    let titleValue = "";
    let selectedValue = "1";

    /**
     * Sélectionner un filtre dans la partie catégorie
     */
    document.getElementById("category").addEventListener("change", function () {
      selectedValue = this.value;
    });

    /**
     * ajouter l'image au DOM
     */
    titleInput.addEventListener("input", function () {
      titleValue = titleInput.value;
    });
  
    const addPictureForm = document.getElementById("add-photo-form");
  
    addPictureForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const hasImage = document.querySelector("#photo-container").firstChild;
      if (hasImage && titleValue) {
        const formData = new FormData();
  
        formData.append("image", file);
        formData.append("title", titleValue);
        formData.append("category", selectedValue);
  
        const token = sessionStorage.authToken;
  
        if (!token) {
          console.error("Token d'authentification manquant.");
          return;
        }
  
        let response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
          },
          body: formData,
        });
        if (response.status !== 201) {
          const errorText = await response.text();
          console.error("Erreur : ", errorText);
        }
      } else {
        alert("Veuillez remplir tous les champs");
      }
    });
}

addimagemodal();