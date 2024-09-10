const cantidadFacturados = localStorage.getItem('cantidadFacturados');
const cantidadContenedor = localStorage.getItem('cantidadContenedor');

const columnDefs = [
    { headerName: "#", field: "id_primario", hide: true },
    {
        headerName: "SP",
        field: "do_sp",
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
    { headerName: "DO Pedido", field: "do_pedido" },
    { headerName: "Pedido", field: "pedido" },
    { headerName: "Contenedores", field: "contenedor" },
    { headerName: "Tipo Transporte", field: "impexp" },
    { headerName: "Cliente", field: "cliente" },
    { headerName: "Fecha Entrada", field: "fecha_actualizacion" },
    { headerName: "Pendiente Liquidar", field: "pendiente_liquidar" },
    {
        headerName: "Acciones",
        hide: true,
        cellRenderer: params => {
            const container = document.createElement('div');

            // Botón Actualizar
            const updateBtn = document.createElement('a');
            updateBtn.href = '#';
            updateBtn.onclick = (e) => {
                e.preventDefault();
                edit(params.data.id_primario);
            };
            const updateIcon = document.createElement('img');
            updateIcon.src = '/img/editar-texto.png';
            updateIcon.alt = 'Actualizar';
            updateIcon.style.width = '20px';
            updateIcon.style.height = '20px';
            updateBtn.appendChild(updateIcon);

            // Botón Eliminar
            const deleteBtn = document.createElement('a');
            deleteBtn.href = '#';
            deleteBtn.onclick = (e) => {
                e.preventDefault();
                deleteRow(params.data.id_primario);
            };
            const deleteIcon = document.createElement('img');
            deleteIcon.src = '/img/basura.png';
            deleteIcon.alt = 'Eliminar';
            deleteIcon.style.width = '20px';
            deleteIcon.style.height = '20px';
            deleteBtn.appendChild(deleteIcon);

            // Añadir los botones al contenedor
            container.appendChild(updateBtn);
            container.appendChild(deleteBtn);

            return container;
        }
    }
];

fetch("https://esenttiapp-production.up.railway.app/api/showsolicitudserv", {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const processedData = data.map(asigControl => {
            return {
                id_primario: asigControl.id_primario,
                do_sp: asigControl.do_sp,
                do_pedido: asigControl.do_pedido,
                pedido: asigControl.pedido,
                contenedor: asigControl.contenedor,
                impexp: asigControl.impexp,
                cliente: asigControl.cliente,
                fecha_actualizacion: asigControl.fecha_actualizacion,
                pendiente_liquidar: asigControl.pendiente_liquidar
            };
        });


        // Configurar la tabla con los datos procesados
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

        const eGridDiv = document.getElementById('ordenService');
        new agGrid.Grid(eGridDiv, gridOptions);
    })
    .catch(error => {
        console.error("Error al cargar los datos:", error);
    });


function showOrdenService(id) {
    window.location.href = `/view/contenedor/create.html?id=${id}`
}