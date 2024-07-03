const estadoColores = {
    "OK": "green",
    "F/S": "orange", // Color para "Fuera de Servicio"
    "F/O": "red"    // Color para "Fuera de Operación"
};

fetch('https://esenttiapp-production.up.railway.app/api/resumenestados')
    .then(response => response.json())
    .then(data => {
        if (data && Array.isArray(data)) {
            const vehicleIconsContainer = document.getElementById('vehicleIcons');
            vehicleIconsContainer.innerHTML = '';

            data.forEach(item => {
                const iconWrapper = document.createElement('div');
                iconWrapper.classList.add('icon-wrapper');

                const icon = document.createElement('span');
                icon.classList.add('fas', 'fa-truck');
                icon.style.color = estadoColores[item.estado] || 'gray';

                const count = document.createElement('span');
                count.textContent = item.conteo;
                count.classList.add('count');

                const state = document.createElement('span');
                state.textContent = item.estado;
                state.classList.add('state');

                iconWrapper.appendChild(icon);
                iconWrapper.appendChild(count);
                iconWrapper.appendChild(state);
                vehicleIconsContainer.appendChild(iconWrapper);
            });
        } else {
            console.error('Error: Unexpected data format');
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
