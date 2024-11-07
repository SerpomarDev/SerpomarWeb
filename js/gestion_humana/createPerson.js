document.getElementById("msform").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    const jsonData = JSON.stringify(Object.fromEntries(formData));
    
    fetch("http://esenttiapp.test/api/gestionHumana", {
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
          title: "¡Buen trabajo!",
          text: "¡Se ha creado con exito",
          icon: "success",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });