document.getElementById("login_form").addEventListener("submit", async function(event){
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const api = "http://localhost:5678/api/users/login";

    const errorDiv = document.getElementById("error");
    errorDiv.textContent = '';
    errorDiv.style.color = 'red';
    


        let response = await fetch(api, {
            method: "POST",
            body: JSON.stringify({email, password}),
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if(response.status =! 200) {
            errorDiv.textContent = "Identifiant ou mot de passe incorrect";
            errorDiv.className = "error-login";
            errorDiv.innerHTML =
            "Veuillez vérifier votre email et/ou votre mot de passe";
            document.querySelector("form").prepend(errorBox);
        } else {
            let data = await response.json();
            console.log("Connexion réussie :", data);
            window.location.href = "./index.html";
        }
});