async function deleteImage(imageId) {
    const token = sessionStorage.getItem("authToken"); // Récupération du token

    if (!token) {
        alert("Vous devez être connecté pour supprimer une image.");
        return false;
    }

    const url = `http://localhost:5678/api/works/${imageId}`;
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error(`Erreur ${response.status} : ${response.statusText}`);
            return false;
        }

        console.log("Image supprimée avec succès !");
        return true;
    } catch (error) {
        console.error("Erreur lors de la suppression :", error.message);
        return false;
    }
}

function deleteImagetrash(e) {
    // lors du click on regarde si l'élément est cliqué contient la icon-trash
    if (e.target.classList.contains("icon-trash")) {
        e.preventDefault();
        //récupère l'id de l'image
        const imageId = e.target.getAttribute("data-id"); // Récupère l'ID de l'image
        if (!imageId) return;

        // Confirmation utilisateur avant suppression
        const confirmDelete = confirm("Voulez-vous vraiment supprimer cette image ?");
        if (!confirmDelete) return;

        // Supprime l'image côté serveur
        deleteImage(imageId).then((success) => {
            if (success) {
                // Supprime l'élément correspondant dans le DOM
                const imageContainer = e.target.closest(".image-container");
                if (imageContainer) {
                    imageContainer.remove();
                }

                // Mise à jour sans recharger la page
                miseajourdelagalerie();
            } else {
                alert("Problème avec l'API !");
            }
        });
    }
}

// Écouteur d'événements pour la suppression des images
document.querySelector(".gallery_modal").addEventListener("click", deleteImagetrash);

/**
 * Met à jour la galerie après suppression, sans recharger la page
 */
function miseajourdelagalerie() {
    const gallery = document.querySelector(".gallery");
    const modalGallery = document.querySelector(".gallery_modal");

    // Vide la galerie pour éviter les doublons
    gallery.innerHTML = "";
    modalGallery.innerHTML = "";

    fetch("http://localhost:5678/api/works") // requête fetch est envoyé au serveur
        .then((response) => response.json())
        .then((works) => {
            works.forEach((work) => {
                // Création de l'image pour la galerie principale
                const figure = document.createElement("figure");
                figure.innerHTML = `
                    <img src="${work.imageUrl}" alt="${work.title}">
                    <figcaption>${work.title}</figcaption>
                `;
                gallery.appendChild(figure);

                // Création de l'image avec l'icône poubelle pour la modale
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
        })
        .catch((error) => console.error("Erreur lors du rechargement des images :", error.message));
}
