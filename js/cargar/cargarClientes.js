// document.addEventListener('DOMContentLoaded',function(){
//     let selectCliente = document.getElementById('id_cliente');

//     fetch('https://esenttiapp-production.up.railway.app/api/uploadclientes',{
//         method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem("authToken")}`
//             }
//     })
//     .then(Response => Response.json())
//     .then(data=>{
//         data.forEach(aliado => {
//             let option = document.createElement('option')
//             option.value = aliado.id
//             option.text = aliado.nombre
//             selectCliente.appendChild(option)       
//         });

//     });

   /*  selectCliente.addEventListener('change', function(){
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
                inputTelefono.value = aliado.telefono
            }else{
                console.error('Los datos esperados no están presentes en la respuesta de la API');
            }
        })
        .catch(error => console.error('Error:', error))
    }); */

// });


document.addEventListener('DOMContentLoaded', function(){

    //let selectCliente = document.getElementById('id_cliente');
 
     new TomSelect('#id_cliente', {
         valueField: 'id',
         labelField: 'nombre',
         searchField: 'nombre',
         maxItems:1,
         load: function(query, callback) {
             fetch(`https://esenttiapp-production.up.railway.app/api/uploadclientes?search=${encodeURIComponent(query)}`,{
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
                             ${escape(item.nombre)}
                         </div>`;
             },
             item: function(item, escape) {
                 return `<div class="">
                             ${escape(item.nombre)}
                         </div>`;
             }
         }
     });

    })