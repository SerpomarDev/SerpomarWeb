const columnDefs = [
    { headerName: "id", field: "id", hide: false },
    { headerName: "Placa", field: "placa" },
    { headerName: "Eje", field: "eje" },
    { headerName: "Tipologia", field: "tipologia" },
    { headerName: "Propietario", field: "nombre" },
    { headerName: "Razon social", field: "razon_social" },
    { headerName: "soat", field: "soat" },
    { headerName: "soat vence", field: "fecha_vencimientos" },
    { headerName: "num. poliza", field: "numero_poliza" },
    { headerName: "tecnomecanica", field: "tecnomecanica" },
    { headerName: "tec. vencimiento", field: "fecha_vencimientot" },
    { headerName: "Plataforma", field: "gps" },
    { headerName: "Web gps", field: "webgps" },
    { headerName: "Usuario", field: "usuario" },
    { headerName: "Clave", field: "contrasenia" },
    {
        headerName: 'Documentos', hide: false,
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
            link.href = '/view/Placa/edit.html';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                editPlaca(params.data.id);
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
        headerName: "Acciones", 
        cellRenderer: params => {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';

            // Switch para activar/desactivar conductor
            const switchLabel = document.createElement('label');
            switchLabel.classList.add('switch');
            const inputElement = document.createElement('input');
            inputElement.type = 'checkbox';
            inputElement.checked = !params.data.inactivo; 
            inputElement.addEventListener('change', () => {
                Swal.fire({
                    title: 'Actualizando...',
                    didOpen: () => {
                        Swal.showLoading()
                    },
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false
                });

                fetch(`https://esenttiapp-production.up.railway.app/api/placas/${params.data.id}`, { 
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
                    },
                    body: JSON.stringify({ inactivo: !inputElement.checked }) 
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al actualizar el estado del conductor');
                    }
                    Swal.fire({
                        icon: 'success',
                        title: 'Estado actualizado',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    gridOptions.api.refreshCells(); 
                })
                .catch(error => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Estado actualizado',
                        text: 'Conductor Actualizado'
                    });
                    console.error(error);
                });
            });

            switchLabel.appendChild(inputElement);

            // Agregar la clase "slider" al span
            const spanElement = document.createElement('span');
            spanElement.classList.add('slider'); 
            spanElement.classList.add('round'); // Opcional: para que el switch sea redondo
            switchLabel.appendChild(spanElement); 

            container.appendChild(switchLabel);

            return container;
        }
    },
];

const eGridDiv = document.getElementById('Placa'); 

const gridContainer = document.createElement('div');
gridContainer.style.width = '90%';
gridContainer.style.height = '500px';
gridContainer.style.margin = '20px auto';
eGridDiv.appendChild(gridContainer); 

fetch("https://esenttiapp-production.up.railway.app/api/cargarplaca", {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
    }
})
.then(response => response.json())
.then(data => {
    if (Array.isArray(data) && data.length > 0) {
        // Ordenar los datos por id en orden descendente (opcional)
        data.sort((b, a) => b.id - a.id);

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
            paginationPageSize: 20, 
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
    document.getElementById('createPlaca').reset();
    setTimeout(() => {
        window.location.href = `/view/placa/create.html`;
    }, 1200);
}

function editPlaca(id) {
    window.location.href = `/view/placa/edit_alert.html?id=${id}`
}

function deletePlaca(id) {
    DeleteData(id)
}

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