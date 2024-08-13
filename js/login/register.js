document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Validación de la contraseña (mínimo 8 caracteres)
    const password = document.getElementById('password').value;
    const passwordConfirmation = document.getElementById('password_confirmation').value;

    if (password.length < 8) {
        Swal.fire({
            icon: 'error',
            title: 'Contraseña inválida',
            text: 'La contraseña debe tener al menos 8 caracteres'
        });
        return; 
    }

    if (password !== passwordConfirmation) {
        Swal.fire({
            icon: 'error',
            title: 'Contraseñas no coinciden',
            text: 'Las contraseñas no coinciden'
        });
        return; 
    }
    
    // Recopila los datos del formulario
    const formData = new FormData(this);
    const data = {};
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }

    fetch('https://esenttiapp-production.up.railway.app/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en el registro');
        }
        return response.json();
    })
    .then(data => {
        Swal.fire({
            icon: 'success',
            title: '¡Registro exitoso!',
            text: 'Ahora puedes iniciar sesión.',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            window.location.href = 'index.html';
        });
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error en el registro',
            text: error.message 
        });
    });
});
