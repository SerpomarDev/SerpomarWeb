document.addEventListener('DOMContentLoaded', () => {
  // Función para realizar una solicitud fetch
  function fetchData(url, elementId) {
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
      }
    })
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        document.getElementById(elementId).textContent = data[0].total_apariciones || data[0].total_documentos_lleno || data[0].total_ingreso_planta || data[0].total_vehiculos; 
      })
      .catch(error => {
        console.error('Error al obtener datos:', error);
      });
  }

  // Llamadas a la función fetchData para cada API
  fetchData('https://sertrack-production.up.railway.app/api/totalcolocados', 'total-ingreso-planta');
  fetchData('https://sertrack-production.up.railway.app/api/totalprograma', 'total-programa');
  fetchData('https://sertrack-production.up.railway.app/api/totalcargados', 'total-documento-lleno');
  fetchData('https://sertrack-production.up.railway.app/api/vehiculosoperacion', 'total-vehiculos');
});