// Definir logoutUser en el ámbito global
async function logoutUser() {
    const authToken = localStorage.getItem("authToken");

    // Mostrar la pantalla de carga
    document.getElementById("loading-spinner").style.display = "block";

    if (authToken) {
        try {
            const response = await fetch("https://esenttiapp-production.up.railway.app/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                // Cierre de sesión exitoso en el servidor, borrar datos locales y redirigir
                localStorage.clear();
                document.cookie.split(";").forEach(function(c) {
                    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });
                window.location.replace("/");
            } else {
                // Error al cerrar sesión en el servidor, forzar cierre de sesión en el navegador
                console.error("Error al cerrar sesión en el servidor:", response.status);
                forceLogout();
            }
        } catch (error) {
            // Error de red, forzar cierre de sesión en el navegador
            console.error("Error de red al intentar cerrar sesión en el servidor:", error);
            forceLogout();
        } finally {
            // Ocultar la pantalla de carga en cualquier caso (éxito o error)
            document.getElementById("loading-spinner").style.display = "none";
        }
    } else {
        window.location.replace("/");
    }
}

function forceLogout() {
    // Borrar cookies
    document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Borrar localStorage
    localStorage.clear();

    // Redirigir a la página de inicio
    window.location.replace("/");
}

// Temporizador de inactividad
let inactivityTimer;

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        console.log('Temporizador activado. Cerrando sesión.'); // Verificar si el temporizador se activa
        mostrarModalInicioSesion(); // Asegúrate de que esta función exista
        logoutUser();
    }, 15 * 60 * 1000);
}
// Reiniciar el temporizador en cada evento de usuario
document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keydown', resetInactivityTimer);

document.addEventListener('DOMContentLoaded', function() {
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