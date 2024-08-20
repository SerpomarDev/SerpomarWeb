document.getElementById('createCostoClientes').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const formData = new FormData(this);
  
    const jsonData = JSON.stringify(Object.fromEntries(formData));

    console.log(jsonData)
    
    fetch('https://esenttiapp-production.up.railway.app/api/costocliente', {
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
    })
    .then((response)=>{
     time();
    })
  });

  function time() {
    document.getElementById('createRuta').reset();
    setTimeout(() => {
        window.location.href = `/view/tarifas_clientes/tarifas_clientes.html`; 
    },  1500);
  }   

  function editRuta(id) {
    window.location.href = `/view/tarifas_clientes/edit.html?id=${id}`
}

function deleteRuta(id){
    DeleteData(id)
}