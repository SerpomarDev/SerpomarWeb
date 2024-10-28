
  const columnDefs = [
    { headerName: "#", field: "id_placa", hide: true }, 
    { headerName: "Placa", field: "placa" },
    { headerName: "Vence Soat", field: "fecha_vencimientos" },
    { headerName: "Vence Tecno", field: "fecha_vencimientot" },
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

                fetch(`https://esenttiapp-production.up.railway.app/api/placas/${params.data.id_placa}`, { 
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
                        text: 'Placa Actualizada'
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
    }
];

const eGridDiv = document.getElementById('placas');

const gridContainer = document.createElement('div');
gridContainer.style.width = '80%';
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