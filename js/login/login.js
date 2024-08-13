document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById("overlay");
    const closeBtn = document.getElementById("close-btn");
    const loginForm = document.getElementById("login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");


    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
        window.location.href = "home.html";
    }

    // botón cerrar 
    closeBtn.addEventListener("click", () => {
        overlay.style.display = "none";
    });

    // Envío del formulario 
    loginForm.addEventListener("submit", async(event) => {
        event.preventDefault();

        const email = usernameInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch("https://esenttiapp-production.up.railway.app/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario: email, password: password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("authToken", data.token);
                window.location.href = "home.html";
            } else {
                alert("Credenciales inválidas. Por favor, inténtalo de nuevo.");
            }
        } catch (error) {
            console.error("Error durante el inicio de sesión:", error);
            alert("Ocurrió un error durante el inicio de sesión. Por favor, inténtalo de nuevo más tarde.");
        }
    });


    $("#layoutv2-placeholder").load("/Componentes/layoutv2.html", function() {
        console.log('layoutv2 loaded');
        initializeLoginComponent();
        attachLoginFormEvent();
    });
});