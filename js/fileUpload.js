// SDKs necesario
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

// configuracion firebase
const firebaseConfig = {
    apiKey: "AIzaSyBQh7eqWl_iu02oDPds3nQMigzSrHDOFn0",
    authDomain: "serpomar-driver-mysql-f8df6.firebaseapp.com",
    projectId: "serpomar-driver-mysql-f8df6",
    storageBucket: "serpomar-driver-mysql-f8df6.appspot.com",
    messagingSenderId: "840427888757",
    appId: "1:840427888757:web:b8250feec992a76510583c"
};

// inicio Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

document.addEventListener('DOMContentLoaded', (event) => {
    const modal = document.getElementById('fileUploadModal');
    const span = document.getElementsByClassName('close')[0];
    let currentRowIndex;

    span.onclick = function () {
        modal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    window.handleFileUpload = function (event) {
        currentRowIndex = event.target.getAttribute('data-row-index');
        modal.style.display = 'block';
    }

    function uploadId(id) {
        document.getElementById('id_asignacion').value = id;
        modal.style.display = 'block';
        if (Dropzone.instances.length > 0) {
            Dropzone.instances.forEach(dz => dz.destroy());
        }
        const myDropzone = new Dropzone('#SaveFile', {
            autoProcessQueue: false,
            acceptedFiles: '.pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.png,.jpeg',
            init: function () {
                this.on('addedfile', async function (file) {
                    const id = document.getElementById('id_asignacion').value;
                    const storageRef = ref(storage, `uploads/${id}/${file.name}`);
                    try {
                        await uploadBytes(storageRef, file);
                        console.log(`File uploaded: ${file.name}`);
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
            const listRef = ref(storage, `uploads/${id}`);
            const res = await listAll(listRef);

            if (res.items.length === 0) {
                const noFilesMessage = document.createElement('li');
                noFilesMessage.textContent = 'No hay archivos adjuntos.';
                fileList.appendChild(noFilesMessage);
            } else {
                res.items.forEach((itemRef) => {
                    getDownloadURL(itemRef).then((url) => {
                        const listItem = document.createElement('li');
                        const link = document.createElement('a');
                        link.href = url;
                        link.textContent = itemRef.name;
                        listItem.appendChild(link);
                        fileList.appendChild(listItem);
                    });
                });
            }
        } catch (error) {
            console.error('Error loading uploaded files:', error);
            alert('Ocurrió un error al cargar los archivos adjuntos. Por favor, inténtelo de nuevo más tarde.');
        }
    }

    window.uploadId = uploadId;
});
