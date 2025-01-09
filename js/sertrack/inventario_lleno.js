import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getStorage, ref, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

// Configuración Firebase (copia la misma configuración de uploadFotos.js)
const firebaseConfig = {
    apiKey: "AIzaSyBQh7eqWl_iu02oDPds3nQMigzSrHDOFn0",
    authDomain: "serpomar-driver-mysql-f8df6.firebaseapp.com",
    projectId: "serpomar-driver-mysql-f8df6",
    storageBucket: "serpomar-driver-mysql-f8df6.appspot.com",
    messagingSenderId: "840427888757",
    appId: "1:840427888757:web:b8250feec992a76510583c"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const columnDefs = [
    { headerName: "id", field: "id", hide: false },
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
            value: ['EXPORTACION'],
            suppressSorting: true 
        }
    },

    { headerName: "Contenedor", field: "contenedor" },
    { headerName: "Tipo de contenedor", field: "tipo_contenedor" },
    { headerName: "Naviera", field: "naviera", editable: true  },
    { headerName: "Motonave", field: "motonave", editable: true },
    { headerName: "Pedido", field: "pedido", editable: true },
    { headerName: "Cutoff", field: "cutoff", editable: true},
    { headerName: "Dias en patio", field: "cantidad_dias" },
    { 
        headerName: "Fotos", 
        cellRenderer: params => {
            const button = document.createElement('button');
            button.className = 'border rounded bg-green-600';
            button.innerText = 'Fotos';
            button.onclick = () => abrirModalFotos(params.data.id);
            return button;
        }
    }
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
            motonave: ordenCargue.motonave,
            pedido: ordenCargue.pedido,
            cutoff: ordenCargue.cutoff,
            cantidad_dias: ordenCargue.cantidad_dias,
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
                    values: ['EXPORTACION'] 
                }
            });
        },

        onCellValueChanged: (event) => {
            const updatedRowData = event.data;
            const id = updatedRowData.id;

            // Mapear "motonave" a "moto_nave"
            const dataToSend = {
                ...updatedRowData,  // Copiar todas las propiedades de updatedRowData
                moto_nave: updatedRowData.motonave, // Reemplazar "motonave" con "moto_nave"
                vencimiento_cutoff: updatedRowData.cutoff  // Reemplazar "motonave" con "moto_nave"
            };
            delete dataToSend.motonave;  // Eliminar la propiedad "motonave" original
            delete dataToSend.cutoff;  // Eliminar la propiedad "motonave" original



            Swal.fire({
                title: 'Actualizando...',
                text: "Se actualizará la información en la base de datos",
                icon: 'info',
                timer: 1000,
                timerProgressBar: true,
                toast: true,
                position: 'top-end',
                showConfirmButton: false
            });

            setTimeout(() => {
                fetch(`https://esenttiapp-production.up.railway.app/api/ordencargue/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
                    },
                    body: JSON.stringify(dataToSend) // Usar dataToSend aquí
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al actualizar datos');
                    }
                    console.log('Datos actualizados correctamente');
                    Swal.fire({
                        title: '¡Actualizado!',
                        text: 'El registro ha sido actualizado.',
                        icon: 'success',
                        timer: 1000,
                        timerProgressBar: true,
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false
                    });
                })
                .catch(error => {
                    console.error('Error al actualizar datos:', error);
                    Swal.fire(
                        'Error',
                        'No se pudo actualizar el registro.',
                        'error'
                    );
                });
            }, 2000);
        }
    };
    
    // Renderizar la tabla en el contenedor
    const eGridDiv = document.getElementById('inventario');
    new agGrid.Grid(eGridDiv, gridOptions);

})
.catch(error => {
    console.error("Error al cargar los datos:", error);
});

// Función para abrir el modal de fotos
async function abrirModalFotos(id) {
    const fileList = document.getElementById('uploadedFilesList');
    fileList.innerHTML = '';

    try {
        const listRef = ref(storage, `orden_cargue/${id}`);
        const res = await listAll(listRef);

        if (res.items.length === 0) {
            const noFilesMessage = document.createElement('li');
            noFilesMessage.textContent = 'No hay archivos adjuntos.';
            fileList.appendChild(noFilesMessage);
        } else {
            for (const itemRef of res.items) {
                const url = await getDownloadURL(itemRef);
                const listItem = document.createElement('li');

                const imgPreview = document.createElement('img');
                imgPreview.src = url;
                imgPreview.alt = itemRef.name;
                imgPreview.style.maxWidth = '100px';
                imgPreview.style.maxHeight = '100px';
                imgPreview.style.cursor = 'pointer';
                imgPreview.onclick = () => showImageInModal(url, itemRef.name);

                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.textContent = itemRef.name;

                listItem.appendChild(imgPreview);
                listItem.appendChild(link);
                fileList.appendChild(listItem);
            }
        }

        const modal = document.getElementById('fileUploadModal');
        modal.style.display = 'block';

        // Limpiar el formulario de subida de archivos (opcional)
        const dropzoneElement = document.getElementById('SaveFile');
        if (dropzoneElement && Dropzone.instances.length > 0) {
            const dropzoneInstance = Dropzone.forElement(dropzoneElement);
            dropzoneInstance.removeAllFiles(true);
        }

    } catch (error) {
        console.error('Error loading uploaded files:', error);
        alert('Ocurrió un error al cargar los archivos adjuntos. Por favor, inténtelo de nuevo más tarde.');
    }
}

// Función para mostrar la imagen en el modal de detalles (si la tienes)
function showImageInModal(imageUrl, imageName) {
    const modalContent = document.getElementById('modalDetailsContent');
    modalContent.innerHTML = '';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
    img.alt = imageName;

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = imageName;

    modalContent.appendChild(img);
    modalContent.appendChild(figcaption);
    detailsModal.style.display = 'block'; 
}