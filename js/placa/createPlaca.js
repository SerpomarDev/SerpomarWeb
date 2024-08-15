new gridjs.Grid({
    search: true,
    language: {
        search: {
            placeholder: '🔍 Buscar...'
        }
    },
    pagination: {
        limit: 20,
        enabled: true,
    },
    resizable: true,
    sort: false,
    columns: [{
            name: 'id',
            hidden: true,
        }, "Placa", "Eje", "Tipologia", "Propietario", "soat", "soat vencimientos", "num. poliza", "tecnomecanica", "tec. vencimiento", "gps", "web gps", {

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
            hidden: true,
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
    server: {
        url: "https://esenttiapp-production.up.railway.app/api/showplaca",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                // Ordenar los datos por id_placa en orden descendente
                data.sort((a, b) => b.id_placa - a.id_placa);

                return data.map((placa) => [
                    placa.id_placa,
                    placa.placa,
                    placa.eje,
                    placa.tipologia,
                    placa.nombre,
                    placa.soat,
                    placa.fecha_vencimientos,
                    placa.numero_poliza,
                    placa.tecnomecanica,
                    placa.fecha_vencimientot,
                    placa.gps,
                    placa.webgps
                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    }
}).render(document.getElementById('Placa'));

// Manejo del evento 'submit' del formulario
document.getElementById('createPlaca').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    // Convertir los datos del formulario a JSON, escapando caracteres especiales si es necesario
    const jsonData = JSON.stringify(Object.fromEntries(formData), (key, value) => {
        if (typeof value === 'string') {
            return value.replace(/\n/g, ' ').replace(/\t/g, ' ');
        }
        return value;
    });

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
                // Manejo de errores del servidor con más detalle
                if (response.status === 400) { // Ejemplo: Bad Request
                    return response.json().then(data => {
                        throw new Error("Solicitud incorrecta: " + data.message || "Verifique los datos del formulario.");
                    });
                }
            } else {
                return response.text().then(text => {
                    console.log("Respuesta del servidor:", text);
                    if (text.includes("Placa creada exitosamente") || text.includes("mensaje de éxito similar del servidor")) {
                        Swal.fire({
                            title: "¡Buen trabajo!",
                            text: "Has Creado una Placa.",
                            icon: "success",
                        });
                        time();
                    } else {
                        Swal.fire({ // Cambiado a SweetAlert de éxito
                            title: "¡Bien hecho!",
                            text: "Placa creada correctamente",
                            icon: "success",
                        });
                        time();
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error al crear la placa:', error);
            Swal.fire({
                title: "Error",
                text: error.message || "Hubo un problema al crear la placa. Por favor, inténtalo de nuevo.",
                icon: "error",
            });
        });
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