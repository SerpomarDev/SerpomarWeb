document.getElementById("msform").addEventListener("submit", function (e) {
    e.preventDefault();

    //  // Obtener los valores de los campos
    //  const salarioBase = document.getElementById("salario_base").value;
    //  const bonificacion = document.getElementById("bonificacion").value;
 
    //  // Verificar si los valores son numéricos
    //  if (isNaN(salarioBase) || isNaN(bonificacion)) {
    //      Swal.fire({
    //          title: "Error",
    //          text: "Por favor, ingresa valores numéricos en los campos de Salario base y Bonificación.",
    //          icon: "error",
    //      });
    //      return; // Detener el envío si los valores no son numéricos
    //  }

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
      })
      .catch((error) => {
        Swal.fire({
          title: "Error",
          text: error.message || "Ha ocurrido un problema.",
          icon: "error",
      });
      });
  });