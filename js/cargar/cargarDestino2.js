document.addEventListener('DOMContentLoaded',function(){
    let selectDestinos = document.getElementById('id_sitio_inspeccion2')

    fetch('https://esenttiapp-production.up.railway.app/api/destinospt',{
        method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
    })
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