const ctx2 = document.getElementById('myChart2').getContext('2d');

// Crear gradientes para las barras con los colores especificados
const gradient1 = ctx2.createLinearGradient(0, 0, 0, 400);
gradient1.addColorStop(0, '#00bfff');
gradient1.addColorStop(1, '#87cefa');

const gradient2 = ctx2.createLinearGradient(0, 0, 0, 400);
gradient2.addColorStop(0, '#87cefa');
gradient2.addColorStop(1, '#4682b4');

const gradient3 = ctx2.createLinearGradient(0, 0, 0, 400);
gradient3.addColorStop(0, '#4682b4');
gradient3.addColorStop(1, '#1e90ff');

const myChart2 = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: ['PENDENTE LIQUIDAR', 'PENDIENTE INGRESO A PUERTO', 'PENDIENTE RETIRO VACIO'],
        datasets: [{
            label: 'Valores',
            data: [], // Los datos se actualizarán dinámicamente
            backgroundColor: [
                gradient1,
                gradient2,
                gradient3
            ],
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 15, // Bordes redondeados
            barPercentage: 0.7, // Ancho de las barras
            categoryPercentage: 0.6 // Espacio entre barras
        }]
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Estado de Exportaciones',
                font: {
                    size: 12,
                    weight: 'bold',
                    family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                },
                padding: {
                    top: 20,
                    bottom: 20
                }
            },
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleFont: {
                    size: 12
                },
                bodyFont: {
                    size: 14
                },
                cornerRadius: 5,
                padding: 10,
                callbacks: {
                    label: function(context) {
                        return ` ${context.dataset.label}: ${context.raw}`;
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Cantidad',
                    font: {
                        size: 14,
                        weight: 'bold',
                        family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                    }
                },
                ticks: {
                    color: getComputedStyle(document.documentElement).getPropertyValue('--bs-dark'),
                    font: {
                        size: 8
                    }
                },
                grid: {
                    color: '#e0e0e0', // Color suave para las líneas de la cuadrícula
                    borderDash: [3, 3]
                }
            },
            y: {
                ticks: {
                    color: getComputedStyle(document.documentElement).getPropertyValue('--bs-dark'),
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                grid: {
                    display: false // Quitar las líneas de la cuadrícula para un estilo más limpio
                }
            }
        }
    }
});

fetch('https://esenttiapp-production.up.railway.app/api/estadoexpo')
    .then(response => response.json())
    .then(data => {
        const pendienteLiquidar = data.find(item => item.estado === 'PENDENTE LIQUIDAR');
        const pendienteIngreso = data.find(item => item.estado === 'PENDIENTE INGRESO A PUERTO');
        const pendienteRetiro = data.find(item => item.estado === 'PENDIENTE RETIRO VACIO');

        const pendiente = pendienteLiquidar ? pendienteLiquidar.conteo : 0;
        const pendienteIng = pendienteIngreso ? pendienteIngreso.conteo : 0;
        const pendienteRet = pendienteRetiro ? pendienteRetiro.conteo : 0;

        myChart2.data.datasets[0].data = [pendiente, pendienteIng, pendienteRet];
        myChart2.update();
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
