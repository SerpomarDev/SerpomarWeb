// let ctx = document.getElementById('myChart').getContext('2d');
// let options =  {
//     type: 'bar',
//     data: {
//         labels: [],
//         datasets: [{
//             label: 'Valores',
//             data: [],
//             backgroundColor: [
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(255, 206, 86, 0.2)'
//             ],
//             borderColor: [
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)'
//             ],
//             borderWidth: 1
//         }]
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         }
//     }
// };



let myChartse = new ApexCharts(ctx, options);
myChartse.render();


let urlse = "https://esenttiapp-production.up.railway.app/api/volumenesimpexp";
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