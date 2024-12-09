
const columnDefsiso = [
    { headerName: "id", field: "id", hide: true },
    { 
        headerName: "lleno o vacio", 
        field: "lleno_vacio",
        filter: 'agSetColumnFilter',
        hide: true,
        filterParams: {
            values: ['LLENO', 'VACIO'],
            suppressSorting: true 
        }
    },
    { headerName: "Cliente", field: "cliente",
        filter: 'agSetColumnFilter',
        hide: true,
        filterParams: {
            value: ['ESENTTIA S A'],
            suppressSorting: true 
        }
    },
    { headerName: "Modalidad", field: "modalidad",
        filter: 'agSetColumnFilter',
        hide: true,
        filterParams: {
            value: ['IMPORTACION'],
            suppressSorting: true 
        }
    },
    { headerName: "Naviera", field: "naviera" },
    { headerName: "Contenedor", field: "contenedor" },
    { headerName: "Tipo de contenedor", field: "tipo_contenedor",
        filter: 'agSetColumnFilter',
        hide: false,
        filterParams: {
            value: ['40 HC'],
            suppressSorting: true 
        }
    },
    { headerName: "Placa", field: "placa" }

];

fetch("https://esenttiapp-production.up.railway.app/api/cargarinventario",{
    headers: {
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
})
.then(response => response.json())
.then(data => {
    const processedData = data.map(ordenCargue => {
        return {
            id: ordenCargue.id,
            lleno_vacio: ordenCargue.lleno_vacio,
            cliente: ordenCargue.cliente,
            modalidad: ordenCargue.modalidad,
            contenedor: ordenCargue.contenedor,
            tipo_contenedor: ordenCargue.tipo_contenedor,
            naviera: ordenCargue.naviera,
            placa: ordenCargue.placa,
        };
    });

    const gridOptions = {
        columnDefs: columnDefsiso,
        defaultColDef: {
          resizable: true,
          sortable: false,
          filter: "agTextColumnFilter",
          floatingFilter: true,
          flex: 1,
          minWidth: 100,
          editable: true
        },
        enableRangeSelection: true,
        suppressMultiRangeSelection:true,
        pagination: true,
        paginationPageSize: 20,
        rowData: processedData,
        onGridReady: params => { // Aplicar filtro al iniciar la grilla
            params.api.setFilterModel({
                'lleno_vacio': {
                    filterType: 'set',
                    values: ['LLENO'] 
                },
                'cliente': {
                    filterType: 'set',
                    values: ['ESENTTIA S A'] 
                },
                'modalidad': {
                    filterType: 'set',
                    values: ['IMPORTACION'] 
                },'tipo_contenedor': {
                    filterType: 'set',
                    values: ['40 HC'] 
                }
            });
        },

        rowSelection: 'multiple',
        enableRangeSelection: true,
        suppressMultiRangeSelection: true,
        pagination: true,
        paginationPageSize: 20,
        rowData: processedData,
    };
    
    // Renderizar la tabla en el contenedor
    const eGridDiv = document.getElementById('inventario-contenedores');
    new agGrid.Grid(eGridDiv, gridOptions);

})
.catch(error => {
    console.error("Error al cargar los datos:", error);
});
