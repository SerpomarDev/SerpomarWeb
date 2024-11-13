const columnDefs = [
    { headerName: "ID Primario", field: "id_primario" , hide:true},
    { headerName: "SP",
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
   
    { headerName: "Fecha Documental", field: "fecha_documental" },
    { headerName: "Fecha Cutoff F.", field: "fecha_cutoff_fisico" },
 
    { headerName: "Libre Hasta", field: "libre_hasta" },
    { headerName: "Bodegaje Hasta", field: "bodegaje_hasta" },
   

   
    { headerName: "Estado", field: "estado" }
];

fetch("https://esenttiapp-production.up.railway.app/api/registroestadistico", {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
})
.then((response) => response.json())
.then((data) => {
    const processedData = data.map((item) => {
        return {
            id_primario: item.id_primario,
            sp: item.sp,

            fecha_documental: item.fecha_documental,
            fecha_cutoff_fisico: item.fecha_cutoff_fisico,

            libre_hasta: item.libre_hasta,
            bodegaje_hasta: item.bodegaje_hasta,

            estado: item.estado,
        };
    });

    const gridOptions = {
        columnDefs: columnDefs,
        defaultColDef: {
            resizable: true,
            sortable: true,
            filter: "agTextColumnFilter",
            floatingFilter: true,
            editable: true
        },
        pagination: true,
        paginationPageSize: 20,
        rowData: processedData,
    };

    const eGridDiv = document.getElementById("registro_estadistico");
    new agGrid.Grid(eGridDiv, gridOptions);
})
.catch((error) => {
    console.error("Error al cargar los datos:", error);
});

function showOrdenService(id){
    window.location.href = `/view/contenedor/create.html?id=${id}`
}
