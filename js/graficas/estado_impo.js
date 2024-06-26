// JS de Estado Importación (estado_impo.js)

const ctxImportacion = document.getElementById('myChartImportacion').getContext('2d');
const myChartImportacion = new Chart(ctxImportacion, {
    type: 'bar',
    data: {
        labels: ['P. Retiro', 'P. Devolución', 'P. Liquidar'],
        datasets: [{
            label: 'Valores',
            data: [], // Los datos se actualizarán dinámicamente
            backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        indexAxis: 'y',
        scales: {
            x: {
                beginAtZero: true
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
