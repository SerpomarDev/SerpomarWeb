// JS para mostrar el total de vehículos con diferentes colores según su estado y cantidad

const estadoColores = {
    "OK": "green",
    "F/S": "red"
};

fetch('https://esenttiapp-production.up.railway.app/api/resumenestados')
    .then(response => response.json())
    .then(data => {
        if (data && Array.isArray(data)) {
            const vehicleIconsContainer = document.getElementById('vehicleIcons');
            vehicleIconsContainer.innerHTML = ''; // Limpiar cualquier contenido previo

            data.forEach(item => {
                const iconWrapper = document.createElement('div');
                iconWrapper.style.display = 'inline-block';
                iconWrapper.style.margin = '0 10px';
                iconWrapper.style.textAlign = 'center';

                const icon = document.createElement('span');
                icon.classList.add('fas', 'fa-car');
                icon.style.color = estadoColores[item.estado] || 'black'; // Usar color según el estado o negro por defecto
                icon.style.fontSize = '48px'; // Tamaño del ícono

                const count = document.createElement('span');
                count.textContent = item.conteo;
                count.style.display = 'block';
                count.style.color = '#000';
                count.style.fontSize = '14px'; // Tamaño del texto de conteo

                iconWrapper.appendChild(icon);
                iconWrapper.appendChild(count);
                vehicleIconsContainer.appendChild(iconWrapper);
            });
        } else {
            console.error('Error: Unexpected data format');
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
