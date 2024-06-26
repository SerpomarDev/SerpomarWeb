// JS para el gráfico de Inventario en Patio

const ctxInventario = document.getElementById('inventarioChart').getContext('2d');
const myChartInventario = new Chart(ctxInventario, {
    type: 'bar',
    data: {
        labels: [], // Los nombres de los estados se actualizarán dinámicamente
        datasets: [{
            label: 'Conteo de Vehículos',
            data: [], // Los datos del conteo se actualizarán dinámicamente
            backgroundColor: [], // Los colores se actualizarán dinámicamente
            borderColor: [],
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

fetch('https://esenttiapp-production.up.railway.app/api/resumenestados')
    .then(response => response.json())
    .then(data => {
        if (data && Array.isArray(data)) {
            const estados = data.map(item => item.estado);
            const conteos = data.map(item => item.conteo);
            const colores = estados.map(estado => {
                switch (estado) {
                    case 'OK':
                        return 'rgba(75, 192, 192, 0.2)';
                    case 'F/S':
                        return 'rgba(255, 99, 132, 0.2)';
                    // Añadir más estados y colores según sea necesario
                    default:
                        return 'rgba(201, 203, 207, 0.2)';
                }
            });
            const bordes = estados.map(estado => {
                switch (estado) {
                    case 'OK':
                        return 'rgba(75, 192, 192, 1)';
                    case 'F/S':
                        return 'rgba(255, 99, 132, 1)';
                    // Añadir más estados y colores de borde según sea necesario
                    default:
                        return 'rgba(201, 203, 207, 1)';
                }
            });

            myChartInventario.data.labels = estados;
            myChartInventario.data.datasets[0].data = conteos;
            myChartInventario.data.datasets[0].backgroundColor = colores;
            myChartInventario.data.datasets[0].borderColor = bordes;
            myChartInventario.update();
        } else {
            console.error('Error: Unexpected data format');
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
