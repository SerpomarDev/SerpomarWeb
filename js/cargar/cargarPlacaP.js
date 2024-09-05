document.addEventListener('DOMContentLoaded', function(){
        
    let selectPlaca = document.getElementById('id_placa');
    
    new TomSelect(selectPlaca, {
        valueField: 'id',
        labelField: 'placa',
        searchField: 'placa',
        maxItems:1,
        load: function(query, callback) {
            fetch(`https://esenttiapp-production.up.railway.app/api/loadplaca?search=${encodeURIComponent(query)}`,{
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

});
