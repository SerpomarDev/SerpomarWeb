let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

fetch(`https://esenttiapp-production.up.railway.app/api/editconductor/${id}`)
    .then((response) => {
      if (!response.ok) {
          throw new Error("Error al obtener los datos de la API");
      }
      return response.json();
    })
    .then((data) => {
      if (data.length > 0) {
        const conductor = data[0];
          document.getElementById("id").value = conductor.id
          document.getElementById("nombre").value = conductor.nombre
          document.getElementById("identificacion").value = conductor.identificacion
          document.getElementById("telefono").value = conductor.telefono
          document.getElementById("email").value = conductor.email

      } else {
        console.log('La propiedad array no existe en la respuesta');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });

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
        columns: ["#","Nombre", "Identificacicón", "Telefono", "Email"],
        server: {
            url: "https://esenttiapp-production.up.railway.app/api/uploadconductor",
            then: (data) => {
                if (Array.isArray(data) && data.length > 0) {
                    return data.map((conductor) => [
                        conductor.id,
                        conductor.nombre,
                        conductor.identificacion,
                        conductor.telefono,
                        conductor.email
                    ]);
                } else {
                    console.error("La respuesta del servidor no contiene datos válidos.");
                    return [];
                }
            }
        }
    }).render(document.getElementById('conductoresedit'));

    document.getElementById("editConductor").addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const jsonData = JSON.stringify(Object.fromEntries(formData));

        fetch(`https://esenttiapp-production.up.railway.app/api/conductores/${id}`, {
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
                    text: "Has actualizado un conductor.",
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
        document.getElementById('editConductor').reset();
        setTimeout(() => {
          window.location.href = `/view/conductores/edit.html`;  
        },  1500);
      }