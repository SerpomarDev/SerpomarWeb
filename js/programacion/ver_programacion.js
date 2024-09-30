const te = new Date();
const azDate = new Intl.DateTimeFormat("az").format(te);

const columnDefs = [
    { title: "Id", field: "id", visible: false }, 
    { title: "Fecha", field: "fecha", hozAlign: "center", headerHozAlign: "center" },
    { title: "Cliente", field: "cliente" },
    { title: "SP", field: "do_sp", hozAlign: "center", headerHozAlign: "center" },
    { title: "Numero Contenedor", field: "numero_contenedor", hozAlign: "center", headerHozAlign: "center" },
    { title: "Placa", field: "placa", hozAlign: "center", headerHozAlign: "center" },
    { title: "Estado", field: "estado" },
    {
        title: "Accion",
        visible: false,
        formatter: function(cell, formatterParams) {
            const id = cell.getData().id;
            return `<button class="py-1 mb-2 px-3 bg-blue-600 text-white rounded hover:bg-blue-700" onclick="actualizarFactura('${id}')">Programar</button>`;
        },
        hozAlign: "center",
        headerHozAlign: "center"
    }
];

let table = new Tabulator("#programar", { 
    columns: columnDefs,
    layout: "fitColumns", 
    pagination: true,
    paginationSize: 20,
    resizableColumns:   true, 
    selectable: 1, 
    tooltips: true, 

    headerFilterPlaceholder: "Filtrar...", 
    placeholder: "No hay datos disponibles", 

    tableClass: "table-striped table-bordered", 
    headerSortElement: "<i class='fa fa-sort'></i>"
});
// Función para cargar los datos y actualizar la tabla
function cargarDatos(fechaSeleccionada) {
    fetch(`https://esenttiapp-production.up.railway.app/api/viewprogramacion/${fechaSeleccionada}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const processedData = data.map(Preprogramar => {
            return {
                id: Preprogramar.id,
                fecha: Preprogramar.fecha,
                cliente: Preprogramar.cliente,
                do_sp: Preprogramar.do_sp,
                numero_contenedor: Preprogramar.numero_contenedor,
                placa: Preprogramar.placa,
                estado: Preprogramar.estado,
            };
        });

        table.setData(processedData); // Actualizar los datos de la tabla con Tabulator
    })
    .catch(error => {
        console.error("Error al cargar los datos:", error);
    });
}

// Cargar datos iniciales al iniciar la tabla
const fechaInicial = localStorage.getItem("fechaSeleccionada") || azDate;
cargarDatos(fechaInicial);

// Observar cambios en localStorage para recargar la tabla
window.addEventListener('storage', (event) => {
    if (event.key === 'fechaSeleccionada') {
        cargarDatos(event.newValue);
    }
});

// Escuchar el evento personalizado (en la misma pestaña)
window.addEventListener('fechaCambiada', () => {
    cargarDatos(localStorage.getItem('fechaSeleccionada'));
});


// const te = new Date();
// const azDate = new Intl.DateTimeFormat("az").format(te);

// const columnDefs = [
//     { headerName: "Id", field: "id", hide: true },
//     { headerName: "Fecha", field: "fecha" },
//     { headerName: "Cliente", field: "cliente" },
//     { headerName: "SP", field: "do_sp" },
//     { headerName: "Numero Contenedor", field: "numero_contenedor" },
//     { headerName: "Placa", field: "placa" },
//     { headerName: "Estado", field: "estado" },
//     {
//         headerName: "Accion",hide: true,
//         cellRenderer: params => {
//             const id = params.data.id;
//             return `<button class="py- mb-4 px-4 bg-blue-600" onclick="actualizarFactura('${params.data.id}')">Programar</button>`;
//         }
//     }
// ];

// fetch(`https://esenttiapp-production.up.railway.app/api/viewprogramacion/${azDate}`, {
//         headers: {
//             'Authorization': `Bearer ${localStorage.getItem("authToken")}`
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         const processedData = data.map(Preprogramar => {
//             return {
//                 id: Preprogramar.id,
//                 fecha: Preprogramar.fecha,
//                 cliente: Preprogramar.cliente,
//                 do_sp: Preprogramar.do_sp,
//                 numero_contenedor: Preprogramar.numero_contenedor,
//                 placa: Preprogramar.placa,
//                 estado: Preprogramar.estado,
//             };
//         });

//         const gridOptions = {
//             columnDefs: columnDefs,
//             defaultColDef: {
//                 resizable: true,
//                 sortable: false,
//                 filter: "agTextColumnFilter",
//                 floatingFilter: true,
//                 flex: 1,
//                 minWidth: 100,
//             },
//             rowSelection: 'multiple',
//             enableRangeSelection: true,
//             suppressMultiRangeSelection: true,
//             pagination: true,
//             paginationPageSize: 20,
//             rowData: processedData,
//         };

//         const eGridDiv = document.getElementById('programar');
//         new agGrid.Grid(eGridDiv, gridOptions);
//     })
//     .catch(error => {
//         console.error("Error al cargar los datos:", error);
//     });
