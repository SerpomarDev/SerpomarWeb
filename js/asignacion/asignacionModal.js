document.getElementById("saveAsignacion").addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(this);
  const jsonData = JSON.stringify(Object.fromEntries(formData));

  fetch("https://esenttiapp-production.up.railway.app/api/saveasignacion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al enviar los datos del formulario");
      }
      return response.json();
    })
    .then((data) => {
      Swal.fire({
        title: "¡Buen trabajo!",
        text: " La asignacion se ha creado de forma exitosa.",
        icon: "success"
      });
      setTimeout(() => {
        history.back();
      }, 1500);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});


document.querySelector(".modal-look .close").addEventListener("click", function() {
  document.querySelector(".modal-overlay").style.display = "none";
  history.back();
});
