// Configuración Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBQh7eqWl_iu02oDPds3nQMigzSrHDOFn0",
    authDomain: "serpomar-driver-mysql-f8df6.firebaseapp.com",
    projectId: "serpomar-driver-mysql-f8df6",
    storageBucket: "serpomar-driver-mysql-f8df6.appspot.com",
    messagingSenderId: "840427888757",
    appId: "1:840427888757:web:b8250feec992a76510583c"
};

// Inicio Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('fileUploadModal');
    const span = document.querySelector('.close');
    let currentId;

    // Manejo de cierre del modal
    span.onclick = () => (modal.style.display = 'none');
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = 'none';
    };

    // Inicializar Dropzone
    if (Dropzone.instances.length > 0) Dropzone.instances.forEach(dz => dz.destroy());
    const myDropzone = new Dropzone('#HumanaSaveFile', {
        autoProcessQueue: false,
        acceptedFiles: '.pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.png,.jpeg',
        init: function () {
            this.on('addedfile', async function (file) {
                const id = currentId; // Usar ID actual
                let fileName = file.name;
                let filePath = `gestionHumana/${id}/${fileName}`;
                const storageRef = storage.ref(filePath);

                try {
                    const existingFiles = await storage.ref(`gestionHumana/${id}`).listAll();
                    const fileNames = existingFiles.items.map(item => item.name);

                    // Verificar duplicados
                    if (fileNames.includes(fileName)) {
                        const timestamp = Date.now();
                        const extension = fileName.substring(fileName.lastIndexOf('.'));
                        const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
                        fileName = `${nameWithoutExtension}_${timestamp}${extension}`;
                        filePath = `gestionHumana/${id}/${fileName}`;
                    }

                    const newStorageRef = storage.ref(filePath);
                    await newStorageRef.put(file);

                    console.log(`Archivo subido: ${fileName}`);
                    loadUploadedFiles(id);
                    this.removeFile(file);
                } catch (error) {
                    console.error('Error al subir el archivo:', error);
                }
            });
        }
    });

    // Función para abrir el modal y cargar archivos
    window.uploadId = async (id) => {
        currentId = id;
        modal.style.display = 'block';
        loadUploadedFiles(id);
    };

    // Cargar lista de archivos
    async function loadUploadedFiles(id) {
        const fileList = document.getElementById('uploadedFilesList');
        fileList.innerHTML = '';

        try {
            const listRef = storage.ref(`gestionHumana/${id}`);
            const res = await listRef.listAll();

            if (res.items.length === 0) {
                fileList.innerHTML = '<li>No hay archivos adjuntos.</li>';
            } else {
                for (const itemRef of res.items) {
                    const url = await itemRef.getDownloadURL();
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <a href="${url}" target="_blank">${itemRef.name}</a>
                        <button onclick="deleteFile('${id}', '${itemRef.name}')">Eliminar</button>
                    `;
                    fileList.appendChild(listItem);
                }
            }
        } catch (error) {
            console.error('Error al cargar los archivos:', error);
        }
    }

    // Eliminar un archivo
    window.deleteFile = async (id, fileName) => {
        try {
            const fileRef = storage.ref(`gestionHumana/${id}/${fileName}`);
            await fileRef.delete();
            console.log(`Archivo eliminado: ${fileName}`);
            loadUploadedFiles(id);
        } catch (error) {
            console.error('Error al eliminar el archivo:', error);
            alert('Ocurrió un error al eliminar el archivo.');
        }
    };
});