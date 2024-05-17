
// Grafico que indica el numero autos asignados a cada proyecto
let cts = document.getElementById('proyectos')
    let myCharts = new Chart(cts,{
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Proyectos',
                backgroundColor: [
                'rgb(231, 76, 60)',
                'rgb(26, 188, 156)',
                'rgb(52, 152, 219)',
                'rgb(142, 68, 173)',
                'rgb(155, 89, 182)',
                'rgb(241, 196, 15)',
                ],
                hoverOffset: 4,
                borderColor: ['black'],
                borderWidth: 1
            }],
        },
        options:{
            scales:{
                y:{
                    beginAtZero:true,
                }
            }
        }
    })
    
    let urls = "https://esenttiapp-production.up.railway.app/api/resumenproyectos";
fetch(urls)
    .then(response => response.json())
    .then(items => view(items))
    .catch(error => console.log(error));

const view = (proyectos) => {
    proyectos.forEach(elements => {
        myCharts.data.labels.push(elements.proyecto); // Añade etiquetas al gráfico
        myCharts.data.datasets[0].data.push(elements.conteo); // Añade datos al gráfico
    });
    myCharts.update(); // Actualiza el gráfico para mostrar los nuevos datos
}



    // Grafico que indica estado de los autos
// Documentacion https://www.chartjs.org/docs/latest/
let ctx = document.getElementById('estados')
let myChart = new Chart(ctx,{
    type:'bar',
    data:{
        datasets:[{
            label:'Estado Operación',
            backgroundColor: [
                'rgb(231, 76, 60)',
                'rgb(26, 188, 156)',
                'rgb(52, 152, 219)',
                'rgb(142, 68, 173)',
                'rgb(155, 89, 182)',
                'rgb(241, 196, 15)',
              ],
              hoverOffset: 4,
            borderColor:['black'],
            borderWidth:1
        }],
    },
    option:{
        scales:{
            y:{
                beginAtZero:true,
            }
        }
    }
})

let url = "https://esenttiapp-production.up.railway.app/api/resumenestados"
fetch(url)
    .then(response=>response.json())
    .then(datos=>mostrar(datos))
    .catch(error => console.log(error))


const mostrar = (estados)=>{
    estados.forEach(element => {
        myChart.data['labels'].push(element.estado)
        myChart.data['datasets'][0].data.push(element.conteo)
    });
    myChart.update();
}
