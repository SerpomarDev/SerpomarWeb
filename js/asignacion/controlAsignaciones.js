function updateTotalAbiertas(data) {
    const abiertas = data.filter(item => item.estado === 'ABIERTA'); // Verifica que 'estado' sea 'ABIERTA'
    document.getElementById('total-abiertas').textContent = abiertas.length;

    const totalTarifas = abiertas.reduce((sum, item) => sum + parseFloat(item.tarifa || 0), 0); // Verifica que 'tarifa' sea un número válido
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
    columns: [
        { name: "id", hidden: false },
        "Fecha", "SP", "Contenedor", "Placa", "Aliado", {
            name: "Tarifa",
            formatter: (_, row) => `$ ${(row.cells[6].data).toLocaleString()}`
        },
        "Ruta", "Nombre", "Estado", {
            name: 'Soportes',
            hidden: false,
            formatter: (cell, row) => {
                return gridjs.html(`
                    <button onclick="uploadId(${row.cells[0].data})">Adjuntar Archivo</button>
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
                    asigControl.adjunto
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

    function uploadId(id) {
        document.getElementById('id_asignacion').value = id;
        modal.style.display = 'block';

        // RESETEAR EL MODAL
        Dropzone.forElement("#SaveFile").removeAllFiles(true);
    }

    window.uploadId = uploadId;

    const form = document.getElementById('SaveFile');

    const myDropzone = new Dropzone(form, {
        url: 'https://esenttiapp-production.up.railway.app/api/asignacionfile',
        method: 'POST',
        acceptedFiles: '.pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.png,.jpeg',
        init: function() {
            this.on('success', function(file, response) {
                console.log(response);
            });
            this.on('error', function(file, response) {
                console.error(response);
            });
        }
    });
});
