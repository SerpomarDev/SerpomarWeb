fetch(`https://esenttiapp-production.up.railway.app/api/pendienteliquidar/${id}`,{
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
    const totalRegistrosElement = document.getElementById('totalRegistros');
    totalRegistrosElement.textContent = `Pendiente Liquidar : ${data}`;
  })
  .catch(error => {
    console.error('Error:', error);
  });



  fetch(`https://esenttiapp-production.up.railway.app/api/uploadencurso/${id}`,{
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
    const totalRegistrosElement = document.getElementById('Tencurso');
    totalRegistrosElement.textContent = `En Curso : ${data}`;
  })
  .catch(error => {
    console.error('Error:', error);
  });


  fetch(`https://esenttiapp-production.up.railway.app/api/uploadPendiente/${id}`,{
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
    const totalRegistrosElement = document.getElementById('Tpendiente');
    totalRegistrosElement.textContent = `Pendiente : ${data}`;
  })
  .catch(error => {
    console.error('Error:', error);
  });