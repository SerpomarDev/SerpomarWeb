$(function() {

    var isopen_usermenu = false;

    // Ocultar el menú al cargar la página
    $(".header .user-menu").hide();

    /**
     * Open and close usermenu event
     */
    $(".header .user-menu-toggle").on("click", function() {
        if (!isopen_usermenu) {

            // Show menu
            $(".header .user-menu").show();

            //Change arrow
            $(".user-menu-toggle .simple-arrow").removeClass("fa-chevron-down").addClass("fa-chevron-up");

            isopen_usermenu = true;
        } else {

            // Close menu
            $(".header .user-menu").hide();


            //Change arrow
            $(".user-menu-toggle .simple-arrow").removeClass("fa-chevron-up").addClass("fa-chevron-down");

            isopen_usermenu = false;
        }
    });
});

// Manejar el clic en el ícono de perfil
const profileIcon = document.querySelector('.profile-icon');
const profileDropdown = document.createElement('div'); // Crear el contenedor del desplegable
profileDropdown.classList.add('profile-dropdown');
profileDropdown.style.display = 'none'; // Ocultar el desplegable inicialmente

profileIcon.addEventListener('click', () => {
    const userId = localStorage.getItem('userId');
    const apiUrlUsuario = `https://esenttiapp-production.up.railway.app/api/usuario/${userId}`;

    const token = localStorage.getItem('authToken');
    const requestOptions = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    };

    fetch(apiUrlUsuario, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener la información del usuario');
            }
            return response.json();
        })
        .then(userData => {
            // Construir el contenido del desplegable
            const dropdownContent = `
                <p>${userData.correo}</p>
                <p>Cargo: ${userData.cargo}</p>
                <p>Nombre: ${userData.primer_nombre} ${userData.primer_apellido}</p>
                <p>Teléfono: ${userData.telefono}</p>
            `;

            profileDropdown.innerHTML = dropdownContent; // Asignar el contenido al desplegable
            profileDropdown.style.display = 'block'; // Mostrar el desplegable

            // Posicionar el desplegable debajo del icono de perfil
            const profileIconRect = profileIcon.getBoundingClientRect();
            profileDropdown.style.position = 'absolute';
            profileDropdown.style.top = `${profileIconRect.bottom + 5}px`; // 5px de margen inferior
            profileDropdown.style.right = '10px'; // Ajusta según tu diseño

            document.body.appendChild(profileDropdown); // Agregar el desplegable al cuerpo del documento

            // Cerrar el desplegable al hacer clic fuera de él
            document.addEventListener('click', (event) => {
                if (!profileIcon.contains(event.target) && !profileDropdown.contains(event.target)) {
                    profileDropdown.style.display = 'none';
                }
            });
        })
        .catch(error => {
            console.error('Error al obtener la información del usuario:', error);
            alert('Error al cargar la información del perfil. Por favor, inténtalo de nuevo más tarde.');
        });
});