let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

fetch(`https://esenttiapp-production.up.railway.app/api/uploadvalortotal/${id}`,{
  method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
})
.then((responde) => {
  if (!responde) {
    throw new Error("Error al obtener los datos de la API");
  }
  return responde.json();
})
.then((data) => {
  if (data.length > 0) {
    const liquidar = data[0];
    document.getElementById('id_solicitud_servicio').value = liquidar.id_sc;
    document.getElementById('valor_total').value = liquidar.valor_total;

  } else {
    console.log("La propiedad array no existe en la respuesta");
  }
})
.catch((error) => {
  console.error("Error:", error);
});