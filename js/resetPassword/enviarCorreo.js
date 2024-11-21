document.getElementById('envioCorreoReestablecer').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const formData = new FormData(this);
  
    const jsonData = JSON.stringify(Object.fromEntries(formData));
    
    console.log(jsonData)
    fetch('https://esenttiapp-production.up.railway.app/api/passwordreset', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
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
          title: "¡Revisa tu bandeja de correo!",
          text: "¡Correo de recuperación enviado con éxito",
          icon: "success",
        });

        setTimeout(() => location.reload(), 2500);
    })
    .catch(error => {
        console.error('Error al hacer envio del correo:', error);

        Swal.fire({
            title: "Error",
            text: "Hubo un problema al hacer envio del correo. Por favor, inténtalo de nuevo.",
            icon: "error",
        });
    });
  });