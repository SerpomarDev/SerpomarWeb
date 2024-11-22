let gridOptions1;

const columnDefsSS = [
    { headerName: "id", field: "id", hide: false },
    {
        headerName: "SP",
        field: "sp",
        cellRenderer: 'agGroupCellRenderer',
        detailCellRendererParams: {
            detailGridOptions: {
                columnDefs: [
                    { field: 'id', headerName: 'ID Contenedor' },
                    { field: 'nu_serie', headerName: 'Contenedor' },
                    { field: 'id_tipo_contenedor', headerName: 'Tipo Contenedor' },
                    { field: 'tara', headerName: 'Tara' },
                    { field: 'payload', headerName: 'Payload' }
                ],
                masterDetail: true, 
                detailCellRendererParams: {
                    detailGridOptions: {
                        columnDefs: [
                            { field: 'id', headerName: 'ID Orden' },
                            { field: 'fecha_cargue', headerName: 'Fecha Cargue' },
                            { field: 'fecha_devolucion', headerName: 'Fecha Devolución' },
                            { field: 'sitio', headerName: 'Sitio' },
                            { field: 'manifiesto', headerName: 'Manifiesto' },
                            { field: 'fecha_manifiesto', headerName: 'Fecha Manifiesto' },
                            { field: 'remesa', headerName: 'Remesa' },
                            { field: 'fecha_remesa', headerName: 'Fecha Remesa' },
                            { field: 'fecha_cita', headerName: 'Fecha Cita' },
                            { field: 'fecha_cliente', headerName: 'Fecha Cliente' },
                            { field: 'sitio_cargue_descargue', headerName: 'Sitio Cargue/Descargue' },
                            { field: 'patio', headerName: 'Patio' }
                        ]
                    },
                    getDetailRowData: params => {
                        params.successCallback(params.data.ordenesServicios);
                    }
                }
            },
            getDetailRowData: params => {
                params.successCallback(params.data.contenedores);
            }
        }
    },
    { headerName: "DO", field: "do_pedido" },
    { headerName: "Pedido", field: "pedido" },
    { headerName: "# Contenedores", field: "cantidad_contenedor", hide: true },
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

Promise.all([
    fetch("https://esenttiapp-production.up.railway.app/api/solicitudservicios", {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        }
    }).then(response => response.json()),
    fetch("https://esenttiapp-production.up.railway.app/api/contenedores", {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        }
    }).then(response => response.json()),
    fetch("https://esenttiapp-production.up.railway.app/api/ordenservicios", {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        }
    }).then(response => response.json())
])
    .then(([solicitudServiciosData, contenedoresData, ordenesServiciosData]) => {

        const filteredDataSS = solicitudServiciosData.filter(ss => ss.inactivo === 0 && ss.estado === 'ACEPTADO');

        const processedDataSS = filteredDataSS.map(ss => {
            const contenedoresSS = contenedoresData.filter(c => c.id_solicitud_servicio === ss.id);

            const processedContenedores = contenedoresSS.map(c => {
                const ordenesC = ordenesServiciosData.filter(os => os.id_contenedor === c.id);
                return { ...c, ordenesServicios: ordenesC };
            });

            return {
                ...ss,
                contenedores: processedContenedores
            };
        });


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
            rowSelection: 'multiple',
            enableRangeSelection: true,
            suppressMultiRangeSelection: true,
            pagination: true,
            paginationPageSize: 20,
            rowData: processedDataSS, 

            onCellValueChanged: (event) => {
                const updatedRowData = event.data;
                const id = updatedRowData.id;

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

                setTimeout(() => {
                    fetch(`https://esenttiapp-production.up.railway.app/api/solicitudservicios/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
                        },
                        body: JSON.stringify(updatedRowData)
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error al actualizar datos');
                            }
                            console.log('Datos actualizados correctamente');
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
                        })
                        .catch(error => {
                            console.error('Error al actualizar datos:', error);
                            Swal.fire(
                                'Error',
                                'No se pudo actualizar el registro.',
                                'error'
                            );
                        });
                }, 2000);
            },

            masterDetail: true
        };

        const eGridDiv = document.getElementById('Solicitudservicios');
        new agGrid.Grid(eGridDiv, gridOptions1);
    })
    .catch(error => {
        console.error("Error al cargar los datos:", error);
    });