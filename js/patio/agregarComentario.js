let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");


document.getElementById("craeateComentario").addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(this);
  const jsonData = JSON.stringify(Object.fromEntries(formData));
   
    
    fetch(`http://esenttiapp.test/api/actualizarcomentario/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
      },
      body:jsonData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Comentario guardado con éxito:', data);
        Swal.fire({
          title: "¡Buen trabajo!",
          text: "Comentario guardado!",
          icon: "success"
        });

    })
    .catch((error) => {
        console.error('Error al guardar el comentario:', error);
    });
  
})