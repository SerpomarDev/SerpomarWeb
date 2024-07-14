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

// Genera un UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    const modal = document.getElementById('fileUploadModal');
    const span = document.getElementsByClassName('close')[0];
    const idAsignacion = getQueryParam('id'); // Obtiene el ID de la solicitud desde la URL

    span.onclick = function () {
        modal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    document.getElementById('btnAdjuntos').onclick = function () {
        uploadId(idAsignacion);
    }

    async function uploadId(id) {
        modal.style.display = 'block';
        if (Dropzone.instances.length > 0) {
            Dropzone.instances.forEach(dz => dz.destroy());
        }
        const myDropzone = new Dropzone('#SaveFile', {
            autoProcessQueue: false,
            acceptedFiles: '.pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.png,.jpeg',
            init: function () {
                this.on('addedfile', async function (file) {
                    let fileName = file.name;
                    let filePath = `spcontenedores/${id}/${fileName}`;
                    const storageRef = ref(storage, filePath);

                    // Verifica si el archivo ya existe
                    const existingFiles = await listAll(ref(storage, `spcontenedores/${id}`));
                    const fileNames = existingFiles.items.map(item => item.name);

                    // Si el nombre del archivo ya existe, añade un timestamp
                    if (fileNames.includes(fileName)) {
                        const timestamp = Date.now();
                        const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
                        const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
                        fileName = `${fileNameWithoutExtension}_${timestamp}${fileExtension}`;
                        filePath = `spcontenedores/${id}/${fileName}`;
                    }

                    const newStorageRef = ref(storage, filePath);

                    try {
                        await uploadBytes(newStorageRef, file);
                        console.log(`File uploaded: ${fileName}`);
                        // Actualizar la lista de archivos adjuntos después de una carga exitosa
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
            const listRef = ref(storage, `spcontenedores/${id}`);
            const res = await listAll(listRef);

            if (res.items.length === 0) {
                const noFilesMessage = document.createElement('li');
                noFilesMessage.textContent = 'No hay archivos adjuntos.';
                fileList.appendChild(noFilesMessage);
            } else {
                for (const itemRef of res.items) {
                    const url = await getDownloadURL(itemRef);
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = url;
                    link.target = '_blank';  // Abre en una nueva pestaña
                    link.textContent = itemRef.name;
                    listItem.appendChild(link);
                    fileList.appendChild(listItem);
                }
            }
        } catch (error) {
            console.error('Error loading uploaded files:', error);
            alert('Ocurrió un error al cargar los archivos adjuntos. Por favor, inténtelo de nuevo más tarde.');
        }
    }
});
