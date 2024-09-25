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
    columns: ["#", "Nombre", "Identificacicón", "Telefono", "email", "licencia", "lic. Vencemiento", {

            name: 'Documentos',
            hidden: false,
            formatter: (cell, row) => {
                return gridjs.html(
                    `<button id="btn-${row.cells[0].data}" class="upload-btn no-file" onclick="uploadId(${row.cells[0].data})">Adjuntos</button>`
                );
            }
        },
        {
            name: 'Actualizar',
            hidden:true,
            formatter: (cell, row) => {
                return gridjs.h('a', {
                    href: '/view/conductores/edit.html',
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
            name: 'Eliminar',
            hidden:true,
            formatter: (cell, row) => {
                return gridjs.h('a', {
                    href: '/view/conductores/create.html',
                    onclick: (e) => {
                        e.preventDefault(); // Evita que el enlace se recargue la página
                        deleteCondcutor(row.cells[0].data);
                    }
                }, [

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
        url: "https://esenttiapp-production.up.railway.app/api/uploadconductorexterno",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((conductor) => [
                    conductor.id,
                    conductor.nombre,
                    conductor.identificacion,
                    conductor.telefono,
                    conductor.email,
                    conductor.numero_licencia,
                    conductor.fecha_vencimiento
                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    }
}).render(document.getElementById('externos'));