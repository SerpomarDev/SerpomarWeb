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
    columns: ["Nombre", "Cedula", "Telefono", "", {

            name: 'Adjuntos',
            hidden: false,
            formatter: (cell, row) => {
                return gridjs.html(
                    `<button id="btn-${row.cells[0].data}" class="upload-btn no-file" onclick="uploadId(${row.cells[0].data})">Adjuntos</button>`
                );
            }
        },
        {
            name: 'EDIT',
            formatter: (cell, row) => {
                return gridjs.h('a', {
                    href: '/view/hseq/conductores_edit.html',
                    onclick: (e) => {
                        e.preventDefault();
                        editConductor(row.cells[0].data);
                    }
                }, [

                    gridjs.h('img', {
                        src: '/img/editar-texto.png',
                        alt: 'Actualizar',
                        style: 'width: 20px; height: 20px;'
                    })
                ]);
            },
        }, {
            name: '',
            formatter: (cell, row) => {
                return gridjs.h('a', {
                    href: '/view/hseq/conductores_crear.html',
                    onclick: (e) => {
                        e.preventDefault(); // Evita que el enlace se recargue la página
                        deleteCondcutor(row.cells[0].data);
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
        url: "https://esenttiapp-production.up.railway.app/api/uploadconductor",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((conductor) => [
                    conductor.nombre,
                    conductor.examen_medico,
                    conductor.fecha_realizacion,
                    conductor.fecha_seguimiento,
                    conductor.tipo_examen,
                    conductor.fecha_vencimiento

                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    }
}).render(document.getElementById('conductores'));

// Manejo del evento 'submit' del formulario
document.getElementById('createConductor').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    // Convertir los datos del formulario a JSON, escapando caracteres especiales si es necesario
    const jsonData = JSON.stringify(Object.fromEntries(formData), (key, value) => {
        if (typeof value === 'string') {
            return value.replace(/\n/g, ' ').replace(/\t/g, ' ');
        }
        return value;
    });


    fetch('https://esenttiapp-production.up.railway.app/api/conductores', {
        method: 'POST', // O PUT/PATCH si es lo que espera tu API
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
                    if (text.includes("Conductor creado exitosamente") || text.includes("mensaje de éxito similar del servidor")) {
                        Swal.fire({
                            title: "¡Buen trabajo!",
                            text: "Has Creado un conductor.",
                            icon: "success",
                        });
                        time();
                    } else {
                        Swal.fire({ // Cambiado a SweetAlert de éxito
                            title: "¡Bien hecho!",
                            text: "Conductor creado correctamente",
                            icon: "success",
                        });
                        time();
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error al crear el conductor:', error);
            Swal.fire({
                title: "Error",
                text: error.message || "Hubo un problema al crear la placa. Por favor, inténtalo de nuevo.",
                icon: "error",
            });
        });
});



function time() {
    document.getElementById('createConductor').reset();
    setTimeout(() => {
        window.location.href = `/view/hseq/conductores_crear.html`;
    }, 1200);
}


function editConductor(id) {

    window.location.href = `/view/hseq/conductores_edit.html?id=${id}`
}