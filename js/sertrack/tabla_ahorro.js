let gridOptions;

const columnDefs = [
  
  { headerName: "Contenedor", field: "contenedor" },
  { headerName: "Modalidad", field: "modalidad", hide: true },
  { headerName: "Estado", field: "lleno", hide: true},
  { headerName: "Cliente", field: "cliente", hide: true },
  { headerName: "Fecha Hora Entrada", field: "fecha_hora_entrada" },
  { headerName: "Fecha Hora Salida", field: "fecha_hora_salida" },
  { headerName: "Dias en piso", field: "cantidad_dias" },
  { headerName: "Bodegaje Generado", field: "bodegaje_generado" },
  { headerName: "Tipo Contenedor", field: "tipo_contenedor" },
  { headerName: "Naviera", field: "naviera" },
  { headerName: "Costo Bodegaje", field: "costo_bodegaje" },
  { headerName: "Costo Serpomar", field: "costo_serpomar" }

];


fetch("https://esenttiapp-production.up.railway.app/api/ahorrobycliente", {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
  }
})
  .then(response => response.json())
  .then(data => {
    // Filtrar los datos aquí
    const filteredData = data.data.filter(item =>
        item.cliente === "ESENTTIA S A" &&
        item.modalidad === "EXPORTACION" &&
        item.lleno === "LLENO"
      );
  

    const processedData = filteredData.map(Ahorrocliente => {
      return {
        contenedor: Ahorrocliente.contenedor,
        modalidad: Ahorrocliente.modalidad,
        lleno: Ahorrocliente.lleno,
        cliente: Ahorrocliente.cliente,
        fecha_hora_entrada: Ahorrocliente.fecha_hora_entrada,
        fecha_hora_salida: Ahorrocliente.fecha_hora_salida,
        cantidad_dias: Ahorrocliente.cantidad_dias,
        bodegaje_generado: Ahorrocliente.bodegaje_generado,
        tipo_contenedor: Ahorrocliente.tipo_contenedor,
        naviera: Ahorrocliente.naviera,
        costo_bodegaje: Ahorrocliente.costo_bodegaje,
        costo_serpomar: Ahorrocliente.costo_serpomar
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
      rowData: processedData
    };

    const eGridDiv = document.getElementById('ahorrocliente');
    new agGrid.Grid(eGridDiv, gridOptions);
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
  });

