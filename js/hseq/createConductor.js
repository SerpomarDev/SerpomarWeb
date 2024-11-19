
const columnDefs = [
    { headerName: "#", field: "id", hide: true },
    { headerName: "Nombre", field: "nombre" },
    { headerName: "Cedula", field: "identificacion" },
    { headerName: "Telefono", field: "telefono" },
    {
        headerName: 'Editar',
        hide: true,
        cellRenderer: params => {
            const link = document.createElement('a');
            link.href = '/view/hseq/conductores_edit.html',
            link.addEventListener('click', (e) => {
                e.preventDefault();
                editConductor(params.data.id);
            });
            const img = document.createElement('img');
            img.src = '/img/editar-texto.png';
            img.alt = 'Actualizar';
            img.style.width = '20px';
            img.style.height = '20px';
            link.appendChild(img);
            return link;
        }
    },
    
    
];

const eGridDiv = document.getElementById('conductores');

const gridContainer = document.createElement('div');
gridContainer.style.width = '90%';
gridContainer.style.height = '600px';
gridContainer.style.margin = '20px auto';
eGridDiv.appendChild(gridContainer); 

fetch("https://esenttiapp-production.up.railway.app/api/uploadconductor", {
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


function time() {
    document.getElementById('createConductor').reset();
    setTimeout(() => {
        window.location.href = `/view/seguridad/conductores_crear.html`;
    }, 1200);
}


function editConductor(id) {
    window.location.href = `/view/seguridad/conductores_edit.html?id=${id}`
}



// Handle modal close
$('.close').on('click', function() {
    $('#fileUploadModal').hide();
});
