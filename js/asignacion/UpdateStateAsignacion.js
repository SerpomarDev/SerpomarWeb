function updateState (id){
    
    fetch(`https://esenttiapp-production.up.railway.app/api/updatestate/${id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
    })
    .then(response => {
        // Si la respuesta tiene un cuerpo vacío, lanza un error
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(text || 'Error al actualizar el estado');
            });
        }

        // Si la respuesta tiene un cuerpo vacío, retorna un objeto vacío
        return response.text().then(text => text ? JSON.parse(text) : {});
    })
    .then(data => {
        if (data.message === 'No hay archivos adjuntos para esta asignacion.') {
            Swal.fire({
                title: "Advertencia",
                text: data.message,
                icon: "warning"
            });
        } else {
            Swal.fire({
                title: "¡Buen trabajo!",
                text: "Estado actualizado!",
                icon: "success"
            });
            time();
        }
    })
    .catch((error) => {
        console.error('Error al actualizar el estado:', error);
        Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error"
        });
    });
}

function time() {
    document.getElementById('SaveFile').reset();
    setTimeout(() => {
       window.location.href = ``; 
    },1200);
}
