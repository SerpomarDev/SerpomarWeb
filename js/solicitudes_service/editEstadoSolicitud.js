function actualizarEstado(id) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, procesar"
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://esenttiapp-production.up.railway.app/api/actualizarestado/${id}`, {
          method: 'put',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al eliminar el registro');
            }
            Swal.fire({
              title: "¡Procesado!",
              text: "Registro procesado con exito.",
              icon: "success"
            });
            location.reload()
          })
          .catch(error => {
            console.error('Error:', error);
            Swal.fire({
              title: "¡Error!",
              text: "Hubo un problema al intentar Procesar la solicitud.",
              icon: "error"
            });
          });
      }
    });
  }
