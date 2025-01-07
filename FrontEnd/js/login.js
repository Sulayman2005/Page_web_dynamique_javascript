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
        console.log(response);

        if(!response.ok) {
            if (response.status === 401) {
                errorDiv.textContent = "Erreur dans l'identifiant ou le mot de passe";
            } else {
                errorDiv.textContent = "Une erreur est survenue veuillez résayer";
            }
        } else {
            const data = await response.json();
            console.log("Connexion réussie :", data);
            window.location.href = "index.html";
        }    
    } catch (error) {
        console.error("Erreur lors de la tentative de connexion :", error);
    }
});