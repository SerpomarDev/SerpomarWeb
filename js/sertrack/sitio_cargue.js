fetch('https://sertrack-production.up.railway.app/api/sitiocargue')
  .then(response => response.json())
  .then(data => {
    generarGraficoSitioCargue(data);
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
    // En caso de error, generar el gráfico con un array vacío
    generarGraficoSitioCargue([]); 
  });

function generarGraficoSitioCargue(data) {
  // Preparar los datos para el gráfico
  const labels = data.map(item => item.sitio_cargue);
  const values = data.map(item => item.total_sitio_cargue);

  // Usar la paleta de colores del ejemplo (puedes ajustarla)
  const colores = [
    '#00bfff',
    '#87cefa',
    '#4682b4',
    '#1e90ff'
  ];

  // Crear el gráfico de pastel con ECharts
  const domSitioCargue = document.getElementById('grafico-sitio-cargue'); 
  const myChartSitioCargue = echarts.init(domSitioCargue);

  // Si no hay datos, mostrar un gráfico vacío con un mensaje
  if (labels.length === 0) {
    myChartSitioCargue.setOption({
      title: {
        text: 'CANTIDAD POR SITIO DE CARGUE',
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
      text: 'CANTIDAD POR SITIO DE CARGUE', 
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

  myChartSitioCargue.setOption(option);
}