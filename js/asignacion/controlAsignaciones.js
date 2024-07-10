

new gridjs.Grid({
    search: true,
    language:{
      search:{
          placeholder: '🔍 Buscar...'
      }
    },
    pagination: {
        limit:30,
        enabled: false,
        //summary: true
    },
    sort: false,
    columns: [{name:"id",
        hidden:false
    },
    "Fecha","SP","Contenedor","Placa","Aliado",{
        name:"Tarifa",
        formatter:(_,row)=> `$ ${(row.cells[5].data).toLocaleString()}`
    },"Ruta","Nombre","Estado",{
    name:'Soportes',
    hidden:false,
      formatter:(cell,row)=>{
        return gridjs.html(`
           
            `);
      }
  },{
    name:"enviar",
    formatter:(cell,row)=>{
        return gridjs.h('button',{
          className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
          onClick: () => editAsignacion()
        },'enviar')
      }
  }],
    fixedHeader: true,
    //height: '400px',
    server: {
        url: `https://esenttiapp-production.up.railway.app/api/controlasignaciones`,
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((asigControl) => [
                  asigControl.id,
                  asigControl.fecha,
                  asigControl.do_sp,
                  asigControl.numero_contenedor,
                  asigControl.placa,
                  asigControl.aliado,
                  asigControl.tarifa,
                  asigControl.ruta,
                  asigControl.nombre,
                  asigControl.estado,
                  asigControl.adjunto,
                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    },
    resizable: true,
    style: {
      table: {with:"80%"}
    }
}).render(document.getElementById('controlAsig'));



    document.getElementById('SaveFile').addEventListener( "DOMContentLoaded", function() {
       
         myDropzone = new Dropzone("#SaveFile", {
            url: `https://esenttiapp-production.up.railway.app/api/asignacionfile`, 
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            },

            acceptedFiles: ".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.png,.jpeg",
            init: function() {
                this.on("success", function(file, response) {
                    console.log(response);
                });
                this.on("error", function(file, response) {
                    console.error(response);
                });
            }
        });
    });
