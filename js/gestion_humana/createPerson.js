document.getElementById("msform").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    const jsonData = JSON.stringify(Object.fromEntries(formData));
    
    fetch("https://esenttiapp-production.up.railway.app/api/gestionHumana", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: jsonData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al enviar los datos del formulario");
        }
      })
      .then((data) => {
        Swal.fire({
          title: '¡Actualizado!',
          text: 'El registro ha sido actualizado.',
          icon: 'success',
          timer: 1000, // 1 segundo (o el tiempo que prefieras)
          timerProgressBar: true,
          toast: true,
          position: 'top-end',
          showConfirmButton: false
      }); 
      setTimeout(() => {
        window.location.href = `/view/gestion_humana/create.html`;
    }, 2000);
      })
      .catch((error) => {
        Swal.fire({
          title: "Error",
          text: error.message || "Ha ocurrido un problema.",
          icon: "error",
      });
      });
  });