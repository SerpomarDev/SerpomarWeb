document.addEventListener('DOMContentLoaded',function(){
    let selectTipoServicio = document.getElementById('id_tipo_operacion');

    fetch('https://esenttiapp-production.up.railway.app/api/tiposervicios')
    .then(Response => Response.json())
    .then(data=>{
        data.forEach(tipoServ => {
            let option = document.createElement('option')
            option.value = tipoServ.id
            option.text = tipoServ.tipo
            selectTipoServicio.appendChild(option)       
        });

    });

});