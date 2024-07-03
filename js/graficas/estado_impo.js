const ctxImportacion = document.getElementById('myChartImportacion').getContext('2d');
const gradient = ctxImportacion.createLinearGradient(0, 0, ctxImportacion.canvas.width, 0);
gradient.addColorStop(0, 'rgba(54, 162, 235, 1)');
gradient.addColorStop(1, 'rgba(54, 162, 235, 0.2)');

const myChartImportacion = new Chart(ctxImportacion, {
    type: 'bar',
    data: {
        labels: ['P. Retiro', 'P. Devolución', 'P. Liquidar'],
        datasets: [{
            label: 'Conteo de Estados',
            data: [], // Los datos se actualizarán dinámicamente
            backgroundColor: gradient,
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            borderRadius: 20,
            borderSkipped: false
        }]
    },
    options: {
        indexAxis: 'y',
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    display: false
                }
            },
            y: {
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            title: {
                display: false
            },
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += context.raw;
                        return label;
                    }
                }
            }
        }
    }
});

fetch('https://esenttiapp-production.up.railway.app/api/estadoimpo')
    .then(response => response.json())
    .then(data => {
        if (data && Array.isArray(data)) {
            const enCursoData = data.find(item => item.estado === 'EN CURSO');
            const pendienteData = data.find(item => item.estado === 'PENDIENTE');
            const liquidarData = data.find(item => item.estado === 'PENDENTE LIQUIDAR');
            
            const enCurso = enCursoData ? enCursoData.conteo : 0;
            const pendiente = pendienteData ? pendienteData.conteo : 0;
            const liquidar = liquidarData ? liquidarData.conteo : 0;

            myChartImportacion.data.datasets[0].data = [pendiente, enCurso, liquidar];
            myChartImportacion.update();
        } else {
            console.error('Error: Unexpected data format');
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
