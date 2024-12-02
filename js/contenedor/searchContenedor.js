    
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
        { headerName: "Cliente", field: "cliente", },
        { headerName: "Modalidad", field: "modalidad", },
        { headerName: "Estado", field: "estado",},
    ];

    fetch("https://esenttiapp-production.up.railway.app/api/searchcontendor", {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(responseData => {
        // Verifica si el response contiene `success` y los datos están en `data`
        if (responseData.success && responseData.data) {
            const processedData = responseData.data.map(asigControl => {
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
                suppressMultiRangeSelection: true,
                pagination: true,
                paginationPageSize: 30,
                rowData: processedData,
            };
    
            const eGridDiv = document.getElementById('searchContenedor');
            new agGrid.Grid(eGridDiv, gridOptions);
        } else {
            throw new Error('Respuesta inválida del servidor.');
        }
    })
    .catch(error => {
        console.error("Error al cargar los datos:", error.message);
    });
    

    function showOrdenService(id) {
        window.location.href = `/view/contenedor/create.html?id=${id}`;

    }
