let cts = document.getElementById('proyectos');

let optionsProyectos = {
    series: [{
        name: 'Proyectos',
        data: []
    }],
    chart: {
        type: 'bar',
        height: 350,
        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 1000,
            animateGradually: {
                enabled: true,
                delay: 150
            },
            dynamicAnimation: {
                enabled: true,
                speed: 350
            }
        }
    },
    plotOptions: {
        bar: {
            borderRadius: 10,
            horizontal: false,
            distributed: true,
        }
    },
    dataLabels: {
        enabled: true,
        formatter: function (val) {
            return val + " ";
        },
        offsetY: -10,
        style: {
            fontSize: '12px',
            colors: ["#fff"]
        }
    },
    xaxis: {
        categories: [],
        position: 'bottom',
        labels: {
            offsetY: -5,
        },
        axisBorder: {
            show: true,
            color: '#78909C'
        },
        axisTicks: {
            show: true,
            color: '#78909C'
        }
    },
    yaxis: {
        title: {
            text: 'Número de Proyectos'
        }
    },
    fill: {
        gradient: {
            shade: 'light',
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100, 100]
        },
    },
    legend: {
        position: 'top',
        horizontalAlign: 'center'
    },
    tooltip: {
        enabled: true,
        y: {
            formatter: function (val) {
                return val + " proyectos";
            }
        }
    }
};

let myCharts = new ApexCharts(cts, optionsProyectos);
myCharts.render();

    fetch("https://esenttiapp-production.up.railway.app/api/resumenproyectos",{
        method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
    })
    .then(response => response.json())
    .then(items => view(items))
    .catch(error => console.log(error));

const view = (proyectos) => {
    proyectos.forEach(elements => {
        optionsProyectos.xaxis.categories.push(elements.proyecto);
        optionsProyectos.series[0].data.push(elements.conteo);
    });
    myCharts.updateOptions(optionsProyectos);
}

let ctx = document.getElementById('estados');

let optionsEstados = {
    series: [{
        name: 'Estado Operación',
        data: []
    }],
    chart: {
        type: 'bar',
        height: 350,
        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 1000,
            animateGradually: {
                enabled: true,
                delay: 150
            },
            dynamicAnimation: {
                enabled: true,
                speed: 350
            }
        }
    },
    plotOptions: {
        bar: {
            borderRadius: 10,
            horizontal: false,
            distributed: true,
        }
    },
    dataLabels: {
        enabled: true,
        formatter: function (val) {
            return val + "";
        },
        offsetY: -10,
        style: {
            fontSize: '12px',
            colors: ["#fff"]
        }
    },
    xaxis: {
        categories: [],
        position: 'bottom',
        labels: {
            offsetY: -5,
        },
        axisBorder: {
            show: true,
            color: '#78909C'
        },
        axisTicks: {
            show: true,
            color: '#78909C'
        }
    },
    yaxis: {
        title: {
            text: 'Número de Operaciones'
        }
    },
    fill: {
        gradient: {
            shade: 'light',
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100, 100]
        },
    },
    legend: {
        position: 'top',
        horizontalAlign: 'center'
    },
    tooltip: {
        enabled: true,
        y: {
            formatter: function (val) {
                return val + " operaciones";
            }
        }
    }
};

let myChart = new ApexCharts(ctx, optionsEstados);
myChart.render();

    fetch("https://esenttiapp-production.up.railway.app/api/resumenestados",{
        method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
    })
    .then(response => response.json())
    .then(datos => mostrar(datos))
    .catch(error => console.log(error));

const mostrar = (estados) => {
    estados.forEach(element => {
        optionsEstados.xaxis.categories.push(element.estado);
        optionsEstados.series[0].data.push(element.conteo);
    });
    myChart.updateOptions(optionsEstados);
}
