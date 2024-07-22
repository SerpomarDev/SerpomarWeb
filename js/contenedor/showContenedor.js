let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

fetch(`https://esenttiapp-production.up.railway.app/api/showcontenedor/${id}`)
.then((response)=>{
    if(!response.ok){
      throw new Error("Error al obtener los datos de la API");
    }
    return response.json()
  })
.then((data)=>{
    if(data.length > 0) {
      const contenedor = data[0];
        document.getElementById('id_contenedor').value = contenedor.id_contenedor;
        document.getElementById('id_tipo_contenedor').value = contenedor.tipo;
        document.getElementById('nu_serie').value = contenedor.numero;
    }
    else {
      console.log('La propiedad array no existe en la respuesta');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
