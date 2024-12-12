const columnDefsGPS = [
    { headerName: "id", field: "id", hide: true },
    { headerName: "Contenedor", field: "contenedor" },
    { headerName: "Cita Puerto", field: "cita_puerto" },
    { headerName: "Placa", field: "vehiculo" },
    { headerName: "Conductor", field: "conductor" },
    { headerName: "Punto Origen", field: "punto_origen" },
    { headerName: "Punto Final", field: "punto_final" },
    { headerName: "Hora Salida", field: "hora_salida" },
    { headerName: "Hora Llegada", field: "hora_llegada" },
    { headerName: "Duracion recorrido", field: "duracion_recorrido" },
  ];
  
  fetch("https://sertrack-production.up.railway.app/api/intervalfifteenday", {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
  })
    .then(response => response.json())
    .then(data => {
      // Obtener la fecha actual en el formato adecuado (YYYY-MM-DD) usando moment
      const fechaActual = moment().format('YYYY-MM-DD');
  
      // Filtrar los datos para que solo incluyan los de la fecha actual,
      // ignorando aquellos donde cita_puerto es null
      const filteredData = data.filter(Preprogramar => {
        if (Preprogramar.cita_puerto) {
          // Usar Moment.js para analizar la fecha y convertirla al formato correcto
          const citaPuertoFecha = moment(Preprogramar.cita_puerto, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD');
          return citaPuertoFecha === fechaActual;
        } else {
          return false;
        }
      });
  
      const processedData = filteredData.map(Preprogramar => {
        return {
          id: Preprogramar.id,
          contenedor: Preprogramar.contenedor,
          cita_puerto: Preprogramar.cita_puerto,
          vehiculo: Preprogramar.vehiculo,
          conductor: Preprogramar.conductor,
          punto_origen: Preprogramar.punto_origen,
          punto_final: Preprogramar.punto_final,
          hora_salida: Preprogramar.hora_salida,
          hora_llegada: Preprogramar.hora_llegada,
          duracion_recorrido: Preprogramar.duracion_recorrido,
        };
      });
  
      gridOptions = {
        columnDefs: columnDefsGPS,
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
      };
  
      const eGridDiv = document.getElementById('reporte-gps');
      new agGrid.Grid(eGridDiv, gridOptions);
    })
    .catch(error => {
      console.error("Error al cargar los datos:", error);
    });