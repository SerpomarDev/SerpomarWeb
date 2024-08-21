function loadSidebar() {
    const menuItemsContainer = document.getElementById('menu-items-container');
    const apiUrlMenu = 'https://esenttiapp-production.up.railway.app/api/createmenu';
    const apiUrlRoles = 'https://esenttiapp-production.up.railway.app/api/uploadroles';

    const token = localStorage.getItem('authToken');
    const rolId = localStorage.getItem('rol_Id');

    const requestOptions = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    };

    Promise.all([
            fetch(apiUrlRoles, requestOptions).then(response => response.json()),
            fetch(apiUrlMenu, requestOptions).then(response => response.json())
        ])
        .then(([roles, menuItems]) => {
            const userRole = roles.find(role => role.id == rolId);

            if (!userRole) {
                console.error('Rol de usuario no encontrado.');
                menuItemsContainer.innerHTML = '<p>Error al cargar el menú. Rol de usuario no válido.</p>';
                return;
            }

            const allowedMenuItems = userRole.menu_item.split(',').map(Number);
            const allowedMenuSubitems = userRole.menu_subitem.split(',').map(Number);

            const allowedMenuItemsSet = new Set(allowedMenuItems);
            const allowedMenuSubitemsSet = new Set(allowedMenuSubitems);

            const filteredMenuItems = menuItems.filter(item => allowedMenuItemsSet.has(item.id_propio));

            const menuGroups = {};
            filteredMenuItems.forEach(item => {
                if (!menuGroups[item.nombre]) {
                    menuGroups[item.nombre] = [];
                }
                menuGroups[item.nombre].push(item);
            });

            let menuHtml = '<ul id="menu">';
            for (const groupName in menuGroups) {
                const groupId = groupName.toLowerCase().replace(/ /g, '-');
                const groupIcon = menuGroups[groupName][0].icono_mi;

                const filteredSubMenuItems = menuGroups[groupName].filter(item => allowedMenuSubitemsSet.has(item.id_subitem));

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

            menuItemsContainer.addEventListener('click', (event) => {
                const target = event.target.closest('.dropdown');
                if (target) {
                    target.classList.toggle('open');
                }
            });
        })
        .catch(error => {
            console.error('Error al cargar el menú o los roles:', error);
            menuItemsContainer.innerHTML = '<p>Error al cargar el menú. Por favor, inténtalo de nuevo más tarde.</p>';
        });
}

// Abrir/cerrar el sidebar
const logo = document.getElementById('nodhus-logo');
const sidebar = document.getElementById('sidebar');

logo.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Cargar el sidebar al inicio
loadSidebar();