const galleryModal = document.querySelector(".gallery_modal");
const addModal = document.querySelector(".add-modal");
const modalBackButton = document.querySelector(".js-modal-back");
const modalCloseButton = document.querySelector(".close-modal_1");
const addPhotoButton = document.querySelector(".add-photo-button");
const addPhotoForm = document.getElementById("add-photo-form");

addPhotoButton.addEventListener("click", () => {
    addModal.style.display = "block";
    document.querySelector("#modal1 .modal-wrapper").style.display = "none";
});

modalBackButton.addEventListener("click", () => {
    addModal.style.display = "none";
    document.querySelector("#modal1 .modal-wrapper").style.display = "block";
});

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

triggerFileButton.addEventListener("click", () => {
    fileInput.click();
});

function addimagemodal() {
    let file;
    const img = document.createElement("img");
    const titleInput = document.getElementById("title");
    let titleValue = "";
    let selectedValue = "";

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
            previewIcon.style.display = "none";
            textinsert.style.display = "none";
            triggerFileButton.style.display = "none";
        } else {
            alert("Veuillez sélectionner une image au format JPG ou PNG.");
        }
    });

    titleInput.addEventListener("input", function () {
        titleValue = titleInput.value;
        updateSubmitButton();
    });

    document.getElementById("category").addEventListener("change", function () {
        selectedValue = this.value;
        updateSubmitButton();
    });

    function updateSubmitButton() {
        const submitButton = document.querySelector(".submit-photo-button");
        if (titleValue && selectedValue && file) {
            submitButton.style.backgroundColor = "#1D6154";
            submitButton.disabled = false;
        } else {
            submitButton.style.backgroundColor = "grey";
            submitButton.disabled = true;
        }
    }

    addPhotoForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!file || !titleValue || !selectedValue) {
            alert("Veuillez remplir tous les champs correctement");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", titleValue);
        formData.append("category", selectedValue);

        const token = sessionStorage.getItem("authToken");

        if (!token) {
            console.error("Token d'authentification manquant.");
            return;
        }

        try {
            let response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: { Authorization: "Bearer " + token },
                body: formData,
            });

            if (response.status === 201) {
                const newWork = await response.json();
                console.log("Image ajoutée avec succès !");
                ajoutgallerysansrecharge(newWork);
                document.querySelector("#modal1").style.display = "none"; // Ferme la modale
            } else {
                console.error("Erreur lors de l'ajout :", response.statusText);
            }
        } catch (error) {
            console.error("Erreur :", error.message);
        }
    });
}

function ajoutgallerysansrecharge(newWork) {
    const gallery = document.querySelector(".gallery");
    const modalGallery = document.querySelector(".gallery_modal");

    const figure = document.createElement("figure");
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