const columnDefs = [
    { headerName: "id", field: "id_contenedor", hide: true },
    { headerName: "SP", field: "sp" },
    { headerName: "DO pedido", field: "do_pedido" },
    { headerName: "Pedido", field: "pedido" },
    { headerName: "Contenedor", field: "contenedor" },
    { headerName: "Cliente", field: "cliente" },
    {
        headerName: "Accion",
        cellRenderer: params => {
            const id = params.data.id;
            return `<button class="py- mb-4 px-4 bg-blue-600" onclick="actualizarFactura('${params.data.id_contenedor}')">Programar</button>`;
        }
    }
];

fetch("https://esenttiapp-production.up.railway.app/api/uploadpreprogramar", {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
})
.then(response => {
    if (!response.ok) { 
        throw new Error(`Error de red: ${response.status}`); 
    }
    return response.json(); 
})
.then(data => {
    const processedData = data.map(Preprogramar => {
        return {
            id_contenedor: Preprogramar.id_contenedor,
            sp: Preprogramar.sp,
            do_pedido: Preprogramar.do_pedido,
            pedido: Preprogramar.pedido,
            contenedor: Preprogramar.contenedor,
            cliente: Preprogramar.cliente,
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
        rowSelection: 'multiple',
        enableRangeSelection: true,
        suppressMultiRangeSelection: true,
        pagination: true,
        paginationPageSize: 20,
        rowData: processedData,
    };

    const eGridDiv = document.getElementById('preprogramar');
    new agGrid.createGrid(eGridDiv, gridOptions);
})
.catch(error => {
    console.error("Error al cargar los datos:", error);
    // Manejo de errores más específico
    if (error.message.includes('Network response')) {
        alert("Error de red al obtener los datos. Por favor, verifica tu conexión a internet.");
    } else if (error.message.includes('Unexpected token')) {
        alert("Error al procesar los datos del servidor. Por favor, intenta de nuevo más tarde."); 
    } else {
        alert("Se ha producido un error. Por favor, contacta al administrador.");
    }
});

function actualizarFactura(id_contenedor) {
    const modal = document.getElementById("myModal");
    modal.classList.remove("hidden");
    modal.style.display = "flex";
    document.getElementById('id_contenedor').value = id_contenedor;
}

function closeModal() {
    console.log("Botón Cerrar presionado");
    const modal = document.getElementById("myModal");
    modal.classList.add("hidden");
    modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
    modal.classList.add("hidden");
});