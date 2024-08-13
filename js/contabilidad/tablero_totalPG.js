const apiUrl = fetch('https://esenttiapp-production.up.railway.app/api/asignacionespendientepago',{
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
})

async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

       
        let totalSP = 0;
        let totalTarifa = 0;

      
        data.forEach(item => {
            if (item.estado === 'PENDIENTE PAGO') {
                totalSP += 1;
                totalTarifa += parseFloat(item.tarifa);
            }
        });

    
        document.getElementById('total-abiertas').innerText = totalSP;
        document.getElementById('valor-total-abiertas').innerText = totalTarifa.toLocaleString('es-CO', {currency: 'COP' });
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}


document.addEventListener('DOMContentLoaded', fetchData);