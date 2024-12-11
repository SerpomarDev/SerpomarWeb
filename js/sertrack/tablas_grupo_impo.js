const columnDefsRE = [
    { headerName: "ID Primario", field: "id_primario", hide: true },
    { headerName: "Número Contenedor", field: "numero_contenedor" },
    { headerName: "Pedido", field: "pedido" },
    { headerName: "Fecha Cita", field: "fecha_cita" },
    { headerName: "Cliente", field: "cliente", hide: true },
    { headerName: "Modalidad", field: "modalidad", hide: true, rowGroup: true },
    { headerName: "Producto", field: "producto" },
    { headerName: "Placa Puerto", field: "placa_puerto" },
    { headerName: "Sitio Descargue", field: "sitio_cargue_descargue" },
  ];
  
  const columnDefsIM = [
    { headerName: "id", field: "id", hide: true },
    {
      headerName: "lleno o vacio",
      field: "lleno_vacio",
      filter: 'agSetColumnFilter',
      hide: true,
      filterParams: {
        values: ['LLENO', 'VACIO'],
        suppressSorting: true
      }
    },
    {
      headerName: "Cliente", field: "cliente",
      filter: 'agSetColumnFilter',
      hide: true, rowGroup: true,
      filterParams: {
        value: ['ESENTTIA S A'],
        suppressSorting: true
      }
    },
    {
      headerName: "Modalidad", field: "modalidad",
      filter: 'agSetColumnFilter',
      hide: true,
      filterParams: {
        value: ['IMPORTACION'],
        suppressSorting: true
      }
    },
    { headerName: "Contenedor", field: "contenedor" },
    { headerName: "Tipo de contenedor", field: "tipo_contenedor" },
    { headerName: "Dias en patio", field: "cantidad_dias" },
  
  ];
  
  const columnDefs = [
    { headerName: "id", field: "id", hide: true },
    {
      headerName: "lleno o vacio",
      field: "lleno_vacio",
      filter: 'agSetColumnFilter',
      hide: true,
      filterParams: {
        values: ['LLENO', 'VACIO'],
        suppressSorting: true
      }
    },
    {
      headerName: "Cliente", field: "cliente",
      filter: 'agSetColumnFilter',
      hide: true,
      filterParams: {
        value: ['ESENTTIA S A'],
        suppressSorting: true
      }
    },
    {
      headerName: "Modalidad", field: "modalidad",
      filter: 'agSetColumnFilter',
      hide: true,
      filterParams: {
        value: ['IMPORTACION'],
        suppressSorting: true
      }
    },
    { headerName: "Naviera", field: "naviera" },
    { headerName: "Contenedor", field: "contenedor" },
    {
      headerName: "Tipo de contenedor", field: "tipo_contenedor",
      hide: false, rowGroup: true
  
    },
    { headerName: "Placa", field: "placa" }
  
  ];
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const columnDefsCombinados = [
    { headerName: "Fuente", field: "fuente", rowGroup: true },
    { headerName: "Contenedor", field: "contenedor" },
    { headerName: "Tipo de contenedor", field: "tipo_contenedor", rowGroup: true }, // <-- rowGroup añadido
    {
      headerName: "Pedido",
      field: "pedido",
      valueGetter: params => {
        return params.data.fuente === "Citas Programadas" ? params.data.pedido : null;
      }
    },
    {
      headerName: "Días en patio",
      field: "dias_en_patio",
      valueGetter: params => {
        return params.data.fuente === "Vacios en Patio por Devolución" ? params.data.dias_en_patio : null;
      }
    },
    {
      headerName: "Fecha Cita",
      field: "fecha_cita",
      valueGetter: params => {
        return params.data.fuente === "Citas Programadas" ? params.data.fecha_cita : null;
      }
    },
    {
      headerName: "Producto",
      field: "producto",
      valueGetter: params => {
        return params.data.fuente === "Citas Programadas" ? params.data.producto : null;
      }
    },
    {
      headerName: "Placa",
      field: "placa",
      valueGetter: params => {
        if (params.data.fuente === "Citas Programadas") {
          return params.data.placa_puerto;
        } else if (params.data.fuente === "Contenedores Llenos Pendientes por Entregar - 20 ISO" || params.data.fuente === "Contenedores Llenos Pendientes por Entregar - 40 HC") {
          return params.data.placa;
        } else {
          return null;
        }
      }
    },
    {
      headerName: "Sitio Descargue",
      field: "sitio",
      valueGetter: params => {
        return params.data.fuente === "Citas Programadas" ? params.data.sitio : null;
      }
    },
    {
      headerName: "Naviera",
      field: "naviera",
      valueGetter: params => {
        return params.data.fuente === "Contenedores Llenos Pendientes por Entregar - 20 ISO" || params.data.fuente === "Contenedores Llenos Pendientes por Entregar - 40 HC" ? params.data.naviera : null;
      }
    },
  ];
  
  
  const gridOptionsCombinados = {
    columnDefs: columnDefsCombinados,
    defaultColDef: {
      resizable: true,
      sortable: true,
    },
    groupDisplayType: "groupRows",
    groupDefaultExpanded: 0,
    enableRangeSelection: true,
    paginationPageSize: 50,
  };
  
  Promise.all([
    fetch(`https://esenttiapp-production.up.railway.app/api/registroestadistico`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    }),
    fetch("https://esenttiapp-production.up.railway.app/api/cargarinventario", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
  ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(([dataRegistro, dataInventario]) => {
  
      const datosCitas = dataRegistro.filter(item =>
        item.cliente === "ESENTTIA S A" &&
        item.modalidad === "importacion" &&
        item.fecha_cita !== null &&
        new Date(item.fecha_cita) >= hoy
      ).map(item => ({
        fuente: "Citas Programadas",
        id: item.id_primario,
        contenedor: item.numero_contenedor,
        pedido: item.pedido,
        fecha_cita: item.fecha_cita,
        cliente: item.cliente,
        modalidad: item.modalidad,
        producto: item.producto,
        placa_puerto: item.placa_puerto,
        sitio: item.sitio_cargue_descargue,
      }));
  
      const datosVacios = dataInventario.filter(item =>
        item.lleno_vacio === "VACIO" &&
        item.cliente === "ESENTTIA S A" &&
        item.modalidad === "IMPORTACION"
      ).map(item => ({
        fuente: "Vacios en Patio por Devolución",
        id: item.id,
        contenedor: item.contenedor,
        tipo_contenedor: item.tipo_contenedor,
        dias_en_patio: item.cantidad_dias,
      }));
  
      const datosInventario = dataInventario.filter(item =>
        item.lleno_vacio === "LLENO" &&
        item.cliente === "ESENTTIA S A" &&
        item.modalidad === "IMPORTACION"
      ).map(item => ({
        fuente: item.tipo_contenedor === "40 HC"  // <-- Lógica para la fuente
          ? "Contenedores Llenos Pendientes por Entregar - 40 HC" 
          : "Isotanques Llenos Pendientes por Entregar - 20 ISO",
        id: item.id,
        contenedor: item.contenedor,
        tipo_contenedor: item.tipo_contenedor,
        naviera: item.naviera,
        placa: item.placa,
      }));
  
      const datosCombinados = [...datosCitas, ...datosVacios, ...datosInventario];
  
      gridOptionsCombinados.rowData = datosCombinados;
      const eGridDiv = document.getElementById("tabla-combinada");
      new agGrid.Grid(eGridDiv, gridOptionsCombinados);
    })
    .catch((error) => {
      console.error("Error al cargar los datos:", error);
    });