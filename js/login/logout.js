document.addEventListener('DOMContentLoaded', function() {
    let inactivityTimeout;

    function startInactivityTimer() {
        inactivityTimeout = setTimeout(logoutUser, 10 * 60 * 1000); // 10 minutos
    }

    function resetInactivityTimer() {
        clearTimeout(inactivityTimeout);
        startInactivityTimer();
    }

    async function logoutUser() {
        const authToken = localStorage.getItem("authToken");

        if (authToken) { // Verifica si hay un token antes de intentar cerrar sesión
            try {
                const response = await fetch("https://esenttiapp-production.up.railway.app/api/logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`,
                    },
                });

                if (response.ok) {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("userData");
                    document.cookie.split(";").forEach(function(c) {
                        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                    });
                    window.location.href = "index.html";
                } else {

                    console.error("Error al cerrar sesión:", response.status);
                }
            } catch (error) {

                console.error("Error de red:", error);
            }
        } else {

            window.location.href = "/index.html";
        }
    }

    function addLogoutEventListener() {
        const logoutButton = document.getElementById("logout-button");
        if (logoutButton) {
            logoutButton.addEventListener("click", logoutUser);
        } else {
            setTimeout(addLogoutEventListener, 100);
        }
    }

    document.addEventListener("mousemove", resetInactivityTimer);
    document.addEventListener("keypress", resetInactivityTimer);

    startInactivityTimer();
    addLogoutEventListener();
});