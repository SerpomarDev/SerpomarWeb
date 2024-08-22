// Definir logoutUser en el ámbito global
async function logoutUser() {
    const authToken = localStorage.getItem("authToken");

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

// Función para manejar la respuesta de la API al refrescar el token
async function handleRefreshTokenResponse(response) {
    if (!response.ok) {
        const data = await response.json();
        if (data.error === 'session_expired') {
            mostrarModalInicioSesion(); // Muestra tu modal aquí
            logoutUser(); // Cierra la sesión del usuario
        } else {
            console.error('Error al refrescar el token:', data.error);
            // Maneja otros errores si es necesario
        }
    }
    // Si la respuesta es OK, el token se refrescó correctamente, no necesitas hacer nada más aquí.
}

// Refrescar el token periódicamente
function refreshAuthTokenPeriodically() {
    setInterval(async() => {
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
                handleRefreshTokenResponse(response);
            } catch (error) {
                console.error("Error de red al intentar refrescar el token:", error);
                // Maneja el error de red si es necesario
            }
        }
    }, 14 * 60 * 1000); // Refresca el token 1 minuto antes de que expire (asumiendo que expira en 15 minutos)
}

// Temporizador de inactividad
let inactivityTimer;

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        console.log('Temporizador activado. Cerrando sesión.');
        mostrarModalInicioSesion();
        logoutUser();
    }, 15 * 60 * 1000);

    // Reinicia el intervalo de actualización del token
    refreshAuthTokenPeriodically();
}

// Reiniciar el temporizador en cada evento de usuario
document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keydown', resetInactivityTimer);

// Manejo del botón de cierre de sesión y la carga de la página
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

    // Inicia el refresco periódico del token al cargar la página
    refreshAuthTokenPeriodically();
});
// //CREAR MODAL PARA VERIFICAR EL USUARIO---------------------------------------

// function verificarToken() {
//     const token = localStorage.getItem('authToken');

//     fetch('https://esenttiapp-production.up.railway.app/api/navieras', {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         })
//         .then(response => {
//             if (response.status === 401) {
//                 console.log('Error 401 detectado. Mostrando modal');
//                 mostrarModalInicioSesion();
//             }
//         })
//         .catch(error => {
//             console.error('Error al verificar el token:', error);
//         });
// }

// function mostrarModalInicioSesion() {
//     // Crear el modal si no existe
//     let modalauditor = document.getElementById('modalInicioSesion');
//     if (!modalauditor) {
//         modalauditor = document.createElement('div');
//         modalauditor.id = 'modalInicioSesion';
//         modalauditor.classList.add('modalauditor');
//         modalauditor.innerHTML = `
//             <div class="modalauditor-content">
//                 <span class="close">&times;</span>
//                 <h2>Tu sesión ha expirado</h2>
//                 <p>Por favor, inicia sesión nuevamente.</p>
//                 <button id="btnIniciarSesion">Iniciar sesión</button>
//             </div>
//         `;
//         document.body.appendChild(modalauditor);

//         // Cerrar el modal al hacer clic en la "x"
//         const spanClose = modalauditor.querySelector('.close');
//         spanClose.onclick = function() {
//             modalauditor.style.display = "none";
//         }

//         // Cerrar el modal al hacer clic fuera del contenido
//         window.onclick = function(event) {
//             if (event.target == modalauditor) {
//                 modalauditor.style.display = "none";
//             }

//         }
//     }

//     // Lógica para el botón de inicio de sesión (ejecutar cierre de sesión)
//     const btnIniciarSesion = modalauditor.querySelector('#btnIniciarSesion');
//     btnIniciarSesion.onclick = function() {
//         logoutUser();
//     }
// }

// // Verificar el token al cargar la página
// window.onload = function() {
//     verificarToken();
//     resetInactivityTimer(); // Iniciar el temporizador de inactividad
// }

// // Verificar el token cada 10 minuto
// setInterval(verificarToken, 600000);

// // Verificar el token al ingresar a la página
// window.onfocus = verificarToken;