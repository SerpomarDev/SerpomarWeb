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
    columns: ["#", "Nombre", "Cedula", "Telefono", 
        {
            name: 'ON / OFF',
            formatter: (cell, row) => {
                const inactivo = row.cells[4].data;

                return gridjs.h('label', { class: 'switch' }, [
                    gridjs.h('input', { type: 'checkbox', checked: !inactivo, disabled: true }), // Corrección aquí
                    gridjs.h('span', { class: 'slider round' }),
                    gridjs.h('span', { class: 'off' }, 'OFF'), 
                    gridjs.h('span', { class: 'on' }, 'ON')
                ]);
            }
        },
    ],
    data: [ // Datos de ejemplo con el campo "inactivo"
        { id: 1, nombre: "Conductor 1", identificacion: "1234567890", telefono: "1234567890", inactivo: 1 },
        { id: 2, nombre: "Conductor 2", identificacion: "9876543210", telefono: "9876543210", inactivo: 0 },
        { id: 3, nombre: "Conductor 3", identificacion: "5678901234", telefono: "5678901234", inactivo: 1 },
    ] 
    // ... (configuración del server) ...
}).render(document.getElementById('conductores'));