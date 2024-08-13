document.addEventListener('DOMContentLoaded',function(){
    let selectOrdenCargue = document.getElementById('id_cargue');

    fetch('https://esenttiapp-production.up.railway.app/api/ordencargue',{
        method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
    })
    .then(Response => Response.json())
    .then(data=>{
        data.forEach(cargue => {
            let option = document.createElement('option')
            option.value = cargue.id
            option.text = cargue.contenedor
            selectOrdenCargue.appendChild(option)       
        });

    });

});