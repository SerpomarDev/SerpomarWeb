const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', () => {
  const contenedorBuscado = searchInput.value;

  // Realizar la petición fetch al endpoint
  fetch("https://esenttiapp-production.up.railway.app/api/searchcontendor", {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Filtrar los datos para encontrar el contenedor
        const contenedorEncontrado = data.data.find(contenedor => contenedor.numero_contenedor === contenedorBuscado);

        if (contenedorEncontrado) {
          // Mostrar la información del contenedor en un SweetAlert2 modal
          Swal.fire({
            title: `Información del contenedor ${contenedorBuscado}`,
            html: `
              <p><b>SP:</b> ${contenedorEncontrado.sp}</p>
              <p><b>Pedido:</b> ${contenedorEncontrado.pedido}</p>
              <p><b>Cliente:</b> ${contenedorEncontrado.cliente}</p>
              <p><b>Modalidad:</b> ${contenedorEncontrado.modalidad}</p>
              <p><b>Estado:</b> ${contenedorEncontrado.estado}</p>
            `,
            icon: 'info',
            confirmButtonText: 'Cerrar'
          });

        } else {
          // Mostrar un mensaje si no se encuentra el contenedor
          Swal.fire({
            title: 'Contenedor no encontrado',
            text: 'Por favor, verifique el número de contenedor e intente nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }

      } else {
        // Mostrar un mensaje de error si la petición falla
        Swal.fire({
          title: 'Error',
          text: 'No se pudo obtener la información de los contenedores.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al procesar la solicitud.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });
});