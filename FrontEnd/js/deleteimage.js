async function deleteImage(imageId) {
    const token = sessionStorage.authToken;   

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
    }
}


function deleteImagetrash(e) {
    if (e.target.classList.contains("icon-trash")) {
        const imageId = e.target.getAttribute("data-id"); /**
        Récupère l'ID de l'image */
        if (!imageId) return;

        /**
         * Confirmation utilisateur avant suppression
         */
        const confirmDelete = confirm("Voulez-vous vraiment supprimer cette image!");
        if (!confirmDelete) return;

        /**
         * Supprime l'image côté serveur
         */
        deleteImage(imageId).then((success) => {
            if (success) {
                /**
                 * Supprime l'élément correspondant dans le DOM
                 */
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
