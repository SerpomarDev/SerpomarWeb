// // Definir logoutUser en el ámbito global
// async function logoutUser() {
//     const authToken = localStorage.getItem("authToken");

//     // Mostrar la pantalla de carga
//     document.getElementById("loading-spinner").style.display = "block";

//     if (authToken) {
//         try {
//             const response = await fetch("https://esenttiapp-production.up.railway.app/api/logout", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${authToken}`,
//                 },
//             });

//             if (response.ok) {
//                 // Cierre de sesión exitoso en el servidor, borrar datos locales y redirigir
//                 localStorage.clear();
//                 document.cookie.split(";").forEach(function(c) {
//                     document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
//                 });
//                 window.location.replace("/");
//             } else {
//                 // Error al cerrar sesión en el servidor, forzar cierre de sesión en el navegador
//                 console.error("Error al cerrar sesión en el servidor:", response.status);
//                 forceLogout();
//             }
//         } catch (error) {
//             // Error de red, forzar cierre de sesión en el navegador
//             console.error("Error de red al intentar cerrar sesión en el servidor:", error);
//             forceLogout();
//         } finally {
//             // Ocultar la pantalla de carga en cualquier caso (éxito o error)
//             document.getElementById("loading-spinner").style.display = "none";
//         }
//     } else {
//         window.location.replace("/");
//     }
// }

// function forceLogout() {
//     // Borrar cookies
//     document.cookie.split(";").forEach(function(c) {
//         document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
//     });

//     // Borrar localStorage
//     localStorage.clear();

//     // Redirigir a la página de inicio
//     window.location.replace("/");
// }

// let inactivityTimer;

// function resetInactivityTimer() {
//     clearTimeout(inactivityTimer);
//     inactivityTimer = setTimeout(() => {
//         console.log('Temporizador activado. Mostrando modal.');
//         mostrarModalInicioSesion(); 
//     }, 25 * 60 * 1000); // 30 minutos en milisegundos
// }

// document.addEventListener('mousemove', resetInactivityTimer);
// document.addEventListener('keydown', resetInactivityTimer);

// document.addEventListener('DOMContentLoaded', function() {
//     // Manejo del botón de cierre de sesión (si existe)
//     function addLogoutEventListener() {
//         const logoutButton = document.getElementById("logout-button");
//         if (logoutButton) {
//             logoutButton.addEventListener("click", logoutUser);
//         } else {
//             setTimeout(addLogoutEventListener, 100);
//         }
//     }

//     addLogoutEventListener();
//     // Iniciar el temporizador de inactividad
//     resetInactivityTimer();
// });





async function logoutUser() {
    const authToken = localStorage.getItem("authToken");
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
                localStorage.clear();
                document.cookie.split(";").forEach(function(c) {
                    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });
                window.location.replace("/");
            } else {
                console.error("Error al cerrar sesión en el servidor:", response.status);
                forceLogout();
            }
        } catch (error) {
            console.error("Error de red al intentar cerrar sesión en el servidor:", error);
            forceLogout();
        } finally {
            document.getElementById("loading-spinner").style.display = "none";
        }
    } else {
        window.location.replace("/");
    }
}

function forceLogout() {
    document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    localStorage.clear();
    window.location.replace("/");
}

async function refreshToken() {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
        try {
            const response = await fetch("https://esenttiapp-production.up.railway.app/api/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("authToken", data.access_token);  
                console.log("Token refreshed successfully!");
                return true; 
            } else {
                console.error("Error al refrescar el token:", response.status);
                return false; 
            }
        } catch (error) {
            console.error("Error de red al intentar refrescar el token:", error);
            return false; 
        }
    }
}

function mostrarModalInicioSesion() {
    Swal.fire({
        title: "¿Sigues utilizando la aplicación?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
    }).then((result) => {
        if (result.isConfirmed) {
            refreshToken();
        } else {
            logoutUser();
        }
    });
}

let inactivityTimer;

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        console.log('Temporizador activado. Mostrando modal.');
        mostrarModalInicioSesion(); 
    }, 25 * 60 * 1000);
}

document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keydown', resetInactivityTimer);

document.addEventListener('DOMContentLoaded', function() {
    function addLogoutEventListener() {
        const logoutButton = document.getElementById("logout-button");
        if (logoutButton) {
            logoutButton.addEventListener("click", logoutUser);
        } else {
            setTimeout(addLogoutEventListener, 100);
        }
    }

    addLogoutEventListener();

    resetInactivityTimer();
});