let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

    fetch(`https://esenttiapp-production.up.railway.app/api/editcontenedor/${id}`,{
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
        const contenedor = data[0];
          document.getElementById("id_contenedor").value = contenedor.id_contenedor
          document.getElementById("id_solicitud_servicio").value = contenedor.id_soliServi
          document.getElementById("tipo_contenedor").value = contenedor.tipo_contenedor
          document.getElementById("nu_serie").value = contenedor.numero_contenedor
          document.getElementById("estado_operacion").value = contenedor.estado

      } else {
        console.log('La propiedad array no existe en la respuesta');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });


    document.getElementById("editContenedor").addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const jsonData = JSON.stringify(Object.fromEntries(formData));

        console.log(jsonData)

        fetch(`https://esenttiapp-production.up.railway.app/api/contenedores/${id}`, {
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
                    text: "El contenedor ha sido actualizado.",
                    icon: "success",
                });
            })
            .then(response=>{
              setTimeout(() => {
                location.reload();
              }, 1500);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });