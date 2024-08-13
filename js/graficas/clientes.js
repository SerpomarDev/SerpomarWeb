const ctxClientes = document.getElementById('clientChart').getContext('2d');
const myChartClientes = new Chart(ctxClientes, {
    type: 'bar',
    data: {
        labels: [], 
        datasets: [{
            label: 'Conteo',
            data: [], 
            backgroundColor: ['#1e90ff', '#00bfff'],
            borderColor: ['#00bfff', '#1e90ff'],
            borderWidth: 1,
            borderRadius: 10,
            borderSkipped: false
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false,
                position: 'top',
                labels: {
                    color: '#496ecc',
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return "Solicitudes: " + tooltipItem.raw;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#3e4954',
                    font: {
                        size: 10,
                        family: 'poppins',
                        weight: 400
                    },
                    autoSkip: false, 
                    maxRotation: 8,
                    minRotation: 8 
                },
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#496ecc',
                    font: {
                        size: 13,
                        family: 'poppins',
                        weight: 400
                    },
                },
                grid: {
                    color: '#eee'
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false 
    }
});

    fetch('https://esenttiapp-production.up.railway.app/api/estadobyclientes',{
        method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
                }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Fetched data:', data); 
        if (data && Array.isArray(data)) {
            // Agrupar los datos por cliente
            const clienteConteo = {};
            data.forEach(item => {
                if (!clienteConteo[item.cliente]) {
                    clienteConteo[item.cliente] = 0;
                }
                clienteConteo[item.cliente] += item.cantidad_contenedor;
            });

            console.log('Processed data:', clienteConteo); 

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
