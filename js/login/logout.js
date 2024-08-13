document.addEventListener('DOMContentLoaded', function() {
    // Borrar cookies
    document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Borrar localStorage
    localStorage.clear();

    // Opcional: Intenta realizar la solicitud de cierre de sesión al servidor
    logoutUser(); 

    async function logoutUser() {
        const authToken = localStorage.getItem("authToken"); // Ya no es necesario, pero se puede mantener para intentar el cierre de sesión en el servidor

        if (authToken) { 
            try {
                const response = await fetch("https://esenttiapp-production.up.railway.app/api/logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) {
                    console.error("Error al cerrar sesión en el servidor:", response.status);
                }
            } catch (error) {
                console.error("Error de red al intentar cerrar sesión en el servidor:", error);
            }
        } 

        // Redirige al usuario a la página de inicio, independientemente de la respuesta del servidor
        window.location.replace("/"); 
    }

    // Manejo del botón de cierre de sesión (si existe)
    function addLogoutEventListener() {
        const logoutButton = document.getElementById("logout-button");
        if (logoutButton) {
            logoutButton.addEventListener("click", logoutUser);
        } else {
            setTimeout(addLogoutEventListener, 100); 
        }
    }

    addLogoutEventListener(); 
});
