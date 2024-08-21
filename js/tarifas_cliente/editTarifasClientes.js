let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

    fetch(`https://esenttiapp-production.up.railway.app/api/Uploadcostoclientesbyid/${id}`,{
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
        const costoCliente = data[0];
          document.getElementById("id").value = costoCliente.id;
          document.getElementById("id_cliente").value = costoCliente.id_cliente;
          document.getElementById("cliente").value = costoCliente.cliente;
          document.getElementById("id_concepto").value = costoCliente.id_concepto;
          document.getElementById("concepto").value = costoCliente.concepto;
          document.getElementById("id_costo").value = costoCliente.id_valor
          document.getElementById("costo").value = costoCliente.valor

      } else {
        console.log('La propiedad array no existe en la respuesta');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    document.getElementById("editCostoClientes").addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const jsonData = JSON.stringify(Object.fromEntries(formData));

            fetch(`https://esenttiapp-production.up.railway.app/api/costocliente/${id}`, {
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
                    text: "Registro actualizado.",
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
        document.getElementById('editCostoClientes').reset();
        setTimeout(() => {
          window.location.href = `/view/tarifas_clientes/edit.html`;  
        },  1500);
      }