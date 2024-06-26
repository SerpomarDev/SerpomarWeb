 function impexp(){
    let selectie = document.getElementById('imp_exp')
    let fechaDocumental = document.getElementById('fecha_documental')
    let fechaCutoff = document.getElementById('fecha_cutoff_fisico')

    let fechaEta = document.getElementById('fecha_eta')
    let fechaLevante = document.getElementById('fecha_levante')
    let libreHasta = document.getElementById('libre_hasta')
    let bogegaHasta = document.getElementById('bodegaje_hasta')

    if(selectie.value == 'importacion'){

        fechaDocumental.disabled = true
        fechaCutoff.disabled = true

        fechaEta.disabled = false
        fechaLevante.disabled = false
        libreHasta.disabled = false
        bogegaHasta.disabled = false
    }else{

        fechaEta.disabled = true
        fechaLevante.disabled = true
        libreHasta.disabled = true
        bogegaHasta.disabled = true

        fechaDocumental.disabled = false
        fechaCutoff.disabled = false
    }
 }   
 document.getElementById('imp_exp').addEventListener('change', impexp)


document.getElementById('saveSolicitud').addEventListener('submit',function(event){

    event.preventDefault();
    impexp()

    const formData = new FormData(this);

    console.log(formData)
    fetch('https://esenttiapp-production.up.railway.app/api/solicitudservicios',{
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar los datos del formulario');
        }
    })
    .then(data => {
        Swal.fire({
          title: "¡Buen trabajo!",
          text: "¡Has creado una SP",
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
    document.getElementById('saveSolicitud').reset();
    setTimeout(() => {
        window.location.href = `/view/solicitudes_servicios/create.html`; 
    },);
  }  
