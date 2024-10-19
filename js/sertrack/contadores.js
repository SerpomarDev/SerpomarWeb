document.addEventListener('DOMContentLoaded', () => {
  function fetchData(url, elementId) {
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
      }
    })
    .then(response => response.json())
    .then(data => {
      // Check if data[0] exists and has the required property
      let value = 0; 
      if (data.length > 0 && data[0]) { 
        value = data[0].total_apariciones || data[0].total_documentos_lleno || data[0].total_ingreso_planta || data[0].total_vehiculos || 0;
      }
      document.getElementById(elementId).textContent = value;
    })
    .catch(error => {
      console.error('Error al obtener datos:', error);
      // Set the text content to 0 in case of an error
      document.getElementById(elementId).textContent = 0; 
    });
  }

  // Llamadas a la función fetchData para cada API
  fetchData('https://sertrack-production.up.railway.app/api/totalcolocados', 'total-documento-lleno');
  fetchData('https://sertrack-production.up.railway.app/api/totalprograma', 'total-programa');
  fetchData('https://sertrack-production.up.railway.app/api/totalcargados', 'total-ingreso-planta');
  fetchData('https://sertrack-production.up.railway.app/api/vehiculosoperacion', 'total-vehiculos');
});