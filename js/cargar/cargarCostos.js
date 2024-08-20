document.addEventListener('DOMContentLoaded', function(){

     new TomSelect('#id_costo', {
         valueField: 'id',
         labelField: 'valor',
         searchField: 'valor',
         maxItems:1,
         load: function(query, callback) {
             fetch(`https://esenttiapp-production.up.railway.app/api/showcostos?search=${encodeURIComponent(query)}`,{
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
                             ${escape(item.valor)}
                         </div>`;
             },
             item: function(item, escape) {
                 return `<div class="">
                             ${escape(item.valor)}
                         </div>`;
             }
         }
     });

    })