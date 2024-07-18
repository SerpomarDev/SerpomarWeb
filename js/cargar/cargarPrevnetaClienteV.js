document.addEventListener('DOMContentLoaded', function(){
    let selectPlaca = document.getElementById('id_preventa')
    let inputConductor = document.getElementById('conductor')
    let inputIdentificacion = document.getElementById('identificacion')
    let inputAliado = document.getElementById('aliado')
    let inputTelefono = document.getElementById('celular')

    fetch('https://esenttiapp-production.up.railway.app/api/showclivarios')
    .then(Response => Response.json())
    .then(data=>{
        data.forEach(preventaCl => {
            let option = document.createElement('option') 
            option.value  =   preventaCl.id
            option.text  = preventaCl.placa
            selectPlaca.appendChild(option)
        });
    })

    selectPlaca.addEventListener('change',function(){

        let idPlacaSelecionada = this.value

        fetch(`https://esenttiapp-production.up.railway.app/api/uploadclivariosid/${idPlacaSelecionada}`)
            .then(response=>{
                if(!response.ok){
                    throw new Error('Error en la respuesta de la API: ' + response.statusText);
                }
                return response.json()
            })
            .then(data=> {
                const preventa = data[0]
                if(preventa.nombre && preventa.aliado && preventa.celulara){
                    inputConductor.value = preventa.nombre
                    inputIdentificacion.value = preventa.identificacion
                    inputAliado.value  = preventa.aliado
                    inputTelefono.value  = preventa.celulara
                }else{
                    console.error('Los datos esperados no están presentes en la respuesta de la API');
                }
            })
            .catch(error => console.error('Error:', error));
    })
})