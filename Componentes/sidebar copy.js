function loadSidebar() {
    const menuItemsContainer = document.getElementById('menu-items-container');
    const apiUrlMenu = 'https://esenttiapp-production.up.railway.app/api/createmenu';
    const apiUrlRoles = 'https://esenttiapp-production.up.railway.app/api/uploadroles';

    // Obtener el token y el rol del localStorage
    const token = localStorage.getItem('authToken');
    const rolId = localStorage.getItem('rol_Id');

    // Configurar las opciones de la solicitud con la cabecera de autorización
    const requestOptions = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    };

    // Primero, obtener los datos de roles
    fetch(apiUrlRoles, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(roles => {
            // Encontrar el rol del usuario
            const userRole = roles.find(role => role.id == rolId);

            if (!userRole) {
                console.error('Rol de usuario no encontrado.');
                menuItemsContainer.innerHTML = '<p>Error al cargar el menú. Rol de usuario no válido.</p>';
                return; // Detener la ejecución si no se encuentra el rol
            }

            // Obtener los IDs de menú y submenú permitidos para el rol
            const allowedMenuItems = userRole.menu_item.split(',').map(Number);
            const allowedMenuSubitems = userRole.menu_subitem.split(',').map(Number);

            // Luego, obtener los datos del menú
            fetch(apiUrlMenu, requestOptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(menuItems => {
                    // Filtrar los elementos del menú según el rol (solo usando id_propio)
                    const filteredMenuItems = menuItems.filter(item => {
                        return allowedMenuItems.includes(item.id_propio);
                    });

                    const menuGroups = {};

                    // Verificar si filteredMenuItems es un array antes de usar forEach
                    if (Array.isArray(filteredMenuItems)) {
                        filteredMenuItems.forEach(item => {
                            if (!menuGroups[item.nombre]) {
                                menuGroups[item.nombre] = [];
                            }
                            menuGroups[item.nombre].push(item);
                        });

                        let menuHtml = '<ul id="menu">';
                        for (const groupName in menuGroups) {
                            const groupId = groupName.toLowerCase().replace(/ /g, '-');

                            // Obtener el icono
                            const groupIcon = menuGroups[groupName][0].icono_mi;

                            // Filtrar los sub-elementos del menú según allowedMenuSubitems
                            const filteredSubMenuItems = menuGroups[groupName].filter(item => {
                                return allowedMenuSubitems.includes(item.id_subitem);
                            });

                            // Solo agregar el grupo al menú si tiene sub-elementos permitidos
                            if (filteredSubMenuItems.length > 0) {
                                menuHtml += `
                                    <li class="dropdown" id="menu-${groupId}">
                                        <a class="has-arrow" href="#" aria-expanded="false">
                                            ${groupIcon} <span class="nav-text">${groupName} ></span>
                                        </a>
                                        <ul aria-expanded="false" id="submenu-${groupId}">`;

                                filteredSubMenuItems.forEach(item => {
                                    const iconHtml = item.icono_msi || item.icono_mi;
                                    menuHtml += `
                                        <li><a href="${item.ruta}">${iconHtml} ${item.descripcion}</a></li>`;
                                });

                                menuHtml += `</ul></li>`;
                            }
                        }
                        menuHtml += '</ul>';

                        menuItemsContainer.classList.add('dlabnav-scroll');
                        menuItemsContainer.innerHTML = menuHtml;

                        const dropdownItems = menuItemsContainer.querySelectorAll('.dropdown');
                        dropdownItems.forEach(item => {
                            item.addEventListener('click', () => {
                                item.classList.toggle('open');
                            });
                        });
                    } else {
                        // Manejar el caso donde filteredMenuItems no es un array
                        console.error('Error al cargar el menú: La respuesta de la API no es un array válido.');
                        menuItemsContainer.innerHTML = '<p>Error al cargar el menú. Por favor, inténtalo de nuevo más tarde.</p>';
                    }
                })
                .catch(error => {
                    console.error('Error al cargar el menú:', error);
                    menuItemsContainer.innerHTML = '<p>Error al cargar el menú. Asegúrate de haber iniciado sesión.</p>';
                });
        })
        .catch(error => {
            console.error('Error al cargar los roles:', error);
            menuItemsContainer.innerHTML = '<p>Error al cargar el menú. No se pudieron obtener los roles.</p>';
        });
}

// abrir/cerrar el sidebar
const logo = document.getElementById('nodhus-logo');
const sidebar = document.getElementById('sidebar');
logo.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Cargar el sidebar al inicio
loadSidebar();