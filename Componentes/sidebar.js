function loadSidebar() {
    const menuItemsContainer = document.getElementById('menu-items-container');
    const apiUrl = 'https://esenttiapp-production.up.railway.app/api/createmenu';

    // Obtener el token del localStorage
    const token = localStorage.getItem('authToken');

    // Configurar las opciones de la solicitud con la cabecera de autorización
    const requestOptions = {
        headers: {
            // Aquí se incluye el token desde el localStorage
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
    };

    fetch(apiUrl, requestOptions) 
        .then(response => {
            if (!response.ok) { 
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(menuItems => {
            const menuGroups = {};

            // Verificar si menuItems es un array antes de usar forEach
            if (Array.isArray(menuItems)) {
                menuItems.forEach(item => {
                    if (!menuGroups[item.nombre]) {
                        menuGroups[item.nombre] = [];
                    }
                    menuGroups[item.nombre].push(item);
                });

                let menuHtml = '<ul id="menu">';
                for (const groupName in menuGroups) {
                    const groupId = groupName.toLowerCase().replace(/ /g, '-');

                    // obtener el icono
                    const groupIcon = menuGroups[groupName][0].icono_mi;

                    menuHtml += `
                        <li class="dropdown" id="menu-${groupId}">
                            <a class="has-arrow" href="#" aria-expanded="false">
                                ${groupIcon} <span class="nav-text">${groupName} ></span>
                            </a>
                            <ul aria-expanded="false" id="submenu-${groupId}">`;

                    menuGroups[groupName].forEach(item => {
                        const iconHtml = item.icono_msi || item.icono_mi;
                        menuHtml += `
                            <li><a href="${item.ruta}">${iconHtml} ${item.descripcion}</a></li>`;
                    });

                    menuHtml += `
                            </ul>
                        </li>`;
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
                // Manejar el caso donde menuItems no es un array
                console.error('Error al cargar el menú: La respuesta de la API no es un array válido.');
                menuItemsContainer.innerHTML = '<p>Error al cargar el menú. Por favor, inténtalo de nuevo más tarde.</p>';
            }
        })
        .catch(error => {
            console.error('Error al cargar el menú:', error);
            menuItemsContainer.innerHTML = '<p>Error al cargar el menú. Asegúrate de haber iniciado sesión.</p>'; 
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
