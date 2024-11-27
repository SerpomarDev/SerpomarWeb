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
  { headerName: "id", field: "id_primario", hide: true },
  {
    headerName: "SP",
    field: "sp",
    valueGetter: params => {
      return params.data.sp;
    },
    cellRenderer: params => {
      const cellValue = params.value;
      const button = document.createElement('a');
      button.textContent = cellValue;
      button.style.cursor = 'pointer';
      button.style.color = '#6495ED';
      button.style.fontWeight = 'bold';
      button.onclick = () => showOrdenService(params.data.id);
      return button;
    }
  },
  { headerName: "DO", field: "do_pedido" },
  { headerName: "Pedido", field: "pedido" },
  { headerName: "# Contenedores", field: "cantidad" },
  { headerName: "Cliente", field: "cliente" },
  { headerName: "Modalidad", field: "modalidad" },
  { headerName: "Fecha Levante", field: "fecha_levante" },
  { headerName: "Fecha ETA", field: "fecha_eta" },
  { headerName: "Fecha Notificacion", field: "fecha_notificacion" },
  { headerName: "Fecha Documental", field: "fecha_documental" },
  { headerName: "Fecha Cutoff Fisico", field: "fecha_cutoff_fisico" },
  { headerName: "Producto", field: "producto" },
  { headerName: "Booking", field: "booking" },
  { headerName: "Libre Hasta", field: "libre_hasta" },
  { headerName: "Bodegaje Hasta", field: "bodegaje_hasta" },
  { headerName: "Patio Naviera", field: "patio_naviero" },
  { headerName: "Naviera", field: "naviera" },
  { headerName: "Puerto", field: "puerto" },
  { headerName: "inactivo", field: "inactivo", hide: true },
  { headerName: "Estado", field: "estado", hide: true },
  // Nueva columna para las acciones (opcional, si aún la necesitas)
  {
    headerName: 'Acciones',
    field: 'acciones',
    cellRenderer: params => {
      const contenedor = params.data;
      const icon = document.createElement('i');
      icon.classList.add('fas', 'fa-chevron-right');
      icon.style.cursor = 'pointer';
      icon.onclick = () => {
        mostrarOrdenServicio(contenedor);
      };
      return icon;
    },
    width: 100
  }
];

function getContenedoresDetail(idSolicitudServicio) {
  return fetch("https://esenttiapp-production.up.railway.app/api/contenedorregistro", {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al obtener contenedores');
      }
      return response.json();
    })
    .then(data => {
      console.log("Contenedores obtenidos:", data);
      return data
        .filter(contenedor => contenedor.soli_servi === idSolicitudServicio)
        .map(contenedor => ({
          ...contenedor,
          ordenesServicio: []
        }));
    })
    .catch(error => {
      console.error("Error en getContenedoresDetail:", error);
      Swal.fire(
        'Error',
        'No se pudieron obtener los contenedores.',
        'error'
      );
      return [];
    });
}

function getOrdenesServicioDetail(contenedor) {
  return fetch("https://esenttiapp-production.up.railway.app/api/ordenservicioregistro", {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al obtener órdenes de servicio');
      }
      return response.json();
    })
    .then(data => {
      console.log("Órdenes de servicio obtenidas:", data);
      const ordenServicio = data.find(ordenServicio => ordenServicio.id_contenedor === contenedor.id_contenedor);
      contenedor.ordenesServicio = ordenServicio ? [ordenServicio] : [];
      console.log("Contenedor con órdenes de servicio:", contenedor);
    })
    .catch(error => {
      console.error("Error en getOrdenesServicioDetail:", error);
      Swal.fire(
        'Error',
        'No se pudieron obtener las órdenes de servicio.',
        'error'
      );
    });
}

// Función para mostrar la orden de servicio en un modal con formulario editable
function mostrarOrdenServicio(contenedor) {
  const ordenServicio = contenedor.ordenesServicio[0];

  if (ordenServicio) {
    // Construir el formulario HTML
    const formularioHTML = `
      <form id="formularioOrdenServicio">
        <div class="form-group">
          <label for="id">ID Orden de Servicio:</label>
          <input type="text" class="form-control" id="id" value="${ordenServicio.id}" readonly> 
        </div>
        <div class="form-group">
          <label for="fecha_cargue">Fecha Cargue:</label>
          <input type="text" class="form-control" id="fecha_cargue" value="${ordenServicio.fecha_cargue}">
        </div>
        <div class="form-group">
          <label for="sitio">Sitio:</label>
          <input type="text" class="form-control" id="sitio" value="${ordenServicio.sitio}">
        </div>
        // ... agregar más campos del formulario
      </form>
    `;

    Swal.fire({
      title: `Orden de Servicio para Contenedor ${contenedor.numero_contenedor}`,
      html: formularioHTML,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return new Promise((resolve) => {
          const formulario = document.getElementById('formularioOrdenServicio');
          const datosEditados = {
            id: formulario.elements['id'].value,
            fecha_cargue: formulario.elements['fecha_cargue'].value,
            sitio: formulario.elements['sitio'].value,
            // ... obtener los valores de los demás campos
          };
          resolve(datosEditados);
        });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí puedes enviar los datos editados a tu API para guardarlos
        console.log('Datos editados:', result.value);
        // ... lógica para enviar los datos a la API
      }
    });
  } else {
    Swal.fire({
      title: 'Información',
      text: 'No se encontró una orden de servicio para este contenedor.',
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
  }
}

fetch("https://esenttiapp-production.up.railway.app/api/soliserviresgistro", {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
  }
})
  .then(response => response.json())
  .then(data => {

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
      rowData: data,
      masterDetail: true,
      detailCellRendererParams: {
        detailGridOptions: {
          columnDefs: [
            { 
              headerName: "Id", 
              field: "id_contenedor", 
              cellRenderer: params => {
                const contenedor = params.data;
                const idContenedor = params.value;
                const link = document.createElement('a');
                link.textContent = idContenedor;
                link.style.cursor = 'pointer';
                link.style.color = '#6495ED'; 
                link.onclick = () => {
                  mostrarOrdenServicio(contenedor);
                };
                return link;
              }
            },
            { headerName: "ID S.S.", field: "soli_servi" },
            { headerName: "Contenedor", field: "numero_contenedor" },
            { headerName: "Id Tipo Contenedor", field: "id_tipo_contenedor" },
            { headerName: "Tara", field: "tara" },
            { headerName: "Payload", field: "payload" },
            { headerName: "Estado", field: "estado" }
          ],
          defaultColDef: {
            flex: 1,
            resizable: true,
            sortable: true,
            filter: true
          },
          detailRowAutoHeight: true 
        },
        getDetailRowData: (params) => {
          console.log("Params para contenedores:", params);
          getContenedoresDetail(params.data.id_primario)
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
        // ... (onCellValueChanged sin cambios) ...
      }
    };

    const eGridDiv = document.getElementById('Solicitudservicios');
    const gridApi = agGrid.createGrid(eGridDiv, gridOptions1);
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
  });