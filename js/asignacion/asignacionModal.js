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

// function time() {
//   document.getElementById("saveAsignacion").reset();
//   setTimeout(() => {
//     window.location.href = `onclick="history.back()"`;
//   }, 1500);
// }

document.querySelector(".modal-look .close").addEventListener("click", function() {
  document.querySelector(".modal-overlay").style.display = "none";
  history.back();
});

// // Opcional: manejar el cierre del modal al presionar la tecla ESC
// document.addEventListener("keydown", function(event) {
//   if (event.key === "Escape") {
//     document.querySelector(".modal-overlay").style.display = "none";
//     history.back();
//   }
// });