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
                    generarQRCode(ordenCargueId);
                    time();
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