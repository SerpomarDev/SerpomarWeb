function initializeLoginComponent() {
    const loginButton = document.getElementById("login-button");
    const sesionOkContainer = document.querySelector(".sesionok");
    const closeButton = document.getElementById("close-btn");
    const overlay = document.getElementById("overlay");

    if (loginButton && sesionOkContainer && closeButton && overlay) {
        loginButton.addEventListener("click", function(event) {
            event.preventDefault();
            console.log("Button clicked");  // Mensaje para depuración
            if (sesionOkContainer.classList.contains("show")) {
                sesionOkContainer.classList.remove("show");
            } else {
                sesionOkContainer.classList.add("show");
            }
        });

        closeButton.addEventListener("click", function() {
            sesionOkContainer.classList.remove("show");
        });

        overlay.addEventListener("click", function(event) {
            if (event.target === overlay) {
                sesionOkContainer.classList.remove("show");
            }
        });
    } else {
        console.error("Login button, sesionOk container, close button or overlay not found!");
    }
}

initializeLoginComponent();
