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
    }, "Placa", "Eje", "Tipologia", "Propietario", "soat", "soat vencimientos", "num. poliza", "tecnomecanica", "tecnomecanica vencimiento", "gps", "web gps", {
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
                // Ordenar los datos por fecha de creación (asumiendo que tienes una propiedad 'created_at' en tus datos)
                data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

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
                    placa.webgps,
                    placa.telefono
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

    // Imprimir el JSON generado en la consola para verificar su estructura
    console.log(jsonData);

    // Validación básica de datos en el cliente
    if (jsonData.placa === "" || jsonData.eje === "" || jsonData.tipologia === "" ||
        jsonData.id_aliado === "" || jsonData.Soat === "" || jsonData.fecha_vencimientos === "" ||
        jsonData.numero_poliza === "" || jsonData.tecnomecanica === "" || jsonData.fecha_vencimientot === "" ||
        jsonData.gps === "" || jsonData.webgps === "" || jsonData.usuariogps === "" || jsonData.contrasenagps === "") {
        Swal.fire({
            title: "Error",
            text: "Por favor, complete todos los campos obligatorios.",
            icon: "error",
        });
        return;
    }

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
                } else if (response.status === 500) { // Ejemplo: Internal Server Error
                    throw new Error("Error interno del servidor. Por favor, inténtelo de nuevo más tarde.");
                } else {
                    throw new Error('Error al enviar los datos del formulario. Código de estado: ' + response.status);
                }
            } else {
                // Intentar analizar la respuesta como JSON, pero manejar el caso en que no sea válido
                return response.json().catch(error => {
                    // Si hay un error al analizar el JSON, obtener la respuesta como texto plano
                    return response.text().then(text => {
                        console.error("La respuesta del servidor no es un JSON válido:", text);
                        // Si la placa se guardó correctamente, mostrar un mensaje de éxito a pesar del error de análisis
                        if (text.includes("Placa creada exitosamente") || text.includes("mensaje de éxito similar del servidor")) {
                            Swal.fire({
                                title: "¡Buen trabajo!",
                                text: "Has Creado una Placa.",
                                icon: "success",
                            });
                            time();
                        } else {
                            // Si no hay un mensaje de éxito claro, mostrar un error genérico
                            throw new Error("Error interno del servidor. Por favor, inténtelo de nuevo más tarde.");
                        }
                    });
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