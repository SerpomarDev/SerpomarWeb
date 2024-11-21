document.getElementById('resetPassword').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const formData = new FormData(this);
  
    const jsonData = JSON.stringify(Object.fromEntries(formData));
    
    fetch('https://esenttiapp-production.up.railway.app/api/restablecercontrasena', {
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
          text: "¡Su contraseña ha sido restrablecida con éxito",
          icon: "success",
        });
    })
    .then((response)=>{
        time();
       })
    .catch(error => {
        Swal.fire({
            title: "Error",
            text: "Error al restablecer la contraseña. Por favor, inténtalo de nuevo.",
            icon: "error",
        });
    });
  });

  function time() {
    document.getElementById('createConcepto').reset();
    setTimeout(() => {
        window.location.href = `/index.html`; 
    },  1200);
  } 