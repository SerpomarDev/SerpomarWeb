let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

cargarValores(id)

function cargarValores(id){

fetch(`https://esenttiapp-production.up.railway.app/api/editasignacion/${id}`,{
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
    const preventa = data[0];
    document.getElementById("id_asignacion").value = preventa.id_asignacion;
    document.getElementById("id_preventa").value = preventa.id_preventa;
    document.getElementById("id_placa").value = preventa.placa;
    document.getElementById("conductor").value = preventa.conductor;
    document.getElementById("aliado").value = preventa.aliado;
    document.getElementById("celular").value = preventa.telefono;
    console.log(preventa)
  } else {
    console.log("La propiedad array no existe en la respuesta");
  }
})
.catch((error) => {
  console.error("Error:", error);
});
}


document.getElementById("editAsignacion").addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const jsonData = JSON.stringify(Object.fromEntries(formData));

    console.log(jsonData)
    fetch(`https://esenttiapp-production.up.railway.app/api/asignaciones/${id}`, {
        method: "PUT",
        headers: {
           "Content-Type": "application/json" ,
           'Authorization': `Bearer ${localStorage.getItem("authToken")}`
          },
        body: jsonData,
    })
    .then((response) => {
        if (!response.ok) {
          throw new Error("Error al enviar los datos del formulario");
          }
          return response.json();
    })
    .then((data) => {
        console.log("Respuesta del servidor:", data);
          Swal.fire({
          title: "¡Buen trabajo!",
          text: "Asignación actualizada.",
          icon: "success",
          });
    })
    .then(response=>{
      time();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

function time() {
    document.getElementById('editAsignacion').reset();
    setTimeout(() => {
      window.location.href = `/view/asignacion/asignacion.html`;  
    },  1500);
  }
  