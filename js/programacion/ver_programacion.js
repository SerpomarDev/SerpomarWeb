const te = new Date();
const azDate = new Intl.DateTimeFormat("az").format(te);

const columnDefs = [
    { headerName: "Id", field: "id", hide: true },
    { headerName: "Fecha", field: "fecha" },
    { headerName: "Cliente", field: "cliente" },
    { headerName: "SP", field: "do_sp" },
    { headerName: "Numero Contenedor", field: "numero_contenedor" },
    { headerName: "Placa", field: "placa" },
    { headerName: "Estado", field: "estado" },
    {
        headerName: "Accion",hide: true,
        cellRenderer: params => {
            const id = params.data.id;
            return `<button class="py- mb-4 px-4 bg-blue-600" onclick="actualizarFactura('${params.data.id}')">Programar</button>`;
        }
    }
];

fetch(`https://esenttiapp-production.up.railway.app/api/viewprogramacion/${azDate}`, {
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

        const gridOptions = {
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
            suppressMultiRangeSelection: true,
            pagination: true,
            paginationPageSize: 20,
            rowData: processedData,
        };

        const eGridDiv = document.getElementById('programar');
        new agGrid.Grid(eGridDiv, gridOptions);
    })
    .catch(error => {
        console.error("Error al cargar los datos:", error);
    });
