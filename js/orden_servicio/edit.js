let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

fetch(`https://esenttiapp-production.up.railway.app/api/uploadordensevid/${id}`,{
    method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        }
})
.then((response)=>{
    if(!response){
        throw new Error("Error al obtener los datos de la API");
    }
    return response.json();
})
.then((data)=>{
    if (data.length > 0){
        const ordenSev = data[0]
        document.getElementById('id_contenedor').value  = ordenSev.id_contenedor
        document.getElementById('nu_serie').value  = ordenSev.numero_co
        document.getElementById('fecha_cargue').value  = ordenSev.fecha_cargue
        document.getElementById('hora_cargue').value  = ordenSev.hora_cargue
        document.getElementById('fecha_descargue').value  = ordenSev.fecha_descargue
        document.getElementById('hora_descargue').value  = ordenSev.hora_descargue
        document.getElementById('fecha_devolucion').value  = ordenSev.fecha_devolucion
        document.getElementById('fecha_inspeccion').value  = ordenSev.fecha_devolucion
        document.getElementById('id_naviera').value  = ordenSev.fecha_devolucion
        document.getElementById('patio').value  = ordenSev.patio
        console.log(ordenSev)

        let idContenedor = ordenSev.id_contenedor
        table(idContenedor)
    }else{
        console.log("La propiedad array no existe en la respuesta");
    }
})
.catch((error) => {
    console.error("Error:", error);
});

function table(idContenedor){

    new gridjs.Grid({
        search: true,
        language:{
            search:{
                placeholder: '🔍 Buscar...'
            }
        },
        pagination: {
            limit:10,
            enabled: true,
        },
        resizable: true,
        sort: false,
        columns: [{
            name:'id_ords',
            hidden:false,
        },"Numero serie","Fecha cargue", "Hora cargue", "Fecha descargue", "Hora descargue","Fecha devolucion", "Fecha inspeccion","Patio"],
        server: {
            url: `https://esenttiapp-production.up.railway.app/api/showordenerv/${idContenedor}`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`
            },
            then: (data) => {
                if (Array.isArray(data) && data.length > 0) {
                    return data.map((ordenSev) => [
                        ordenSev.id,
                        ordenSev.numero_co,
                        ordenSev.fecha_cargue,
                        ordenSev.hora_cargue,
                        ordenSev.fecha_descargue,
                        ordenSev.hora_descargue,
                        ordenSev.fecha_devolucion,
                        ordenSev.fecha_inspeccion,
                        ordenSev.patio
                    ]);
                } else {
                    console.error("La respuesta del servidor no contiene datos válidos.");
                    return [];
                }
            }
        }
    }).render(document.getElementById('ordenSevEdt'));

    localStorage.setItem("authToken", data.token);
}

  document.getElementById('editOrdenServicio').addEventListener("submit",function(event){
    event.preventDefault()

    const formData = new FormData(this);
    const jsonData = JSON.stringify(Object.fromEntries(formData));

    console.log(jsonData)

    fetch(`https://esenttiapp-production.up.railway.app/api/ordenservicios/${id}`, {
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
          text: "Orden de Servicio actualizada.",
          icon: "success",
          });
    })
    .then(response=>{
      //time();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  })

  function time() {
    document.getElementById('editOrdenServicio').reset();
    setTimeout(() => {
      window.location.href = ``;  
    },  1500);
  }