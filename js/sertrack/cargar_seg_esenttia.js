
let gridOptions; 

const columnDefs = [
  { headerName: "id", field: "id", hide: true}, 
  { 
    headerName: "Fecha Global", 
    field: "fecha_global", hide: false,
    filter: "agDateColumnFilter",
    floatingFilter: true,
    filterParams: {
      browserDatePicker: true, 
      comparator: (filterLocalDateAtMidnight, cellValue) => {
        const [year, month, day] = cellValue.split('-');
        const cellDate = new Date(year, month - 1, day); 
        cellDate.setHours(0, 0, 0, 0);
        const filterDate = new Date(filterLocalDateAtMidnight); 

        if (cellDate.getTime() === filterDate.getTime()) {
          return 0;
        }
        if (cellDate < filterDate) {
          return -1;
        }
        if (cellDate > filterDate) {
          return 1;
        }
      },
    }
  },
  { headerName: "Pedido", field: "pedido" },
  { headerName: "Contenedor", field: "contenedor" },
  { headerName: "Vehiculo", field: "vehiculo" },
  { headerName: "Conductor", field: "conductor" },
  { headerName: "Puerto Ingreso", field: "puerto_ingreso" },
  { headerName: "Diferencia Peso", field: "conductor" },
  { headerName: "Tiempo Recorrido", field: "puerto_ingreso" },
 
];

fetch("https://sertrack-production.up.railway.app/api/intervalfifteenday", {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
  }
})
  .then(response => response.json())
  .then(data => {
    const processedData = data.map(Preprogramar => {
      return {
        id: Preprogramar.id,
        fecha_global: Preprogramar.fecha_global,
        
      
        pedido: Preprogramar.pedido, 
        contenedor: Preprogramar.contenedor,
        vehiculo: Preprogramar.vehiculo,
        conductor: Preprogramar.conductor,
        puerto_ingreso: Preprogramar.puerto_ingreso,
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
        minWidth: 100
      },
      rowSelection: 'multiple',
      enableRangeSelection: true,
      suppressMultiRangeSelection: true,
      pagination: true,
      paginationPageSize: 20,
      rowData: processedData,

    }

    const eGridDiv = document.getElementById('preprogramar');
    new agGrid.Grid(eGridDiv, gridOptions);
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
  });

