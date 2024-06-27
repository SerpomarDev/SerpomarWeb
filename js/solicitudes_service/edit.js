let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

fetch(`https://esenttiapp-production.up.railway.app/api/editsolicitud/${id}`)
    .then((response) => {
      if (!response.ok) {
          throw new Error("Error al obtener los datos de la API");
      }
      return response.json();
    })
    .then((data) => {
      if (data.length > 0) {
        const solic = data[0];
          document.getElementById("id_solicitud_servicio").value = solic.pk
          document.getElementById("cantidad_contenedor").value = solic.cantidad_contenedores
          document.getElementById("tipo_operacion").value = solic.tipo_operacion
          document.getElementById("fecha_eta").value = solic.fecha_eta
          document.getElementById("fecha_levante").value = solic.fecha_levante
          document.getElementById("fecha_documental").value = solic.fecha_documental
          document.getElementById("fecha_cutoff_fisico").value = solic.fecha_cutoff_fisico
          document.getElementById("bodegaje_hasta").value = solic.libre_hasta
          document.getElementById("libre_hasta").value = solic.bodegaje_hasta
          document.getElementById("fecha_propuesta").value = solic.fecha_propuesta

      } else {
        console.log('La propiedad array no existe en la respuesta');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });

document.getElementById("editSolicitud").addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const jsonData = JSON.stringify(Object.fromEntries(formData));

    fetch(`https://esenttiapp-production.up.railway.app/api/solicitudservicios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
                text: "Solicitud Actualizada.",
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
    document.getElementById('editSolicitud').reset();
    setTimeout(() => {
      window.location.href = `/view/solicitudes_servicios/buscarEdit.html`; 
    },  1500);
  }