// new gridjs.Grid({
//     search: true,
//     language: {
//         search: {
//             placeholder: '🔍 Buscar...'
//         }
//     },
//     pagination: {
//         limit: 20,
//         enabled: false,
//     },
//     sort: true,
//     fixedHeader: true,
//     height: '400px',
//     columns: [
//         { name: "id", hidden: false },
//         "Fecha", "SP", "Contenedor", "Placa", "Aliado", {
//             name: "Tarifa",
//             formatter: (_, row) => `$ ${(row.cells[6].data).toLocaleString()}`
//         },
//         "Ruta", "Conductor", "Estado","Observaciones",{
//             name:"#ordencompra",
//             hidden:true,
//         },{
//             name: 'Soportes',
//             hidden: false,
//             formatter: (cell, row) => {
//               return gridjs.html(
//                 `<button id="btn-${row.cells[0].data}" class="upload-btn no-file" onclick="uploadId(${row.cells[0].data})">Ver Adjuntar</button>`
//               );
//             }
//         },
//         {
//             name: "seleccione",
//             formatter: (cell, row) => {
//               return gridjs.h('input', {
//                   type: 'checkbox',
//                   id: `checkbox-${row.cells[0].data}`,
//                   className: 'row-checkbox'
//               });
//             }
//         },{
//                 name:"#ordencompra",
//                 hidden:false,
//                 formatter: (cell, row) => {
//                     return gridjs.html(`<input type="text" id="factura-${row.cells[0].data}">`);
//                 }
//         },
//         {
//             name: "enviar",
//             formatter: (cell, row) => {
//               return gridjs.h('button', {
//                   className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
//                   onClick: () => actualizarFactura(row.cells[0].data)
//               }, 'Enviar');
//           }
//         },
//         {
//             name: "Verificar",
//             hidden: false,
//             formatter: (cell, row) => {
//               return gridjs.h('button', {
//                   className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
//                   onClick: () => verificarAdjuntos(row.cells[0].data),
//               }, 'Verificar');
//           }
//         },
//         {
//             name: "rechazar",
//             hidden: false,
//             formatter: (cell, row) => {
//               return gridjs.h('button', {
//                   className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
//                   onClick: () => rechazarAdjuntos(row.cells[0].data),
//               }, 'Rechazar');
//           }
//         }
//     ],
//     fixedHeader: true,
//     server: {
//         url: `https://esenttiapp-production.up.railway.app/api/asignacionespendienteordencompra`,
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem("authToken")}`
//         },
//         then: (data) => {
//             if (Array.isArray(data) && data.length > 0) {
//                 return data.map(asigControl => [
//                     asigControl.id,
//                     asigControl.fecha,
//                     asigControl.do_sp,
//                     asigControl.numero_contenedor,
//                     asigControl.placa,
//                     asigControl.aliado,
//                     asigControl.tarifa,
//                     asigControl.ruta,
//                     asigControl.nombre,
//                     asigControl.estado,
//                     asigControl.descripcion,
//                     asigControl.numero_factura,
                    
//                 ]);
//             } else {
//                 console.error("La respuesta del servidor no contiene datos válidos.");
//                 return [];
//             }
//         }
//     },
//     resizable: true,
//     style: {
//         table: { width: "100%" }
//     }
// }).render(document.getElementById('costoAfiliado'));

// localStorage.setItem("authToken", data.token);

// function actualizarFactura() {
//   // Obtener los IDs seleccionados y sus números de factura
//   const checkboxes = document.querySelectorAll('.row-checkbox:checked');
   
//   if (checkboxes.length === 0) {
//         Swal.fire({
//             title: "Advertencia",
//             text: "Debe seleccionar al menos un registro para actualizar.",
//             icon: "warning"
//         });
//         return;
//     }

//   const payload = Array.from(checkboxes).map(checkbox => {
//     const id = checkbox.id.replace('checkbox-', '');
//     const ordenInput = document.getElementById(`factura-${id}`);
//     const row = checkbox.closest('tr');
//     return {
//         id: id,
//         orden_compra: ordenInput ? ordenInput.value : '',
//         fecha: row.cells[1].innerText,
//         sp: row.cells[2].innerText,
//         numero_contenedor: row.cells[3].innerText,
//         placa: row.cells[4].innerText,
//         aliado: row.cells[5].innerText,
//         tarifa: row.cells[6].innerText,
//         ruta: row.cells[7].innerText,
//         nombre: row.cells[8].innerText,
//         estado: row.cells[9].innerText
//     };
//   });

//   fetch('https://esenttiapp-production.up.railway.app/api/actualizarfacturas', {
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem("authToken")}`
//       },
//       body: JSON.stringify(payload)
//   })
//   .then(response => response.json())
//   .then(data => {
//     Swal.fire({
//       title: "¡Actualizado!",
//       text: "El estado ha sido actualizado.",
//       icon: "success"
//     });

//     excelCostoAfiliado(payload)
    
//     setTimeout(() => {
//         location.reload();
//     }, 1500);
//   })
//   .catch(error => {
//       console.error('Error:', error);
//   });
// }


const columnDefs = [
    { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
    { headerName: "id", field: "id", hide: false },
    { headerName: "Fecha", field: "fecha" },
    { headerName: "SP", field: "do_sp" },
    { headerName: "Contenedor", field: "numero_contenedor" },
    { headerName: "Placa", field: "placa" },
    { headerName: "Razon social", field: "razon_social" },
    { 
        headerName: "Tarifa", 
        field: "tarifa",
        valueFormatter: params => `$ ${params.value.toLocaleString()}`
    },
    { headerName: "Ruta", field: "ruta" },
    { headerName: "Conductor", field: "nombre" },
    { headerName: "Estado", field: "estado" },
    { headerName: "Cliente", field: "cliente" },
    { headerName: "Observaciones", field: "descripcion" },
    
    {
        headerName: "Soportes",
        cellRenderer: params => {
            const button = document.createElement('button');
            button.className = 'upload-btn no-file';
            button.innerText = 'Ver Adjuntar';
            button.onclick = () => uploadId(params.data.id);
            return button;
        }
    },
    {
        headerName: "Facturar",
        cellRenderer: params => {
            return `<input type="text" id="factura-${params.data.id}">`;
        }
    },
    {
        headerName: "Acciones",
        cellRenderer: params => {
            return `
                <button class="py-2 mb-4 px-4 border rounded bg-blue-600" onclick="actualizarFactura()">Enviar</button>
                <button class="py-2 mb-4 px-4 border rounded bg-blue-600" onclick="verificarAdjuntos(${params.data.id})">Verificar</button>
                <button class="py-2 mb-4 px-4 border rounded bg-blue-600" onclick="rechazarAdjuntos(${params.data.id})">Rechazar</button>
            `;
        }
    }
];
fetch("https://esenttiapp-production.up.railway.app/api/asignacionespendienteordencompra",{
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
  })
  .then(response => response.json())
  .then(data => {
    const processedData = data.map(asigControl => {
      return {
        id: asigControl.id,
        fecha: asigControl.fecha,
        do_sp: asigControl.do_sp,
        numero_contenedor: asigControl.numero_contenedor,
        placa: asigControl.placa,
        razon_social: asigControl.razon_social,
        tarifa: asigControl.tarifa,
        ruta: asigControl.ruta,
        nombre: asigControl.nombre,
        estado: asigControl.estado,
        cliente: asigControl.cliente,
        descripcion: asigControl.descripcion,
        numero_factura: asigControl.numero_factura,
      };
    });

    gridOptions = {
        columnDefs: columnDefs,
        defaultColDef: {
          resizable: true,
          sortable: false,
          filter: "agTextColumnFilter",
          floatingFilter: true,
          flex: 1,
          minWidth: 100,
        },
        rowSelection: 'multiple',
        enableRangeSelection: true,
        suppressMultiRangeSelection:true,
        pagination: true,
        paginationPageSize: 20,
        rowData: processedData,
        
      };
      
      // Renderizar la tabla en el contenedor
        const eGridDiv = document.getElementById('costoAfiliado');
        new agGrid.Grid(eGridDiv, gridOptions);
    })
    .catch(error => {
        console.error("Error al cargar los datos:", error);
    });


    function actualizarFactura() {
        // Obtener las filas seleccionadas
        const selectedNodes = gridOptions.api.getSelectedNodes();
        
        if (selectedNodes.length === 0) {
            Swal.fire({
                title: "Advertencia",
                text: "Debe seleccionar al menos un registro para actualizar.",
                icon: "warning"
            });
            return;
        }
    
        const payload = selectedNodes.map(node => {
            const id = node.data.id;
            const ordenInput = document.getElementById(`factura-${id}`);
            return {
                id: id,
                orden_compra: ordenInput.value,
                fecha: node.data.fecha,
                do_sp: node.data.do_sp,
                numero_contenedor: node.data.numero_contenedor,
                placa: node.data.placa,
                aliado: node.data.aliado,
                tarifa: node.data.tarifa,
                ruta: node.data.ruta,
                nombre: node.data.nombre,
                estado: node.data.estado
            };
        });
    
        fetch('https://esenttiapp-production.up.railway.app/api/actualizarfacturas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                title: "¡Actualizado!",
                text: "El estado ha sido actualizado.",
                icon: "success"
            });
    
            excelCostoAfiliado(payload);
            
            setTimeout(() => {
                location.reload();
            }, 1500);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function verificarAdjuntos(id){
        verificarAdjuntos(id)
    }

    function rechazarAdjuntos(id){
        rechazarAdjuntos(id)
    }