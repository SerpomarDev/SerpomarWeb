// Gráfico de líneas
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [{
            label: '2023',
            data: [246, 288, 200, 250, 259, 245, 259, 159, 144, 291, 168, 310],
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            fill: false
        }, {
            label: '2024',
            data: [304, 281, 243, 211, 94],
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            fill: false
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.dataset.label + ': ' + tooltipItem.raw;
                    }
                }
            }
        }
    }
});

// Gráfico de pastel
var ctxPie = document.getElementById('pieChart').getContext('2d');
var pieChart = new Chart(ctxPie, {
    type: 'pie',
    data: {
        labels: ['HAPAG LLOYD COLOMBIA LTDA.', 'CMA CGM', 'AGUNSA COLOMBIA SAS', 'AVIANCA AEROVIAS DEL CONTINENTE AMERICANO S.A.', 'DEEP BLUE SHIP AGENCY', 'DHL EXPRESS COLOMBIA LTDA.', 'MAERSK COLOMBIA S.A.', 'MEDITERRANEAN SHIPPING COMPANY COLOMBIA S.A.', 'SCS ADUANERA COLOMBIA S.A.S'],
        datasets: [{
            data: [137, 119, 18, 1, 15, 12, 5, 2, 5],
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
            ],
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.label + ': ' + tooltipItem.raw;
                    }
                }
            }
        }
    }
});
