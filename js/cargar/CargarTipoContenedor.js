document.addEventListener('DOMContentLoaded',function(){
    let selectTipoContenedor = document.getElementById('id_tipo_contenedor');

    fetch('https://esenttiapp-production.up.railway.app/api/tipocontenedores',{
        method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
    })
    .then(Response => Response.json())
    .then(data=>{
        data.forEach(TipoCont => {
            let option = document.createElement('option')
            option.value = TipoCont.id
            option.text = TipoCont.tipo
            selectTipoContenedor.appendChild(option)       
        });

    });

});