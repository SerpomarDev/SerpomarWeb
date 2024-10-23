

async function generarTablaDatos() {
  try {
    // Obtener el token del localStorage
    const token = localStorage.getItem('authToken'); 

    // Realizar la solicitud fetch al endpoint, incluyendo el token en las cabeceras
    const response = await fetch("https://esenttiapp-production.up.railway.app/api/esenttialleno", {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });

    const data = await response.json(); 

    // Obtener la tabla HTML y el cuerpo de la tabla (<tbody>)
    const tabla = document.getElementById('tabla-vacio'); // Id corregido
    const tbody = tabla.querySelector('tbody'); 

    // Limpiar solo el cuerpo de la tabla (<tbody>)
    tbody.innerHTML = ""; 

    // Crear las filas de la tabla 
    data.forEach(item => {
      const fila = tbody.insertRow(); 
      fila.insertCell().textContent = item.cliente;
      fila.insertCell().textContent = item.contenedor;
      fila.insertCell().textContent = item.tipo_contenedor;
      fila.insertCell().textContent = item.cutoff;
      fila.insertCell().textContent = item.cantidad_dias;

      // Crear una celda con un botón
      const celdaBoton = fila.insertCell();
      const boton = document.createElement('button');
      boton.textContent = 'fotos'; // Texto del botón
      boton.addEventListener('click', function() {
        abrirModalFotos(item.id); 
      });
      celdaBoton.appendChild(boton);
    });
  } catch (error) {
    console.error("Error al obtener o procesar los datos:", error);
    // Manejo de errores (mostrar un mensaje al usuario, etc.)
  }
}


// Llamar a la función para generar la tabla
generarTablaDatos();

async function abrirModalFotos(id) {
  const fileList = document.getElementById('uploadedFilesList');
  //fileList.innerHTML = '';

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