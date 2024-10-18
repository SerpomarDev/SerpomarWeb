

async function generarTablaDatos() {
  try {
    // Obtener el token del localStorage
    const token = localStorage.getItem('authToken'); 

    // Realizar la solicitud fetch al endpoint, incluyendo el token en las cabeceras
    const response = await fetch("https://esenttiapp-production.up.railway.app/api/esenttiavacio", {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });

    const data = await response.json(); 

// Obtener la tabla HTML y el cuerpo de la tabla (<tbody>)
const tabla = document.getElementById('tabla-vacio'); // Id corregido
const tbody = tabla.querySelector('tbody'); 

    // Limpiar solo el cuerpo de la tabla (<tbody>)
    tbody.innerHTML = ""; 

    // Crear las filas de la tabla 
    data.forEach(item => {
      const fila = tbody.insertRow(); 
      fila.insertCell().textContent = item.cliente;
      fila.insertCell().textContent = item.contenedor;
      fila.insertCell().textContent = item.tipo_contenedor;
      fila.insertCell().textContent = item.cantidad_dias;
    });
  } catch (error) {
    console.error("Error al obtener o procesar los datos:", error);
    // Manejo de errores (mostrar un mensaje al usuario, etc.)
  }
}

// Llamar a la función para generar la tabla
generarTablaDatos();