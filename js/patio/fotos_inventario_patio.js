// SDKs necesarios
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

// Configuración Firebase
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

// Función para obtener el ID de la solicitud desde la URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

document.addEventListener('DOMContentLoaded', (event) => {
    const modal = document.getElementById('fileUploadModal');
    const span = document.getElementsByClassName('close')[0];
    const id_placa = getQueryParam('id');
    const detailsModal = document.getElementById('detailsModal');
    const closeModal = document.getElementById('closeModal');

    span.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    closeModal.onclick = function() {
        detailsModal.style.display = 'none';
    }

    document.getElementById('btnAdjuntos').onclick = function() {
        uploadId(id_placa);
    }

    async function uploadId(id) {
        modal.style.display = 'block';
        if (Dropzone.instances.length > 0) {
            Dropzone.instances.forEach(dz => dz.destroy());
        }
        const myDropzone = new Dropzone('#SaveFile', {
            autoProcessQueue: false,
            acceptedFiles: 'image/*', // Accept only image files
            init: function() {
                this.on('addedfile', async function(file) {
                    let fileName = file.name;
                    let filePath = `orden_cargue/${id}/${fileName}`;
                    const storageRef = ref(storage, filePath);

                    // Check if the file already exists
                    const existingFiles = await listAll(ref(storage, `orden_cargue/${id}`));
                    const fileNames = existingFiles.items.map(item => item.name);

                    // If the file name already exists, add a timestamp
                    if (fileNames.includes(fileName)) {
                        const timestamp = Date.now();
                        const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
                        fileName = `${fileName.substring(0, fileName.lastIndexOf('.'))}_${timestamp}${fileExtension}`;
                        filePath = `orden_cargue/${id}/${fileName}`;
                    }

                    const newStorageRef = ref(storage, filePath);
                    try {
                        await uploadBytes(newStorageRef, file);
                        console.log(`File uploaded: ${fileName}`);
                        loadUploadedFiles(id);
                        this.removeFile(file);
                    } catch (error) {
                        console.error('Error uploading file:', error);
                    }
                });
            }
        });
        loadUploadedFiles(id);
    }

    async function loadUploadedFiles(id) {
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

                    // Create image element for preview
                    const imgPreview = document.createElement('img');
                    imgPreview.src = url;
                    imgPreview.alt = itemRef.name;
                    imgPreview.style.maxWidth = '100px';
                    imgPreview.style.maxHeight = '100px';
                    imgPreview.style.cursor = 'pointer';
                    imgPreview.onclick = () => showImageInModal(url, itemRef.name);

                    // Create link for opening in new tab
                    const link = document.createElement('a');
                    link.href = url;
                    link.target = '_blank';
                    link.textContent = itemRef.name;

                    listItem.appendChild(imgPreview);
                    listItem.appendChild(link);
                    fileList.appendChild(listItem);
                }
            }
        } catch (error) {
            console.error('Error loading uploaded files:', error);
            alert('Ocurrió un error al cargar los archivos adjuntos. Por favor, inténtelo de nuevo más tarde.');
        }
    }

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
});

function actualizarEstado(idOperacion, nuevoEstado) {
    fetch(`https://esenttiapp-production.up.railway.app/api/actualizaroperacionp/${nuevoEstado}/${idOperacion}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({
                estado: nuevoEstado,
                id: idOperacion
            }),
        })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(({ status, body }) => {
            if (status === 400 && body.message === 'El contenedor no tiene una entrada registrada.') {
                Swal.fire({
                    title: "Advertencia",
                    text: body.message,
                    icon: "warning"
                });
            } else if (status >= 200 && status < 300) {
                Swal.fire({
                    title: "¡Buen trabajo!",
                    text: "Estado actualizado!",
                    icon: "success"
                });
                time();
            } else {
                throw new Error(body.message);
            }
        })
        .catch((error) => {
            console.error('Error al actualizar el estado:', error);
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error"
            });
        });
}

function comentario(id, comentario) {
    fetch(`https://esenttiapp-production.up.railway.app/api/actualizarcomentario/${comentario}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({
                id: id,
                comentario: comentario
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Comentario guardado con éxito:', data);
            Swal.fire({
                title: "¡Buen trabajo!",
                text: "Comentario guardado!",
                icon: "success"
            });
            time()
        })
        .catch((error) => {
            console.error('Error al guardar el comentario:', error);
        });
}

new gridjs.Grid({
    sort: false,
    columns: [
        { name: "id", hidden: false },
        "contenedor",
        "Tipo",
        { name: "Comentarios", hidden: true },
        {
            name: 'Acción',
            formatter: (cell, row) => {
                const operacion = row.cells[6].data;
                const idOperacion = row.cells[0].data; // Get the ID of the operation

                const selectElement = gridjs.h('select', {
                    onchange: async(e) => {
                        const nuevoEstado = e.target.value;

                        // Check if at least 3 photos have been uploaded
                        const listRef = ref(storage, `orden_cargue/${idOperacion}`);
                        const res = await listAll(listRef);
                        if (res.items.length < 3 && nuevoEstado !== '') {
                            Swal.fire({
                                title: "Advertencia",
                                text: "Debe adjuntar al menos 3 fotos antes de modificar el estado.",
                                icon: "warning"
                            });
                            e.target.value = ''; // Reset the select value
                            return;
                        }

                        actualizarEstado(idOperacion, nuevoEstado);
                        if (nuevoEstado === 'RECHAZADO') {
                            e.target.disabled = true;
                        }
                    },
                    disabled: operacion === 'RECHAZADO'
                }, [
                    gridjs.h('option', { value: '' }, 'Seleccione'),
                    gridjs.h('option', { value: 'ENTRADA' }, 'ENTRADA'),
                    gridjs.h('option', { value: 'SALIDA' }, 'SALIDA'),
                    gridjs.h('option', { value: 'RECHAZADO' }, 'RECHAZADO'),
                ]);
                return selectElement;
            },
        },
        {
            name: "Observacion",
            hidden: true,
            formatter: (cell, row) => {
                return gridjs.html(`<textarea id="observacion-${row.cells[0].data}">${''}</textarea>`);
            }
        },
        {
            name: 'Acción',
            hidden: true,
            formatter: (cell, row) => {
                return gridjs.h('button', {
                    className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
                    onClick: () => {
                        const comentarioTexto = document.getElementById(`observacion-${row.cells[0].data}`).value;
                        comentario(row.cells[0].data, comentarioTexto);
                    }
                }, 'guardar');
            }
        }
    ],
    fixedHeader: true,
    server: {
        url: 'https://esenttiapp-production.up.railway.app/api/uploadordencargue',
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        then: (data) => {
            const urlParams = new URLSearchParams(window.location.search);
            const idFromUrl = urlParams.get('id');

            if (Array.isArray(data) && data.length > 0) {
                const filteredData = data.filter(ordenCargue => ordenCargue.id == idFromUrl);

                if (filteredData.length === 0) {
                    const errorMessage = `No se encontraron registros con el ID ${idFromUrl}`;
                    document.getElementById('acceso').innerHTML = `<p class="text-center text-red-500">${errorMessage}</p>`;
                    return [];
                }

                return filteredData.map((ordenCargue) => [
                    ordenCargue.id,
                    ordenCargue.contenedor,
                    ordenCargue.tipo_contenedor,
                ]);
            } else {
                document.getElementById('acceso').innerHTML = '<p class="text-center">No hay datos disponibles.</p>';
                return [];
            }
        }
    },
    resizable: true,
    style: {
        table: { width: "100%" }
    }
}).render(document.getElementById('acceso'));

localStorage.setItem("authToken", data.token);

function time() {
    document.getElementById('craeateAccesoPatio').reset();
    setTimeout(() => {
        window.location.href = `/view/patio/inventario.html`;
    }, 1200);
}

function salidaContenedor($contenedor, $operacion) {
    fetch(`https://esenttiapp-production.up.railway.app/api/actualizaroperacionp/${contenedor}/${operacion}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({
                estado: nuevoEstado,
                id: idOperacion
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Estado actualizado con éxito:', data);
            Swal.fire({
                title: "¡Buen trabajo!",
                text: "Orden actualizada!",
                icon: "success"
            });
            time()
        })
        .catch((error) => {
            console.error('Error al actualizar el estado:', error);
        });
}