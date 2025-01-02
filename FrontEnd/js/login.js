document.getElementById("login_form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const errorDiv = document.getElementById("error");
    errorDiv.textContent = ''; 
    errorDiv.style.color = 'red';

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                errorDiv.textContent = "Erreur dans l'identifiant ou le mot de passe";
            } else {
                errorDiv.textContent = "Erreur, veuillez réessayer";
            }
            return;
        }

        const data = await response.json();
        console.log("Connexion réussie :", data);

        window.location.href = "./index.html";

    } catch (error) {
        errorDiv.textContent = "Une erreur s'est produite, veuillez réessayer";
        console.error("Erreur lors de la tentative de connexion :", error);
    }
});