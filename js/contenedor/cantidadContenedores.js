fetch(`https://esenttiapp-production.up.railway.app/api/cantidadcontenedor/${id}`)
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