const apiLibreHasta = "https://esenttiapp-production.up.railway.app/api/notilibrehastaimp";
const apiBodegajeHasta = "https://esenttiapp-production.up.railway.app/api/notibodegahastaimp";
const apiFechaDocumental = "https://esenttiapp-production.up.railway.app/api/notifechadocuexp";
const apiCutoffFisico = "https://esenttiapp-production.up.railway.app/api/noticutofffisexp";

const token = localStorage.getItem('authToken');

async function fetchNotificaciones(api, dateKey, type, displayType) {
    const notifications = { basic: [], medium: [], high: [] };

    try {
        const response = await fetch(api, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error en la respuesta de la red. Código de estado: ${response.status}`);
        }

        const data = await response.json();

        data.forEach(item => {
            if (item.estado === "ACEPTADO" && item[dateKey] && item.fecha_actual) {
                const diferenciaDias = (new Date(item[dateKey]) - new Date(item.fecha_actual)) / (1000 * 60 * 60 * 24);
                item.dias_diferencia = Math.round(diferenciaDias);

                const notification = {
                    do_sp: item.do_sp,
                    fecha: item[dateKey],
                    dias_diferencia: item.dias_diferencia,
                    type: type,
                    displayType: displayType
                };

                if (diferenciaDias >= 6) {
                    notifications.basic.push(notification);
                } else if (diferenciaDias >= 3) {
                    notifications.medium.push(notification);
                } else if (diferenciaDias < 0 && diferenciaDias >= -3) {
                    notifications.high.push(notification);
                }
            }
        });

    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.error('No autorizado. Redirigiendo al inicio de sesión...');
            window.location.href = '/login.html';
        } else {
            console.error(`Error al obtener datos de ${api}:`, error);
        }
    }

    return notifications;
}

function displayNotifications(notifications, containerPrefix) {
    for (const [level, notifs] of Object.entries(notifications)) {
        const container = document.querySelector(`.${containerPrefix} .notification.${level}`);
        let tooltipText = notifs.map(notif => `SP: ${notif.do_sp}, Días restantes: ${notif.dias_diferencia}`).join(' | ');
        container.setAttribute('data-tooltip', tooltipText);
    }
}

function mergeNotifications(notificationSet1, notificationSet2) {
    const merged = { basic: [], medium: [], high: [] };
    for (const level of['basic', 'medium', 'high']) {
        merged[level] = [...notificationSet1[level], ...notificationSet2[level]];
    }
    return merged;
}

async function loadImportNotifications() {
    const libreHastaNotifications = await fetchNotificaciones(apiLibreHasta, 'libre_hasta', 'Importación', 'libre_hasta');
    const bodegajeHastaNotifications = await fetchNotificaciones(apiBodegajeHasta, 'bodegaje_hasta', 'Bodegaje', 'bodegaje_hasta');

    importNotifications = mergeNotifications(libreHastaNotifications, bodegajeHastaNotifications);

    console.log('Import Notifications:', importNotifications);
    displayNotifications(importNotifications, 'import');
}

async function loadExportNotifications() {
    const fechaDocumentalNotifications = await fetchNotificaciones(apiFechaDocumental, 'fecha_documental', 'Exportación', 'fecha_documental');
    const cutoffFisicoNotifications = await fetchNotificaciones(apiCutoffFisico, 'fecha_cutoff_fisico', 'Exportación', 'cutoff_fisico');

    exportNotifications = mergeNotifications(fechaDocumentalNotifications, cutoffFisicoNotifications);

    console.log('Export Notifications:', exportNotifications);
    displayNotifications(exportNotifications, 'export');
}

function openModal(type) {
    const modal = document.getElementById("notificationModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");

    modalTitle.innerText = `Notificaciones ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    modalBody.innerHTML = '';

    const notifications = type === 'import' ? importNotifications : exportNotifications;

    ['basic', 'medium', 'high'].forEach(level => {
        const categoryNotifications = notifications[level];
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('notification', level);

        const categoryHeader = document.createElement('div');
        categoryHeader.classList.add('notification-header');
        categoryHeader.innerHTML = `
            <i class="fas fa-bell icon"></i>
            <span>Notificación ${level.charAt(0).toUpperCase() + level.slice(1)}</span>
        `;

        const notificationDetails = categoryNotifications.map(notif => `
            <div class="notification-detail">
                <p><a href="/view/contenedor/create.html?id=${notif.do_sp}" style="cursor: pointer; color: #6495ED; font-weight: bold;">SP: ${notif.do_sp}</a></p>
                <p>${notif.displayType === 'libre_hasta' ? 'Libre hasta' : 
                    notif.displayType === 'bodegaje_hasta' ? 'Bodegaje hasta' : 
                    notif.displayType === 'fecha_documental' ? 'Fecha documental hasta' : 
                    'Cutoff físico hasta'}: ${notif.fecha}</p>
                <p>Días restantes: ${notif.dias_diferencia}</p>
            </div>
            <div class="notification-separator"></div>
        `).join('');
        const detailsDiv = document.createElement('div');
        detailsDiv.classList.add('notification-details');
        detailsDiv.innerHTML = notificationDetails;

        categoryDiv.appendChild(categoryHeader);
        categoryDiv.appendChild(detailsDiv);
        modalBody.appendChild(categoryDiv);
    });

    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("notificationModal");
    modal.style.display = "none";
}

loadImportNotifications();
loadExportNotifications();

window.onclick = function(event) {
    const modal = document.getElementById("notificationModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}