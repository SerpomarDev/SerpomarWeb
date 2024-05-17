let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

fetch(`https://esenttiapp-production.up.railway.app/api/editplaca/${id}`)
    .then((response) => {
      if (!response.ok) {
          throw new Error("Error al obtener los datos de la API");
      }
      return response.json();
    })
    .then((data) => {
      if (data.length > 0) {
        const conductor = data[0];
          document.getElementById("id_placa").value = conductor.id_placa
          document.getElementById("placa").value = conductor.placa
          document.getElementById("eje").value = conductor.eje
          document.getElementById("tipologia").value = conductor.tipologia
          document.getElementById("id_aliado").value = conductor.id_aliado
          document.getElementById("aliado").value = conductor.aliado
          console.log(conductor)

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
        columns: ["Placa", "Eje", "Tipologia", "Propietario",{
            name:'Telefono',
            hidden: true,
        }],
        server: {
            url: "https://esenttiapp-production.up.railway.app/api/showplaca",
            then: (data) => {
                if (Array.isArray(data) && data.length > 0) {
                    return data.map((placa) => [
                        placa.placa,
                        placa.eje,
                        placa.tipologia,
                        placa.nombre,
                        placa.telefono
                    ]);
                } else {
                    console.error("La respuesta del servidor no contiene datos válidos.");
                    return [];
                }
            }
        }
    }).render(document.getElementById('placaEdit'));

    document.getElementById("editPlaca").addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const jsonData = JSON.stringify(Object.fromEntries(formData));

        fetch(`https://esenttiapp-production.up.railway.app/api/placas/${id}`, {
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
                    text: "Has actualizado una Placa.",
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
        document.getElementById('editPlaca').reset();
        setTimeout(() => {
          window.location.href = `/view/placas/edit.html`;  
        },  1500);
      }