document.addEventListener('DOMContentLoaded', function() {

const columnDefs = [
  { headerName: "ID", field: "id" },
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
      const rowData = {
          id: data.id,
          pedido: data.pedido,
          contenedor: data.contenedor,
          fecha_programa: data.fecha_programa,
          linea_naviera: data.linea_naviera,
          patio_retiro: data.patio_retiro,
          puerto_ingreso: data.puerto_ingreso,
      };

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
          rowData: [rowData], 
      };

      // Renderizar la tabla en el contenedor
      const eGridDiv = document.getElementById('miTabla'); // Reemplaza 'miTabla' con el ID de tu contenedor
      new agGrid.Grid(eGridDiv, gridOptions);
  })
  .catch(error => {
      console.error("Error al cargar los datos:", error);
  });
});