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
        const totalColocados = contarRegistrosColocadosFechaActual(data);
        const totalCargados = contarDocumentosLlenoFechaActual(data);
        const totalVehiculos = contarVehiculosFechaActual(data);
        mostrarResultado(totalPrograma, totalColocados, totalCargados, totalVehiculos);

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
    const fechaIngreso = data[i].fecha_global.slice(0, 10);
    if (fechaIngreso === fechaActual) {
      contador++;
    }
  }

  return contador;
}

function contarRegistrosColocadosFechaActual(data) { 
  const fechaActual = new Date().toISOString().slice(0, 10);
  let contador = 0;

  for (let i = 0; i < data.length; i++) {
    const fechaIngresoPlanta = data[i].ingreso_planta.slice(0, 10);
    if (fechaIngresoPlanta === fechaActual) { 
      contador++;
    }
  }

  return contador;
}

function contarDocumentosLlenoFechaActual(data) {
  const fechaActual = new Date().toISOString().slice(0, 10);
  let contador = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i].documentos_lleno) { 
      const fechaDocumentoLleno = data[i].documentos_lleno.slice(0, 10);
      if (fechaDocumentoLleno === fechaActual) {
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

function mostrarResultado(totalPrograma, totalColocados, totalCargados, totalVehiculos) { 
  document.getElementById("total-programa").textContent = totalPrograma;
  document.getElementById("total-colocados").textContent = totalColocados;
  document.getElementById("total-cargados").textContent = totalCargados;
  document.getElementById("total-vehiculos").textContent = totalVehiculos; 
}

function mostrarError(mensaje) {
  document.getElementById("total-programa").textContent = mensaje; 
  document.getElementById("total-colocados").textContent = mensaje; 
  document.getElementById("total-cargados").textContent = mensaje; 
  document.getElementById("total-vehiculos").textContent = mensaje; 
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
    const colores = {
        'ASIGNADO-ON TIME': 'rgba(54, 162, 235, 0.2)',
        'FINALIZADO-ON TIME': 'rgba(75, 192, 192, 0.2)',
        'FALSE-ON TIME': 'rgba(255, 206, 86, 0.2)',
    };

    // Crear gráfico con Chart.js
    const ctx = document.getElementById('estado-programa').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Estado del programa',
                data: valores,
                backgroundColor: labels.map(label => colores[label] || 'rgba(0, 0, 0, 0.2)'),
                borderColor: labels.map(label => colores[label] ? colores[label].replace(/0\.2$/, '1') : 'rgba(0, 0, 0, 1)'),
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    precision: 0
                }
            },
            plugins: {
                legend: {
                    display: false
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

    // Crear el gráfico de barras
    const ctx = document.getElementById('estado-operacion').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total por estado_operacion',
                data: values,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,

                    precision: 0
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

    // Crear el gráfico de barras
    const ctx = document.getElementById('estado-operacion').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total por estado_operacion',
                data: values,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,

                    precision: 0
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

    // Crear el gráfico de barras vertical
    const ctx = document.getElementById('grafico-puerto-ingreso').getContext('2d'); 
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cantidad por puerto_ingreso',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.2)', 
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    precision: 0 
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
    const colores = generarColoresAleatorios(labels.length); // Función para generar colores aleatorios

    // Crear el gráfico de pastel
    const ctx = document.getElementById('grafico-patio-retiro').getContext('2d'); 
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cantidad por patio_retiro',
                data: values,
                backgroundColor: colores, 
                borderColor: colores.map(color => color.replace(/0\.2$/, '1')), // Ajustar opacidad del borde
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'right' // Colocar la leyenda a la derecha
                }
            }
        }
    });
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
    const colores = generarColoresAleatorios(labels.length); // Función para generar colores aleatorios

    // Crear el gráfico de pastel
    const ctx = document.getElementById('grafico-on-time').getContext('2d'); 
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cantidad por on_time',
                data: values,
                backgroundColor: colores, 
                borderColor: colores.map(color => color.replace(/0\.2$/, '1')), // Ajustar opacidad del borde
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'right' // Colocar la leyenda a la derecha
                }
            }
        }
    });
}

function generarGraficoLineaNaviera(data) {
    // Contar las ocurrencias de cada linea_naviera
    const lineaNavieraCounts = {};
    data.forEach(item => {
        const linea = item.linea_naviera;
        lineaNavieraCounts[linea] = (lineaNavieraCounts[linea] || 0) + 1;
    });

    // Preparar los datos para el gráfico
    const labels = Object.keys(lineaNavieraCounts);
    const values = Object.values(lineaNavieraCounts);
    const colores = generarColoresAleatorios(labels.length); // Función para generar colores aleatorios

    // Crear el gráfico de barras
    const ctx = document.getElementById('grafico-linea-naviera').getContext('2d'); 
    new Chart(ctx, {
        type: 'pie', // Tipo de gráfico de barras
        data: {
            labels: labels,
            datasets: [{
                label: 'Cantidad por linea_naviera',
                data: values,
                backgroundColor: colores, 
                borderColor: colores.map(color => color.replace(/0\.2$/, '1')), // Ajustar opacidad del borde
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'right' // Colocar la leyenda a la derecha
                }
            }
        }
    });
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
    const colores = generarColoresAleatorios(labels.length); // Función para generar colores aleatorios

    // Crear el gráfico de barras
    const ctx = document.getElementById('grafico-sitio-cargue').getContext('2d'); // Asegúrate de que el ID del canvas sea el correcto
    new Chart(ctx, {
        type: 'pie', // Tipo de gráfico de barras
        data: {
            labels: labels,
            datasets: [{
                label: 'Cantidad por sitio_cargue',
                data: values,
                backgroundColor: colores, 
                borderColor: colores.map(color => color.replace(/0\.2$/, '1')), // Ajustar opacidad del borde
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'right' // Colocar la leyenda a la derecha
                }
            }
        }
    });
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
    // Obtener la fecha actual
    const fechaActual = new Date();
  
    // Filtrar los datos de los últimos 30 días
    const datosUltimos30Dias = data.filter(item => {
      const fechaItem = new Date(item.fecha_global);
      const diferenciaDias = (fechaActual - fechaItem) / (1000 * 60 * 60 * 24);
      return diferenciaDias <= 30;
    });
  
    // Agrupar por fecha y contar las ocurrencias
    const totalesPorFecha = {};
    datosUltimos30Dias.forEach(item => {
      const fecha = item.fecha_global;
      totalesPorFecha[fecha] = (totalesPorFecha[fecha] || 0) + 1;
    });
  
    // Preparar los datos para el gráfico
    const labels = Object.keys(totalesPorFecha);
    const values = Object.values(totalesPorFecha);
  
    // Crear el gráfico de barras
    const ctx = document.getElementById('dias-total-programa').getContext('2d'); // Reemplaza 'miGrafico' con el ID de tu canvas
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total por fecha',
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Fecha'
            }
          },
          y: {
            beginAtZero: true,
            precision: 0,
            title: {
              display: true,
              text: 'Total'
            }
          }
        }
      }
    });
  }

fetchData();