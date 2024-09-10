document.getElementById('inspeccionForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío por defecto del formulario

    // Obtén los datos del formulario
    const formData = new FormData(this);

    // Envía los datos al servidor
    fetch('/ruta-a-tu-servidor', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json()) // Asumiendo que el servidor responde con JSON
    .then(data => {
        // Maneja la respuesta del servidor
        console.log('Éxito:', data);
        alert('Formulario enviado con éxito!');
    })
    .catch(error => {
        // Maneja errores
        console.error('Error:', error);
        alert('Error al enviar el formulario. Inténtalo de nuevo.');
    });
});
