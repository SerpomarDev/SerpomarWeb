let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

fetch(`https://esenttiapp-production.up.railway.app/api/uploadclientesid/${id}`)
    .then((response) => {
      if (!response.ok) {
          throw new Error("Error al obtener los datos de la API");
      }
      return response.json();
    })
    .then((data) => {
      if (data.length > 0) {
        const cliente = data[0];
          document.getElementById("id").value = cliente.id;
          document.getElementById("nombre").value = cliente.nombre;
          document.getElementById("identificacion").value = cliente.identificacion;
          document.getElementById("direccion").value = cliente.direccion;
          document.getElementById("ciudad").value = cliente.ciudad

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
        columns: ["#","Nombre", "Nit","Dirección","Ciudad"],
        server: {
            url: "https://esenttiapp-production.up.railway.app/api/showclientes",
            then: (data) => {
                if (Array.isArray(data) && data.length > 0) {
                    return data.map((cliente) => [
                        cliente.id,
                        cliente.nombre,
                        cliente.identificacion,
                        cliente.direccion,
                        cliente.ciudad,
    
                    ]);
                } else {
                    console.error("La respuesta del servidor no contiene datos válidos.");
                    return [];
                }
            }
        }
    }).render(document.getElementById('clienteEdit'));

    document.getElementById("editCliente").addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const jsonData = JSON.stringify(Object.fromEntries(formData));

        fetch(`https://esenttiapp-production.up.railway.app/api/clientes/${id}`, {
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
                    text: "Has actualizado un cliente.",
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
        document.getElementById('editCliente').reset();
        setTimeout(() => {
          window.location.href = `/view/cliente/edit.html`;  
        },  1500);
      }