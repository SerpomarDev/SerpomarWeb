  document.getElementById('createOrdenCompra').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    const jsonData = JSON.stringify(Object.fromEntries(formData));

    fetch('https://esenttiapp-production.up.railway.app/api/ordencompra', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            },
            body: jsonData
        })
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok) {
            if (response.status === 500) {
              Swal.fire({
                title: "Ocurrió un error",
                text:
                  data.message || "Ocurrió un error inesperado.",
                icon: "error",
              });
            } else {
              Swal.fire({
                title: "Error",
                text: "Error al enviar los datos del formulario.",
                icon: "error",
              });
            }
            throw new Error(
              data.message || "Error al enviar los datos del formulario."
            );
          }
  
          Swal.fire({
            title: "¡Buen trabajo!",
            text: data.message || "¡Has creado un Cliente!",
            icon: "success",
          });
  
          setTimeout(() => {
            location.reload();
          }, 1500);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });


   