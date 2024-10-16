const endpoint = "https://sertrack-production.up.railway.app/api/planeacion";

async function fetchData() {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
        console.error("Error de autenticación: Token no encontrado.");
        mostrarError("Error de autenticación");
        return;
    }

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error en la solicitud:", response.status, errorData);
            mostrarError(`Error en la solicitud: ${response.status} - ${errorData.message}`);
            return;
        }

        const data = await response.json();

        // Mostrar resultados numéricos
        const totalPrograma = contarRegistrosFechaActual(data);
        const totalVehiculos = contarVehiculosFechaActual(data);
        const totalIngresoPlanta = contarIngresoPlantaFechaActual(data);
        const totalDocumentoLleno = contarDocumentoCargadoFechaActual(data)
        mostrarResultado(totalPrograma, totalVehiculos, totalIngresoPlanta, totalDocumentoLleno); // Actualizar la función mostrarResultado
    
        // Generar gráficos
        generarGraficoEstadoPrograma(data);
        generarGraficoEstadoOperacion(data);
        generarGraficoPuertoIngreso(data);
        generarGraficoPatioRetiro(data);  
        generarGraficoOnTime(data);
        generarGraficoLineaNaviera(data);
        generarGraficoSitioCargue(data);
        generarGraficoTotalPorFecha(data);
        generarTablaDatos(data);

    } catch (error) {
        console.error("Error al obtener los datos:", error);
        mostrarError("Error al obtener datos");
    }
}

function contarRegistrosFechaActual(data) {
    const fechaActual = new Date().toISOString().slice(0, 10);
    let contador = 0;
  
    for (let i = 0; i < data.length; i++) {
      if (data[i].fecha_global) { // Verificar si la propiedad existe
        const fechaIngreso = data[i].fecha_global.slice(0, 10);
        if (fechaIngreso === fechaActual) {
          contador++;
        }
      }
    }
  
    return contador;
  }

function contarVehiculosFechaActual(data) {
  const fechaActual = new Date().toISOString().slice(0, 10);
  let contador = 0;

  for (let i = 0; i < data.length; i++) {
    const fechaGlobal = data[i].fecha_global.slice(0, 10);
    if (fechaGlobal === fechaActual && data[i].vehiculo) {  
      contador++;
    }
  }

  return contador;
}

function contarIngresoPlantaFechaActual(data) {
  const fechaActual = new Date().toISOString().slice(0, 10);
  let contador = 0;

  for (let i = 0; i < data.length; i++) {
      if (data[i].fecha_global && data[i].ingreso_planta) {
          const fechaIngreso = data[i].fecha_global.slice(0, 10);
          if (fechaIngreso === fechaActual) {
              contador++;
          }
      }
  }

  return contador;
}

function contarDocumentoCargadoFechaActual(data) {
  const fechaActual = new Date().toISOString().slice(0, 10);
  let contador = 0;

  for (let i = 0; i < data.length; i++) {
      if (data[i].fecha_global && data[i].documentos_lleno) {
          const documentos_lleno = data[i].fecha_global.slice(0, 10);
          if (documentos_lleno === fechaActual) {
              contador++;
          }
      }
  }

  return contador;
}

function mostrarResultado(totalPrograma, totalVehiculos, totalIngresoPlanta, totalDocumentoLleno) { 
  document.getElementById("total-programa").textContent = totalPrograma;
  document.getElementById("total-vehiculos").textContent = totalVehiculos; 
  document.getElementById("total-ingreso-planta").textContent = totalIngresoPlanta; 
  document.getElementById("total-documento-lleno").textContent = totalDocumentoLleno; 
}

function mostrarError(mensaje) {
  document.getElementById("total-programa").textContent = mensaje; 
  document.getElementById("total-vehiculos").textContent = mensaje; 
  document.getElementById("total-ingreso-planta").textContent = mensaje;
  document.getElementById("total-documento-lleno").textContent = mensaje; 
}




function generarGraficoEstadoPrograma(data) {
    // Filtrar datos por fecha actual
    const fechaActual = new Date().toISOString().slice(0, 10);
    const datosFiltrados = data.filter(item => item.fecha_global.slice(0, 10) === fechaActual);

    // Contar combinaciones de estado_operacion y on_time
    const conteo = {};
    datosFiltrados.forEach(item => {
        const key = `${item.estado_operacion}-${item.on_time}`;
        conteo[key] = (conteo[key] || 0) + 1;
    });

    // Preparar datos para el gráfico
    const labels = Object.keys(conteo);
    const valores = Object.values(conteo);

    // Crear gradientes para las barras
    const ctx = document.getElementById('estado-programa').getContext('2d');
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0, '#00bfff');
    gradient1.addColorStop(1, '#87cefa');

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient2.addColorStop(0, '#87cefa');
    gradient2.addColorStop(1, '#4682b4');

    const gradient3 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient3.addColorStop(0, '#4682b4');
    gradient3.addColorStop(1, '#1e90ff');

    // Asignar los gradientes a las barras
    const backgroundColor = [];
    for (let i = 0; i < valores.length; i++) {
        switch (i % 3) {
            case 0: backgroundColor.push(gradient1); break;
            case 1: backgroundColor.push(gradient2); break;
            case 2: backgroundColor.push(gradient3); break;
        }
    }

    // Crear gráfico con Chart.js
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Estado del programa',
                data: valores,
                backgroundColor: backgroundColor,
                borderColor: 'transparent', // Sin borde para que se vea el gradiente
                borderWidth: 0,
                borderRadius: 15,
                barPercentage: 0.7,
                categoryPercentage: 0.6
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    precision: 0,
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    precision: 0,
                    grid: {
                        color: '#e0e0e0',
                        borderDash: [3, 3]
                    }
                }
            }
        }
    });
}

function generarGraficoEstadoOperacion(data) {
    // Filtrar datos por fecha actual (si es necesario)
    const fechaActual = new Date().toISOString().slice(0, 10);
    const datosFiltrados = data.filter(item => item.fecha_global.slice(0, 10) === fechaActual);
  
    // Contar las ocurrencias de cada estado_operacion
    const estadoOperacionCounts = {};
    datosFiltrados.forEach(item => {
      const estado = item.estado_operacion;
      estadoOperacionCounts[estado] = (estadoOperacionCounts[estado] || 0) + 1;
    });
  
    // Preparar los datos para el gráfico
    const labels = Object.keys(estadoOperacionCounts);
    const values = Object.values(estadoOperacionCounts);
  
    // Crear gradientes para las barras
    const ctx = document.getElementById('estado-operacion').getContext('2d');
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0, '#00bfff');
    gradient1.addColorStop(1, '#87cefa');
  
    const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient2.addColorStop(0, '#87cefa');
    gradient2.addColorStop(1, '#4682b4');
  
    const gradient3 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient3.addColorStop(0, '#4682b4');
    gradient3.addColorStop(1, '#1e90ff');
  
    // Asignar los gradientes a las barras
    const backgroundColor = [];
    for (let i = 0; i < values.length; i++) {
      switch (i % 3) {
        case 0: backgroundColor.push(gradient1); break;
        case 1: backgroundColor.push(gradient2); break;
        case 2: backgroundColor.push(gradient3); break;
      }
    }
  
    // Crear el gráfico de barras
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total por estado_operacion',
          data: values,
          backgroundColor: backgroundColor,
          borderColor: 'transparent', // Sin borde para que se vea el gradiente
          borderWidth: 0,
          borderRadius: 15, 
          barPercentage: 0.7,
          categoryPercentage: 0.6
        }]
      },
      options: {
        indexAxis: 'y', // Mostrar el gráfico horizontalmente
        responsive: true,
        plugins: {
          legend: {
            display: false // Ocultar la leyenda
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            precision: 0,
            grid: {
              display: false // Ocultar las líneas de la grilla en el eje x
            }
          },
          y: {
            beginAtZero: true,
            precision: 0,
            grid: {
              color: '#e0e0e0', // Color de las líneas de la grilla en el eje y
              borderDash: [3, 3] // Estilo de línea punteada
            }
          }
        }
      }
    });
  }

  function generarGraficoPuertoIngreso(data) {
    // Contar las ocurrencias de cada puerto_ingreso
    const puertoIngresoCounts = {};
    data.forEach(item => {
      const puerto = item.puerto_ingreso;
      puertoIngresoCounts[puerto] = (puertoIngresoCounts[puerto] || 0) + 1;
    });
  
    // Preparar los datos para el gráfico
    const labels = Object.keys(puertoIngresoCounts);
    const values = Object.values(puertoIngresoCounts);
  
    // Crear gradientes para las barras
    const ctx = document.getElementById('grafico-puerto-ingreso').getContext('2d');
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0, '#00bfff');
    gradient1.addColorStop(1, '#87cefa');
  
    const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient2.addColorStop(0, '#87cefa');
    gradient2.addColorStop(1, '#4682b4');
  
    const gradient3 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient3.addColorStop(0, '#4682b4');
    gradient3.addColorStop(1, '#1e90ff');
  
    // Asignar los gradientes a las barras
    const backgroundColor = [];
    for (let i = 0; i < values.length; i++) {
      switch (i % 3) {
        case 0: backgroundColor.push(gradient1); break;
        case 1: backgroundColor.push(gradient2); break;
        case 2: backgroundColor.push(gradient3); break;
      }
    }
  
    // Crear el gráfico de barras vertical
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cantidad por puerto_ingreso',
          data: values,
          backgroundColor: backgroundColor,
          borderColor: 'transparent', // Sin borde para que se vea el gradiente
          borderWidth: 0,
          borderRadius: 15,
          barPercentage: 0.7,
          categoryPercentage: 0.6
        }]
      },
      options: {
        indexAxis: 'y', // Mostrar el gráfico horizontalmente
        responsive: true,
        plugins: {
          legend: {
            display: false // Ocultar la leyenda
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            precision: 0,
            grid: {
              display: false // Ocultar las líneas de la grilla en el eje x
            }
          },
          y: {
            beginAtZero: true,
            precision: 0,
            grid: {
              color: '#e0e0e0', // Color de las líneas de la grilla en el eje y
              borderDash: [3, 3] // Estilo de línea punteada
            }
          }
        }
      }
    });
  }

  function generarGraficoPatioRetiro(data) {
    // Contar las ocurrencias de cada patio_retiro
    const patioRetiroCounts = {};
    data.forEach(item => {
      const patio = item.patio_retiro;
      patioRetiroCounts[patio] = (patioRetiroCounts[patio] || 0) + 1;
    });
  
    // Preparar los datos para el gráfico
    const labels = Object.keys(patioRetiroCounts);
    const values = Object.values(patioRetiroCounts);
  
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

// Función auxiliar para generar colores aleatorios
function generarColoresAleatorios(numColores) {
    const colores = [];
    for (let i = 0; i < numColores; i++) {
        const color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`;
        colores.push(color);
    }
    return colores;
}

function generarGraficoOnTime(data) {
    // Contar las ocurrencias de cada on_time
    const onTimeCounts = {};
    data.forEach(item => {
      const onTime = item.on_time;
      onTimeCounts[onTime] = (onTimeCounts[onTime] || 0) + 1;
    });
  
    // Preparar los datos para el gráfico
    const labels = Object.keys(onTimeCounts);
    const values = Object.values(onTimeCounts);
  
    // Usar la paleta de colores del ejemplo
    const colores = [
      '#00bfff', 
      '#87cefa', 
      '#4682b4', 
      '#1e90ff' 
    ];
  
    // Crear el gráfico de pastel con ECharts
    const domOnTime = document.getElementById('grafico-on-time');
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
        text: 'CANTIDAD POR ON TIME', // Cambiar el título
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
        name: 'Cantidad por on_time',
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

  function generarGraficoLineaNaviera(data) {
    // Obtener la fecha actual en el formato adecuado
    const fechaActual = new Date().toISOString().slice(0, 10); // Formato YYYY-MM-DD
  
    // Filtrar los datos por la fecha actual
    const datosFiltrados = data.filter(item => item.fecha_global === fechaActual);
  
    // Contar las ocurrencias de cada linea_naviera en los datos filtrados
    const lineaNavieraCounts = {};
    datosFiltrados.forEach(item => {
      const linea = item.linea_naviera;
      lineaNavieraCounts[linea] = (lineaNavieraCounts[linea] || 0) + 1;
    });
    // Preparar los datos para el gráfico
    const labels = Object.keys(lineaNavieraCounts);
    const values = Object.values(lineaNavieraCounts);
  
    // Usar la paleta de colores del ejemplo
    const colores = [
      '#00bfff', 
      '#87cefa', 
      '#4682b4', 
      '#1e90ff' 
    ];
  
    // Crear el gráfico de pastel con ECharts
    const domLineaNaviera = document.getElementById('grafico-linea-naviera');
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
        text: 'CANTIDAD POR LINEA NAVIERA', // Cambiar el título
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
        name: 'Cantidad por linea_naviera',
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

  function generarGraficoSitioCargue(data) {
    // Contar las ocurrencias de cada sitio_cargue
    const sitioCargueCounts = {};
    data.forEach(item => {
      const sitio = item.sitio_cargue;
      sitioCargueCounts[sitio] = (sitioCargueCounts[sitio] || 0) + 1;
    });
  
    // Preparar los datos para el gráfico
    const labels = Object.keys(sitioCargueCounts);
    const values = Object.values(sitioCargueCounts);
  
    // Usar la paleta de colores del ejemplo
    const colores = [
      '#00bfff', 
      '#87cefa', 
      '#4682b4', 
      '#1e90ff' 
    ];
  
    // Crear el gráfico de pastel con ECharts
    const domSitioCargue = document.getElementById('grafico-sitio-cargue');
    const myChartSitioCargue = echarts.init(domSitioCargue);
  
    const chartData = labels.map((label, index) => ({
      value: values[index],
      name: label,
      itemStyle: {
        color: colores[index % colores.length]
      }
    }));
  
    const option = {
      title: {
        text: 'CANTIDAD POR SITIO DE CARGUE', // Cambiar el título
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
        name: 'Cantidad por sitio_cargue',
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

function generarTablaDatos(data) {
    // Obtener la fecha actual en formato YYYY-MM-DD
    const fechaActual = new Date().toISOString().split('T')[0];
  
    // Filtrar los datos por fecha actual
    const datosFiltrados = data.filter(item => item.fecha_global.slice(0, 10) === fechaActual);
  
    // Obtener la tabla HTML
    const tabla = document.getElementById('detalle-programa');
  
    // Crear las filas de la tabla (usando datosFiltrados)
    datosFiltrados.forEach(item => {
      const fila = tabla.insertRow();
      fila.insertCell().textContent = item.id;
      fila.insertCell().textContent = item.pedido;
      fila.insertCell().textContent = item.contenedor;
      fila.insertCell().textContent = item.horas_planta;
      fila.insertCell().textContent = item.fecha_programa;
      fila.insertCell().textContent = item.linea_naviera;
      fila.insertCell().textContent = item.patio_retiro;
      fila.insertCell().textContent = item.puerto_ingreso;
      fila.insertCell().textContent = item.estado_operacion;
      fila.insertCell().textContent = item.motonave;
    });
  }

function generarGraficoTotalPorFecha(data) {
  const fechaActual = new Date();
  const datosUltimos30Dias = data.filter(item => {
    const fechaItem = new Date(item.fecha_global);
    const diferenciaDias = (fechaActual - fechaItem) / (1000 * 60 * 60 * 24);
    return diferenciaDias <= 30;
  });

  const totalesPorFecha = {};
  datosUltimos30Dias.forEach(item => {
    const fecha = item.fecha_global;
    totalesPorFecha[fecha] = (totalesPorFecha[fecha] || 0) + 1;
  });

  const labels = Object.keys(totalesPorFecha);
  const values = Object.values(totalesPorFecha);

  const ctx = document.getElementById('dias-total-programa').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Conteo',
        data: values,
        backgroundColor: ['#1e90ff', '#00bfff'],
        borderColor: ['#00bfff', '#1e90ff'],
        borderWidth: 1,
        borderRadius: 10,
        borderSkipped: false
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false,
          position: 'top',
          labels: {
            color: '#496ecc',
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              return "Solicitudes: " + tooltipItem.raw;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#3e4954',
            font: {
              size: 10,
              family: 'poppins',
              weight: 500
            },
            autoSkip: false,
            maxRotation: 20,
            minRotation: 20
          },
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#496ecc',
            font: {
              size: 13,
              family: 'poppins',
              weight: 400
            }
          },
          grid: {
            color: '#eee'
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

fetchData();