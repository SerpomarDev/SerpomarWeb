import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getStorage, ref, listAll } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

// configuración firebase
const firebaseConfig = {
    apiKey: "AIzaSyBQh7eqWl_iu02oDPds3nQMigzSrHDOFn0",
    authDomain: "serpomar-driver-mysql-f8df6.firebaseapp.com",
    projectId: "serpomar-driver-mysql-f8df6",
    storageBucket: "serpomar-driver-mysql-f8df6.appspot.com",
    messagingSenderId: "840427888757",
    appId: "1:840427888757:web:b8250feec992a76510583c"
};

// inicio Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

function updateTotalAbiertas(data) {
    const abiertas = data.filter(item => item.estado === 'ABIERTA'); // Verifica que 'estado' sea 'ABIERTA'
    document.getElementById('total-abiertas').textContent = abiertas.length;

    const totalTarifas = abiertas.reduce((sum, item) => sum + parseFloat(item.tarifa || 0), 0); // Verifica que 'tarifa' sea un número válido
    document.getElementById('valor-total-abiertas').textContent = `${totalTarifas.toLocaleString()}`;
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
                return gridjs.html(`
                    <button id="btn-${row.cells[0].data}" class="upload-btn no-file" onclick="uploadId(${row.cells[0].data})">Adjuntar Archivo</button>
                `);
            }
        }, {
            name: "enviar",
            formatter: (cell, row) => {
                return gridjs.h('button', {
                    className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
                    onClick: () => updateState(row.cells[0].data)
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
                checkAllButtonStates(data); // Revisar el estado de todos los botones al cargar los datos
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
   
    $('#fileUploadModal').show();
    $('#id_asignacion').val(id);

    
    const myDropzone = new Dropzone("#SaveFile", {
        url: "/upload", 
        init: function() {
            this.on("success", function(file, response) {
               
                const button = document.getElementById(`btn-${id}`);
                if (button) {
                    button.classList.remove('no-file');
                    button.classList.add('file-uploaded');
                }

             
                $('#fileUploadModal').hide();
            });
        }
    });
}


$('.close').on('click', function() {
    $('#fileUploadModal').hide();
});

async function checkAndSetButtonState(id) {
    const listRef = ref(storage, `uploads/${id}`);
    const res = await listAll(listRef);
    const button = document.getElementById(`btn-${id}`);

    if (res.items.length > 0 && button) {
        button.classList.remove('no-file');
        button.classList.add('file-uploaded');
    }
}

async function checkAllButtonStates(data) {
    for (const item of data) {
        await checkAndSetButtonState(item.id);
    }
}

window.onload = async () => {
    const response = await fetch('https://esenttiapp-production.up.railway.app/api/controlasignaciones');
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
        checkAllButtonStates(data);
    }
};
