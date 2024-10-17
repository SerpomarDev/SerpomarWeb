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
    columns: ["#", 
              {
                name: "Tipo",
                formatter: (cell) => {
                    switch (cell) {
                        case "NO":
                            return "Afiliado";
                        case "SI":
                            return "Externo";
                        case "AP":
                            return "Apoyo";
                        default:
                            return cell; // Mostrar el valor original si no coincide
                    }
                }
              }, 
              "Nombre", "Cedula", "Telefono", 
              {
                name: 'ON / OFF',
                formatter: (cell, row) => {

                    const inactivo = row.cells[5].data; // ¡Corregido! Índice 5 en lugar de 4

                    let inputElement; 

                    const switchElement = gridjs.h('label', { class: 'switch' }, [
                        gridjs.h('input', { 
                            type: 'checkbox', 
                            checked: !inactivo, 
                            ref: (el) => { inputElement = el }, 
                            onchange: () => {
                                Swal.fire({
                                    title: 'Actualizando...',
                                    didOpen: () => {
                                        Swal.showLoading()
                                    },
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                    showConfirmButton: false
                                });

                                fetch(`https://esenttiapp-production.up.railway.app/api/conductores/${row.cells[0].data}`, { 
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
                                    // Mostrar un mensaje de éxito con SweetAlert
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Estado actualizado',
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                })
                                .catch(error => {
                                    // Mostrar un mensaje de error con SweetAlert
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'Error al actualizar el estado del conductor'
                                    });

                                    console.error(error);
                                });
                            }
                        }),
                        gridjs.h('span', { class: 'slider round' })
                    ]);

                    return switchElement;
                },
              },
    ],

    server: {
        url: "https://esenttiapp-production.up.railway.app/api/cargarcondutores",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((conductor) => [
                    conductor.id,
                    conductor.externo, // Incluido en el mapeo
                    conductor.nombre,
                    conductor.identificacion,
                    conductor.telefono,
                    conductor.inactivo 
                ]); // ¡Corregido! Orden del mapeo actualizado
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    }

}).render(document.getElementById('conductores'));