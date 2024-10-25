fetch('https://sertrack-production.up.railway.app/api/intervalfifteenday')
  .then(response => response.json())
  .then(data => {
    generarGraficoOnTime(data);
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
    // En caso de error, generar el gráfico con un array vacío
    generarGraficoOnTime([]); 
  });

function generarGraficoOnTime(data) {
  // Contar las ocurrencias de cada valor de "on_time"
  const onTimeCounts = {};
  data.forEach(item => {
    const onTime = item.on_timec;
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
  const domOnTime = document.getElementById('grafico-on-time'); 
  const myChartOnTime = echarts.init(domOnTime);

  // Si no hay datos, mostrar un gráfico vacío con un mensaje
  if (labels.length === 0) {
    myChartOnTime.setOption({
      title: {
        text: 'CANTIDAD POR ESTADO DE "ON TIME"',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
        },
        padding: [0, 0, 20, 0]
      },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        label: {
          show: true,
          position: 'center',
          formatter: 'No hay datos disponibles',
          fontSize: 16
        },
        data: [] // Datos vacíos
      }]
    });
    return; 
  }

  const chartData = labels.map((label, index) => ({
    value: values[index],
    name: label,
    itemStyle: {
      color: colores[index % colores.length]
    }
  }));

  const option = {
    title: {
      text: 'CANTIDAD POR ESTADO', 
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