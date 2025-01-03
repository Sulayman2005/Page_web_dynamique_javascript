document.getElementById("login_form").addEventListener("submit", async function(event){
    event.preventDefault();

    const errorDiv = document.getElementById("error");
    errorDiv.textContent = '';
    errorDiv.style.color = 'red';

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            body: JSON.stringify({email, password}),
            headers: {
                "Content-Type": "application/json"
            }
        });
         if (!response.ok) {
            if(response.status === 401) {
                errorDiv.textContent = "Erreur dans l'identifiant ou le mot de passe";
            } else {
                errorDiv.textContent = "Veuillez réssayer s'il vous plaît!";
            } if (response.status === 200) {
                password.innerHTML = "Nom d'utilisateur disponible";
                password.style.color = "green";
            }
            return;
        };

        const data = await response.json();
        console.log("Connexion réussie :", data);

        window.location.href = "./index.html"; 
    } catch(error) {
        error.console.log("Une erreur est survenue: ", error);
    }
});