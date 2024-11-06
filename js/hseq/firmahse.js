var canvas = document.getElementById('firma');
var signaturePad = new SignaturePad(canvas, {
  backgroundColor: 'rgb(250, 250, 250)' // Fondo blanco para el canvas
});

document.getElementById('limpiarFirma').addEventListener('click', function () {
  signaturePad.clear();
});

document.getElementById('guardarFirma').addEventListener('click', function () {
  if (signaturePad.isEmpty()) {
    alert("Por favor, firme en el campo.");
  } else {
    var dataURL = signaturePad.toDataURL('image/png');
    // Aquí puedes enviar la dataURL a tu servidor para guardarla
    console.log(dataURL); 
  }
});
