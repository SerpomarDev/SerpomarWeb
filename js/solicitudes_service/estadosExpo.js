fetch(`https://esenttiapp-production.up.railway.app/api/uploadretirovacio/${id}`,{
    method: 'GET',
      headers:{
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
              }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al obtener los datos de la API');
    }
    return response.json();
  })
  .then(data => {
    const totalRegistrosElement = document.getElementById('Retirovacio');
    totalRegistrosElement.textContent = `Retiro Vacio : ${data}`;
  })
  .catch(error => {
    console.error('Error:', error);
  });

  fetch(`https://esenttiapp-production.up.railway.app/api/uploadingresopuerto/${id}`,{
    method: 'GET',
      headers:{
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
              }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al obtener los datos de la API');
    }
    return response.json();
  })
  .then(data => {
    const totalRegistrosElement = document.getElementById('ingresoPuerto');
    totalRegistrosElement.textContent = `Ingreso Puerto : ${data}`;
  })
  .catch(error => {
    console.error('Error:', error);
  });