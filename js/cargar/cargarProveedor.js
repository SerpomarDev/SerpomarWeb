document.addEventListener('DOMContentLoaded', function(){

    new TomSelect('#id_proveedor', {
        valueField: 'id',
        labelField: 'razon_social',
        searchField: 'razon_social',
        maxItems:1,
        load: function(query, callback) {
            fetch(`https://esenttiapp-production.up.railway.app/api/cargarproveedores?search=${encodeURIComponent(query)}`,{
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
                            ${escape(item.razon_social)}
                        </div>`;
            },
            item: function(item, escape) {
                return `<div class="">
                            ${escape(item.razon_social)}
                        </div>`;
            }
        }
    });

   })