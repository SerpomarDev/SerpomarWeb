document.addEventListener('DOMContentLoaded', function() {

  const columnDefs = [
    { headerName: "ID", field: "id", hide: true},
    { headerName: "Pedido", field: "pedido" },
    { headerName: "Contenedor", field: "contenedor" },
    { headerName: "Fecha Programa", field: "fecha_programa" },
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
    // Obtener la fecha actual en formato YYYY-MM-DD
    const hoy = new Date().toISOString().slice(0, 10);

    // Filtrar los datos por la fecha actual
    const rowData = data.filter(item => {
      // Asumiendo que "fecha_global" es una cadena en formato YYYY-MM-DD
      return item.fecha_global === hoy; 
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