
const columnDefsIM = [
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
        hide: true, rowGroup: true,
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
    { headerName: "Contenedor", field: "contenedor" },
    { headerName: "Tipo de contenedor", field: "tipo_contenedor" },
    { headerName: "Dias en patio", field: "cantidad_dias" },

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
            cantidad_dias: ordenCargue.cantidad_dias,
        };
    });

    const gridOptions = {
        columnDefs: columnDefsIM,
        defaultColDef: {
          resizable: true,
          sortable: false,
          flex: 1,
          minWidth: 100,
        },
        groupDisplayType: "groupRows",
        groupDefaultExpanded: 0, 
        enableRangeSelection: true,
        suppressMultiRangeSelection:true,
        rowData: processedData,

        rowData: processedData,
        onGridReady: params => { // Aplicar filtro al iniciar la grilla
            params.api.setFilterModel({
                'lleno_vacio': {
                    filterType: 'set',
                    values: ['VACIO'] 
                },
                'cliente': {
                    filterType: 'set',
                    values: ['ESENTTIA S A'] 
                },
                'modalidad': {
                    filterType: 'set',
                    values: ['IMPORTACION'] 
                }
            });
        },

        rowSelection: 'multiple',
        enableRangeSelection: true,
        suppressMultiRangeSelection: true,
        rowData: processedData,
  
    };
    
    // Renderizar la tabla en el contenedor
    const eGridDiv = document.getElementById('vacios-impo');
    new agGrid.Grid(eGridDiv, gridOptions);

})
.catch(error => {
    console.error("Error al cargar los datos:", error);
});


