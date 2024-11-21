window.addEventListener('headerLoaded', () => {
    // Este código se ejecutará después de que el encabezado se haya cargado

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
    const profileDropdown = document.createElement('div');
    profileDropdown.classList.add('profile-dropdown');
    profileDropdown.style.display = 'none';

    if (profileIcon) {
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
                    const dropdownContent = `
              <p>${userData.email}</p>
              <p>Cargo: ${userData.cargo}</p>
              <p>Nombre: ${userData.primer_nombre} ${userData.primer_apellido}</p>
              <p>Teléfono: ${userData.telefono}</p>
            `;

                    profileDropdown.innerHTML = dropdownContent;
                    profileDropdown.style.display = 'block';

                    const profileIconRect = profileIcon.getBoundingClientRect();
                    profileDropdown.style.position = 'absolute';
                    profileDropdown.style.top = `${profileIconRect.bottom + 5}px`;
                    profileDropdown.style.right = '10px';

                    document.body.appendChild(profileDropdown);

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
    } else {
        console.error("No se pudo encontrar el elemento .profile-icon");
    }
});