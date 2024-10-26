
const columnDefs = [
    { headerName: "#", field: "id", hide: true },
    { headerName: "Nombre", field: "nombre" },
    { headerName: "Cedula", field: "identificacion" },
    { headerName: "Telefono", field: "telefono" },
    { headerName: "email", field: "email" },
    { headerName: "lic. Vence", field: "numero_licencia" },
    { headerName: "lic. Vencemiento", field: "fecha_vencimiento" },
    { headerName: "Estudio SEG", field: "estudio_seg" },
    { headerName: "Poligrafia", field: "poligrafia" },
    {
        headerName: 'Documentos',
        cellRenderer: params => {
            const button = document.createElement('button');
            button.innerHTML = 'Adjuntos';
            button.setAttribute('id', `btn-${params.data.id}`);
            button.classList.add('upload-btn', 'no-file');
            button.addEventListener('click', () => {
                uploadId(params.data.id);
            });
            return button;
        }
    },
    {
        headerName: 'Editar',
        cellRenderer: params => {
            const link = document.createElement('a');
            link.href = '/view/conductores/edit.html';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                editConductor(params.data.id);
            });
            const img = document.createElement('img');
            img.src = '/img/editar-texto.png';
            img.alt = 'Actualizar';
            img.style.width = '20px';
            img.style.height = '20px';
            link.appendChild(img);
            return link;
        }
    },
    {
        headerName: 'Eliminar',
        hide: true, // Puedes cambiar esto a false si quieres mostrar la columna
        cellRenderer: params => {
            const link = document.createElement('a');
            link.href = '#'; 
            link.addEventListener('click', (e) => {
                e.preventDefault();
                deleteCondcutor(params.data.id);
            });
            const img = document.createElement('img');
            img.src = '/img/basura.png';
            img.alt = 'eliminar';
            img.style.width = '20px';
            img.style.height = '20px';
            link.appendChild(img);
            return link;
        }
    }
];

const eGridDiv = document.getElementById('conductores');

const gridContainer = document.createElement('div');
gridContainer.style.width = '90%';
gridContainer.style.height = '500px';
gridContainer.style.margin = '20px auto';
eGridDiv.appendChild(gridContainer); 

fetch("https://esenttiapp-production.up.railway.app/api/uploadconductor", {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
    }
})
.then(response => response.json())
.then(data => {
    if (Array.isArray(data) && data.length > 0) {
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
            pagination: true,
            paginationPageSize: 10,
            rowData: data 
        };

        new agGrid.Grid(gridContainer, gridOptions); 
    } else {
        console.error("La respuesta del servidor no contiene datos válidos.");
        const gridOptions = {
            columnDefs: columnDefs,
            rowData: [] 
        };

        new agGrid.Grid(gridContainer, gridOptions);
    }
})
.catch(error => {
    console.error("Error al cargar los datos:", error);
});


function time() {
    document.getElementById('createConductor').reset();
    setTimeout(() => {
        window.location.href = `/view/seguridad/conductores_crear.html`;
    }, 1200);
}


function editConductor(id) {
    window.location.href = `/view/seguridad/conductores_edit.html?id=${id}`
}

function deleteCondcutor(id) {
    DeleteData(id) 
}

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
