const ctxImportacion = document.getElementById('myChartImportacion').getContext('2d');

// Crear gradientes para las barras con los colores especificados
const gradient1Importacion = ctxImportacion.createLinearGradient(0, 0, 0, 400);
gradient1Importacion.addColorStop(0, '#00bfff');
gradient1Importacion.addColorStop(1, '#87cefa');

const gradient2Importacion = ctxImportacion.createLinearGradient(0, 0, 0, 400);
gradient2Importacion.addColorStop(0, '#87cefa');
gradient2Importacion.addColorStop(1, '#4682b4');

const gradient3Importacion = ctxImportacion.createLinearGradient(0, 0, 0, 400);
gradient3Importacion.addColorStop(0, '#4682b4');
gradient3Importacion.addColorStop(1, '#1e90ff');

const myChartImportacion = new Chart(ctxImportacion, {
    type: 'bar',
    data: {
        labels: ['RETIRO', 'DEVOLUCIÓN', 'LIQUIDAR'],
        datasets: [{
            label: 'Valores',
            data: [], // Los datos se actualizarán dinámicamente
            backgroundColor: [
                gradient1Importacion,
                gradient2Importacion,
                gradient3Importacion
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
                text: 'Estado de Importaciones',
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
                    size: 12,
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
            const activePoints = myChartImportacion.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false);
            if (activePoints.length) {
                const index = activePoints[0].index;
                displayDetailsImportacion(index);
            }
        }
    }
});

fetch('https://esenttiapp-production.up.railway.app/api/estadoimpo')
    .then(response => response.json())
    .then(data => {
        const enCursoData = data.filter(item => item.estado === 'EN CURSO');
        const pendienteData = data.filter(item => item.estado === 'PENDIENTE');
        const liquidarData = data.filter(item => item.estado === 'PENDIENTE LIQUIDAR');

        const enCurso = enCursoData.length;
        const pendiente = pendienteData.length;
        const liquidar = liquidarData.length;

        myChartImportacion.data.datasets[0].data = [pendiente, enCurso, liquidar];
        myChartImportacion.update();

        // Guardar los datos para su uso posterior
        myChartImportacion.data.datasets[0].meta = {
            enCursoData,
            pendienteData,
            liquidarData
        };
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

function displayDetailsImportacion(index) {
    const detailsContainer = document.getElementById('detailsContainerImportacion');
    const detailsTitle = document.getElementById('detailsTitleImportacion');
    const detailsContent = document.getElementById('detailsContentImportacion');
    let dataToShow = [];

    switch (index) {
        case 0:
            dataToShow = myChartImportacion.data.datasets[0].meta.pendienteData;
            detailsTitle.textContent = 'Detalles Pendiente Retiro';
            break;
        case 1:
            dataToShow = myChartImportacion.data.datasets[0].meta.enCursoData;
            detailsTitle.textContent = 'Detalles Devolución';
            break;
        case 2:
            dataToShow = myChartImportacion.data.datasets[0].meta.liquidarData;
            detailsTitle.textContent = 'Detalles Liquidar';
            break;
    }

    const detailsHtml = dataToShow.map(item => `<p><a href="/view/contenedor/create.html?id=${item.id_primario}" style="cursor: pointer; color: #6495ED;  font-weight: bold;">SP: ${item.do_sp}</a></p>`).join('');
    detailsContent.innerHTML = detailsHtml;
    detailsContainer.style.display = 'block';
    document.getElementById('toggleDetailsImportacion').textContent = 'Ocultar';
}

document.getElementById('toggleDetailsImportacion').addEventListener('click', () => {
    const detailsContainer = document.getElementById('detailsContainerImportacion');
    if (detailsContainer.style.display === 'none' || detailsContainer.style.display === '') {
        detailsContainer.style.display = 'block';
        document.getElementById('toggleDetailsImportacion').textContent = 'Ocultar';
    } else {
        detailsContainer.style.display = 'none';
        document.getElementById('toggleDetailsImportacion').textContent = 'Mostrar';
    }
});
