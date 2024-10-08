document.addEventListener('DOMContentLoaded', function(){

    new TomSelect('#id_solicitud_servi', {
        valueField: 'id_sp',
        labelField: 'do_sp',
        searchField: 'do_sp',
        maxItems:1,
        load: function(query, callback) {
            fetch(`https://esenttiapp-production.up.railway.app/api/uploadsp?search=${encodeURIComponent(query)}`,{
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
                            ${escape(item.do_sp)}
                        </div>`;
            },
            item: function(item, escape) {
                return `<div class="">
                            ${escape(item.do_sp)}
                        </div>`;
            }
        }
    });

   })