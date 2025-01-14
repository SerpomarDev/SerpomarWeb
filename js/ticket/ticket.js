const columnDefs = [
    { headerName: "id", field: "id", hide: false },
    { headerName: "Tipo", field: "tipo",},
    { headerName: "Correo", field: "email" },
    { headerName: "Mensaje", field: "mensaje" },
    { 
        headerName: "Estado",
        field: "estado",
        editable: true,
              cellEditor: 'agSelectCellEditor', // Usa el editor de celdas select de ag-Grid
              cellEditorParams: {
                values: [' ','EN CURSO', 'LISTO', 'CANCELADO']
              }
    },
   
];

fetch("https://esenttiapp-production.up.railway.app/api/ticket", {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const processedData = data.map(ticket => {
            return {
                id: ticket.id,
                tipo: ticket.tipo,
                email: ticket.email,
                mensaje: ticket.mensaje,
                estado: ticket.estado,
            };
        });


        // Configurar la tabla con los datos procesados
        const gridOptions = {
            columnDefs: columnDefs,
            defaultColDef: {
                resizable: true,
                sortable: false,
                filter: "agTextColumnFilter",
                floatingFilter: true,
                flex: 1,
                minWidth: 100,
            },
            enableRangeSelection: true,
            suppressMultiRangeSelection:true,
            pagination: true,
            paginationPageSize: 30,
            rowData: processedData,
            domLayout: 'autoHeight', // Ajusta la altura automáticamente
            suppressHorizontalScroll: true, // Evita el scroll horizontal
            onGridReady: function (params) {
                params.api.sizeColumnsToFit(); // Ajusta las columnas al ancho del contenedor
            },
            onCellValueChanged: (event) => {
                const updatedRowData = event.data;
                const id = updatedRowData.id;
        
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
                    fetch(`https://esenttiapp-production.up.railway.app/api/ticket/${id}`, {
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

        const eGridDiv = document.getElementById('ticket');
        new agGrid.Grid(eGridDiv, gridOptions);

        window.addEventListener('resize', () => {
            gridOptions.api.sizeColumnsToFit();
        });
    })
    .catch(error => {
        console.error("Error al cargar los datos:", error);
    });