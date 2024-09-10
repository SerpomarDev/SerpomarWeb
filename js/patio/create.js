// Escuchar el evento del formulario para enviarlo
document.getElementById('createOrdenCargue').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const jsonData = JSON.stringify(Object.fromEntries(formData));

    fetch('https://esenttiapp-production.up.railway.app/api/ordencargue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            },
            body: jsonData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al enviar los datos del formulario');
            }
            return response;
        })
        .then(response => {
            if (response.ok) {
                return fetch('https://esenttiapp-production.up.railway.app/api/ultimoresgistrood', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
                    }
                });
            } else {
                throw new Error('Form submission failed');
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el último ID de la orden de cargue');
            }
            return response.json();
        })
        .then(data => {
            const ordenCargueId = data;

            Swal.fire({
                icon: 'success',
                title: 'Formulario enviado',
                text: 'El formulario ha sido enviado con éxito.',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('ID del QR code:', ordenCargueId);
                    generarQRCode(ordenCargueId); // Generar el QR
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: '<a href="">Why do I have this issue?</a>'
            });
        });
});

function generarQRCode(ordenCargueId) {
    const contenedorText = document.getElementById('contenedor').value; // Obtener el texto del contenedor
    const qrCodeElement = document.getElementById('qrcode');

    // Crear una nueva instancia de QRCodeStyling usando canvas
    const qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        type: "canvas", // Cambiado a canvas para manipular la imagen
        data: `${window.location.origin}/view/patio/qr_acceso.html?id=${ordenCargueId}`,
        image: '/img/logopeque.png', // Ruta al logo
        dotsOptions: {
            color: "#4267b2", // Color de los puntos
            type: "rounded" // Forma de los puntos
        },
        backgroundOptions: {
            color: "#ffffff" // Fondo del QR
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 20 // Espacio alrededor del logo
        }
    });

    // Vaciar el contenedor de QR
    qrCodeElement.innerHTML = "";

    // Renderizar el QR en el DOM
    qrCode.append(qrCodeElement);

    // Mostrar el modal del QR
    const qrModal = new bootstrap.Modal(document.getElementById('qrModal'));
    qrModal.show();

    // Asignar evento de descarga una vez renderizado
    const downloadButton = document.getElementById('downloadQR');
    downloadButton.removeEventListener('click', downloadQRCode); // Para evitar múltiples asignaciones
    downloadButton.addEventListener('click', function() {
        downloadQRCode(qrCode, contenedorText, ordenCargueId);
    });
}

function downloadQRCode(qrCode, contenedorText, ordenCargueId) {
    // Obtener el elemento canvas directamente del DOM
    const qrCanvas = qrCode._canvas.getContext ? qrCode._canvas : document.querySelector('#qrcode canvas');

    if (!qrCanvas) {
        console.error("No se pudo obtener el canvas del QR.");
        return;
    }

    // Crear un nuevo canvas para combinar QR y texto
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Configurar el tamaño del nuevo canvas
    canvas.width = qrCanvas.width;
    canvas.height = qrCanvas.height + 50; // Añadir espacio para el texto

    // Dibujar el QR en el nuevo canvas
    context.drawImage(qrCanvas, 0, 0);

    // Añadir el texto del contenedor debajo del QR
    context.font = '16px Arial';
    context.fillStyle = '#000'; // Color del texto
    context.textAlign = 'center';
    context.fillText(`Contenedor: ${contenedorText}`, canvas.width / 2, qrCanvas.height + 30);

    // Descargar la imagen combinada (QR + texto)
    const link = document.createElement('a');
    link.download = `OrdenCargue-${ordenCargueId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}