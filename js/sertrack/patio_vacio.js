fetch('https://sertrack-production.up.railway.app/api/totalpatioretiro')
  .then(response => response.json())
  .then(data => {
    generarGraficoPatioRetiro(data);
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
    // En caso de error, generar el gráfico con un array vacío
    generarGraficoPatioRetiro([]); 
  });

function generarGraficoPatioRetiro(data) {
  // Preparar los datos para el gráfico
  const labels = data.map(item => item.patio_retiro);
  const values = data.map(item => item.total_patio_retiro);

  // Usar la paleta de colores del ejemplo
  const colores = [
    '#00bfff', 
    '#87cefa', 
    '#4682b4', 
    '#1e90ff' 
  ];

  // Crear el gráfico de pastel con ECharts
  const domPatioRetiro = document.getElementById('grafico-patio-retiro');
  const myChartPatioRetiro = echarts.init(domPatioRetiro);

  // Si no hay datos, mostrar un gráfico vacío con un mensaje
  if (labels.length === 0) {
    myChartPatioRetiro.setOption({
      title: {
        text: 'CANTIDAD POR PATIO DE RETIRO',
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
        data: [] 
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
      text: 'CANTIDAD POR PATIO DE RETIRO',
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
      name: 'Cantidad por patio_retiro',
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

  myChartPatioRetiro.setOption(option);
}