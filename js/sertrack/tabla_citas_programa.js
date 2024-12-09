function filtroFechaCita(params) {
    const fechaCita = new Date(params.value);
    const hoy = new Date();
    return fechaCita.setHours(0,0,0,0) >= hoy.setHours(0,0,0,0); 
  }
  
  const columnDefsRE = [
    { headerName: "ID Primario", field: "id_primario", hide: true },
    { headerName: "Número Contenedor", field: "numero_contenedor" },
    { headerName: "Pedido", field: "pedido" },
    { 
      headerName: "Fecha Cita", field: "fecha_cita" },
    { headerName: "Fecha Notificación", field: "fecha_notificacion" },
    { headerName: "Cliente", field: "cliente", hide: true}, 
    { headerName: "Modalidad", field: "modalidad"},
    { headerName: "Producto", field: "producto" },
    { headerName: "Estado", field: "estado" },
    { headerName: "Placa Puerto", field: "placa_puerto" },
    { headerName: "Sitio Descargue", field: "sitio_cargue_descargue" },
  ];
  
  fetch("https://esenttiapp-production.up.railway.app/api/registroestadistico", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  })
  .then((response) => response.json())
  .then((data) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
  
    const datosFiltrados = data.filter(item => 
      item.cliente === "ESENTTIA S A" && 
      item.modalidad === "importacion" &&
      item.fecha_cita !== null  
    //   && 
    //   new Date(item.fecha_cita).setHours(0, 0, 0, 0) >= hoy
    );
  
    const processedData = datosFiltrados.map((item) => {
      return {
        id_primario: item.id_primario,
        numero_contenedor: item.numero_contenedor,
        pedido: item.pedido,
        fecha_cita: item.fecha_cita,
        fecha_notificacion: item.fecha_notificacion,
        cliente: item.cliente,
        modalidad: item.modalidad,
        producto: item.producto,
        estado: item.estado,
        placa_puerto: item.placa_puerto,
        sitio_cargue_descargue: item.sitio_cargue_descargue
      };
    });
  
    const gridOptions = {
      columnDefs: columnDefsRE,
      defaultColDef: {
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        floatingFilter: true,
      },
      groupDisplayType: "groupRows",
      rowGroupPanelShow: "always",
      groupDefaultExpanded: 1,
      enableRangeSelection: true,
      pagination: true,
      paginationPageSize: 20,
      rowData: processedData, 
    };
  
    const eGridDiv = document.getElementById("citas-programadas");
    new agGrid.Grid(eGridDiv, gridOptions);
  })
  .catch((error) => {
    console.error("Error al cargar los datos:", error);
  });