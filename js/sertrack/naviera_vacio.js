fetch('https://esenttiapp-production.up.railway.app/api/esenttiavacio', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
  }
})
  .then(response => response.json())
  .then(data => {
    generarGraficoLineaNaviera(data);
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
  });

function generarGraficoLineaNaviera(data) {
  // 1. Contar la cantidad de contenedores por línea naviera
  const conteoNavieras = {};
  data.forEach(item => {
    conteoNavieras[item.naviera] = (conteoNavieras[item.naviera] || 0) + 1;
  });

  // 2. Preparar los datos para el gráfico
  const labels = Object.keys(conteoNavieras);
  const values = Object.values(conteoNavieras);

  // 3. Usar la paleta de colores del ejemplo (puedes ajustarla)
  const colores = [
    '#00bfff', 
    '#87cefa', 
    '#4682b4', 
    '#1e90ff' 
  ];

  // 4. Crear el gráfico de pastel con ECharts
  const domLineaNaviera = document.getElementById('grafico-naviera'); 
  const myChartLineaNaviera = echarts.init(domLineaNaviera);

  const chartData = labels.map((label, index) => ({
    value: values[index],
    name: label,
    itemStyle: {
      color: colores[index % colores.length]
    }
  }));

  const option = {
    title: {
      text: 'CANTIDAD DE CONTENEDORES POR LINEA NAVIERA', 
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
      },
      padding: [0, 0, 20, 0]
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [{
      name: 'Cantidad', 
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

  myChartLineaNaviera.setOption(option);
}


//document.addEventListener('DOMContentLoaded', function() {
  //   generarGraficoLineaNaviera(); 
  
  //   function generarGraficoLineaNaviera() {
  //     fetch('https://esenttiapp-production.up.railway.app/api/esenttiavacio', {
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem("authToken")}`
  //       }
  //     })
  //       .then(response => response.json())
  //       .then(data => {
  //         // 1. Contar la cantidad de contenedores por línea naviera
  //         const conteoNavieras = {};
  //         data.forEach(item => {
  //           conteoNavieras[item.naviera] = (conteoNavieras[item.naviera] || 0) + 1;
  //         });
  
  //         // 2. Preparar los datos para el gráfico
  //         const labels = Object.keys(conteoNavieras);
  //         const valores = Object.values(conteoNavieras);
  
  //         // 3. Crear gradientes para las barras
  //         const ctx = document.getElementById('grafico-naviera').getContext('2d'); // Asegúrate de tener un elemento con este ID
  //         const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
  //         gradient1.addColorStop(0, '#00bfff');
  //         gradient1.addColorStop(1, '#87cefa');
  
  //         const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
  //         gradient2.addColorStop(0, '#87cefa');
  //         gradient2.addColorStop(1, '#4682b4');
  
  //         const gradient3 = ctx.createLinearGradient(0, 0, 0, 400);
  //         gradient3.addColorStop(0, '#4682b4');
  //         gradient3.addColorStop(1, '#1e90ff');
  
  //         // 4. Asignar los gradientes a las barras
  //         const backgroundColor = [];
  //         for (let i = 0; i < valores.length; i++) {
  //           switch (i % 3) {
  //             case 0: backgroundColor.push(gradient1); break;
  //             case 1: backgroundColor.push(gradient2); break;
  //             case 2: backgroundColor.push(gradient3); break;
  //           }
  //         }
  
  //         // 5. Crear gráfico con Chart.js
  //         new Chart(ctx, {
  //           type: 'bar',
  //           data: {
  //             labels: labels,
  //             datasets: [{
  //               label: 'Cantidad de contenedores',
  //               data: valores,
  //               backgroundColor: backgroundColor,
  //               borderColor: 'transparent', 
  //               borderWidth: 0,
  //               borderRadius: 15,
  //               barPercentage: 0.7,
  //               categoryPercentage: 0.6
  //             }]
  //           },
  //           options: {
  //             indexAxis: 'y',
  //             responsive: true,
  //             plugins: {
  //               legend: {
  //                 display: false
  //               }
  //             },
  //             scales: {
  //               x: {
  //                 beginAtZero: true,
  //                 grid: {
  //                   display: false
  //                 },
  //                 ticks: {
  //                   stepSize: 1 
  //                 }
  //               },
  //               y: {
  //                 beginAtZero: true,
  //                 precision: 0,
  //                 grid: {
  //                   color: '#e0e0e0',
  //                   borderDash: [3, 3]
  //                 }
  //               }
  //             }
  //           }
  //         });
  //       });
  //   }
  // });