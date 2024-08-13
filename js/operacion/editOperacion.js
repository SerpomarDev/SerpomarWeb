let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

    fetch(`https://esenttiapp-production.up.railway.app/api/editrtoperacion/${id}`,{
      method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
    })
    .then((response) => {
      if (!response.ok) {
          throw new Error("Error al obtener los datos de la API");
      }
      return response.json();
    })
    .then((data) => {
      if (data.length > 0) {
        const operacion = data[0];
          document.getElementById("id").value = operacion.id
          document.getElementById("placa").value = operacion.placa
          document.getElementById("conductor").value = operacion.conductor
          document.getElementById("aliado").value = operacion.aliado
          document.getElementById("cliente").value = operacion.cliente

      } else {
        console.log('La propiedad array no existe en la respuesta');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
