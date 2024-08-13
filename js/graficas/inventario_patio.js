const domInventario = document.getElementById('impoExpoChart');
const myChartInventario = echarts.init(domInventario);

    fetch('https://esenttiapp-production.up.railway.app/api/estadoinventario',{
        method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
    })
    .then(response => response.json())
    .then(data => {
        if (data && Array.isArray(data)) {
            const chartData = data.map((item, index) => ({
                value: item.conteo,
                name: item.modalidad,
                itemStyle: {
                    color: [
                            '#00bfff', // --bs-success
                            '#87cefa', // --bs-info
                            '#4682b4', // --bs-warning (Steel Blue)
                            '#1e90ff' // --bs-danger
                        ][index % 4] // Alterna entre los 4 colores
                }
            }));

            const option = {
                title: {
                    text: 'INVENTARIO EN PATIO',
                    left: 'center',
                    textStyle: {
                        fontSize: 18,
                        fontWeight: 'bold',
                        fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                    },
                    padding: [0, 0, 20, 0] // Top, Right, Bottom, Left
                },
                tooltip: {
                    trigger: 'item'
                },

                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [{
                    name: 'Inventario en Patio',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 5
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 20,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: chartData
                }]
            };

            myChartInventario.setOption(option);
        } else {
            console.error('Error: Unexpected data format');
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });