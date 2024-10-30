document.addEventListener('DOMContentLoaded', function () {
    const columnDefs = [
        { headerName: "#", field: "id_primario",hide:true},
        {
            headerName: "SP",
            field: "sp",
            cellRenderer: params => {
                const cellValue = params.value;
                const button = document.createElement('a');
                button.textContent = cellValue;
                button.style.cursor = 'pointer';
                button.style.color = '#6495ED';
                button.style.fontWeight = 'bold';
                button.onclick = () => showOrdenService(params.data.id_primario);
                return button;
            }
        },
        { headerName: "Pedido", field: "pedido", },
        { headerName: "Contenedores", field: "numero_contenedor", },
        { headerName: "Cliente", field: "cliente",
            filter: 'agSetColumnFilter',
            hide: true,
            filterParams: {
                value: ['PRODUCTOS AUTOADHESIVOS ARCLAD S.A'],
                suppressSorting: true 
            }
        },
        { headerName: "Modalidad", field: "modalidad",
            filter: 'agSetColumnFilter',
            hide: true,
            filterParams: {
                value: ['exportacion'],
                suppressSorting: true 
            }
        },
        { headerName: "Estado", field: "estado",},
    ];

    // Función para aplicar el filtro rápido
    function onQuickFilterChanged() {
        const input = document.getElementById('search').value;
        if (gridOptions.api) {
            gridOptions.api.setQuickFilter(input); // Aplicar el filtro rápido sobre la tabla
        }
    }

    // Hacer la función accesible globalmente
    window.onQuickFilterChanged = onQuickFilterChanged;


    fetch("https://esenttiapp-production.up.railway.app/api/searchcontendor", {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const processedData = data.map(asigControl => {
            return {
                id_primario: asigControl.id_primario,
                sp: asigControl.sp,
                pedido: asigControl.pedido,
                numero_contenedor: asigControl.numero_contenedor,
                cliente: asigControl.cliente,
                modalidad: asigControl.modalidad,
                estado: asigControl.estado,
            };
        });

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
            enableRangeSelection: true,
            suppressMultiRangeSelection:true,
            pagination: true,
            paginationPageSize: 30,
            rowData: processedData,
            onGridReady: params => { // Aplicar filtro al iniciar la grilla
                params.api.setFilterModel({
                    'cliente': {
                        filterType: 'set',
                        values: ['PRODUCTOS AUTOADHESIVOS ARCLAD S.A'] 
                    },
                    'modalidad': {
                        filterType: 'set',
                        values: ['exportacion'] 
                    }
                });
            },
        };
        const eGridDiv = document.getElementById('searchContenedor');
        new agGrid.Grid(eGridDiv, gridOptions);

    })
    .catch(error => {
        console.error("Error al cargar los datos:", error);
    });

    function showOrdenService(id) {
        window.location.href = `/view/contenedor/create.html?id=${id}`;
    }
});





