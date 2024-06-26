document.addEventListener('DOMContentLoaded', function () {


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
