document.addEventListener('DOMContentLoaded', function() {
  const columnDefs = [
    { headerName: "ID", field: "id", hide: true },
    { headerName: "Pedido", field: "pedido" },
    { headerName: "Contenedor", field: "contenedor" },
    { headerName: "Fecha Programa", field: "fecha_programa" },
    { headerName: "Vehiculo", field: "vehiculo", hide: false },
    { headerName: "Linea Naviera", field: "linea_naviera" },
    { headerName: "Patio Retiro", field: "patio_retiro" },
    { headerName: "Puerto Ingreso", field: "puerto_ingreso" }, 
  ];

  fetch("https://sertrack-production.up.railway.app/api/intervalfifteenday", {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
  })
  .then(response => response.json())
  .then(data => {
    // 1. Obtener la fecha actual en la zona horaria de Colombia
    const hoyColombia = moment().tz('America/Bogota').startOf('day'); 

    // 2. Filtrar los datos por la fecha actual (usando la fecha en Colombia)
    const rowData = data.filter(item => {
      try {
        // Convertir la fecha del item a la zona horaria de Colombia usando moment.js
        const fechaItem = moment(item.fecha_global).tz('America/Bogota').startOf('day');

        // Comparar las fechas
        return fechaItem.isSame(hoyColombia); 
      } catch (error) {
        console.error("Error al convertir la fecha:", item.fecha_global, error);
        return false;
      }
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
      enableRangeSelection: true,
      suppressMultiRangeSelection: true,
      pagination: true, 
      paginationPageSize: 20,
      rowData: rowData,
    };

    const eGridDiv = document.getElementById('miTabla');
    new agGrid.Grid(eGridDiv, gridOptions);
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
  });
});