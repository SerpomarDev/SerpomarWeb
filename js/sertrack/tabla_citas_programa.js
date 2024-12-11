const columnDefsRE = [
  { headerName: "ID Primario", field: "id_primario", hide: true },
  { headerName: "Número Contenedor", field: "numero_contenedor" },
  { headerName: "Pedido", field: "pedido" },
  { headerName: "Fecha Cita", field: "fecha_cita" },
  { headerName: "Cliente", field: "cliente", hide: true },
  { headerName: "Modalidad", field: "modalidad", hide: true , rowGroup: true  },
  { headerName: "Producto", field: "producto"}, 
  { headerName: "Placa Puerto", field: "placa_puerto" },
  { headerName: "Sitio Descargue", field: "sitio_cargue_descargue" },
];

const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

fetch(`https://esenttiapp-production.up.railway.app/api/registroestadistico`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  },
})
.then((response) => response.json())
.then((data) => {
  const datosFiltrados = data.filter(item => 
    item.cliente === "ESENTTIA S A" && 
    item.modalidad === "importacion" && 
    item.fecha_cita !== null &&
    new Date(item.fecha_cita) >= hoy 
  );

  const processedData = datosFiltrados.map((item) => {
    return {
      id_primario: item.id_primario,
      numero_contenedor: item.numero_contenedor,
      pedido: item.pedido,
      fecha_cita: item.fecha_cita,
      cliente: item.cliente,
      modalidad: item.modalidad,
      producto: item.producto,
      placa_puerto: item.placa_puerto,
      sitio_cargue_descargue: item.sitio_cargue_descargue
    };
  });

  const gridOptions = {
    columnDefs: columnDefsRE,
    defaultColDef: {
      resizable: true,
      sortable: true,

    },
    groupDisplayType: "groupRows",
    groupDefaultExpanded: 0, 
    enableRangeSelection: true,
    paginationPageSize: 50,
    rowData: processedData, 
  };

  const eGridDiv = document.getElementById("citas-programadas");
  new agGrid.Grid(eGridDiv, gridOptions);
})
.catch((error) => {
  console.error("Error al cargar los datos:", error);
});