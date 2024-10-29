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
  { headerName: "ESTADO OPERACIÓN", field: "estado_operacion", rowGroup: true }, 
  { headerName: "ESTADO", field: "on_timec", hide: false }, 
  {
      headerName: "CANTIDAD",
      aggFunc: "count", hide: true 
  },
];

fetch("https://sertrack-production.up.railway.app/api/intervalfifteenday", {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
  }
})
.then(response => response.json())
.then(data => {
  const hoyColombia = new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' });
  const fechaActual = new Date(hoyColombia).toISOString().slice(0, 10);

  const filteredData = data.filter(Preprogramar => {
    try {
      // Intenta convertir la fecha, si falla, se salta el elemento
      const fechaItem = new Date(Preprogramar.fecha_global); 
      const fechaColombia = new Date(fechaItem.toLocaleString('en-US', { timeZone: 'America/Bogota' }));
      const fechaGlobal = fechaColombia.toISOString().slice(0, 10);
      return fechaGlobal === fechaActual;
    } catch (error) {
      console.error("Error al convertir la fecha:", Preprogramar.fecha_global, error);
      return false; // Salta este elemento si la fecha es inválida
    }
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
      groupDisplayType: 'groupRows',
      suppressRowClickSelection: true, 
      autoGroupColumnDef: { 
          headerName: "ESTADO DE LA OPERACIÓN", 
          field: 'estado_operacion',
          cellRendererParams: {
              suppressCount: true
          }
      }
  };

  const eGridDiv = document.getElementById('preprogramar');
  new agGrid.Grid(eGridDiv, gridOptions);
})
.catch(error => {
  console.error("Error al cargar los datos:", error);
});