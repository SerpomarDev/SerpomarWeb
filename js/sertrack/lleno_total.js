fetch('https://esenttiapp-production.up.railway.app/api/esenttialleno', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
  }
})
  .then(response => {
    if (!response.ok) {
      // Verificar el código de estado de la respuesta
      if (response.status === 401) {
        console.error('Token inválido o expirado');
        // Redirigir al usuario a la página de inicio de sesión o realizar otra acción
        // Ejemplo: window.location.href = '/login';
      } else {
        console.error('Error en la solicitud a la API');
      }
      throw new Error('Error en la solicitud a la API'); 
    }
    return response.json(); 
  })
  .then(data => {
    // Verificar si data es un array
    if (Array.isArray(data)) {
      generarGraficoOnTime(data);
    } else {
      console.error('La respuesta del servidor no es un array:', data);
      // Mostrar un mensaje de error en el gráfico o realizar otra acción
    }
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
    generarGraficoOnTime([]); 
  });

function generarGraficoOnTime(data) {
  // Calcular el total de objetos recibidos
  const totalObjetos = data.length;

  // Contar las ocurrencias de "lleno_vacio"
  const llenoVacioCounts = {};
  data.forEach(item => {
    const llenoVacio = item.lleno_vacio;
    llenoVacioCounts[llenoVacio] = (llenoVacioCounts[llenoVacio] || 0) + 1;
  });

  // Preparar los datos para el gráfico
  const labels = Object.keys(llenoVacioCounts);
  const values = Object.values(llenoVacioCounts);

  // Usar la paleta de colores del ejemplo
  const colores = [
    '#00bfff', 
    '#87cefa', 
    '#4682b4', 
    '#1e90ff' 
  ];

  // Crear el gráfico de pastel con ECharts
  const domOnTime = document.getElementById('grafico-vacio'); 
  const myChartOnTime = echarts.init(domOnTime);

  // Si no hay datos, mostrar un gráfico vacío con un mensaje
  if (data.length === 0) { 
    myChartOnTime.setOption({
      title: {
        text: `TOTAL DE LLENOS: ${totalObjetos}`,
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
      text: `TOTAL LLENOS EN PATIO: ${totalObjetos}`, 
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
