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
            hidden: true,
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
                    onClick: () => actualizarPagado(row.cells[0].data)
                }, 'enviar')
            }
        }
    ],
    fixedHeader: true,
    server: {
        url: `https://esenttiapp-production.up.railway.app/api/asignacionespendientepago`,
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
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
}).render(document.getElementById('costoAfiliado'));

function actualizarPagado(id){
    actualizarPagado(id)
}