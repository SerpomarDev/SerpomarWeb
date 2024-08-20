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