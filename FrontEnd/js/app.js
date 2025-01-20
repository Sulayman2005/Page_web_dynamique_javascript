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


async function deleteImage(imageId) {
    const token = sessionStorage.authToken;   

    const url = `http://localhost:5678/api/works/${imageId}`;
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // Si nécessaire
            },
        });

        if (!response.ok) {
            // Affiche un message d'erreur selon le code de statut
            console.error(`Erreur ${response.status} : ${response.statusText}`);
            return false;
        }

        console.log("Image supprimée avec succès !");
        return true;
    } catch (error) {
        console.error("Erreur lors de la suppression :", error.message);
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
                if (imageContainer) {
                    imageContainer.remove();
                }
            } else {
                alert("Problème avec l'API !");
            }
        });
    }
}

document.querySelector(".gallery_modal").addEventListener("click", deleteImagetrash);

// Sélection des éléments nécessaires
const galleryModal = document.querySelector(".gallery_modal");
const addModal = document.querySelector(".add-modal");
const modalBackButton = document.querySelector(".js-modal-back");
const modalCloseButton = document.querySelector(".close-modal_1");
const addPhotoButton = document.querySelector(".add-photo-button");
const addPhotoForm = document.getElementById("add-photo-form");

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

// Sélection des éléments nécessaires
const fileInput = document.getElementById("file");
const imagePreview = document.getElementById("image-preview");
const previewIcon = document.getElementById("preview-icon");
const triggerFileButton = document.getElementById("trigger-file");

// Ouvrir l'explorateur de fichiers lorsque l'utilisateur clique sur "+ Ajouter une photo"
triggerFileButton.addEventListener("click", () => {
    fileInput.click(); // Déclenche l'ouverture de l'explorateur de fichiers
});

function addimagemodal() {
    const img = document.createElement("img");
    const fileInput = document.getElementById("file");
    let file; // On ajoutera dans cette variable la photo qui a été uploadée.
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
        // Je converti l'image en une URL de donnees
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
  
    document.getElementById("category").addEventListener("change", function () {
      selectedValue = this.value;
    });
  
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
          const errorBox = document.createElement("div");
          errorBox.className = "error-login";
          errorBox.innerHTML = `Il y a eu une erreur : ${errorText}`;
          document.querySelector("form").prepend(errorBox);
        }
      } else {
        alert("Veuillez remplir tous les champs");
      }
    });
}

addimagemodal();
