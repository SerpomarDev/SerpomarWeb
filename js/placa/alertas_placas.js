const columnDefs = [
    { headerName: "id", field: "id", hide: false },
    { headerName: "# Abjuntos", field: "aqui la cantidad", hide: true },
    {
        headerName: "Tecnomecánica",
        cellRenderer: params => createDaysRemainingElement(params.data.fecha_vencimientot)
    },
    {
        headerName: "SOAT",
        cellRenderer: params => createDaysRemainingElement(params.data.fecha_vencimientos)
    },

    { headerName: "Placa", field: "placa" },
    { headerName: "Tipologia", field: "tipologia" },
    { headerName: "Propietario", field: "nombre" },
    { headerName: "Razon social", field: "razon_social" },
    { headerName: "soat", field: "soat" },
    { headerName: "soat vence", field: "fecha_vencimientos" },
    { headerName: "num. poliza", field: "numero_poliza" },
    { headerName: "tecnomecanica", field: "tecnomecanica" },
    { headerName: "tec. vencimiento", field: "fecha_vencimientot" },
    {
        headerName: 'Documentos',
        cellRenderer: params => createButton('Adjuntos', params.data.id)
    },
    {
        headerName: 'Editar',
        cellRenderer: params => createEditLink('/view/Placa/edit.html', params.data.id)
    }
];

function getDaysRemaining(dateString) {
    if (!dateString) return null;

    const expiryDate = moment(dateString);
    const today = moment();
    const days = expiryDate.diff(today, 'days');

    return days;
}

function createDaysRemainingElement(dateString) {
    const daysRemaining = getDaysRemaining(dateString);
    const element = document.createElement('div');
    element.style.textAlign = 'center';
    element.style.padding = '5px';
    element.style.borderRadius = '5px';
    element.style.fontWeight = 'bold';
    element.style.display = 'flex';
    element.style.justifyContent = 'center';
    element.style.alignItems = 'center';
    element.style.minHeight = '30px';

    if (daysRemaining === null || daysRemaining === "") {
        element.innerText = "";
        return element;
    }

    if (daysRemaining < 0) {
        element.innerText = "Vencido";
        element.style.color = "white";
        element.style.backgroundColor = "red";
    } else if (daysRemaining === 0) {
        element.innerText = "Vence hoy";
        element.style.color = "white";
        element.style.backgroundColor = "red";
    } else if (daysRemaining <= 30) {
        element.innerText = `-${daysRemaining} día${daysRemaining !== 1 ? 's' : ''}`;
        element.style.color = "black";
        element.style.backgroundColor = "orange";
    } else if (daysRemaining > 30) { // New condition for green color
        element.innerText = `- ${daysRemaining} día${daysRemaining !== 1 ? 's' : ''}`;
        element.style.color = "white";
        element.style.backgroundColor = "green"; // Green background for more than 30 days
    } else {
        element.innerText = `- ${daysRemaining} día${daysRemaining !== 1 ? 's' : ''}`;
    }

    return element;
}

function createButton(text, id) {
    const button = document.createElement('button');
    button.innerHTML = text;
    button.setAttribute('id', `btn-${id}`);
    button.classList.add('upload-btn', 'no-file');
    button.addEventListener('click', () => uploadId(id));
    return button;
}

function createEditLink(href, id) {
    const link = document.createElement('a');
    link.href = href;
    link.addEventListener('click', (e) => {
        e.preventDefault();
        editPlaca(id);
    });
    const img = document.createElement('img');
    img.src = '/img/editar-texto.png';
    img.alt = 'Actualizar';
    img.style.width = '20px';
    img.style.height = '20px';
    link.appendChild(img);
    return link;
}

const eGridDiv = document.getElementById('Placa');
const gridContainer = document.createElement('div');
gridContainer.style.width = '90%';
gridContainer.style.height = '800px';
gridContainer.style.margin = '20px auto';
eGridDiv.appendChild(gridContainer);
fetch("https://esenttiapp-production.up.railway.app/api/cargarplaca", {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
})
.then(response => response.json())
.then(data => {
    // Filtrar los datos aquí
    const filteredData = data.filter(item => item.inactivo === 0); 

    const rowData = Array.isArray(filteredData) && filteredData.length > 0 
                    ? filteredData.sort((b, a) => b.id - a.id) 
                    : [];

    const gridOptions = {
        columnDefs,
        defaultColDef: { resizable: true, sortable: false, filter: "agTextColumnFilter", floatingFilter: true, flex: 1, minWidth: 100 },
        pagination: true,
        paginationPageSize: 20,
        rowData
    };

    new agGrid.Grid(gridContainer, gridOptions);
})
.catch(error => console.error("Error al cargar los datos:", error));

function time() {
    document.getElementById('createPlaca').reset();
    setTimeout(() => {
        window.location.href = `/view/placa/create.html`;
    }, 1200);
}

function editPlaca(id) {
    window.location.href = `/view/placa/edit_alert.html?id=${id}`
}

function deletePlaca(id) {
    DeleteData(id)
}

function uploadId(id) {
    $('#fileUploadModal').show();
    $('#id_asignacion').val(id);

    const myDropzone = new Dropzone("#SaveFile", {
        url: "/upload",
        init: function() {
            this.on("success", function(file, response) {
                const button = document.getElementById(`btn-${id}`);
                if (button) {
                    button.classList.remove('no-file');
                    button.classList.add('file-uploaded');
                }
                $('#fileUploadModal').hide();
            });
        }
    });
}

$('.close').on('click', function() {
    $('#fileUploadModal').hide();
});