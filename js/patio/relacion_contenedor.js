    new gridjs.Grid({
        search: true,
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
        columns: ["SP","Cliente","Modalidad","Numero serie", "Tipo operación", "Conductor", "placa",{
            name:'Ingreso',
            hidden: false,
            formatter:(cell,row)=>{
                return gridjs.h('button',{
                  className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
                  onclick:()=>patio(row.cells[0].data)
                },'Ir')
              }
        }],
        server: {
            url: 'https://esenttiapp-production.up.railway.app/api/patiocontenedor',
            then: (data) => {
                if (Array.isArray(data) && data.length > 0) {
                    return data.map((
                    patcont) => [
                        patcont.do_sp,
                        patcont.cliente,
                        patcont.emp_exp,
                        patcont.numero_contenedor,
                        patcont.tipo_contenedor,
                        patcont.conductor,
                        patcont.placa,
                    ]);
                } else {
                    console.error("La respuesta del servidor no contiene datos válidos.");
                    return [];
                }
            }
        }
    }).render(document.getElementById('relacont'));

    function patio(id){
        window.location.href = `/view/patio/solicitud_ingreso.html?id=${id}`
      }
