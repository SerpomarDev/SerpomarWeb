let ctse = document.getElementById('operacionC');

let options = {
    series: [],
    chart: {
        type: 'donut',
        height: 350,
        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 1500,
            animateGradually: {
                enabled: true,
                delay: 200
            },
            dynamicAnimation: {
                enabled: true,
                speed: 500
            }
        }
    },
    labels: [],
    colors: ['#FF4560', '#00E396', '#FEB019', '#775DD0', '#0090FF', '#FF66FF'],
    fill: {
        type: 'gradient',
        gradient: {
            shade: 'dark',
            type: 'vertical',
            shadeIntensity: 0.5,
            gradientToColors: ['#F55555', '#00D4FF', '#FFC75F', '#A866FF', '#4F9FFF', '#FF7FFF'],
            inverseColors: true,
            opacityFrom: 0.9,
            opacityTo: 0.9,
            stops: [0, 100]
        }
    },
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'bottom'
            }
        }
    }],
    legend: {
        position: 'right',
        offsetY: 0,
        height: 230,
    },
    tooltip: {
        enabled: true,
        y: {
            formatter: function (val) {
                return val + " items";
            }
        }
    },
    dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
            return opts.w.config.series[opts.seriesIndex] + "%";
        },
        dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 2,
            opacity: 0.7
        }
    },
    plotOptions: {
        pie: {
            donut: {
                size: '75%',
                labels: {
                    show: true,
                    name: {
                        show: true,
                        fontSize: '22px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 600,
                        color: '#373d3f',
                        offsetY: -10,
                        formatter: function (val) {
                            return val
                        }
                    },
                    value: {
                        show: true,
                        fontSize: '16px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 400,
                        color: '#373d3f',
                        offsetY: 16,
                        formatter: function (val) {
                            return val
                        }
                    },
                    total: {
                        show: true,
                        showAlways: true,
                        label: 'Total',
                        formatter: function (w) {
                            return w.globals.seriesTotals.reduce((a, b) => {
                                return a + b;
                            }, 0);
                        }
                    }
                }
            }
        }
    }
};

let myChartse = new ApexCharts(ctse, options);
myChartse.render();

let urlse = "https://esenttiapp-production.up.railway.app/api/resumenestadooperacion";
fetch(urlse)
    .then(response => response.json())
    .then(itemsEs => viewEs(itemsEs))
    .catch(error => console.log(error));

const viewEs = (estadoEs) => {
    estadoEs.forEach(elementse => {
        options.labels.push(elementse.estado);
        options.series.push(elementse.conteo);
    });
    myChartse.updateOptions(options);
}
