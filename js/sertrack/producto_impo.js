document.addEventListener('DOMContentLoaded', function () {
    // Obtener la fecha seleccionada de localStorage, o usar la fecha actual si no hay ninguna
    const fechaSeleccionada = localStorage.getItem('fechaSeleccionada') || moment().format('YYYY-MM-DD');
  
    // Actualizar el calendario con la fecha seleccionada
    const calendario = document.querySelector('.calendar');
    calendario.value = fechaSeleccionada;
  
    let miGrafico; // Variable para guardar la instancia del gráfico
  
    obtenerDatosYGenerarGrafico(fechaSeleccionada); // Pasar la fecha a la función
  
    calendario.addEventListener('change', () => {
      const nuevaFechaSeleccionada = calendario.value;
      localStorage.setItem('fechaSeleccionada', nuevaFechaSeleccionada);
      obtenerDatosYGenerarGrafico(nuevaFechaSeleccionada); // Actualizar el gráfico
    });
  
    function obtenerDatosYGenerarGrafico(fecha) {
      fetch('https://esenttiapp-production.up.railway.app/api/registroestadistico', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        }
      })
      .then(response => response.json())
      .then(data => {
        // Obtener el cliente del localStorage
        const clienteFiltrar = localStorage.getItem("cliente");
  
        // Filtrar los datos
        const datosFiltrados = data.filter(item =>
          item.cliente === clienteFiltrar && // Usar la variable del localStorage
          item.modalidad === "importacion" &&
          item.producto !== null &&
          moment(item.fecha_cita).format('YYYY-MM-DD') === fecha // Filtrar por fecha
        );
  
        generarGraficoLineaNaviera(datosFiltrados);
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
      });
    }
  
    function generarGraficoLineaNaviera(data) {
      // 1. Contar la cantidad de contenedores por línea naviera
      const conteoNavieras = {};
      data.forEach(item => {
        conteoNavieras[item.producto] = (conteoNavieras[item.producto] || 0) + 1;
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
  
      // Destruir el gráfico anterior si existe
      if (miGrafico) {
        miGrafico.dispose(); // Usar dispose() para gráficos de ECharts
      }
  
      // 4. Crear el gráfico de pastel con ECharts
      const domLineaNaviera = document.getElementById('productos');
      miGrafico = echarts.init(domLineaNaviera);
  
      const chartData = labels.map((label, index) => ({
        value: values[index],
        name: label,
        itemStyle: {
          color: colores[index % colores.length]
        }
      }));
  
      const option = {
        title: {
          text: 'PRODUCTOS',
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
          show: true, //activar para ver etiquetas
          top: '5%',
          left: 'center'
        },
        series: [{
          name: 'Cantidad',
          type: 'pie',
          radius: ['35%', '75%'],
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
              fontSize: 10,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false,
          },
          data: chartData
        }]
      };
  
      miGrafico.setOption(option);
    }
  });