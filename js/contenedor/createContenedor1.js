document.getElementById('saveContenedor').addEventListener('submit',function(event){
    event.preventDefault();
  
    const formData = new FormData(this);
    const jsonData = JSON.stringify(Object.fromEntries(formData));
  
    fetch('https://esenttiapp-production.up.railway.app/api/contenedores',{
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
        text: "¡Has creado un contenedor",
        icon: "success",
      });
    })
    .then((response)=>{
      time();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  });
  
  function time() {
    document.getElementById('saveContenedor').reset();
    setTimeout(() => {
      window.location.href = ``;
    },  1200);
  }