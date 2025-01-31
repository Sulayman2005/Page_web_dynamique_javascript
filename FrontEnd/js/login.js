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
            body: JSON.stringify({ email, password }), // permet d'authentifier l'utilisateur
        });

        if(!response.ok) {
            if (response.status === 401) {
                errorDiv.textContent = "Erreur dans l'identifiant ou le mot de passe";
            } else {
                errorDiv.textContent = "Une erreur est survenue veuillez résayer";
            }
        } else {
            let result = await response.json(); // si les identifiants sont valides, le serveur retroune un token
            const token = result.token;
            sessionStorage.setItem("authToken", token);// le token est stockée dans le sessionStorage
            // sous la clé de "authotoken"
            window.location.href = "index.html";
        }    // le sessionStorage est utilisé pour connecté l'utilisateur
    } catch (error) {
        console.error("Erreur lors de la tentative de connexion :", error);
    }
});