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
    // Obtener la fecha actual en la zona horaria de Colombia
    const hoyColombia = new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' });
    const hoy = new Date(hoyColombia).toISOString().slice(0, 10);

    // Filtrar los datos por la fecha actual (usando la fecha en Colombia)
    const rowData = data.filter(item => {
      try {
        const fechaItem = new Date(item.fecha_global);
        const fechaColombia = new Date(fechaItem.toLocaleString('en-US', { timeZone: 'America/Bogota' }));
        const fechaGlobal = fechaColombia.toISOString().slice(0, 10);
        return fechaGlobal === hoy; 
      } catch (error) {
        console.error("Error al convertir la fecha:", item.fecha_global, error);
        return false; // Salta este elemento si la fecha es inválida
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