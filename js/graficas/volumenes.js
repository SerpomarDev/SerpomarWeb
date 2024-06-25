// JS de Volumen (volumenes.js)

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Expo', 'Impo'],
        datasets: [{
            label: 'Valores',
            data: [],
            backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
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

fetch('https://esenttiapp-production.up.railway.app/api/volumenesimpexp')
    .then(response => response.json())
    .then(data => {
        const importacion = data.find(item => item.imp_exp === 'importacion').conteo;
        const exportacion = data.find(item => item.imp_exp === 'exportacion').conteo;

        myChart.data.datasets[0].data = [exportacion, importacion];
        myChart.update();
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
