document.getElementById('saveContenedor').addEventListener('submit',function(event){
    event.preventDefault();
  
    const formData = new FormData(this);
    const jsonData = JSON.stringify(Object.fromEntries(formData));
  
    fetch('https://esenttiapp-production.up.railway.app/api/contenedores',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jsonData
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        if (status === 400 && body.message === 'No se pueden crear más contenedores para esta solicitud de servicio') {
            Swal.fire({
                title: "Advertencia",
                text: body.message,
                icon: "warning"
            });
        } else if (status >= 200 && status < 300) {
            Swal.fire({
                title: "¡Buen trabajo!",
                text: "Contenedor Creado!",
                icon: "success"
            });
             time();
        } else {
          Swal.fire({
            title: "Advertencia",
            text: body.message || "Ha ocurrido un error",
            icon: "warning"
        });
        }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  });
  
  function time() {
    document.getElementById('saveContenedor').reset();
    setTimeout(() => {
      location.reload();
    },  1200);
  }