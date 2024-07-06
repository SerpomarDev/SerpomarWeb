   fetch(`https://esenttiapp-production.up.railway.app/api/pendienteliquidar/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al obtener los datos de la API');
      }
      return response.json();
    })
    .then(data => {
      const cantidadFacturadosElement = document.getElementById('cantidadFacturados');
      cantidadFacturadosElement.textContent = `${data}`;

      localStorage.setItem('cantidadFacturados', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });

