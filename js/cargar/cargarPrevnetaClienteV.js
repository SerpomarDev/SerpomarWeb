document.addEventListener('DOMContentLoaded', function(){
    let selectPlaca = document.getElementById('id_preventa')
    let inputConductor = document.getElementById('conductor')
    let inputIdentificacion = document.getElementById('identificacion')
    let inputAliado = document.getElementById('aliado')
    let inputTelefono = document.getElementById('celular')


    new TomSelect(selectPlaca, {
        valueField: 'id',
        labelField: 'placa',
        searchField: 'placa',
        maxItems:1,
        load: function(query, callback) {
            fetch(`https://esenttiapp-production.up.railway.app/api/showclivarios?search=${encodeURIComponent(query)}`,{
              method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
                }
            })
            .then(response => response.json())
            .then(data => {
                  callback(data);
              })
              .catch(() => {
                    callback();
              });
        },
        render: {
            option: function(item, escape) {
                return `<div class="">
                            ${escape(item.placa)}
                        </div>`;
            },
            item: function(item, escape) {
                return `<div class="">
                            ${escape(item.placa)}
                        </div>`;
            }
        }
    });

    selectPlaca.addEventListener('change',function(){

        let idPlacaSelecionada = this.value

            fetch(`https://esenttiapp-production.up.railway.app/api/uploadclivariosid/${idPlacaSelecionada}`,{
                method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
                    }
            })
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
                    inputAliado.value = preventa.aliado
                    inputTelefono.value = preventa.telefono

                }else{
                    console.error('Los datos esperados no están presentes en la respuesta de la API');
                }
            })
            .catch(error => console.error('Error:', error));
    })
})