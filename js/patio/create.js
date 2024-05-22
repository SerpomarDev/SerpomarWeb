document.getElementById('createOrdenCargue').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const formData = new FormData(this);
  
    const jsonData = JSON.stringify(Object.fromEntries(formData));

    console.log(jsonData)
    
    fetch('https://esenttiapp-production.up.railway.app/api/ordencargue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          text: "¡Has creado un Cliente",
          icon: "success",
        });
    })
    .then((response)=>{
     time();
    })
  });

function time() {
    document.getElementById('createOrdenCargue').reset();
    setTimeout(() => {
        window.location.href = ``; 
    },1200);
}