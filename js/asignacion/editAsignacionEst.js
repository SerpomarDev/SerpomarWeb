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
    document.getElementById("placa").value = preventa.placa;
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
    
      new gridjs.Grid({
        search: true,
        language:{
          search:{
              placeholder: '🔍 Buscar...'
          }
        },
        pagination: {
            limit:5,
            enabled: true,
            //summary: true
        },
        sort: false,
        columns: [{
          name:"id-asign",
          hidden: true,
        },{
          name:'id-preventa',
          hidden: true,
        },"Placa","Conductor","Aliado","Telefono","Ruta","Tarifa","Cliente","Fecha"],
        fixedHeader: true,
        //height: '400px',
        server: {
            url: "https://esenttiapp-production.up.railway.app/api/showasignacionest",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`
          },
            then: (data) => {
                if (Array.isArray(data) && data.length > 0) {
                    return data.map((asignacion) => [
                      asignacion.id_asignacion,
                      asignacion.id_preventa,
                      asignacion.placa,
                      asignacion.conductor,
                      asignacion.aliado,
                      asignacion.telefono,
                      asignacion.ruta,
                      asignacion.tarifa,
                      asignacion.cliente,
                      asignacion.fecha
                    ]);
                } else {
                    console.error("La respuesta del servidor no contiene datos válidos.");
                    return [];
                }
            }
        },
        style: {
          table: {with:"80%"}
        }
    }).render(document.getElementById('esenttiaasigEd'));

    localStorage.setItem("authToken", data.token);
}


document.getElementById("editAsignacionEsnt").addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const jsonData = JSON.stringify(Object.fromEntries(formData));

    fetch(`https://esenttiapp-production.up.railway.app/api/asignaciones/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
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
    document.getElementById('editAsignacionEsnt').reset();
    setTimeout(() => {
      window.location.href = ``;  
    },  1500);
  }