document.addEventListener('DOMContentLoaded',function(){
    let selectDestinos = document.getElementById('id_sitio_inspeccion1')

    fetch('https://esenttiapp-production.up.railway.app/api/destinos')
    .then(Response=>Response.json())
    .then(data =>{
        data.forEach(destino => {
            let option = document.createElement('option')
            option.value = destino.id
            option.text = destino.nombre
            selectDestinos.appendChild(option)
        });
    })
})