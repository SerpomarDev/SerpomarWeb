import 'https://cdn.jsdelivr.net/npm/ag-grid-enterprise@32.3.3/dist/ag-grid-enterprise.js';

let gridOptions1;
let gridApi; // Variable global para almacenar la API de la grilla


function getDatesWithHoursAndMinutes() {
  const datesWithHours = [];
  const now = moment();

  // Iteramos para el día actual y el siguiente
  for (let i = 0; i < 2; i++) { 
      const currentDate = moment().add(i, 'days'); 
      for (let j = 0; j < 24; j++) { 
          const hour = j.toString().padStart(2, '0');
          const minute = '00'; 
          const dateString = `${currentDate.format('DD-MM-YYYY')} ${hour}:${minute}`;
          datesWithHours.push(dateString); 
      }
  }
  return datesWithHours;
}

const navieras = {
  1: 'MAERSK',
  2: 'HAPAG LlOYD',
  3: 'ZIM',
  4: 'COSCO',
  5: 'CMA CGM',
  6: 'SHIPLILLY',
  7: 'SEABOARD',
  8: 'ONE LINE',
  9: 'EVERGREEN',
  10: 'MEDITERRANEA',
  11: 'OCEANIC',
  12: 'KING OCEAN',
  13: 'AGUNSA',
  14: 'YAN MING MARINE TRANSPORT'
};


const puertos = {
  0: '',
  1: 'SPRC',
  2: 'CONTECAR',
  3: 'COMPAS',
  4: 'CCTO',
  5: 'PUERTO BAHIA'
};

const columnDefsSS = [
  {
    headerName: '',
    field: 'expandir',
    editable: false,
    cellRenderer: params => {
      const icon = document.createElement('i');
      icon.classList.add('fas', 'fa-chevron-right');
      icon.style.cursor = 'pointer';
      icon.onclick = () => params.node.setExpanded(!params.node.expanded);
      return icon;
    },
    width: 50
  },
  { 
    headerName: "Modalidad", 
    field: "modalidad",
    filter: 'agSetColumnFilter',
    hide: true,
    filterParams: {
      values: ['importacion', 'exportacion'],
      suppressSorting: true
    }
  },
  { headerName: "id", field: "id_primario", hide: true },
  {
    headerName: "SP",
    field: "sp",
    cellRenderer: params => {
      const cellValue = params.value;
      const button = document.createElement('a');
      button.textContent = cellValue;
      button.style.cursor = 'pointer';
      button.style.color = '#6495ED';
      button.style.fontWeight = 'bold';
      button.onclick = () => showOrdenService(params.data.id_primario);
      return button;
    }
  },
  { headerName: "DO", field: "do_pedido" },
  { headerName: "Pedido", field: "pedido" },
  { headerName: "# Contenedores", field: "cantidad" },
  { headerName: "Cliente", field: "cliente" },
  { headerName: "Fecha Notificacion", 
    field: "fecha_notificacion", 
    editable: true,
    dateFormat: 'dd/MM/yyyy', 
  },
  { 
    headerName: "Naviera", 
    field: "naviera", 
    editable: true,
    cellEditor: 'agSelectCellEditor', 
    cellEditorParams: {
      values: Object.values(navieras), // Usa los nombres de las navieras
      cellRenderer: (params) => {
          // Muestra el nombre de la naviera en la celda
          return navieras[params.value] || ''; 
      },
      valueFormatter: (params) => {
          // Formatea el valor para mostrar el nombre en el editor
          return navieras[params.value] || '';
      },
      valueParser: (params) => {
          // Convierte el nombre de la naviera al ID correspondiente
          for (const id in navieras) {
              if (navieras[id] === params.newValue) {
                  return id;
              }
          }
          return null; // O maneja el caso donde no se encuentra la naviera
      }
  }
},
  { headerName: "Puerto", 
    field: "puerto",
    editable: true,
    cellEditor: 'agSelectCellEditor', 
    cellEditorParams: {
      values: Object.values(puertos),
      cellRenderer: (params) => {
      
          return puertos[params.value] || ''; 
      },
      valueFormatter: (params) => {
        
          return puertos[params.value] || '';
      }
  }
  },
  { headerName: "Producto", field: "producto", editable: true },
  { headerName: "Eta", field: "fecha_eta", editable: true },
  { headerName: "Fecha levante", field: "fecha_levante", editable: true },
  { headerName: "Libre hasta", field: "libre_hasta",  editable: true },
  { headerName: "Bodegaje hasta", field: "bodegaje_hasta", editable: true },
 
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
      //console.log("Contenedores obtenidos:", data);
      return data.data.filter(contenedor => contenedor.id_primario === idSolicitudServicio);
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
              hide: false
            },
            { headerName: "ID S.S.", field: "id_primario", hide: true },

            {
              headerName: "Contenedor",
              field: "numero_contenedor",
              cellRenderer: params => {
                const cellValue = params.value;
                const button = document.createElement('a');
                button.textContent = cellValue;
                button.style.cursor = 'pointer';
                button.style.color = '#6495ED';
                button.style.fontWeight = 'bold';
                button.onclick = () => showAsignacion(params.data.id_contenedor);
                return button;
              }
            },

            { headerName: "Tipo Contenedor", field: "tipo" },

            { headerName: "Notificacion Cliente", 
              field: "notificacion_cliente", 
              editable: true, 
              dateFormat: 'dd/MM/yyyy',   
            },

           

         

            { 
              headerName: "Fecha Cliente", 
              field: "fecha_cliente", 
              editable: true,
              dateFormat: 'dd/MM/yyyy', 
            },

            {
              headerName: "Fecha Cita",
              field: "fecha_cita",
              cellEditor: 'agRichSelectCellEditor',
              editable: true,
              cellEditorParams: {
                values: getDatesWithHoursAndMinutes(7), // <-- Llamamos a la nueva función (7 días)
                cellHeight: 50,
              },
              valueFormatter: params => {
                if (params.value) {
                  return params.value; // <-- Mostramos la fecha y hora tal cual
                }
                return '';
              }
            },
           

            { headerName: "Conductor Puerto", field: "conductor_puerto" ,editable: false},
            { headerName: "Placa Puerto", field: "placa_puerto",editable: false},
            { headerName: "Conductor traslado", field: "conductor_traslado",editable: false},
            { headerName: "Placa traslado", field: "placa_traslado" ,editable: false},
            { headerName: "Conductor inspeccion", field: "conductor_inspeccion",editable: false},
            { headerName: "Placa inspeccion", field: "placa_inspeccion",editable: false },
            { headerName: "Sitio Cargue/Descargue", field: "sitio_cargue_descargue", editable: true },

            { headerName: "Fecha Descargue", 
              field: "fecha_cargue", 
              editable: true, 
              dateFormat: 'dd/MM/yyyy', 
            },

            { headerName: "Sitio devolucion", field: "sitio", editable: true  },

            { headerName: "Fecha Devolucion", 
              field: "fecha_devolucion", 
              editable: true, 
              dateFormat: 'dd/MM/yyyy',   
            },

            { headerName: "Placa Patio", field: "placa_patio" },
            { headerName: "Conductor Patio", field: "conductor_patio" },

            { headerName: "Fecha Manifiesto", 
              field: "fecha_manifiesto", 
              editable: true,
              dateFormat: 'dd/MM/yyyy',   
            },

            { headerName: "Manifiesto", field: "manifiesto", editable: true  },

            { headerName: "Fecha Remesa", 
              field: "fecha_remesa", 
              editable: true, 
              dateFormat: 'dd/MM/yyyy',   
            },

            { headerName: "Remesa", field: "remesa", editable: true  },

            { headerName: "Patio serpomar", field: "patio", editable: true  },
            { headerName: "Comentarios", field: "comentario", editable: true  },
            { headerName: "Sitio Inspeccion", field: "sitio_inspeccion", editable: true },
            //{ headerName: "Placa Inspeccion", field: "placa_inspeccion", editable: true },

            { headerName: "Fecha Inspeccion", 
              field: "fecha_inspeccion", 
              editable: true, 
              dateFormat: 'dd/MM/yyyy',  
            },

            { headerName: "Peso", field: "Peso", editable: true },

            { 
              headerName: "Tipo servicio", 
              field: "tipo_servicio", 
              editable: true,
              cellEditor: 'agSelectCellEditor', // Usa el editor de celdas select de ag-Grid
              cellEditorParams: {
                values: [' ','ITR', 'TRANSPORTE']
              } 
            },

            { headerName: "Estado", field: "estado" }

          ],
          defaultColDef: {
            flex: 1,
            resizable: true,
            sortable: true,
            filter: true
          },
          onCellValueChanged: (event) => {
            const idContenedor = event.data.id_contenedor;
            const fieldName = event.colDef.field;
            let newValue = event.newValue; // Declaramos newValue con let

            Swal.fire({
              title: 'Actualizando...',
              text: "Se actualizará la información en la base de datos",
              icon: 'info',
              timer: 1000,
              timerProgressBar: true,
              toast: true,
              position: 'top-end',
              showConfirmButton: false
          });

       

            const apiUrl = `https://esenttiapp-production.up.railway.app/api/updatecontenedorbysoliservi/${idContenedor}`;

              // Convertir la fecha si el campo es fecha_cita
              if (fieldName === 'fecha_cita') {
                newValue = moment(newValue, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss');
            }

            const updatedData = {
              id_primario: event.data.id_primario,
              [fieldName]: newValue // Usamos newValue convertido
          };

            fetch(apiUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
              },
              body: JSON.stringify(updatedData)
            })
              .then(response => {
                if (!response.ok) {
                  return response.json().then(errorData => {
                    throw new Error(`Error al actualizar datos: ${errorData.message || response.statusText}`);
                  });
                }

                Swal.fire({
                  title: '¡Actualizado!',
                  text: 'El registro ha sido actualizado.',
                  icon: 'success',
                  timer: 1000,
                  timerProgressBar: true,
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false
                });

                const rowNode = event.node;
                const updatedRowData = { ...rowNode.data };
                updatedRowData[fieldName] = newValue;
                rowNode.setData(updatedRowData);

              })
              .catch(error => {
                console.error('Error al actualizar datos:', error);

                Swal.fire({
                  title: 'Error',
                  text: error.message,
                  icon: 'error',
                });
              });
          },
          detailRowAutoHeight: true
        },
        getDetailRowData: (params) => {
          getContenedoresDetail(params.data.id_primario)
            .then(contenedores => {
              params.successCallback(contenedores);
            });
        }
      },

      onCellValueChanged: (event) => {
        const id_primario = event.data.id_primario;
        const fieldName = event.colDef.field;
        const newValue = event.newValue;

        // Validar los datos (agregar validaciones según tus necesidades)
        if (fieldName === 'fecha_levante' || fieldName === 'fecha_eta' ||
          fieldName === 'fecha_notificacion' || fieldName === 'fecha_documental' ||
          fieldName === 'fecha_cutoff_fisico' || fieldName === 'bodegaje_hasta') {
          // Validar formato de fecha
          if (!/^\d{4}-\d{2}-\d{2}$/.test(newValue)) {
            Swal.fire({
              title: 'Error',
              text: 'Formato de fecha inválido. Debe ser YYYY-MM-DD',
              icon: 'error',
            });
            return; // Detener la actualización
          }
        }

        Swal.fire({
          title: 'Actualizando...',
          text: "Se actualizará la información",
          icon: 'info',
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          position: 'top-end',
          showConfirmButton: false
        });

        const apiUrl = `https://esenttiapp-production.up.railway.app/api/solicitudservicios/${id_primario}`;

        // Mapear los nombres de los campos
        const fieldMapping = {
          'sp': 'sp',
          'do_pedido': 'do_pedido',
          'cantidad': 'cantidad_contenedor',
          'modalidad': 'imp_exp',
          'fecha_eta': 'fecha_eta',
          'fecha_levante': 'fecha_levante',
          'fecha_notificacion': 'fecha_notificacion',
          'fecha_documental': 'fecha_documental',
          'fecha_cutoff_fisico': 'fecha_cutoff_fisico',
          'libre_hasta': 'libre_hasta',
          'bodegaje_hasta': 'bodegaje_hasta',
          'naviera': 'naviera',
          'id_naviera': 'id_naviera',

          'booking': 'booking_number',
          'producto': 'observaciones',
          'puerto': 'puerto'
        };

        // Construir updatedData con los nombres de campos mapeados
        const updatedData = {};
        const mappedFieldName = fieldMapping[fieldName];
        if (mappedFieldName) {
          updatedData[mappedFieldName] = newValue;
        } else {
          console.warn(`No se encontró mapeo para el campo: ${fieldName}`);
          return; // Detener la actualización si no hay mapeo
        }

        fetch(apiUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
          },
          body: JSON.stringify(updatedData)
        })
          .then(response => {
            if (!response.ok) {
              return response.json().then(errorData => {
                // Mostrar mensaje de error específico
                Swal.fire({
                  title: 'Error',
                  text: `Error al actualizar ${fieldName}: ${errorData.message || response.statusText}`,
                  icon: 'error',
                });
                throw new Error(`Error al actualizar datos: ${errorData.message || response.statusText}`);
              });
            }

            Swal.fire({
              title: '¡Actualizado!',
              text: 'El registro ha sido actualizado.',
              icon: 'success',
              timer: 1000,
              timerProgressBar: true,
              toast: true,
              position: 'top-end',
              showConfirmButton: false
            });

            const rowNode = event.node;
            const updatedRowData = { ...rowNode.data };
            updatedRowData[fieldName] = newValue;
            rowNode.setData(updatedRowData);
          })
          .catch(error => {
            console.error('Error al actualizar datos:', error);
            Swal.fire({
              title: 'Error',
              text: error.message,
              icon: 'error',
            });
          });
      },
      onGridReady: (params) => {
        gridApi = params.api;

        // Aplicar el filtro de modalidad
        gridApi.setFilterModel({
          'modalidad': {
            filterType: 'set',
            values: ['importacion']
          }
        });

        

        const searchInput = document.querySelector('input[type="search"]');

        searchInput.addEventListener('input', () => {
          const searchTerm = searchInput.value.toLowerCase();

          function searchNodes(nodes) {
            nodes.forEach(node => {
              const data = node.data;

              let match = (data.do_pedido && data.do_pedido.toLowerCase().includes(searchTerm)) ||
                (data.pedido && data.pedido.toLowerCase().includes(searchTerm));

              if (!match && node.detailGridInfo) {
                const detailGridApi = node.detailGridInfo.api;
                detailGridApi.forEachNode(detailNode => {
                  const detailData = detailNode.data;
                  if (detailData.numero_contenedor && detailData.numero_contenedor.toLowerCase().includes(searchTerm)) {
                    match = true;
                    node.setExpanded(true);
                  }
                });
              }

              node.visible = match;
            });
          }

          searchNodes(gridApi.getRenderedNodes());
          gridApi.onFilterChanged();
        });
      }
    };

    const eGridDiv = document.getElementById('Solicitudservicios');
    agGrid.createGrid(eGridDiv, gridOptions1);
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
  });

function showOrdenService(id) {
  window.open(`/view/contenedor/create.html?id=${id}`, '_blank');
}

function showAsignacion(id) {
  window.open(`/view/modal/modal.html?id=${id}`, '_blank');
}