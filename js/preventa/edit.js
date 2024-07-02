
// Obtenemos el id que se ha enviado por la url
let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

let originalValues;
// Cargamos los datos iniciales del formulario
fetch(`https://esenttiapp-production.up.railway.app/api/cargaredit/${id}`)
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
          document.getElementById("placa").value = preventa.placa;
          document.getElementById("id_conductor").value = preventa.id_conductor;
          document.getElementById("conductor").value = preventa.conductor;
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

          // Guarda los valores originales para su posterior comparación
        originalValues = {
          id_placa: preventa.id_placa,
          placa: preventa.placa,
          id_conductor: preventa.id_conductor,
          conductor: preventa.conductor,
          identificacion: preventa.identificacion,
          telefono: preventa.telefono,
          eje: preventa.eje,
          tipologia: preventa.tipologia,
          id_aliado: preventa.id_aliado,
          aliado: preventa.aliado,
          celular: preventa.celular,
          proyecto: preventa.proyecto,
          esenttia: preventa.esenttia,
          cabot: preventa.cabot,
          estado: preventa.estado,
          flota: preventa.flota,
        }
        
      } else {
        console.log('La propiedad array no existe en la respuesta');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });


  
document.getElementById("PreventaEdit").addEventListener("submit", function (event) {
        event.preventDefault();
        // Compara los valores actuales con los originales
        let currentValues = {
            id_placa: document.getElementById("id_placa").value,
            // placa: document.getElementById("placa").value,
            id_conductor: document.getElementById("id_conductor").value,
            // conductor: document.getElementById("conductor").value,
            identificacion: document.getElementById("identificacion").value,
            telefono: document.getElementById("telefono").value,
            eje: document.getElementById("eje").value,
            tipologia: document.getElementById("tipologia").value,
            //id_aliado: document.getElementById("id_aliado").value,
            //aliado: document.getElementById("aliado").value,
            //celular: document.getElementById("celular").value,
            proyecto: document.getElementById("proyecto").value,
            esenttia: document.getElementById("esenttia").value,
            cabot: document.getElementById("cabot").value,
            estado: document.getElementById("estado").value,
            flota: document.getElementById("flota").value,   
        };

        // Verifica si hay cambios
        let hasChanged = Object.keys(currentValues).some(
            (key) => currentValues[key] !== originalValues[key]
        );

     /*    let hasChanged = JSON.stringify(originalValues) === JSON.stringify(currentValues)
        console.log(hasChanged) */

        if (!hasChanged) {
            Swal.fire({
                icon: "info",
                title: "No hay cambios",
                text: "No se han realizado cambios en el formulario.",
            });
            return; // Detiene la ejecución de la función
        }

        // Convertir formData a un objeto y luego a JSON
        const formData = new FormData(this);
        const jsonData = JSON.stringify(Object.fromEntries(formData));

        fetch(`https://esenttiapp-production.up.railway.app/api/preventas/${id}`, {
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