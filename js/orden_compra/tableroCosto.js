const columnDefs = [
    { headerName: "OC", field: "id" },
    { headerName: "Nit", field: "nit" },
    { headerName: "Razón Social", field: "razon_social" },
    { headerName: "Valor", field: "valor", valueFormatter: params => `$ ${params.value.toLocaleString()}`},
    { headerName: "Condición", field: "condicion" },
    { headerName: "Centro de Costo", field: "centro_costo" },
    { headerName: "Equipo", field: "equipo" },
    { headerName: "SP", field: "sp" },
    { headerName: "Dias pendiente", field: "cantidad_dias" },
    { headerName: "Observación", field: "observacion" },
      {
        headerName: "Soportes",
        cellRenderer: params => {
            const button = document.createElement('button');
            button.className = 'upload-btn no-file';
            button.innerText = 'Adjuntar Archivo';
            button.id = `btn-${params.data.id}`;
            button.addEventListener( 'click',()=> uploadId(params.data.id));
            return button;
        }
      },
      {
        headerName: "Acciones",
        cellRenderer: params => {
            return `
                <button class="py-2 mb-4 px-4 border rounded bg-blue-600" onclick="aprovarOrdenCompra(${params.data.id})">Aprobar</button>
                <button class="py-2 mb-4 px-4 border rounded bg-blue-600" onclick="rechazarOrdenCompra(${params.data.id})">Rechazar</button>
            `;
        }
    }
    ];
  
    fetch("https://esenttiapp-production.up.railway.app/api/uploadordencompra",{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
      }
    })
    .then(response => response.json())
    .then(data => {
      const processedData = data.map(ordenCompra => {
        return {
          id: ordenCompra.id,
          nit: ordenCompra.nit,
          razon_social: ordenCompra.razon_social,
          valor: ordenCompra.valor,
          condicion: ordenCompra.condicion,
          centro_costo: ordenCompra.centro_costo,
          equipo: ordenCompra.equipo,
          sp: ordenCompra.sp,
          cantidad_dias: ordenCompra.cantidad_dias,
          observacion: ordenCompra.observacion,
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
          editable: true
        },
        pagination: true,
        paginationPageSize: 7,
        rowData: processedData,
  
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
              fetch(`https://esenttiapp-production.up.railway.app/api/ordencompra/${id}`, {
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
      }
        
      };
  
      // Renderizar la tabla en el contenedor
        const eGridDiv = document.getElementById('control_gastos');
        new agGrid.Grid(eGridDiv, gridOptions);
    })
    .catch(error => {
      console.error("Error al cargar los datos:", error);
    });


    function aprovarOrdenCompra(id){
        aprovarOrdenCompra(id)
      }
  
      function rechazarOrdenCompra(id){
        rechazarOrdenCompra(id)
      }


      function uploadId(id) {
        // Open the modal or handle file upload
        $('#fileUploadModal').show();
        $('#id_ordenc').val(id);
    
        // Initialize Dropzone for the form
      const  myDropzone = new Dropzone("#SaveFile", {
            url: "/upload", // Replace with your upload URL
            init: function() {
                this.on("success", function(file, response) {
                    // Change button state after successful file upload
                    const button = document.getElementById(`btn-${id}`);
                    if (button) {
                        button.classList.remove('no-file');
                        button.classList.add('file-uploaded');
                    }
    
                    // Hide the modal after upload
                    $('#fileUploadModal').hide();
                });
            }
        });
    }
    
    // Handle modal close
    $('.close').on('click', function() {
        $('#fileUploadModal').hide();
    });