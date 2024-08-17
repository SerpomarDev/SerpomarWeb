let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

fetch(`http://esenttiapp.test/api/uploadconceptosid/${id}`)
    .then((response) => {
      if (!response.ok) {
          throw new Error("Error al obtener los datos de la API");
      }
      return response.json();
    })
    .then((data) => {
      if (data.length > 0) {
        const concepto = data[0];
          document.getElementById("id").value = concepto.id;
          document.getElementById("concepto").value = concepto.concepto;
          document.getElementById("descripcion").value = concepto.descripcion;

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
            limit:7,
            enabled: true,
        },
        resizable: true,
        sort: false,
        columns: ["#","Concepto", "Descripción",],
        server: {
            url: "http://esenttiapp.test/api/uploadconceptos",
            then: (data) => {
                if (Array.isArray(data) && data.length > 0) {
                    return data.map((concepto) => [
                        concepto.id,
                        concepto.concepto,
                        concepto.descripcion,

                    ]);
                } else {
                    console.error("La respuesta del servidor no contiene datos válidos.");
                    return [];
                }
            }
        }
    }).render(document.getElementById('conceptosedit'));

    document.getElementById("editConcepto").addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const jsonData = JSON.stringify(Object.fromEntries(formData));

        fetch(`http://esenttiapp.test/api/concepto/${id}`, {
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
                    text: "Has actualizado un concepto.",
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
        document.getElementById('editConcepto').reset();
        setTimeout(() => {
          window.location.href = `/view/conceptos/edit.html`;  
        },  1500);
      }