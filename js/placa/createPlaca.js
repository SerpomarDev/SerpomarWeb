new gridjs.Grid({
    search: true,
    language: {
        search: {
            placeholder: '🔍 Buscar...'
        }
    },
    pagination: {
        limit: 10,
        enabled: true,
    },
    resizable: true,
    sort: false,
    columns: [{
        name: 'id',
        hidden: true,
    }, "Placa", "Eje", "Tipologia", "Propietario", {
        name: 'Telefono',
        hidden: true,
    }, {
        name: 'Accion',
        columns: [{
                name: 'Documentos',
                hidden: false,
                formatter: (cell, row) => {
                    return gridjs.html(
                        `<button id="btn-${row.cells[0].data}" class="upload-btn no-file" onclick="uploadId(${row.cells[0].data})">Adjuntos</button>`
                    );
                }
            }, {

                name: 'Actualizar',
                formatter: (cell, row) => {
                    return gridjs.h('a', {
                        href: '/view/Placa/edit.html',
                        onclick: (e) => {
                            e.preventDefault();
                            editPlaca(row.cells[0].data);
                        }
                    }, [
                        // Imagen dentro del enlace
                        gridjs.h('img', {
                            src: '/img/editar-texto.png',
                            alt: 'Actualizar',
                            style: 'width: 20px; height: 20px;'
                        })
                    ]);
                },
            },
            {
                name: 'Eliminar',
                formatter: (cell, row) => {
                    return gridjs.h('a', {
                        href: '/view/Placa/create.html',
                        onclick: (e) => {
                            e.preventDefault();
                            deletePlaca(row.cells[0].data);
                        }
                    }, [
                        // Imagen dentro del enlace
                        gridjs.h('img', {
                            src: '/img/basura.png',
                            alt: 'eliminar',
                            style: 'width: 20px; height: 20px;'
                        })
                    ]);
                },
            }
        ],

    }],
    server: {
        url: "https://esenttiapp-production.up.railway.app/api/showplaca",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((placa) => [
                    placa.id_placa,
                    placa.placa,
                    placa.eje,
                    placa.tipologia,
                    placa.nombre,
                    placa.telefono
                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    }
}).render(document.getElementById('Placa'));

localStorage.setItem("authToken", data.token);

document.getElementById('createPlaca').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    const jsonData = JSON.stringify(Object.fromEntries(formData));

    fetch('https://esenttiapp-production.up.railway.app/api/placas', {
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
                text: "Has Creado una Placa.",
                icon: "success",
            });
        })
        .then((response) => {
            time();
        })
});

function time() {
    document.getElementById('createPlaca').reset();
    setTimeout(() => {
        window.location.href = `/view/placa/create.html`;
    }, 1200);
}

function editPlaca(id) {

    window.location.href = `/view/placa/edit.html?id=${id}`
}


function deletePlaca(id) {
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