
// Manejo del evento 'submit' del formulario
document.getElementById('createConductor').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    // Convertir los datos del formulario a JSON, escapando caracteres especiales si es necesario
    const jsonData = JSON.stringify(Object.fromEntries(formData), (key, value) => {
        if (typeof value === 'string') {
            return value.replace(/\n/g, ' ').replace(/\t/g, ' ');
        }
        return value;
    });


    fetch('https://esenttiapp-production.up.railway.app/api/conductores', {
        method: 'POST', // O PUT/PATCH si es lo que espera tu API
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
                    if (text.includes("Conductor creado exitosamente") || text.includes("mensaje de éxito similar del servidor")) {
                        Swal.fire({
                            title: "¡Buen trabajo!",
                            text: "Has Creado un conductor.",
                            icon: "success",
                        });
                        time();
                    } else {
                        Swal.fire({ // Cambiado a SweetAlert de éxito
                            title: "¡Bien hecho!",
                            text: "Conductor creado correctamente",
                            icon: "success",
                        });
                        time();
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error al crear el conductor:', error);
            Swal.fire({
                title: "Error",
                text: error.message || "Hubo un problema al crear la placa. Por favor, inténtalo de nuevo.",
                icon: "error",
            });
        });
});



function time() {
    document.getElementById('createConductor').reset();
    setTimeout(() => {
        window.location.href = `/view/seguridad/conductores_crear.html`;
    }, 1200);
}


function editConductor(id) {

    window.location.href = `/view/seguridad/conductores_edit.html?id=${id}`
}

function deleteCondcutor(id) {
    DeleteData(id)
}

function uploadId(id) {
    // Open the modal or handle file upload
    $('#fileUploadModal').show();
    $('#id_asignacion').val(id);

    // Initialize Dropzone for the form
    const myDropzone = new Dropzone("#SaveFile", {
        url: "/upload", // Replace with your upload URL
        init: function() {
            this.on("success", function(file, response) {
                // Change button state after successful file upload
                const button = document.getElementById(`btn-${id}`);
                if (button) {
                    button.classList.remove('no-file');
                    button.classList.add('file-uploaded');
                }

                // Hide the modal after upload
                $('#fileUploadModal').hide();
            });
        }
    });
}

// Handle modal close
$('.close').on('click', function() {
    $('#fileUploadModal').hide();
});


