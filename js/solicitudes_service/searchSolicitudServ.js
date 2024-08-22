
new gridjs.Grid({
    search: true,
    language:{
        search:{
            placeholder: '🔍 Buscar...'
        }
    },
    pagination: {
        limit:30,
        enabled: true,
    },
    resizable: true,
    sort: false,
    columns: [
        {
            name:"#",
            hidden:true,
        },{
            name:'SP',
            attributes: (cell,row)=>{
            if(cell){
                return{
                  'data-cell-content': cell,
                  onclick:()=>showOrdenService(row.cells[0].data),
                  'style': 'cursor: pointer; color: #6495ED;  font-weight: bold;',
                }
            }
        }
    }, "DO pedido","Pedido","Contendores","Tipo Transporte","Cliente","Fecha entrada",{
        name: "Pendiente Liquidar",
    },{
        name:'Acciones',
        hidden:true,
        columns:[{
            name:'Actualizar',
            hidden:true,
            formatter:(cell,row)=>{
                return gridjs.h('a', {
                    href: '',
                    onclick: (e) => {
                        e.preventDefault();
                        edit(row.cells[0].data);
                    }
                }, [
                    gridjs.h('img', {
                        src: '/img/editar-texto.png',
                        alt: 'Actualizar',
                        style: 'width: 20px; height: 20px;' 
                    })
                ]);
            }
        },
        {
            name:'Eliminar',
            hidden:true,
            formatter:(cell,row)=>{
                return gridjs.h('a', {
                    href: '',
                    onclick: (e) => {
                        e.preventDefault();
                        delete(row.cells[0].data);
                    }
                }, [
                    gridjs.h('img', {
                        src: '/img/basura.png',
                        alt: 'eliminar',
                        style: 'width: 20px; height: 20px;' 
                    })
                ]);
            }
        },
    ],
    }],
    // sort: true,
    server: {
        url: "https://esenttiapp-production.up.railway.app/api/showsolicitudserv",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((soliserv) => [
                    soliserv.id_primario,
                    soliserv.do_sp,
                    soliserv.do_pedido,
                    soliserv.pedido,
                    soliserv.contenedor,
                    soliserv.impexp,
                    soliserv.cliente,
                    soliserv.fecha_actualizacion,

                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    }
}).render(document.getElementById('ordenService'));


// const cantidadFacturados = localStorage.getItem('cantidadFacturados');
// const cantidadContenedor = localStorage.getItem('cantidadContenedor');

// const columnDefs = [
//     { headerName: "#", field: "id_primario", hide: true },
//     { 
//         headerName: "SP", 
//         field: "do_sp", 
//         cellRenderer: params => {
//             const cellValue = params.value;
//             const button = document.createElement('a');
//             button.textContent = cellValue;
//             button.style.cursor = 'pointer';
//             button.style.color = '#6495ED';
//             button.style.fontWeight = 'bold';
//             button.onclick = () => showOrdenService(params.data.id_primario);
//             return button;
//         } 
//     },
//     { headerName: "DO Pedido", field: "do_pedido" },
//     { headerName: "Pedido", field: "pedido" },
//     { headerName: "Contenedores", field: "contenedor" },
//     { headerName: "Tipo Transporte", field: "impexp" },
//     { headerName: "Cliente", field: "cliente" },
//     { headerName: "Fecha Entrada", field: "fecha_actualizacion" },
//     { headerName: "Pendiente Liquidar", 
//       field: "pendiente_liquidar",
//       cellRenderer: async params => {
//         const container = document.createElement('div');

//         // Crear dos <span> para mostrar los resultados
//         const span1 = document.createElement('span');
//         const span2 = document.createElement('span');
//         const separator = document.createElement('span');
//         separator.textContent = '/';

//         // Asignar valores iniciales
//         span1.textContent = 'Cargando...';
//         span2.textContent = 'Cargando...';

//         // Obtener los valores de las funciones (asíncronas)
//         const contenedor = await cantidadContenedor(params.data.id_primario);
//         const facturados = await pendienteLiquidar(params.data.id_primario);

//         // Asignar los valores a los <span> correspondientes
//         span1.textContent = contenedor || '0';
//         span2.textContent = facturados || '0';

//         // Añadir los elementos al contenedor
//         container.appendChild(span1);
//         container.appendChild(separator);
//         container.appendChild(span2);

//         return container;
//     }
//      },
//     {
//         headerName: "Acciones", hide:true,
//         cellRenderer: params => {
//             const container = document.createElement('div');

//             // Botón Actualizar
//             const updateBtn = document.createElement('a');
//             updateBtn.href = '#';
//             updateBtn.onclick = (e) => {
//                 e.preventDefault();
//                 edit(params.data.id_primario);
//             };
//             const updateIcon = document.createElement('img');
//             updateIcon.src = '/img/editar-texto.png';
//             updateIcon.alt = 'Actualizar';
//             updateIcon.style.width = '20px';
//             updateIcon.style.height = '20px';
//             updateBtn.appendChild(updateIcon);

//             // Botón Eliminar
//             const deleteBtn = document.createElement('a');
//             deleteBtn.href = '#';
//             deleteBtn.onclick = (e) => {
//                 e.preventDefault();
//                 deleteRow(params.data.id_primario);
//             };
//             const deleteIcon = document.createElement('img');
//             deleteIcon.src = '/img/basura.png';
//             deleteIcon.alt = 'Eliminar';
//             deleteIcon.style.width = '20px';
//             deleteIcon.style.height = '20px';
//             deleteBtn.appendChild(deleteIcon);

//             // Añadir los botones al contenedor
//             container.appendChild(updateBtn);
//             container.appendChild(deleteBtn);

//             return container;
//         }
//     }
// ];

// fetch("https:esenttiapp-production.up.railway.app/api/showsolicitudserv",{
//     headers: {
//       'Authorization': `Bearer ${localStorage.getItem("authToken")}`
//     }
//   })
//   .then(response => response.json())
//   .then(data => {
//     const processedData = data.map(asigControl => {
//       return {
//         id_primario: asigControl.id_primario,
//         do_sp: asigControl.do_sp,
//         do_pedido: asigControl.do_pedido,
//         pedido: asigControl.pedido,
//         contenedor: asigControl.contenedor,
//         impexp: asigControl.impexp,
//         cliente: asigControl.cliente,
//         fecha_actualizacion: asigControl.fecha_actualizacion,
//         pendiente_liquidar: asigControl.pendiente_liquidar
//       };
//     });


//     // Configurar la tabla con los datos procesados
//     const gridOptions = {
//         columnDefs: columnDefs,
//         defaultColDef: {
//             resizable: true,
//             sortable: false,
//             filter: "agTextColumnFilter",
//             floatingFilter: true,
//       },
//       pagination: true,
//       paginationPageSize: 30,
//       rowData: processedData,
//     };

//       const eGridDiv = document.getElementById('ordenService');
//       new agGrid.Grid(eGridDiv, gridOptions);
//   })
//   .catch(error => {
//     console.error("Error al cargar los datos:", error);
//   });


function showOrdenService(id){
    window.location.href = `/view/contenedor/create.html?id=${id}`
}
