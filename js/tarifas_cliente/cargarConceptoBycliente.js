// document.addEventListener('DOMContentLoaded',function(){
//     let selectCliente = document.getElementById('id_concepto');

//     fetch('https://esenttiapp-production.up.railway.app/api/uploadconceptos',{
//         method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem("authToken")}`
//             }
//     })
//     .then(Response => Response.json())
//     .then(data=>{
//         data.forEach(concepto => {
//             let option = document.createElement('option')
//             option.value = concepto.id
//             option.text = concepto.concepto
//             selectCliente.appendChild(option)       
//         });

//     });

// })


document.addEventListener('DOMContentLoaded', function(){

    let selectCliente = document.getElementById('id_concepto');
 
     new TomSelect('#id_concepto', {
         valueField: 'id',
         labelField: 'concepto',
         searchField: 'concepto',
         maxItems:1,
         load: function(query, callback) {
             fetch(`https://esenttiapp-production.up.railway.app/api/uploadconceptos?search=${encodeURIComponent(query)}`,{
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
                             ${escape(item.concepto)}
                         </div>`;
             },
             item: function(item, escape) {
                 return `<div class="">
                             ${escape(item.concepto)}
                         </div>`;
             }
         }
     });

    })