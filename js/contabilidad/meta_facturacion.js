const ctxBarChart1 = document.getElementById('barChart1').getContext('2d');
const barChart1 = new Chart(ctxBarChart1, {
    type: 'bar',
    data: {
        labels: ['Facturación', 'Meta'],
        datasets: [{
            label: 'Facturación vs Meta',
            data: [totalFacturacion2024, metaFacturacion2024],
            backgroundColor: [
                '#00bfff',
                '#1e90ff'
            ],
            borderColor: [
                '#1e90ff',
                '#00bfff'
            ],
            borderWidth: 1,
            borderRadius: 12
        }]
    },
    options: {
        scales: {
            x: {
                ticks: {
                    color: '#3e4954',
                    font: {
                        size: 13,
                        family: 'poppins',
                        weight: 400
                    }
                },
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#3e4954',
                    font: {
                        size: 13,
                        family: 'poppins',
                        weight: 400
                    }
                },
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Facturación vs Meta',
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
                display: false,
                position: 'top',
                align: 'end',
                labels: {
                    color: '#000000',
                    font: {
                        size: 12
                    },
                    usePointStyle: true,
                    pointStyleWidth: 18
                },
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.dataset.label + ': ' + context.raw;
                    }
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false
    }
});
