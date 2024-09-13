document.getElementById('savePreProgramar').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const formData = new FormData(this);
  
    const jsonData = JSON.stringify(Object.fromEntries(formData));
    
    fetch('http://esenttiapp.test/api/programacion', {
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
          text: "¡Has creado una ruta",
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
