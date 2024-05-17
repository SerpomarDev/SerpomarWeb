fetch('https://esenttiapp-production.up.railway.app/api/count')
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al obtener los datos de la API');
    }
    return response.json();
  })
  .then(data => {
    const totalRegistrosElement = document.getElementById('totalRegistros');
    totalRegistrosElement.textContent = `Total registros: ${data}`;
  })
  .catch(error => {
    console.error('Error:', error);
  });
