// controlAsignaciones.js
function updateTotalAbiertas(data) {
    const abiertas = data.filter(item => item.estado === 'ABIERTA'); // Verifica que 'estado' sea 'ABIERTA'
    document.getElementById('total-abiertas').textContent = abiertas.length;
  
    const totalTarifas = abiertas.reduce((sum, item) => sum + parseFloat(item.tarifa || 0), 0); // Verifica que 'tarifa' sea un número válido
    document.getElementById('valor-total-abiertas').textContent = totalTarifas.toLocaleString();
  }
  
  const columnDefs = [
    { headerName: "ID", field: "id" },
    { headerName: "Fecha", field: "fecha" },
    { headerName: "Cliente", field: "cliente" },
    { headerName: "SP", field: "do_sp" },
    { headerName: "Contenedor", field: "numero_contenedor" },
    { headerName: "Placa", field: "placa" },
    { headerName: "Aliado", field: "aliado" },
    { 
        headerName: "Tarifa", 
        field: "tarifa",
        valueFormatter: params => `$ ${parseFloat(params.value).toLocaleString()}` 
    },
    { headerName: "Ruta", field: "ruta" },
    { headerName: "Nombre", field: "nombre" },
    { headerName: "Estado", field: "estado" },
    {
        headerName: "Soportes",
        cellRenderer: params => {
            const button = document.createElement('button');
            button.className = 'upload-btn no-file';
            button.textContent = 'Adjuntar Archivo';
            button.id = `btn-${params.data.id}`;
            button.addEventListener('click', () => uploadId(params.data.id));
            return button;
        }
    },
    {
        headerName: "Enviar",
        cellRenderer: params => {
            const button = document.createElement('button');
            button.className = 'py-2 mb-4 px-4 border rounded bg-blue-600';
            button.textContent = 'Enviar';
            button.addEventListener('click', () => updateState(params.data.id));
            return button;
        }
    }
];

    fetch("https://esenttiapp-production.up.railway.app/api/controlasignaciones",{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
      }
    })
    .then(response => response.json())
    .then(data => {
      const processedData = data.map(asigControl => {
        return {
          id: asigControl.id,
          fecha: asigControl.fecha,
          cliente: asigControl.cliente,
          do_sp: asigControl.do_sp,
          numero_contenedor: asigControl.numero_contenedor,
          placa: asigControl.placa,
          aliado: asigControl.aliado,
          tarifa: asigControl.tarifa,
          ruta: asigControl.ruta,
          nombre: asigControl.nombre,
          estado: asigControl.estado,
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
        const eGridDiv = document.getElementById('controlAsig');
        new agGrid.Grid(eGridDiv, gridOptions);
    })
    .catch(error => {
      console.error("Error al cargar los datos:", error);
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
  