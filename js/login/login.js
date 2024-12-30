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

        // Deshabilitar el botón de envío
        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;

        // Mostrar el elemento de carga con posición absoluta y z-index alto
        const loadingSpinner = document.getElementById("loading-spinner");
        if (loadingSpinner) {
            loadingSpinner.style.display = "block";
            loadingSpinner.style.position = "fixed";
            loadingSpinner.style.top = "50%";
            loadingSpinner.style.left = "50%";
            loadingSpinner.style.transform = "translate(-50%, -50%)";
            loadingSpinner.style.zIndex = "1000";
        }

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
                localStorage.setItem("userId", data.user_id);
                localStorage.setItem("rol_Id", data.rol_id);
                localStorage.setItem("cliente", data.cliente);

                window.location.href = "home.html";
            } else {
                alert("Credenciales inválidas. Por favor, inténtalo de nuevo.");
            }
        } catch (error) {
            console.error("Error durante el inicio de sesión:", error);
            alert("Ocurrió un error durante el inicio de sesión. Por favor, inténtalo de nuevo más tarde.");
        } finally {
            // Volver a habilitar el botón y ocultar el elemento de carga
            submitButton.disabled = false;
            if (loadingSpinner) {
                loadingSpinner.style.display = "none";
            }
        }
    });

    $("#layoutv2-placeholder").load("/Componentes/layoutv2.html", function() {
        console.log('layoutv2 loaded');
        // Asegúrate de que estas funciones existan y estén definidas correctamente
        initializeLoginComponent();
        attachLoginFormEvent();
    });
});