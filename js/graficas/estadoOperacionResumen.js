let ctse = document.getElementById('operacionC')
    let myChartse = new Chart(ctse,{
        type:'pie',
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
    
    let urlse = "https://esenttiapp-production.up.railway.app/api/resumenestadooperacion"
    fetch(urlse)
        .then(response=>response.json())
        .then(itemsEs=>viewEs(itemsEs))
        .catch(error => console.log(error))
    
    
    const viewEs = (estadoEs)=>{
        estadoEs.forEach(elementse => {
            myChartse.data['labels'].push(elementse.estado)
            myChartse.data['datasets'][0].data.push(elementse.conteo)
        });
        myChartse.update();
    }