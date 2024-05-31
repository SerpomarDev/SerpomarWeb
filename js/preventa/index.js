/* Generamos una tabla utilizando el framework grid js.
 Enlace a la documentación https://gridjs.io */
 
 showPreventa()

 function showPreventa(){
    new gridjs.Grid({
        search:true,
        language:{
            search:{
                placeholder: '🔍 Buscar...'
            }
        },
        // pagination: {
        //     limit:5,
        //     enabled: true,
        // },
        sort: false,
        //resizable: true,
        columns: [{
            name: "#",
            hidden: true
        },"Placa","Nombre","Telefono","Ejes","Puerto","Estado","Flota","Esenttia","Cabot",{
          name :'Asignar',
          hidden: true,
          formatter:(cell, row)=>{
            return gridjs.h('div',{}, [
                gridjs.h('button',{
                    id:'asignarBtn',
                    className: 'btn btn-info',
                    onclick:()=>asignarPreventa(row.cells[0].data)
                },'Asignar')
            ])
          }
        },
        {
            name: 'Editar',
            formatter:(cell,row)=>{
                return gridjs.h('button',{
                    className: 'btn btn-primary editBtn',
                    onclick:()=>editPreventa(row.cells[0].data)
                }, 'Editar')
            }
        },
        {
            name: 'Eliminar',
            hidden: true,
            formatter:(cell,row)=>{
                return gridjs.h('button',{
                    className: 'btn btn-danger deleteBtn',
                    onclick:()=> deleteD(row.cells[0].data)
                },'Eliminar')
            }
        }
      ],
        server: {
            url: "https://esenttiapp-production.up.railway.app/api/selectbyinac",
            then: (data) => {
                if (Array.isArray(data) && data.length > 0) {
                    return data.map((preventa) => [
                      preventa.id,
                      preventa.placa,
                      preventa.nombre,
                      preventa.telefono,
                      preventa.ejes,
                      preventa.puerto,
                      preventa.estado,
                      preventa.flota,
                      preventa.esenttia,
                      preventa.cabot
                    ]);
                } else {
                    console.error("La respuesta del servidor no contiene datos válidos.");
                    return [];
                }
            }
        },
        style: {
          table: {with:"80%"}
        }
    }).render(document.getElementById('preventas'));
 }
 

function editPreventa(id) {
    window.location.href = `/view/preventas/edit.html?id=${id}`
}

function CrearPreventa() {
    window.location.href = `../preventas/create`;
}

function asignarPreventa(id){
    window.location.href = `/view/asignacion/asignacion.html?id=${id}`
}

function deleteD(id){
    DeleteData(id)
}
