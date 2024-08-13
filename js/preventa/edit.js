
// Obtenemos el id que se ha enviado por la url
let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

let originalValues;
// Cargamos los datos iniciales del formulario
    fetch(`https://esenttiapp-production.up.railway.app/api/cargaredit/${id}`,{
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
        const preventa = data[0];
        document.getElementById("id").value = preventa.id;
          document.getElementById("id_placa").value = preventa.id_placa;
          // document.getElementById("placa").value = preventa.placa;
          document.getElementById("id_conductor").value = preventa.id_conductor;
          // document.getElementById("conductor").value = preventa.conductor;
          document.getElementById("identificacion").value = preventa.identificacion;
          document.getElementById("telefono").value = preventa.telefono;
          document.getElementById("eje").value = preventa.eje;
          document.getElementById("tipologia").value = preventa.tipologia;
          document.getElementById("estado_puerto").value = preventa.puerto;
          document.getElementById("proyecto").value = preventa.proyecto;
          document.getElementById("esenttia").value = preventa.esenttia;
          document.getElementById("cabot").value = preventa.cabot;
          document.getElementById("estado").value = preventa.estado;
          document.getElementById("flota").value = preventa.flota;
        
      } else {
        console.log('La propiedad array no existe en la respuesta');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });


  
document.getElementById("PreventaEdit").addEventListener("submit", function (event) {
        event.preventDefault();
  
        // Convertir formData a un objeto y luego a JSON
        const formData = new FormData(this);
        const jsonData = JSON.stringify(Object.fromEntries(formData));

        fetch(`https://esenttiapp-production.up.railway.app/api/preventas/${id}`, {
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
                    text: "Has actualizado la preventa exitosamente.",
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
      document.getElementById('PreventaEdit').reset();
      setTimeout(() => {
        window.location.href = `/view/preventas/index.html`;  
      },  1500);
    }