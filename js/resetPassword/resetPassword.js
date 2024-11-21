document.getElementById('resetPassword').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const formData = new FormData(this);
  
    const jsonData = JSON.stringify(Object.fromEntries(formData));
    
    console.log(jsonData)
    fetch('https://esenttiapp-production.up.railway.app/api/restablecercontrasena', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
         },
        body: jsonData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar los datos del formulario');
        }
        return response.json();
    })
    .then(data => {
        Swal.fire({
          title: "¡Buen trabajo!",
          text: "¡Su contraseña ha sido restrablecida con éxito",
          icon: "success",
        });

        setTimeout(() => {
            window.location.href = `/index.html`; 
        },  1200);
    })
    .catch(error => {
        Swal.fire({
            title: "Error",
            text: "Error al restablecer la contraseña. Por favor, inténtalo de nuevo.",
            icon: "error",
        });
    });
  });
