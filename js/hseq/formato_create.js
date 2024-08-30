// Manejo del evento 'submit' del formulario
document.getElementById('fnovedad').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    // Convertir los datos del formulario a JSON, escapando caracteres especiales si es necesario
    const jsonData = JSON.stringify(Object.fromEntries(formData), (key, value) => {
        if (typeof value === 'string') {
            return value.replace(/\n/g, ' ').replace(/\t/g, ' ');
        }
        return value;
    });

    fetch('https://esenttiapp-production.up.railway.app/api/formatonovedad', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            },
            body: jsonData
        })
        .then(response => {
            if (!response.ok) {
                // Manejo de errores del servidor con más detalle
                if (response.status === 400) { // Ejemplo: Bad Request
                    return response.json().then(data => {
                        throw new Error("Solicitud incorrecta: " + data.message || "Verifique los datos del formulario.");
                    });
                }
            } else {
                return response.text().then(text => {
                    console.log("Respuesta del servidor:", text);
                    if (text.includes("formato creado exitosamente") || text.includes("mensaje de éxito similar del servidor")) {
                        Swal.fire({
                            title: "¡Buen trabajo!",
                            text: "Has Creado el formato.",
                            icon: "success",
                        });
                        time();
                    } else {
                        Swal.fire({ // Cambiado a SweetAlert de éxito
                            title: "¡Bien hecho!",
                            text: "formato creado correctamente",
                            icon: "success",
                        });
                        time();
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error al generar el formato:', error);
            Swal.fire({
                title: "Error",
                text: error.message || "Hubo un problema al crear el formato. Por favor, inténtalo de nuevo.",
                icon: "error",
            });
        });
});

function time() {
    document.getElementById('fnovedad').reset();
    setTimeout(() => {
        window.location.href = `/view/hseq/formato_novedad.html`;
    }, 1200);
}