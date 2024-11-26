import 'https://cdn.jsdelivr.net/npm/ag-grid-enterprise@32.3.3/dist/ag-grid-enterprise.js';

let gridOptions1;

const columnDefsSS = [
  {
    headerName: '',
    field: 'expandir',
    cellRenderer: params => {
      const icon = document.createElement('i');
      icon.classList.add('fas', 'fa-chevron-right');
      icon.style.cursor = 'pointer';
      icon.onclick = () => params.node.setExpanded(!params.node.expanded);
      return icon;
    },
    width: 50
  },
  { headerName: "id", field: "id", hide: true },
  {
    headerName: "SP",
    field: "sp",
    valueGetter: params => {
      return params.data.sp + params.data.id;
    }
  },
  { headerName: "DO", field: "do_pedido" },
  { headerName: "Pedido", field: "pedido" },
  { headerName: "# Contenedores", field: "cantidad_contenedor" },
  { headerName: "Cliente", field: "id_cliente" },
  { headerName: "Modalidad", field: "imp_exp" },
  { headerName: "Fecha Levante", field: "fecha_levante" },
  { headerName: "Fecha ETA", field: "fecha_eta" },
  { headerName: "Fecha Notificacion", field: "fecha_notificacion" },
  { headerName: "Fecha Documental", field: "fecha_documental" },
  { headerName: "Fecha Cutoff Fisico", field: "fecha_cutoff_fisico" },
  { headerName: "Producto", field: "observaciones" },
  { headerName: "Booking", field: "booking_number" },
  { headerName: "Libre Hasta", field: "libre_hasta" },
  { headerName: "Bodegaje Hasta", field: "bodegaje_hasta" },
  { headerName: "Naviera", field: "id_naviera" },
  { headerName: "Puerto", field: "puerto" },
  { headerName: "inactivo", field: "inactivo", hide: true },
  { headerName: "Estado", field: "estado", hide: true },
];

// Función para obtener los datos de los contenedores hijos (modificada)
function getContenedoresDetail(idSolicitudServicio) {
  return fetch("https://esenttiapp-production.up.railway.app/api/contenedores", {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
  })
    .then(response => response.json())
    .then(data => {
      return data
        .filter(contenedor => contenedor.id_solicitud_servicio === idSolicitudServicio)
        .map(contenedor => ({
          ...contenedor, 
          ordenesServicio: [] 
        }));
    });
}

// Función para obtener las órdenes de servicio hijas de un contenedor (CORREGIDA)
function getOrdenesServicioDetail(contenedor) {
  return fetch("https://esenttiapp-production.up.railway.app/api/ordenservicios", {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
  })
    .then(response => response.json())
    .then(data => {
      // Filtrar por id_contenedor (corregido)
      contenedor.ordenesServicio = data.filter(ordenServicio => ordenServicio.id_contenedor === contenedor.id); 
    });
}

fetch("https://esenttiapp-production.up.railway.app/api/solicitudservicios", {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
  }
})
  .then(response => response.json())
  .then(data => {
    const filteredData = data.filter(Solicitudservicios => Solicitudservicios.inactivo === 0 && Solicitudservicios.estado === 'ACEPTADO');
    gridOptions1 = {
      columnDefs: columnDefsSS,
      defaultColDef: {
        resizable: true,
        sortable: false,
        filter: "agTextColumnFilter",
        floatingFilter: true,
        flex: 1,
        minWidth: 100,
        editable: true
      },

      rowSelection: 'none',

      pagination: true,
      paginationPageSize: 20,
      rowData: filteredData,
      masterDetail: true,
      detailCellRendererParams: {
        detailGridOptions: {
          columnDefs: [
            { headerName: "Id", field: "id", hide: false },
            { headerName: "Contenedor", field: "nu_serie" },
            { headerName: "Id Tipo Contenedor", field: "id_tipo_contenedor" },
            { headerName: "Tara", field: "tara" },
            { headerName: "Payload", field: "payload" }
          ],
          defaultColDef: {
            flex: 1,
            resizable: true,
            sortable: true,
            filter: true
          },

          masterDetail: true,
          detailCellRendererParams: {
            detailGridOptions: {
              columnDefs: [
                { headerName: "id", field: "id", hide: false },
                { headerName: "ID C.", field: "id_contenedor", hide: false },
                { headerName: "Fecha Cargue", field: "fecha_cargue" },
                { headerName: "Fecha Devolucion", field: "fecha_devolucion" },
                { headerName: "Sitio", field: "sitio" },
                { headerName: "Manifiesto", field: "manifiesto" },
                { headerName: "Fecha Manifiesto", field: "fecha_manifiesto" },
                { headerName: "Remesa", field: "remesa" },
                { headerName: "Fecha Remesa", field: "fecha_remesa" },
                { headerName: "Fecha Cita", field: "fecha_cita" },
                { headerName: "Fecha Cliente", field: "fecha_cliente" },
                { headerName: "Sitio Cargue/Descargue", field: "sitio_cargue_descargue" },
                { headerName: "Patio", field: "patio" },
              ],
              defaultColDef: {
                flex: 1,
                resizable: true,
                sortable: true,
                filter: true
              },
            },
            getDetailRowData: (params) => {
              params.successCallback(params.data.ordenesServicio); 
            }
          }
        },
        getDetailRowData: (params) => {
          getContenedoresDetail(params.data.id)
            .then(contenedores => {
              const promises = contenedores.map(contenedor => getOrdenesServicioDetail(contenedor));
              return Promise.all(promises)
                .then(() => {
                  params.successCallback(contenedores);
                });
            });
        }
      },

      onCellValueChanged: (event) => {
        // ... (código para actualizar la solicitud de servicio)
      }
    };

    const eGridDiv = document.getElementById('Solicitudservicios');
    const gridApi = agGrid.createGrid(eGridDiv, gridOptions1);
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
  });