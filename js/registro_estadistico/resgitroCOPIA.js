const columnDefsRE = [
    { headerName: "ID Primario", field: "id_primario" , hide:true},


    // TODO ESTO VIENE DE SOLICITUD DE SERVICIO    
    { headerName: "SP",
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
    { headerName: "Do", field: "do_pedido" },
    { headerName: "Pedido", field: "pedido" },
    { headerName: "Número Contenedor", field: "numero_contenedor" , rowGroup: true },
    { headerName: "Cliente", field: "cliente" },
    { headerName: "Modalidad", field: "modalidad" },
    { headerName: "Fecha Levante", field: "fecha_levante" },
    { headerName: "Fecha ETA", field: "fecha_eta" },
    { headerName: "Fecha Notificación", field: "fecha_notificacion" },
    { headerName: "Fecha Documental", field: "fecha_documental" },
    { headerName: "Fecha Cutoff Físico", field: "fecha_cutoff_fisico" },
    { headerName: "Producto", field: "producto" },
    { headerName: "Booking", field: "booking" },
    { headerName: "Libre Hasta", field: "libre_hasta" },
    { headerName: "Bodegaje Hasta", field: "bodegaje_hasta" },
    { headerName: "Naviera", field: "naviera" },
    { headerName: "Puerto", field: "puerto" },
    { headerName: "Estado", field: "estado" },
    //-----------TODO ESTO VIENE DE SOLICITUD DE SERVICIO

    // { headerName: "Conductor", field: "conductor",hide:true},
    // { headerName: "Placa", field: "placa",hide:true },
    // { headerName: "Conductor Puerto", field: "conductor_puerto" },
    // { headerName: "Placa Puerto", field: "placa_puerto" },
    // { headerName: "Conductor Patio", field: "conductor_patio" },
    // { headerName: "Placa Patio", field: "placa_patio" },


    // TODO ESTO VIENE DE ORDEN DE SERVICIO
    { headerName: "Fecha Cargue", field: "fecha_cargue" },
    { headerName: "Fecha Devolución", field: "fecha_devolucion" },
    { headerName: "Sitio(retiro o devolucion)", field: "sitio" },
    { headerName: "Manifiesto", field: "manifiesto" },
    { headerName: "Fecha Manifiesto", field: "fecha_manifiesto" },
    { headerName: "Remesa", field: "remesa" },
    { headerName: "Fecha Remesa", field: "fecha_remesa" },
    { headerName: "Fecha Cita", field: "fecha_cita" },
    { headerName: "Fecha Cliente", field: "fecha_cliente" },
    { headerName: "Sitio(Cargue o Descargue)", field: "sitio_cargue_descargue" },
    { headerName: "Patio", field: "patio" },
    //-----------TODO ESTO VIENE DE ORDEN DE SERVICIO


    // TODO ESTO VIENE DE CONTENEDORES  
    { headerName: "Tipo", field: "tipo" },
    { headerName: "Tara", field: "tara" },
    { headerName: "Payload", field: "payload" },
    //-----------TODO ESTO VIENE DE CONTENEDORES
    
  
   
 

    {
        headerName: "Alerta Documental",
        field: "fecha_documental", 
        cellRenderer: params => {
            const fechaDocumental = params.value ? new Date(params.value) : null; 
            const hoy = new Date(); 
            const estado = params.data.estado; // Obtener el estado de la fila
            if (estado === "PENDIENTE LIQUIDAR") { 
                const checkIcon = document.createElement('i');
                checkIcon.className = 'fas fa-check'; 
                checkIcon.style.color = 'green'; 
                checkIcon.style.fontSize = '1.2em'; 
    
                // Centrar el icono usando text-align
                const wrapperDiv = document.createElement('div'); 
                wrapperDiv.style.textAlign = 'center'; // Centrar el contenido del div
                wrapperDiv.appendChild(checkIcon); 
    
                return wrapperDiv;
            } else if (fechaDocumental) { 
                const diferenciaDias = Math.ceil(
                    (fechaDocumental - hoy) / (1000 * 60 * 60 * 24)
                ); 

                const alertaDiv = document.createElement('div');
                alertaDiv.textContent = diferenciaDias >= 3 ? '3 DIAS O MAS' : diferenciaDias === 2 ? '2 DIAS' : '1 DIA O MENOS';
                alertaDiv.style.fontWeight = 'bold';
                alertaDiv.style.textAlign = 'center'; 

                if (diferenciaDias >= 3) {
                    alertaDiv.style.backgroundColor = 'green';
                    alertaDiv.style.color = 'white';
                } else if (diferenciaDias === 2) {
                    alertaDiv.style.backgroundColor = 'orange';
                    alertaDiv.style.color = 'black';
                } else {
                    alertaDiv.style.backgroundColor = 'red';
                    alertaDiv.style.color = 'white';
                }

                return alertaDiv;
            } else { 
                const alertaDiv = document.createElement('div');
                alertaDiv.textContent = 'Faltan datos';
                alertaDiv.style.backgroundColor = 'gray';
                alertaDiv.style.color = 'white';
                alertaDiv.style.fontWeight = 'bold';
                alertaDiv.style.textAlign = 'center'; 
                return alertaDiv;
            }
        }
    },

    {
        headerName: "Alerta Cutoff Físico",
        field: "fecha_cutoff_fisico", 
        cellRenderer: params => {
            const fechaDocumental = params.value ? new Date(params.value) : null; 
            const hoy = new Date(); 
            const estado = params.data.estado; // Obtener el estado de la fila
            if (estado === "PENDIENTE LIQUIDAR") { 
                const checkIcon = document.createElement('i');
                checkIcon.className = 'fas fa-check'; 
                checkIcon.style.color = 'green'; 
                checkIcon.style.fontSize = '1.2em'; 
    
                // Centrar el icono usando text-align
                const wrapperDiv = document.createElement('div'); 
                wrapperDiv.style.textAlign = 'center'; // Centrar el contenido del div
                wrapperDiv.appendChild(checkIcon); 
    
                return wrapperDiv;
            } else if (fechaDocumental) { 
                const diferenciaDias = Math.ceil(
                    (fechaDocumental - hoy) / (1000 * 60 * 60 * 24)
                ); 

                const alertaDiv = document.createElement('div');
                alertaDiv.textContent = diferenciaDias >= 3 ? '3 DIAS O MAS' : diferenciaDias === 2 ? '2 DIAS' : '1 DIA O MENOS';
                alertaDiv.style.fontWeight = 'bold';
                alertaDiv.style.textAlign = 'center'; 

                if (diferenciaDias >= 3) {
                    alertaDiv.style.backgroundColor = 'green';
                    alertaDiv.style.color = 'white';
                } else if (diferenciaDias === 2) {
                    alertaDiv.style.backgroundColor = 'orange';
                    alertaDiv.style.color = 'black';
                } else {
                    alertaDiv.style.backgroundColor = 'red';
                    alertaDiv.style.color = 'white';
                }

                return alertaDiv;
            } else { 
                const alertaDiv = document.createElement('div');
                alertaDiv.textContent = 'Faltan datos';
                alertaDiv.style.backgroundColor = 'gray';
                alertaDiv.style.color = 'white';
                alertaDiv.style.fontWeight = 'bold';
                alertaDiv.style.textAlign = 'center'; 
                return alertaDiv;
            }
        }
    },

    {
        headerName: "Alerta Libre Hasta",
        field: "libre_hasta", 
        cellRenderer: params => {
            const fechaDocumental = params.value ? new Date(params.value) : null; 
            const hoy = new Date(); 
            const estado = params.data.estado; // Obtener el estado de la fila
            if (estado === "PENDIENTE LIQUIDAR") { 
                const checkIcon = document.createElement('i');
                checkIcon.className = 'fas fa-check'; 
                checkIcon.style.color = 'green'; 
                checkIcon.style.fontSize = '1.2em'; 
    
                // Centrar el icono usando text-align
                const wrapperDiv = document.createElement('div'); 
                wrapperDiv.style.textAlign = 'center'; // Centrar el contenido del div
                wrapperDiv.appendChild(checkIcon); 
    
                return wrapperDiv;
            } else if (fechaDocumental) { 
                const diferenciaDias = Math.ceil(
                    (fechaDocumental - hoy) / (1000 * 60 * 60 * 24)
                ); 

                const alertaDiv = document.createElement('div');
                alertaDiv.textContent = diferenciaDias >= 3 ? '3 DIAS O MAS' : diferenciaDias === 2 ? '2 DIAS' : '1 DIA O MENOS';
                alertaDiv.style.fontWeight = 'bold';
                alertaDiv.style.textAlign = 'center'; 

                if (diferenciaDias >= 3) {
                    alertaDiv.style.backgroundColor = 'green';
                    alertaDiv.style.color = 'white';
                } else if (diferenciaDias === 2) {
                    alertaDiv.style.backgroundColor = 'orange';
                    alertaDiv.style.color = 'black';
                } else {
                    alertaDiv.style.backgroundColor = 'red';
                    alertaDiv.style.color = 'white';
                }

                return alertaDiv;
            } else { 
                const alertaDiv = document.createElement('div');
                alertaDiv.textContent = 'Faltan datos';
                alertaDiv.style.backgroundColor = 'gray';
                alertaDiv.style.color = 'white';
                alertaDiv.style.fontWeight = 'bold';
                alertaDiv.style.textAlign = 'center'; 
                return alertaDiv;
            }
        }
    },

    {
        headerName: "Alerta Bodegaje Hasta",
        field: "bodegaje_hasta", 
        cellRenderer: params => {
            const fechaDocumental = params.value ? new Date(params.value) : null; 
            const hoy = new Date(); 
            const estado = params.data.estado; // Obtener el estado de la fila
            if (estado === "PENDIENTE LIQUIDAR") { 
                const checkIcon = document.createElement('i');
                checkIcon.className = 'fas fa-check'; 
                checkIcon.style.color = 'green'; 
                checkIcon.style.fontSize = '1.2em'; 
    
                // Centrar el icono usando text-align
                const wrapperDiv = document.createElement('div'); 
                wrapperDiv.style.textAlign = 'center'; // Centrar el contenido del div
                wrapperDiv.appendChild(checkIcon); 
    
                return wrapperDiv;
            } else if (fechaDocumental) { 
                const diferenciaDias = Math.ceil(
                    (fechaDocumental - hoy) / (1000 * 60 * 60 * 24)
                ); 

                const alertaDiv = document.createElement('div');
                alertaDiv.textContent = diferenciaDias >= 3 ? '3 DIAS O MAS' : diferenciaDias === 2 ? '2 DIAS' : '1 DIA O MENOS';
                alertaDiv.style.fontWeight = 'bold';
                alertaDiv.style.textAlign = 'center'; 

                if (diferenciaDias >= 3) {
                    alertaDiv.style.backgroundColor = 'green';
                    alertaDiv.style.color = 'white';
                } else if (diferenciaDias === 2) {
                    alertaDiv.style.backgroundColor = 'orange';
                    alertaDiv.style.color = 'black';
                } else {
                    alertaDiv.style.backgroundColor = 'red';
                    alertaDiv.style.color = 'white';
                }

                return alertaDiv;
            } else { 
                const alertaDiv = document.createElement('div');
                alertaDiv.textContent = 'Faltan datos';
                alertaDiv.style.backgroundColor = 'gray';
                alertaDiv.style.color = 'white';
                alertaDiv.style.fontWeight = 'bold';
                alertaDiv.style.textAlign = 'center'; 
                return alertaDiv;
            }
        }
    },
    
   
];

fetch("https://esenttiapp-production.up.railway.app/api/registroestadistico", {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
})
.then((response) => response.json())
.then((data) => {
    const processedData = data.map((item) => {
        return {
            id_primario: item.id_primario,

        // TODO ESTO VIENE DE SOLICITUD DE SERVICIO  
            sp: item.sp,
            do_pedido: item.do_pedido,
            pedido: item.pedido,
            numero_contenedor: item.numero_contenedor,
            cliente: item.cliente,
            modalidad: item.modalidad,
            fecha_levante: item.fecha_levante,
            fecha_eta: item.fecha_eta,
            fecha_notificacion: item.fecha_notificacion,
            fecha_documental: item.fecha_documental,
            fecha_cutoff_fisico: item.fecha_cutoff_fisico,
            producto: item.producto,
            booking: item.booking,
            libre_hasta: item.libre_hasta,
            bodegaje_hasta: item.bodegaje_hasta,
            naviera: item.naviera,
            puerto: item.puerto,
            estado: item.estado,
    //-----------TODO ESTO VIENE DE SOLICITUD DE SERVICIO


            // conductor: item.conductor,
            // placa: item.placa,
            // conductor_puerto: item.conductor_puerto,
            // placa_puerto: item.placa_puerto,
            // conductor_patio: item.conductor_patio,
            // placa_patio: item.placa_patio,
            
            
    // TODO ESTO VIENE DE SOLICITUD DE SERVICIO  
            fecha_cargue: item.fecha_cargue,
            fecha_devolucion: item.fecha_devolucion,
            sitio: item.sitio,
            manifiesto: item.manifiesto,
            fecha_manifiesto: item.fecha_manifiesto,
            remesa: item.remesa,
            fecha_remesa: item.fecha_remesa,
            fecha_cita: item.fecha_cita,
            fecha_cliente: item.fecha_cliente,
            sitio_cargue_descargue: item.sitio_cargue_descargue,
            patio: item.patio,
    //-----------TODO ESTO VIENE DE SOLICITUD DE SERVICIO


    // TODO ESTO VIENE DE CONTENEDORES 
            tipo: item.tipo,
            tara: item.tara,
            payload: item.payload,
    //-----------TODO ESTO VIENE DE CONTENEDORES 
            
            
        };
    });

    const gridOptions = {
        columnDefs: columnDefsRE,
        defaultColDef: {
            resizable: true,
            sortable: true,
            filter: "agTextColumnFilter",
            floatingFilter: true,
            editable: true
        },
        groupDisplayType: "groupRows",
        rowGroupPanelShow: "always",
        groupDefaultExpanded: 1,
        enableRangeSelection: true,
        pagination: true,
        paginationPageSize: 20,
        rowData: processedData,
        onCellValueChanged: (event) => {
            const updatedRowData = event.data;
            const id = updatedRowData.id_primario;
    
            // Mostrar una notificación toast informando del cambio
            Swal.fire({
                title: 'Actualizando...',
                text: "Se actualizará la información en la base de datos",
                icon: 'info',
                timer: 1000, // La alerta se cerrará después de 2 segundos
                timerProgressBar: true, 
                toast: true, 
                position: 'top-end', 
                showConfirmButton: false // Ocultar el botón de confirmación
            });
    
            // Retrasar la actualización 2 segundos
            setTimeout(() => {
                fetch(`https://esenttiapp-production.up.railway.app/api/ordenservicios/${id}`, {
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
                  // Mostrar notificación de éxito más rápida
                  Swal.fire({
                      title: '¡Actualizado!',
                      text: 'El registro ha sido actualizado.',
                      icon: 'success',
                      timer: 1000, // 1 segundo (o el tiempo que prefieras)
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
                    )
                });
            }, 2000); 
        },
    };

    const eGridDiv = document.getElementById("registro_estadistico");
    new agGrid.Grid(eGridDiv, gridOptions);
})
.catch((error) => {
    console.error("Error al cargar los datos:", error);
});

function showOrdenService(id){
    window.location.href = `/view/contenedor/create.html?id=${id}`
}
