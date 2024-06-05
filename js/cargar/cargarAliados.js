document.addEventListener('DOMContentLoaded',function(){
    let selectAliado = document.getElementById('id_aliado');
    let inputTelefono= document.getElementById('telefonoa');

    fetch('https://esenttiapp-production.up.railway.app/api/uploadalidos')
    .then(Response => Response.json())
    .then(data=>{
        data.forEach(aliado => {
            let option = document.createElement('option')
            option.value = aliado.id
            option.text = aliado.nombre
            selectAliado.appendChild(option)       
        });

    });

    selectAliado.addEventListener('change', function(){
        let  idAliadoSelecionado = this.value
        fetch(`https://esenttiapp-production.up.railway.app/api/uploadalidosid/${idAliadoSelecionado}`)
        .then(response=>{
            if(!response.ok){
                throw new Error('Error en la respuesta de la API: ' + response.statusText);
            }
            return response.json()
        })
        .then(data=>{
            const aliado = data[0]
            if(aliado.telefono){
                inputTelefono.value = aliado.telefono;
            }else{
                console.error('Los datos esperados no están presentes en la respuesta de la API');
            }
        })
        .catch(error => console.error('Error:', error))
    });

});