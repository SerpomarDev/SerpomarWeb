const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Exportaciones', 'Importaciones'],
        datasets: [{
            label: 'Valores',
            data: [],
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
                text: 'Volumenes',
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
                        return 'Total ' + context.raw ;
                    }
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false
    }
});

    fetch('https://esenttiapp-production.up.railway.app/api/volumenesimpexp',{
        method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
    })
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
