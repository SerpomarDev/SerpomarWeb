

  fetch('https://esenttiapp-production.up.railway.app/api/esenttialleno', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
  })
  .then(response => response.json())
  .then(data => {
    // Verificar si data es un array
    if (Array.isArray(data)) {
      // Actualizar el contador con el total de objetos
      const totalObjetos = data.length;
      const contadorElement = document.getElementById('total-llenos'); 
      if (contadorElement) {
        contadorElement.textContent = totalObjetos;
      }

    } else {
      console.error('La respuesta del servidor no es un array:', data);
    
    }
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
    generarGraficoOnTime([]);
  });