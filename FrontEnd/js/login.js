document.getElementById("login_form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const api = "http://localhost:5678/api/users/login";

    const errorDiv = document.getElementById("error");
    errorDiv.textContent = '';
    errorDiv.style.color = 'red';

    try {
        let response = await fetch(api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (email == "canteausulayman@mail.fr" || password == "Sulayman49") {
            const data = await response.json();
            console.log("Connexion réussie :", data);
            window.location.href = "index.html";
        } else {
            if (response.status === 200) {
                errorDiv.textContent = "Erreur dans l'identifiant ou le mot de passe";
            } else {
                errorDiv.textContent = "Une erreur est survenue veuillez résayer";
            } return;
        }
    } catch (error) {
        console.error("Erreur lors de la tentative de connexion :", error);
    }
});