const columnDefs = [
    { headerName: "#", field: "id", hide: true }, 
    { headerName: "Tipo", field: "externo", 
        cellRenderer: params => {
            switch (params.value) {
                case "NO":
                    return "Afiliado";
                case "SI":
                    return "Externo";
                case "AP":
                    return "Apoyo";
                default:
                    return params.value; 
            }
        }
    },
    { headerName: "Nombre", field: "nombre" },
    { headerName: "Cedula", field: "identificacion" },
    { headerName: "Telefono", field: "telefono" },
    { 
        headerName: "ON / OFF", 
        field: "inactivo",
        cellRenderer: params => {
            const inputElement = document.createElement('input');
            inputElement.type = 'checkbox';
            inputElement.checked = !params.value; 

            // Contenedor para el switch
            const switchElement = document.createElement('label');
            switchElement.classList.add('switch'); 

            // Span para la parte móvil del switch
            const sliderSpan = document.createElement('span');
            sliderSpan.classList.add('slider', 'round');

            // Agregar los elementos al contenedor
            switchElement.appendChild(inputElement);
            switchElement.appendChild(sliderSpan);

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

                fetch(`https://esenttiapp-production.up.railway.app/api/conductores/${params.data.id}`, { 
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
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Error al actualizar el estado del conductor'
                    });
                    console.error(error);
                });
            });

            return switchElement;
        }
    }
];

const eGridDiv = document.getElementById('conductores');

// 1. Obtener los datos primero
fetch("https://esenttiapp-production.up.railway.app/api/cargarcondutores", {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
    }
})
.then(response => response.json())
.then(data => {
    if (Array.isArray(data) && data.length > 0) {
        // 2. Crear la grilla con los datos obtenidos
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
            // 3. Pasar los datos a la grilla al crearla
            rowData: data 
        };

        new agGrid.Grid(eGridDiv, gridOptions);
    } else {
        console.error("La respuesta del servidor no contiene datos válidos.");
        const gridOptions = {
            columnDefs: columnDefs,
            rowData: [] 
        };

        new agGrid.Grid(eGridDiv, gridOptions);
    }
})
.catch(error => {
    console.error("Error al cargar los datos:", error);
});