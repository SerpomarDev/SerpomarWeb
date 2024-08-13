let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

    fetch(`https://esenttiapp-production.up.railway.app/api/uploadrutaid/${id}`,{
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
        const ruta = data[0];
          document.getElementById("id").value = ruta.id;
          document.getElementById("item").value = ruta.item;
          document.getElementById("tarifas").value = ruta.tarifas;
          document.getElementById("notas").value = ruta.notas

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
        columns: ["#","Nombre", "Tarifas", "Comentario"],
        server: {
            url: "https://esenttiapp-production.up.railway.app/api/uploadrutas",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`
            },
            then: (data) => {
                if (Array.isArray(data) && data.length > 0) {
                    return data.map((ruta) => [
                        ruta.id,
                        ruta.item,
                        ruta.tarifas,
                        ruta.notas,
                    ]);
                } else {
                    console.error("La respuesta del servidor no contiene datos válidos.");
                    return [];
                }
            }
        }
    }).render(document.getElementById('editRutas'));

    localStorage.setItem("authToken", data.token);

    document.getElementById("editRuta").addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const jsonData = JSON.stringify(Object.fromEntries(formData));

            fetch(`https://esenttiapp-production.up.railway.app/api/rutas/${id}`, {
                method: "PUT",
                headers:{ 
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
                    text: "Has actualizado un conductor.",
                    icon: "success",
                });
            })
            .then(response=>{
                time()
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });

    function time() {
        document.getElementById('editRuta').reset();
        setTimeout(() => {
          window.location.href = `/view/rutas/create.html`;  
        },  1500);
      }