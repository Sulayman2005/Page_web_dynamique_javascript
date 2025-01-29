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
    fileInput.click(); // Déclenche l'ouverture de l'explorateur de fichiers
});

function addimagemodal() {
  const img = document.createElement("img");
  let file; // On ajoutera dans cette variable la photo qui a été chargée
  const titleInput = document.getElementById("title");
  let titleValue = "";
  let selectedValue = ""; // Initialisé comme une chaîne vide pour s'assurer que la catégorie doit être sélectionnée

  // Ajout de l'image
  fileInput.style.display = "none";
  fileInput.addEventListener("change", function (event) {
    file = event.target.files[0];
    const maxFileSize = 4 * 1024 * 1024;

    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      if (file.size > maxFileSize) {
        alert("La taille de l'image ne doit pas dépasser 4 Mo.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
        img.alt = "Uploaded Photo";
        img.style.width = "129px";
        img.style.height = "173px";
        document.getElementById("photo-container").appendChild(img);
      };
      reader.readAsDataURL(file);
      document.querySelectorAll(".picture-loaded").forEach((e) => (e.style.display = "none"));
      document.querySelectorAll(".button_insert").forEach((e) => (e.style.display = "none"));
      document.querySelectorAll(".text_insert").forEach((e) => (e.style.display = "none"));
    } else {
      alert("Veuillez sélectionner une image au format JPG ou PNG.");
    }
  });

  // Sélectionner un filtre dans la partie catégorie
  document.getElementById("category").addEventListener("change", function () {
    selectedValue = this.value;
    updateSubmitButton(); // Mise à jour de l'état du bouton Valider à chaque changement
  });

  // Ajouter l'image au DOM
  titleInput.addEventListener("input", function () {
    titleValue = titleInput.value;
    updateSubmitButton(); // Mise à jour de l'état du bouton Valider à chaque changement
  });

  // Mettre à jour la couleur du bouton "Valider" en fonction de la validité des champs
  function updateSubmitButton() {
    const submitButton = document.querySelector(".submit-photo-button");
    // Le bouton devient vert uniquement si tous les champs sont remplis et une image est ajoutée
    if (titleValue && selectedValue && file) {
      submitButton.style.backgroundColor = "#1D6154"; // Change la couleur en vert
      submitButton.disabled = false; // Active le bouton
    } else {
      submitButton.style.backgroundColor = "grey"; // Garde le bouton en gris
      submitButton.disabled = true; // Désactive le bouton
    }
  }

  // Vérifier si tous les champs sont remplis lors de la soumission du formulaire
  const addPictureForm = document.getElementById("add-photo-form");
  addPictureForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Vérification si l'image, le titre et la catégorie sont remplis avant d'envoyer
    const hasImage = document.querySelector("#photo-container").firstChild;
    if (hasImage && titleValue && selectedValue) {
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
      alert("Veuillez remplir tous les champs correctement");
    }
  });
}

addimagemodal();

