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

//MODAL

let modal = null

const openModal = function(e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    target.style.display = null;
    target.setAttribute('aria-hidden', 'true');
    target.setAttribute('aria-modal', 'true');
    modal = target;
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
}

const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal', 'true');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    modal = null;
}

const stopPropagation = function (e) {
    e.stopPropagation();
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
});

window.addEventListener('keydown', function(e) {
    if(e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
});

