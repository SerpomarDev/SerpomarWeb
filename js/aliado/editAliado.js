let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

fetch(`https://esenttiapp-production.up.railway.app/api/uploadaliadoid/${id}`)
    .then((response) => {
      if (!response.ok) {
          throw new Error("Error al obtener los datos de la API");
      }
      return response.json();
    })
    .then((data) => {
      if (data.length > 0) {
        const aliado = data[0];
          document.getElementById("id").value = aliado.id;
          document.getElementById("nombre").value = aliado.nombre;
          document.getElementById("razon_social").value = aliado.razon_social;
          document.getElementById("celular").value = aliado.celular

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
        columns: ["#","Nombre", "Razon social", "Telefono"],
        server: {
            url: "https://esenttiapp-production.up.railway.app/api/showaliado",
            then: (data) => {
                if (Array.isArray(data) && data.length > 0) {
                    return data.map((aliado) => [
                        aliado.id,
                        aliado.nombre,
                        aliado.rozan_social,
                        aliado.celular,
                    ]);
                } else {
                    console.error("La respuesta del servidor no contiene datos válidos.");
                    return [];
                }
            }
        }
    }).render(document.getElementById('aliadoEdit'));

    document.getElementById("editAliado").addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const jsonData = JSON.stringify(Object.fromEntries(formData));

        fetch(`https://esenttiapp-production.up.railway.app/api/aliados/${id}`, {
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
                    text: "Has actualizado un aliado.",
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
        document.getElementById('editAliado').reset();
        setTimeout(() => {
          window.location.href = `/view/aliados/edit.html`;  
        },  1500);
      }