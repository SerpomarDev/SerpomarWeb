document.addEventListener('DOMContentLoaded', function(){
        
    let selectPlaca = document.getElementById('id_placa');
    let inputeje = document.getElementById('eje');
    let inputtipologia = document.getElementById('tipologia');
    let inputid_aliado = document.getElementById('id_aliado');
    let inputtelefono = document.getElementById('telefonoa');
  
    fetch('https://esenttiapp-production.up.railway.app/api/loadplaca')
    .then(response => response.json())
    .then(data => {
        data.forEach(placa => {
            let option = document.createElement('option');
            option.value = placa.id;
            option.text = placa.placa;
            selectPlaca.appendChild(option);
        });
    })
    .catch(error => console.error('Error:', error));


    selectPlaca.addEventListener('change', function(){

        let selectPlaca = this.value;
    
        fetch(`https://esenttiapp-production.up.railway.app/api/uploadplacabyid/${selectPlaca}`)
        .then(response =>{
            if(!response.ok){
                throw new Error('Error en la respuesta de la API: ' + response.statusText)
            }
            return response.json()
        })
        .then(data =>{
            const placa = data[0]
            if(placa.eje && placa.tipologia && placa.nombre && placa.celular){
                inputeje.value = placa.eje;
                inputtipologia.value = placa.tipologia;
                inputid_aliado.value = placa.nombre;
                inputtelefono.value = placa.celular;

            }else{
                console.error('Los datos esperados no están presentes en la respuesta de la API');
            }
        })  
    })
});
