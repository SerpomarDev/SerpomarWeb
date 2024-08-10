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
    const idAsignacion = getQueryParam('id');
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
        uploadId(idAsignacion);
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