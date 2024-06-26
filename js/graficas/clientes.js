// JS para el gráfico de clientes

const ctxClientes = document.getElementById('clientChart').getContext('2d');
const myChartClientes = new Chart(ctxClientes, {
    type: 'bar',
    data: {
        labels: [], // Los nombres de los clientes se actualizarán dinámicamente
        datasets: [{
            label: 'Conteo',
            data: [], // Los datos del conteo se actualizarán dinámicamente
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

fetch('https://esenttiapp-production.up.railway.app/api/estadobyclientes')
    .then(response => response.json())
    .then(data => {
        if (data && Array.isArray(data)) {
            // Agrupar los datos por cliente
            const clienteConteo = {};
            data.forEach(item => {
                if (!clienteConteo[item.cliente]) {
                    clienteConteo[item.cliente] = 0;
                }
                clienteConteo[item.cliente] += item.conteo;
            });

            // Actualizar el gráfico con los datos agrupados
            myChartClientes.data.labels = Object.keys(clienteConteo);
            myChartClientes.data.datasets[0].data = Object.values(clienteConteo);
            myChartClientes.update();
        } else {
            console.error('Error: Unexpected data format');
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
