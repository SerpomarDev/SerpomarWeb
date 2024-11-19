
let gridOptions; 

const columnDefs = [
  { headerName: "id", field: "id", hide: true}, 
  { headerName: "Pedido", field: "pedido" },



  { 
    headerName: "Fecha Global", 
    field: "fecha_global",
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


  { 
    headerName: "Fecha Programa", 
    field: "fecha_programa",
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
  
  { headerName: "Ingreso Planta", field: "ingreso_planta" },
  { headerName: "Documentos Lleno", field: "documentos_lleno" },
  { headerName: "Cita Puerto", field: "cita_puerto" },
  { headerName: "Observacion OP", field: "observacion_op" },
  { headerName: "Validacion Piso", field: "validacion_piso" },
 
  { headerName: "Remisionado", field: "remisionado" },
 
  { headerName: "Vehiculo", field: "vehiculo" },
  { headerName: "Conductor", field: "conductor" },

  { headerName: "Cantidad Cont", field: "cantidad_cont" },
  { headerName: "Incoterms", field: "incoterms" },
  { headerName: "Cliente", field: "cliente" },
  { headerName: "Contenedor", field: "contenedor" },
  { headerName: "Tara", field: "tara" },
  { headerName: "Payload", field: "payload" },
  { headerName: "UVI", field: "uvi" },
  { headerName: "N Servicio", field: "n_servicio" },
  { headerName: "Reserva", field: "reserva" },
  { headerName: "Linea Naviera", field: "linea_naviera" },
  { headerName: "Patio Retiro", field: "patio_retiro" },
  { headerName: "Tipo Contenedor", field: "tipo_contenedor" },
  { headerName: "Peso Mercancia", field: "peso_mercancia" },
  { headerName: "Puerto Ingreso", field: "puerto_ingreso" },
  { headerName: "Motonave", field: "motonave" },
  { headerName: "Fecha Documental", field: "fecha_documental" },
  { headerName: "Corte Documental", field: "corte_documental" },
  { headerName: "Fecha Fisico", field: "fecha_fisico" },
  { headerName: "ETA MN", field: "eta_mn" },
 
  { headerName: "Tipo Modalidad", field: "tipo_modalidad", hide: true},
  { headerName: "Sitio Cargue", field: "sitio_cargue" },
  { headerName: "Remision", field: "remision" },
  { headerName: "Manifiesto", field: "manifiesto" },
  { headerName: "Dias Libres Piso", field: "dias_libre_piso" },
  { headerName: "Dias Libres Piso", field: "dias_libres_piso", hide: true},
  { headerName: "On Time", field: "on_timec" },
  { headerName: "Estado Operación", field: "estado_operacion", 
    filter: 'agSetColumnFilter',
    hide: false,
    filterParams: {
        value: ['FINALIZADO'],
        suppressSorting: true 
    }
  },
  { headerName: "Horas Planta", field: "horas_planta", hide: true },
  { headerName: "Fecha Retiro Vacio", field: "fecha_retiro_vacio", hide: true },
 
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
        pedido: Preprogramar.pedido, 

        fecha_global: Preprogramar.fecha_global,
        fecha_programa: Preprogramar.fecha_programa,
        ingreso_planta: Preprogramar.ingreso_planta,
        documentos_lleno: Preprogramar.documentos_lleno,
        cita_puerto: Preprogramar.cita_puerto,
        observacion_op: Preprogramar.observacion_op,
        validacion_piso: Preprogramar.validacion_piso,
      
        remisionado: Preprogramar.remisionado,
        
        vehiculo: Preprogramar.vehiculo,
        conductor: Preprogramar.conductor,
      
        cantidad_cont: Preprogramar.cantidad_cont,
        incoterms: Preprogramar.incoterms,
        cliente: Preprogramar.cliente,
        contenedor: Preprogramar.contenedor,
        tara: Preprogramar.tara,
        payload: Preprogramar.payload,
        uvi: Preprogramar.uvi,
        n_servicio: Preprogramar.n_servicio,
        reserva: Preprogramar.reserva,
        linea_naviera: Preprogramar.linea_naviera,
        patio_retiro: Preprogramar.patio_retiro,
        tipo_contenedor: Preprogramar.tipo_contenedor,
        peso_mercancia: Preprogramar.peso_mercancia,
        puerto_ingreso: Preprogramar.puerto_ingreso,
        motonave: Preprogramar.motonave,
        fecha_documental: Preprogramar.fecha_documental,
        corte_documental: Preprogramar.corte_documental,
        fecha_fisico: Preprogramar.fecha_fisico,
        eta_mn: Preprogramar.eta_mn,
       
        sitio_cargue: Preprogramar.sitio_cargue,
        remision: Preprogramar.remision,
        manifiesto: Preprogramar.manifiesto,
        dias_libres_piso: Preprogramar.dias_libres_piso,
        on_timec: Preprogramar.on_timec,
        estado_operacion: Preprogramar.estado_operacion,
        horas_planta: Preprogramar.horas_planta,
        fecha_retiro_vacio: Preprogramar.fecha_retiro_vacio,
        dias_libre_piso: Preprogramar.dias_libre_piso,
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
        minWidth: 100,
      },
      rowSelection: 'multiple',
      enableRangeSelection: true,
      suppressMultiRangeSelection: true,
      pagination: true,
      paginationPageSize: 20,
      rowData: processedData,
      onGridReady: params => { // Aplicar filtro al iniciar la grilla
        params.api.setFilterModel({
            'estado_operacion': {
                filterType: 'set',
                values: ['FINALIZADO'] 
            }
          });
        },
    };

    const eGridDiv = document.getElementById('preprogramar');
    new agGrid.Grid(eGridDiv, gridOptions);
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
  });

