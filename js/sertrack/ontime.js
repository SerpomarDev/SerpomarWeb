fetch('https://sertrack-production.up.railway.app/api/ontime')
  .then(response => response.json())
  .then(data => {
    generarGraficoOnTime(data);
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
  });

function generarGraficoOnTime(data) {
  // Contar las ocurrencias de cada valor de "on_time"
  const onTimeCounts = {};
  data.forEach(item => {
    const onTime = item.on_time;
    onTimeCounts[onTime] = (onTimeCounts[onTime] || 0) + 1;
  });

  // Preparar los datos para el gráfico
  const labels = Object.keys(onTimeCounts);
  const values = Object.values(onTimeCounts);

  // Usar la paleta de colores del ejemplo (puedes ajustarla)
  const colores = [
    '#00bfff', 
    '#87cefa', 
    '#4682b4', 
    '#1e90ff' 
  ];

  // Crear el gráfico de pastel con ECharts
  const domOnTime = document.getElementById('grafico-on-time'); // Asegúrate de tener un elemento con este ID
  const myChartOnTime = echarts.init(domOnTime);

  const chartData = labels.map((label, index) => ({
    value: values[index],
    name: label,
    itemStyle: {
      color: colores[index % colores.length]
    }
  }));

  const option = {
    title: {
      text: 'CANTIDAD POR ESTADO DE "ON TIME"', // Título del gráfico
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

  myChartOnTime.setOption(option);
}