pendienteLiquidar(id)

function pendienteLiquidar(id){
    fetch(`https://esenttiapp-production.up.railway.app/api/pendienteLiquidar/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al obtener los datos de la API');
      }
      return response.json();
    })
    .then(data => {
      const cantidadFacturadosElement = document.getElementById('cantidadFacturados');

      console.log(cantidadFacturadosElement)
      
      cantidadFacturadosElement.textContent = `${data}`;
    })
    .catch(error => {
      console.error('Error:', error);
    });
  
}
