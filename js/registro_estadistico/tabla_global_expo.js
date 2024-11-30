import 'https://cdn.jsdelivr.net/npm/ag-grid-enterprise@32.3.3/dist/ag-grid-enterprise.js';

let gridOptions1;
let gridApi; // Variable global para almacenar la API de la grilla

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
    {
        headerName: '+ contenedor',
        cellRenderer: params => {
            const button = document.createElement('button');
            button.innerHTML = '+';
            button.classList.add('btn', 'btn-primary');
            button.onclick = () => {
                mostrarFormularioContenedor(params.data.id_primario); 
            };
            return button;
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
    { headerName: "Fecha Notificacion", field: "fecha_notificacion", editable: true },
    { headerName: "Fecha Documental", field: "fecha_documental", editable: true },
    { headerName: "Fecha Cutoff Fisico", field: "fecha_cutoff_fisico", editable: true },
    { headerName: "Booking", field: "booking", editable: true },
    { headerName: "Naviera", field: "naviera", editable: true },
    { headerName: "Patio Naviera", field: "patio_naviero", editable: true },
    { headerName: "Producto", field: "producto", editable: true },
    { headerName: "Naviera", field: "naviera", editable: true },
    { headerName: "Motonave", field: "motonave", editable: true },
    { headerName: "Uvi", field: "uvi", editable: true },
    { headerName: "Sae", field: "sae", editable: true },
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
                        hide: true
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
                    { headerName: "Tara", field: "tara", editable: true },
                    { headerName: "Payload", field: "payload", editable: true },
                    { headerName: "Fecha Cliente", field: "fecha_cliente", editable: true },
                    { headerName: "Notificacion Cliente", field: "notificacion_cliente", editable: true },
                    { headerName: "Fecha Retiro Vacio", field: "fecha_vacio", editable: true },
                    { headerName: "Conductor Patio", field: "conductor_patio" },
                    { headerName: "Placa Patio", field: "placa_patio" },
                    { headerName: "Conductor Puerto", field: "conductor_puerto" },
                    { headerName: "Placa Puerto", field: "placa_puerto" },
                    { headerName: "Tipo Contenedor", field: "tipo" },
                    { headerName: "Fecha Cargue", field: "fecha_cargue", editable: true },
                    { headerName: "Sitio Cargue/Descargue", field: "sitio_cargue_descargue", editable: true },
                    { headerName: "Fecha Cita", field: "fecha_cita", editable: true },
                    
                    { headerName: "Fecha Manifiesto", field: "fecha_manifiesto", editable: true },
                    { headerName: "Manifiesto", field: "manifiesto", editable: true },
                    { headerName: "Fecha Remesa", field: "fecha_remesa", editable: true },
                    { headerName: "Remesa", field: "remesa", editable: true },
                    // { headerName: "Sitio", field: "sitio" },
                    { headerName: "Patio serpomar", field: "patio", editable: true },
                    { headerName: "Observaciones", field: "observaciones", editable: true },
                    { headerName: "Sello/PT", field: "sello", editable: true },
                    { headerName: "Fecha hora Salida", field: "fecha_salida", editable: true },
                    { headerName: "Fecha hora Ingreso plata", field: "ingreso_planta", editable: true },
                    { headerName: "Estado", field: "estado" },
                    
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
                    const newValue = event.newValue;

                    Swal.fire({
                        title: 'Actualizando...',
                        text: "Se actualizará la información en la base de datos",
                        icon: 'info',
                    });

                    const apiUrl = `https://esenttiapp-production.up.railway.app/api/updatecontenedorbysoliservi/${idContenedor}`;

                    const updatedData = {
                        id_primario: event.data.id_primario,
                        [fieldName]: newValue
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
                console.log("Params para contenedores:", params);
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
              text: "Se actualizará la información en la base de datos",
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
                    values: ['exportacion']
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

            // Llamar a actualizarGrilla() después de que la grilla esté lista
            actualizarGrilla(); 
        }
    };

    const eGridDiv = document.getElementById('Solicitudservicios');
    agGrid.createGrid(eGridDiv, gridOptions1);
})
.catch(error => {
    console.error("Error al cargar los datos:", error);
});

function mostrarFormularioContenedor(id_primario) {
    Swal.fire({
        title: 'Crear contenedor',
        html: `
            <input type="hidden" name="id_solicitud_servicio" id="id_solicitud_servicio" value="${id_primario}">
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="id_tipo_contenedor" class="form-label">Tipo Contenedor</label>
                        <select name="id_tipo_contenedor" id="id_tipo_contenedor" class="form-control">
                            <option value="">Seleccione</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="nu_serie" class="form-label">Numero Contenedor</label>
                        <input type="text" id="nu_serie" name="nu_serie" class="form-control">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="tara" class="form-label">Tara</label>
                        <input type="text" id="tara" name="tara" class="form-control">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="payload" class="form-label">Payload</label>
                        <input type="text" id="payload" name="payload" class="form-control">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="peso" class="form-label">Peso</label>
                        <input type="text" id="peso" name="peso" class="form-control">
                    </div></div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        preConfirm: () => {
            // Obtener los valores del formulario
            const id_solicitud_servicio = document.getElementById('id_solicitud_servicio').value;
            const id_tipo_contenedor = document.getElementById('id_tipo_contenedor').value;
            const nu_serie = document.getElementById('nu_serie').value;
            const tara = document.getElementById('tara').value;
            const payload = document.getElementById('payload').value;
            const peso = document.getElementById('peso').value;

            // Validaciones (agregar las necesarias)
            if (!id_tipo_contenedor || !nu_serie || !tara || !payload) {
                Swal.showValidationMessage('Por favor, completa todos los campos');
                return false;
            }

            // Retornar los datos del formulario
            return {
                id_solicitud_servicio,
                id_tipo_contenedor,
                nu_serie,
                tara,
                payload,
                peso
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Enviar los datos del formulario al servidor
            const formData = result.value;
            fetch('https://esenttiapp-production.up.railway.app/api/contenedores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(`Error al crear contenedor: ${errorData.message || response.statusText}`);
                    });
                }
                return response.json();
            })
            .then(data => {
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

                // Actualizar la grilla (puedes recargar la grilla o agregar la nueva fila manualmente)
                // actualizarGrilla(); // Ya no es necesario llamarlo aquí

                // Recargar la página
                location.reload();
            })
            .catch(error => {
                console.error('Error al crear contenedor:', error);
                Swal.fire({
                    title: 'Error',
                    text: error.message,
                    icon: 'error',
                });
            });
        }
    });

    // Obtener los tipos de contenedores y poblar el select
    fetch("https://esenttiapp-production.up.railway.app/api/tipocontenedores", {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener tipos de contenedores');
        }
        return response.json();
    })
    .then(data => {
        const selectTipoContenedor = document.getElementById('id_tipo_contenedor');
        
        // Corrección: iterar directamente sobre el array 'data'
        data.forEach(tipoContenedor => { 
            const option = document.createElement('option');
            option.value = tipoContenedor.id; 
            option.text = tipoContenedor.tipo; 
            selectTipoContenedor.add(option);
        });
    })
    
    .catch(error => {
        console.error("Error al obtener tipos de contenedores:", error);
        Swal.fire(
            'Error',
            'No se pudieron obtener los tipos de contenedores.',
            'error'
        );
    });
}

function showOrdenService(id) {
    window.open(`/view/contenedor/create.html?id=${id}`, '_blank');
}

function showAsignacion(id) {
    window.open(`/view/modal/modal.html?id=${id}`, '_blank');
}

function actualizarGrilla() {
    // Verificar si gridOptions1.api está definido antes de llamar a refreshCells()
    
    if (gridOptions1 && gridOptions1.api) {
        gridOptions1.api.refreshCells(); 
    } else {
        console.warn("La grilla aún no está inicializada.");
    }
}