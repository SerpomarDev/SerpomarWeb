// let cts = document.getElementById('myChart');

// let optionsProyectos = {
//     series: [{
//         name: 'Volumenes',
//         data: []
//     }],
//     chart: {
//         type: 'bar',
//         height: 350,
//         animations: {
//             enabled: true,
//             easing: 'easeinout',
//             speed: 1000,
//             animateGradually: {
//                 enabled: true,
//                 delay: 150
//             },
//             dynamicAnimation: {
//                 enabled: true,
//                 speed: 350
//             }
//         }
//     },
//     plotOptions: {
//         bar: {
//             borderRadius: 10,
//             horizontal: false,
//             distributed: true,
//         }
//     },
//     dataLabels: {
//         enabled: true,
//         formatter: function (val) {
//             return val + " ";
//         },
//         offsetY: -10,
//         style: {
//             fontSize: '12px',
//             colors: ["#fff"]
//         }
//     },
//     xaxis: {
//         categories: [],
//         position: 'bottom',
//         labels: {
//             offsetY: -5,
//         },
//         axisBorder: {
//             show: true,
//             color: '#78909C'
//         },
//         axisTicks: {
//             show: true,
//             color: '#78909C'
//         }
//     },
//     yaxis: {
//         title: {
//             text: 'Número de Proyectos'
//         }
//     },
//     fill: {
//         gradient: {
//             shade: 'light',
//             type: "horizontal",
//             shadeIntensity: 0.25,
//             gradientToColors: undefined,
//             inverseColors: true,
//             opacityFrom: 0.85,
//             opacityTo: 0.85,
//             stops: [50, 0, 100, 100]
//         },
//     },
//     legend: {
//         position: 'top',
//         horizontalAlign: 'center'
//     },
//     tooltip: {
//         enabled: true,
//         y: {
//             formatter: function (val) {
//                 return val + " volumenes";
//             }
//         }
//     }
// }
let ctx = document.getElementById('myChart').getContext('2d');
let options =  {
    type: 'bar',
    data: {
        labels: [],
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
};

let myChartse = new Chart(cts, options);
myChartse.render();


let urlse = "https://esenttiapp-production.up.railway.app/api/volumenesimpexp";
fetch(urlse)
    .then(response => response.json())
    .then(itemsEs => viewEs(itemsEs))
    .catch(error => console.log(error));

const viewEs = (estadoEs) => {
    estadoEs.forEach(elementse => {
        options.labels.push(elementse.imp_exp);
        options.series.push(elementse.conteo);
    });
    myChartse.updateOptions(options);
}