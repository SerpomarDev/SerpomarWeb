function updateTotalAbiertas(data) {
	const abiertas = data.filter(item => item[8] === 'ABIERTA'); // 8 es el índice de la columna "Estado"
	document.getElementById('total-abiertas').textContent = abiertas.length;
  
	const totalTarifas = abiertas.reduce((sum, item) => sum + parseFloat(item[5]), 0); // 5 es el índice de la columna "Tarifa"
	document.getElementById('valor-total-abiertas').textContent = `$ ${totalTarifas.toLocaleString()}`;
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
	columns: [{name:"id",
                hidden:false
            },"Fecha", "SP", "Contenedor", "Placa", "Aliado", {
			name: "Tarifa",
			formatter: (_, row) => `$ ${(row.cells[5].data).toLocaleString()}`
		}, "Ruta", "Nombre", "Estado", {
			name: 'Soportes',
			hidden: false,
			formatter: (cell, row) => {
				return gridjs.html(`
					<button onclick="uploadId(${row.cells[0].data})" >Adjuntar Archivo</button>
				`);
			}
		}, {
			name: "enviar",
			formatter: (cell, row) => {
				return gridjs.h('button', {
					className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
					onClick: () => editAsignacion()
				}, 'enviar')
			}
		}
	],
	fixedHeader: true,
	server: {
		url: `https://esenttiapp-production.up.railway.app/api/controlasignaciones`,
		then: (data) => {
			if (Array.isArray(data) && data.length > 0) {
				updateTotalAbiertas(data.map(asigControl => [
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
					asigControl.adjunto
				]));
				return data.map((asigControl) => [
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
					asigControl.adjunto,
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
  
  document.addEventListener('DOMContentLoaded', (event) => {
	const modal = document.getElementById('fileUploadModal');
	const span = document.getElementsByClassName('close')[0];
	const uploadButton = document.getElementById('uploadButton');
	let currentRowIndex;
  
	span.onclick = function() {
	  modal.style.display = 'none';
	}
  
	window.onclick = function(event) {
	  if (event.target == modal) {
		modal.style.display = 'none';
	  }
	}
  
	window.handleFileUpload = function(event) {
	  currentRowIndex = event.target.getAttribute('data-row-index');
	  modal.style.display = 'block';
	}
  
	uploadButton.onclick = function() {
	  const files = document.getElementById('fileInput').files;
	  const formData = new FormData();
  
	  for (let i = 0; i < files.length; i++) {
		formData.append('files[]', files[i]);
	  }
  
	  formData.append('rowIndex', currentRowIndex);
  

	  modal.style.display = 'none';
	}
  });

  function uploadId(id) {

    document.getElementById('id_asignacion').value = id;
    document.getElementById('SaveFile').style.display = 'block'; 
    }
  
  document.getElementById('SaveFile').addEventListener( "DOMContentLoaded", function() {
       
    myDropzone = new Dropzone("#SaveFile", {
       url: `https://esenttiapp-production.up.railway.app/api/asignacionfile`, 
       method: 'POST',
       headers: {
           'X-CSRF-TOKEN': '{{ csrf_token() }}'
       },

       acceptedFiles: ".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.png,.jpeg",
       init: function() {
           this.on("success", function(file, response) {
               console.log(response);
           });
           this.on("error", function(file, response) {
               console.error(response);
           });
       }
   });
});
