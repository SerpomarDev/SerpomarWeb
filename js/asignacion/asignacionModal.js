function cargarIdRuta(idRuta){

  document.getElementById("tarifa").addEventListener("change", function () {
    const dynamicInput = document.getElementById("tarifa");

    if (idRuta == 84 || idRuta == 85) {
      document.getElementById('tarifa').style.display = "block";
    } else {
      document.getElementById('tarifa').style.display =  "none";
    }
  });
}


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
       location.reload();
      },);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});


document.querySelector(".modal-look .close").addEventListener("click", function() {
  document.querySelector(".modal-overlay").style.display = "none";
  history.back();
});
