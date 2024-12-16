fetch('https://esenttiapp-production.up.railway.app/api/registroestadistico', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
  })
    .then(response => response.json())
    .then(data => {
        // Calcular la fecha actual usando Moment.js
        const fechaActual = moment().format('YYYY-MM-DD'); 
  
        // Filtrar los datos
        const datosFiltrados = data.filter(item => 
            item.cliente === "DISAN COLOMBIA S.A.S" && 
            item.modalidad === "importacion" && 
            item.naviera !== null &&
            moment(item.fecha_cita).format('YYYY-MM-DD') === fechaActual // Filtrar por fecha actual
        );
  
        generarGraficoNaviera(datosFiltrados); 
    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });
  
  function generarGraficoNaviera(data) {
      // 1. Contar la cantidad de contenedores por línea naviera
      const conteoDescargue = {};
      data.forEach(item => {
        conteoDescargue[item.naviera] = (conteoDescargue[item.naviera] || 0) + 1;
      });
    
      // 2. Preparar los datos para el gráfico
      const labels = Object.keys(conteoDescargue);
      const values = Object.values(conteoDescargue);
    
      // 3. Usar la paleta de colores del ejemplo (puedes ajustarla)
      const colores = [
        '#00bfff', 
        '#87cefa', 
        '#4682b4', 
        '#1e90ff' 
      ];
    
      // 4. Crear el gráfico de pastel con ECharts
      const domLineaNaviera = document.getElementById('navieras'); 
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
          text: 'Lineas Navieras', 
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
    
      myChartLineaNaviera.setOption(option);
    }
    
  