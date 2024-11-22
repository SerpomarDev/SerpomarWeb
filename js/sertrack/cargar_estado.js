const estadosOperacion = [
  "PROGRAMADO-NO CONFIRMADO", 
  "PROGRAMADO-CONFIRMADO",
  "EN SITIO DE CARGUE",
  "ASIGNADO",
  "CARGADO ESPERANDO CITA",
  "FINALIZADO",
  "DEVOLUCION DE EXPORTACION",
  "FALLIDO",
];

const columnDefs = [
  { headerName: "id", field: "id", hide: true },
  { headerName: "Fecha Global", field: "fecha_global", hide: true },
  { headerName: "PEDIDO", field: "pedido", hide: false },
  { headerName: "CONTENEDOR", field: "contenedor", hide: false },
  { headerName: "Vehiculo", field: "vehiculo", hide: false },
  { 
      headerName: "ESTADO OPERACIÓN", 
      field: "estado_operacion", 
      rowGroup: true,
      // Puedes mantener o eliminar el comparator, ya que groupRowAggNodes se encarga del ordenamiento
      /*comparator: (valueA, valueB) => {
          const indexA = estadosOperacion.indexOf(valueA);
          const indexB = estadosOperacion.indexOf(valueB);
          return indexA - indexB;
      }*/
  },
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
  // 1. Obtener la fecha actual en la zona horaria de Colombia con moment.js
  const hoyColombia = moment().tz('America/Bogota').startOf('day'); 

  // 2. Filtrar los datos por la fecha actual
  const filteredData = data.filter(Preprogramar => {
      try {
          // Convertir la fecha del item a la zona horaria de Colombia con moment.js
          const fechaItem = moment(Preprogramar.fecha_global).tz('America/Bogota').startOf('day');

          // Comparar las fechas (ignorando la hora)
          return fechaItem.isSame(hoyColombia);
      } catch (error) {
          console.error("Error al convertir la fecha:", Preprogramar.fecha_global, error);
          return false;
      }
  });

  const processedData = filteredData.map(Preprogramar => {
      return {
          id: Preprogramar.id,
          fecha_global: Preprogramar.fecha_global,
          pedido: Preprogramar.pedido,
          contenedor: Preprogramar.contenedor,
          vehiculo: Preprogramar.vehiculo,
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
      //autoGroupColumnDef: { // Puedes comentar o eliminar esta sección 
      //    headerName: "ESTADO DE LA OPERACIÓN", 
      //    field: 'estado_operacion',
      //    cellRendererParams: {
      //        suppressCount: true
      //    }
      //},
      groupRowAggNodes: (nodes) => {
          const groupedNodes = {};
          nodes.forEach(node => {
              const estadoOperacion = node.data.estado_operacion;
              if (!groupedNodes[estadoOperacion]) {
                  groupedNodes[estadoOperacion] = [];
              }
              groupedNodes[estadoOperacion].push(node);
          });

          const sortedNodes = estadosOperacion.map(estado => groupedNodes[estado]).filter(Boolean);

          return sortedNodes.flat();
      }
  };

  const eGridDiv = document.getElementById('preprogramar');
  new agGrid.Grid(eGridDiv, gridOptions);
})
.catch(error => {
  console.error("Error al cargar los datos:", error);
});