const estadosOperacion = [
  "ASIGNADO",
  "FINALIZADO",
  "CARGADO ESPERANDO CITA",
  "DEVOLUCION DE EXPORTACION",
  "EN SITIO DE CARGUE",
  "FALLIDO",
  "PROGRAMADO-CONFIRMADO",
];

const columnDefs = [
  { headerName: "id", field: "id", hide: true },
  { headerName: "Fecha Global", field: "fecha_global", hide: true },
  { headerName: "PEDIDO", field: "pedido", hide: false },
  { headerName: "CONTENEDOR", field: "contenedor", hide: false },
  { headerName: "ESTADO OPERACIÓN", field: "estado_operacion", rowGroup: true }, // Agrupar por "Estado Operación"
  { headerName: "ESTADO", field: "on_timec", hide: false }, // Cambiar el nombre de la columna a "ESTADO"
  {
      headerName: "CANTIDAD",
      aggFunc: "count", hide: true // Usar la función de agregación "count" para contar las filas
  },
];

fetch("https://sertrack-production.up.railway.app/api/intervalfifteenday", {
  headers: {
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
  }
})
.then(response => response.json())
.then(data => {
  const fechaActual = new Date().toISOString().slice(0, 10);
  const filteredData = data.filter(Preprogramar => {
      return Preprogramar.fecha_global === fechaActual;
  });

  const processedData = filteredData.map(Preprogramar => {
      return {
          id: Preprogramar.id,
          fecha_global: Preprogramar.fecha_global,
          pedido: Preprogramar.pedido,
          contenedor: Preprogramar.contenedor,
          estado_operacion: Preprogramar.estado_operacion,
          on_timec: Preprogramar.on_timec,
      };
  });

  const gridOptions = {
      columnDefs: columnDefs,
      paginationPageSize: 20,
      rowData: processedData,
      groupDisplayType: 'groupRows', // Mostrar los grupos como filas
      suppressRowClickSelection: true, // Evitar que se seleccionen las filas de grupo
      autoGroupColumnDef: { 
          headerName: "ESTADO DE LA OPERACIÓN", 
          field: 'estado_operacion',
          cellRendererParams: {
              suppressCount: true  // Ocultar el conteo predeterminado de ag-Grid
          }
      }
  };

  const eGridDiv = document.getElementById('preprogramar');
  new agGrid.Grid(eGridDiv, gridOptions);
})
.catch(error => {
  console.error("Error al cargar los datos:", error);
});