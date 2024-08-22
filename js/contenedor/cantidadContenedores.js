function cantidadContenedor(id){

  fetch(`https://esenttiapp-production.up.railway.app/api/cantidadcontenedor/${id}`,{
    method: 'GET',
      headers: {
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
    const cantidadContenedorElement = document.getElementById('cantidadContenedor');
    cantidadContenedorElement.textContent = `${data}`;
  
    localStorage.setItem('cantidadContenedor', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

}
