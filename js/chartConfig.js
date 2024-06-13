// Colores similares a los de la imagen proporcionada
const colors = {
    blue: '#006aff',
    lightBlue: '#00c8ff',
    yellow: '#ffce56',
    green: '#28a745',
    orange: '#fd7e14',
    red: '#dc3545',
    teal: '#20c997',
    purple: '#6f42c1'
};

// Gráfico de líneas
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [{
            label: '2023',
            data: [246, 288, 200, 250, 259, 245, 259, 159, 144, 291, 168, 310],
            borderColor: colors.blue,
            borderWidth: 2,
            fill: false
        }, {
            label: '2024',
            data: [304, 281, 243, 211, 94],
            borderColor: colors.lightBlue,
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
                colors.blue,
                colors.lightBlue,
                colors.yellow,
                colors.green,
                colors.orange,
                colors.red,
                colors.teal,
                colors.purple,
                colors.yellow
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
