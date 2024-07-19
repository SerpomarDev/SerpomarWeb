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
        labels: ['PENDIENTE LIQUIDAR', 'PENDIENTE INGRESO A PUERTO', 'PENDIENTE RETIRO VACIO'],
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
                    size: 18,
                    weight: 'bold',
                    family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                },
                padding: {
                    top: 0,
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
        },
        onClick: (e) => {
            const activePoints = myChart2.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false);
            if (activePoints.length) {
                const index = activePoints[0].index;
                displayDetails(index);
            }
        }
    }
});

fetch('https://esenttiapp-production.up.railway.app/api/estadoexpo')
    .then(response => response.json())
    .then(data => {
        console.log('Fetched data:', data); // Log fetched data to the console
        
        const pendienteLiquidar = data.filter(item => item.estado === 'PENDIENTE LIQUIDAR');
        const pendienteIngreso = data.filter(item => item.estado === 'PENDIENTE INGRESO A PUERTO');
        const pendienteRetiro = data.filter(item => item.estado === 'PENDIENTE RETIRO VACIO');

        const pendiente = pendienteLiquidar.length;
        const pendienteIng = pendienteIngreso.length;
        const pendienteRet = pendienteRetiro.length;

        console.log('Mapped data:', pendiente, pendienteIng, pendienteRet); // Log mapped data

        myChart2.data.datasets[0].data = [pendiente, pendienteIng, pendienteRet];
        myChart2.update();

        // Guardar los datos para su uso posterior
        myChart2.data.datasets[0].meta = {
            pendienteLiquidar,
            pendienteIngreso,
            pendienteRetiro
        };
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

function displayDetails(index) {
    const detailsContainer = document.getElementById('detailsContainer');
    const detailsTitle = document.getElementById('detailsTitle');
    const detailsContent = document.getElementById('detailsContent');
    let dataToShow = [];

    switch (index) {
        case 0:
            dataToShow = myChart2.data.datasets[0].meta.pendienteLiquidar;
            detailsTitle.textContent = 'Detalles de Pendiente Liquidar';
            break;
        case 1:
            dataToShow = myChart2.data.datasets[0].meta.pendienteIngreso;
            detailsTitle.textContent = 'Detalles de Pendiente Ingreso a Puerto';
            break;
        case 2:
            dataToShow = myChart2.data.datasets[0].meta.pendienteRetiro;
            detailsTitle.textContent = 'Detalles de Pendiente Retiro Vacío';
            break;
    }

    const detailsHtml = dataToShow.map(item => `<p><a href="/view/contenedor/create.html?id=${item.id_primario}" style="cursor: pointer; color: #6495ED;  font-weight: bold;">SP: ${item.do_sp}</a></p>`).join('');
    detailsContent.innerHTML = detailsHtml;
    detailsContainer.style.display = 'block';
    document.getElementById('toggleDetailsImportacion').textContent = 'Ocultar';
}
document.getElementById('toggleDetails').addEventListener('click', () => {
    const detailsContainer = document.getElementById('detailsContainer');
    if (detailsContainer.style.display === 'none' || detailsContainer.style.display === '') {
        detailsContainer.style.display = 'block';
        document.getElementById('toggleDetails').textContent = 'Ocultar';
    } else {
        detailsContainer.style.display = 'none';
        document.getElementById('toggleDetails').textContent = 'Mostrar';
    }
});
