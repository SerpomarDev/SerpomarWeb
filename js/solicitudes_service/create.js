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
    const jsonData = JSON.stringify(Object.fromEntries(formData));

    console.log(jsonData)
    fetch('https://esenttiapp-production.up.railway.app/api/solicitudservicios',{
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: jsonData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar los datos del formulario');
        }
    })
    .then(data => {

        const sp = data.sp; // Asegúrate de que estos nombres coincidan con los campos de tu respuesta
        const id = data.id;
        const concatenatedText = sp + id;

        Swal.fire({
          title: "¡Buen trabajo!",
          text: "¡Has creado una SP" + concatenatedText,
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
    }, 1500);
  }  
