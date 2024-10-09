const columnDefs = [
    { headerName: "OC", field: "id" },
    { headerName: "Nit", field: "nit" },
    { headerName: "Razón Social", field: "razon_social" },
    { headerName: "Valor", field: "valor" },
    { headerName: "Condición", field: "condicion" },
    { headerName: "Centro de Costo", field: "centro_costo" },
    { headerName: "Equipo", field: "equipo" },
    { headerName: "SP", field: "sp" },
    { headerName: "Dias pendiente", field: "cantidad_dias" },
    {
      headerName: "Soportes",
      cellRenderer: params => {
          const button = document.createElement('button');
          button.className = 'upload-btn no-file';
          button.innerText = 'Ver Adjuntar';
          button.onclick = () => uploadId(params.data.id);
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
      },
      pagination: true,
      paginationPageSize: 7,
      rowData: processedData // Asignar los datos procesados
    };

    // Renderizar la tabla en el contenedor
      const eGridDiv = document.getElementById('control_gastos');
      new agGrid.Grid(eGridDiv, gridOptions);
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
  });

  document.getElementById('createOrdenCompra').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    const jsonData = JSON.stringify(Object.fromEntries(formData));

    console.log(jsonData)

    fetch('https://esenttiapp-production.up.railway.app/api/ordencompra', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            },
            body: jsonData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al enviar los datos del formulario');
            }
        })
        .then(data => {
            Swal.fire({
                title: "¡Buen trabajo!",
                text: "¡Has creado un Cliente",
                icon: "success",
            });
            setTimeout(() => {
                location.reload();
              }, 1500);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    });


    function uploadId(id) {
        // Open the modal or handle file upload
        $('#fileUploadModal').show();
        $('#id_asignacion').val(id);
    
        // Initialize Dropzone for the form
        const myDropzone = new Dropzone("#SaveFile", {
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

    function aprovarOrdenCompra(id){
      aprovarOrdenCompra(id)
    }

    function rechazarOrdenCompra(id){
      rechazarOrdenCompra(id)
    }