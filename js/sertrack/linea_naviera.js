fetch('https://sertrack-production.up.railway.app/api/lineanaviera')
  .then(response => response.json())
  .then(data => {
    generarGraficoLineaNaviera(data);
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
  });

function generarGraficoLineaNaviera(data) {
  // Preparar los datos para el gráfico
  const labels = data.map(item => item.linea_naviera);
  const values = data.map(item => item.total_patio_retiro);

  // Usar la paleta de colores del ejemplo (puedes ajustarla)
  const colores = [
    '#00bfff', 
    '#87cefa', 
    '#4682b4', 
    '#1e90ff' 
  ];

  // Crear el gráfico de pastel con ECharts
  const domLineaNaviera = document.getElementById('grafico-linea-naviera'); // Asegúrate de tener un elemento con este ID
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
      text: 'CANTIDAD POR LINEA NAVIERA', // Título del gráfico
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