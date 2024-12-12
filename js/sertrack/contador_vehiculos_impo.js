fetch('https://esenttiapp-production.up.railway.app/api/registroestadistico', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
})
.then(response => response.json())
.then(data => {
    const today = new Date().toISOString().slice(0, 10);
    const placas = new Set();

    data.forEach(item => {
        // Verificar si item.fecha_cita es null
        if (item.fecha_cita) { 
            const fechaCita = item.fecha_cita.slice(0, 10);
            if (fechaCita === today && item.placa_puerto) {
                placas.add(item.placa_puerto);
            }
        } 
    });

    const numeroPlacas = placas.size || 0; 
    document.getElementById('placa-operacion').textContent = numeroPlacas;
})
.catch(error => {
    console.error('Error fetching data:', error);
    // Manejar el error de alguna manera, por ejemplo, mostrar un mensaje al usuario
});