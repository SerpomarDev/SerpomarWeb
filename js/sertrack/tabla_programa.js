async function generarTablaDatos() {
  try {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token'); // Reemplaza 'token' con la clave real si es diferente

    // Obtener la fecha actual en formato YYYY-MM-DD
    const fechaActual = new Date().toISOString().split('T')[0];

    // Realizar la solicitud fetch al endpoint, incluyendo el token en las cabeceras
    const response = await fetch("https://sertrack-production.up.railway.app/api/intervalfifteenday", {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });


    const data = await response.json(); 

    // Filtrar los datos por fecha actual
    const datosFiltrados = data.filter(item => item.fecha_global.slice(0, 10) === fechaActual);

    // Obtener la tabla HTML y el cuerpo de la tabla (<tbody>)
    const tabla = document.getElementById('detalle-programa');
    const tbody = tabla.querySelector('tbody'); 

    // Limpiar solo el cuerpo de la tabla (<tbody>)
    tbody.innerHTML = ""; 

    // Crear las filas de la tabla 
    datosFiltrados.forEach(item => {
      const fila = tbody.insertRow(); 
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
  } catch (error) {
    console.error("Error al obtener o procesar los datos:", error);
    // Manejo de errores (mostrar un mensaje al usuario, etc.)
  }
}

// Llamar a la función para generar la tabla
generarTablaDatos();