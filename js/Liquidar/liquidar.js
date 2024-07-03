let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

    new gridjs.Grid({
        search: false,
        language:{
            search:{
                placeholder: '🔍 Buscar...'
            }
        },
        pagination: {
            limit:10,
            enabled: true,
        },
        resizable: true,
        sort: false,
        columns: ["SP","Cliente",{
            name:"Valor Total",
            formatter:(_,row)=> `$ ${(row.cells[2].data)}`
        },{
            name:"cerrar sp",
            hidden:true,
            formatter:(cell,row)=>{
                return gridjs.h('button',{
                type:'submit',
                className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
                onClick: () => saveLiquidar()
                },'ir')
            }
        }],
        server: {
            url: `https://esenttiapp-production.up.railway.app/api/liquidarspt/${id}`,
            then: (data) => {
                if (Array.isArray(data) && data.length > 0) {
                    return data.map((preliq) => [
                        preliq.do_sp,
                        preliq.cliente,
                        preliq.valor_total,
                    ]);
                } else {
                    console.error("La respuesta del servidor no contiene datos válidos.");
                    return [];
                }
            }
        }
    }).render(document.getElementById('liquidar'));


    document.getElementById('saveLiquidacion').addEventListener('submit',function(event){
        event.preventDefault();
    
        const formData = new FormData(this);
        const jsonData = JSON.stringify(Object.fromEntries(formData));
    
        fetch('https://esenttiapp-production.up.railway.app/api/liquidacion',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:jsonData
        })
        .then(response=>{
            if(!response.ok){
                Swal.fire({
                    title: "Advertencia",
                    text: "No se puede enviar una factura vacia",
                    icon: "warning"
                });
                throw new Error('Error al enviar los datos del formulario');
            }
        })
        .then(data => {
            Swal.fire({
              title: "¡Buen trabajo!",
              text: "Liquidación cerrada",
              icon: "success",
            });
            setTimeout(() => {
                history.back();
              }, 1500);
        })
        .catch((error) => {
            Swal.fire({
                title: "¡!",
                text: "Liquidación cerrada",
                icon: "success",
              });
            console.error('Error:', error);
          });
    })