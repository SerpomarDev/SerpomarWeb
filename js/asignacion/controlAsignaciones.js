// controlAsignaciones.js
function updateTotalAbiertas(data) {
    const abiertas = data.filter(item => item.estado === 'ABIERTA'); // Verifica que 'estado' sea 'ABIERTA'
    document.getElementById('total-abiertas').textContent = abiertas.length;
  
    const totalTarifas = abiertas.reduce((sum, item) => sum + parseFloat(item.tarifa || 0), 0); // Verifica que 'tarifa' sea un número válido
    document.getElementById('valor-total-abiertas').textContent = totalTarifas.toLocaleString();
  }
  
  new gridjs.Grid({
    search: true,
    language: {
      search: {
        placeholder: '🔍 Buscar...'
      }
    },
    pagination: {
      limit: 20,
      enabled: false,
    },
    sort: false,
    columns: [
      { name: "id", hidden: true },
      "Fecha", "SP", "Contenedor", "Placa", "Aliado", {
        name: "Tarifa",
        formatter: (_, row) => `$ ${(row.cells[6].data).toLocaleString()}`
      },
      "Ruta", "Nombre", "Estado", {
        name: 'Soportes',
        hidden: false,
        formatter: (cell, row) => {
          return gridjs.html(
            `<button id="btn-${row.cells[0].data}" class="upload-btn no-file" onclick="uploadId(${row.cells[0].data})">Adjuntar Archivo</button>`
          );
        }
      }, {
        name: "enviar",
        formatter: (cell, row) => {
          return gridjs.h('button', {
            className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
            onClick: () => updateState(row.cells[0].data) // Aquí se llama a updateState
          }, 'enviar')
        }
      }
    ],
    fixedHeader: true,
    server: {
      url: 'https://esenttiapp-production.up.railway.app/api/controlasignaciones',
      then: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          updateTotalAbiertas(data);
          return data.map(asigControl => [
            asigControl.id,
            asigControl.fecha,
            asigControl.do_sp,
            asigControl.numero_contenedor,
            asigControl.placa,
            asigControl.aliado,
            asigControl.tarifa,
            asigControl.ruta,
            asigControl.nombre,
            asigControl.estado,
          ]);
        } else {
          console.error("La respuesta del servidor no contiene datos válidos.");
          return [];
        }
      }
    },
    resizable: true,
    style: {
      table: { width: "100%" }
    }
  }).render(document.getElementById('controlAsig'));
  
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
  