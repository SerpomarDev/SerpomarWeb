
 
 showPreventa()

 function showPreventa(){
    new gridjs.Grid({
        search:true,
        language:{
            search:{
                placeholder: '🔍 Buscar...'
            }
        },
        sort: false,
        columns: [{
            name: "#",
            hidden: true
        },"Placa","Nombre","Telefono","Ejes", "Estado","Flota","Esenttia","Cabot",{
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
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`
            },
            then: (data) => {
                if (Array.isArray(data) && data.length > 0) {
                    return data.map((preventa) => [
                      preventa.id,
                      preventa.placa,
                      preventa.nombre,
                      preventa.telefono,
                      preventa.ejes,
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

