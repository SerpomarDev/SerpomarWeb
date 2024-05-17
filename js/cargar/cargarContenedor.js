document.addEventListener('DOMContentLoaded',function(){
    let selectContenedor = document.getElementById('id_contenedor');

    fetch('')
    .then(Response => Response.json())
    .then(data=>{
        data.forEach(contenedor => {
            let option = document.createElement('option')
            option.value = contenedor.id
            option.text = contenedor.numero_serie
            selectContenedor.appendChild(option)
        });

    });

});
