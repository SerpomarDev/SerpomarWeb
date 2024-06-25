document.addEventListener('DOMContentLoaded', function () {
    // JavaScript to generate the first Chart.js chart
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Expo', 'Impo'],
            datasets: [{
                label: 'Valores',
                data: [5, 2],
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

    // JavaScript to generate the second Chart.js chart
    const ctx2 = document.getElementById('myChart2').getContext('2d');
    const myChart2 = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['retiro vacio', 'ingreso puerto', 'pendiente retiro'],
            datasets: [{
                label: 'Valores',
                data: [120, 150, 180],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
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

    // JavaScript to generate the ECharts pie chart
    var chartDom = document.getElementById('polarChart');
    var myChartPolar = echarts.init(chartDom);
    var option = {
        title: {
            text: 'Estado Importación',
            left: 'center',
            top: 20,
            textStyle: {
                color: '#000'
            }
        },
        tooltip: {
            trigger: 'item'
        },
        visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
                colorLightness: [0, 1]
            }
        },
        series: [
            {
                name: 'Estado',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: [
                    { value: 335, name: 'P. Retiro' },
                    { value: 310, name: 'P. Devolucion' },
                    { value: 274, name: 'P. Liquidar' }
                ].sort(function (a, b) {
                    return a.value - b.value;
                }),
                roseType: 'radius',
                label: {
                    color: 'rgba(0, 0, 0, 0.7)'
                },
                labelLine: {
                    lineStyle: {
                        color: 'rgba(0, 0, 0, 0.7)'
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                },
                itemStyle: {
                    color: '#c23531',
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
            }
        ]
    };

    option && myChartPolar.setOption(option);

    // JavaScript to generate the ECharts dynamic bar chart for clients
    const clientChartDom = document.getElementById('clientChart');
    const clientChart = echarts.init(clientChartDom);
    const updateFrequency = 2000;
    const dimension = 0;
    const clientData = Array.from({ length: 15 }, (_, i) => ({
        name: `Cliente ${i + 1}`,
        value: Math.round(Math.random() * 1000)
    }));
    let clientOption = {
        grid: {
            top: 10,
            bottom: 30,
            left: 150,
            right: 80
        },
        xAxis: {
            max: 'dataMax',
            axisLabel: {
                formatter: function (n) {
                    return Math.round(n) + '';
                }
            }
        },
        dataset: {
            source: clientData.map(d => [d.value, d.name])
        },
        yAxis: {
            type: 'category',
            inverse: true,
            max: 15,
            axisLabel: {
                show: true,
                fontSize: 14
            },
            animationDuration: 300,
            animationDurationUpdate: 300
        },
        series: [
            {
                realtimeSort: true,
                seriesLayoutBy: 'column',
                type: 'bar',
                encode: {
                    x: 0,
                    y: 1
                },
                label: {
                    show: true,
                    precision: 1,
                    position: 'right',
                    valueAnimation: true,
                    fontFamily: 'monospace'
                }
            }
        ],
        animationDuration: 0,
        animationDurationUpdate: updateFrequency,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear',
        graphic: {
            elements: [
                {
                    type: 'text',
                    right: 160,
                    bottom: 60,
                    z: 100
                }
            ]
        }
    };

    clientChart.setOption(clientOption);
    setInterval(function () {
        clientData.forEach(d => {
            d.value = Math.round(Math.random() * 1000);
        });
        clientChart.setOption({
            dataset: {
                source: clientData.map(d => [d.value, d.name])
            }
        });
    }, updateFrequency);

    // JavaScript to generate the ECharts impo and expo pie chart
    var impoExpoChartDom = document.getElementById('impoExpoChart');
    var impoExpoChart = echarts.init(impoExpoChartDom);
    var impoExpoOption = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 1048, name: 'Impo' },
                    { value: 735, name: 'Expo' }
                ]
            }
        ]
    };

    impoExpoChart.setOption(impoExpoOption);
});
