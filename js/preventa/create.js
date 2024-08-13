document.getElementById('PreventaCreate').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const formData = new FormData(this);
  
    const jsonData = JSON.stringify(Object.fromEntries(formData));
    
    fetch('https://esenttiapp-production.up.railway.app/api/preventas', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("authToken")}`
         },
        body: jsonData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar los datos del formulario');
        }
    })
    .then(data => {
        Swal.fire({
          title: "¡Buen trabajo!",
          text: "Has Creado la preventa exitosamente.",
          icon: "success",
          showConfirmButton:false
        });
    })
    .then((response)=>{
     time();
    })
  });

  function time() {
    document.getElementById('PreventaCreate').reset();
    setTimeout(() => {
      window.location.href = `/view/preventas/index.html`; 
    },  1200);
  }   
