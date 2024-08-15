let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

fetch(`https://esenttiapp-production.up.railway.app/api/editconductor/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        }
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Error al obtener los datos de la API");
        }
        return response.json();
    })
    .then((data) => {
        if (data.length > 0) {
            const conductor = data[0];
            document.getElementById("id").value = conductor.id
            document.getElementById("nombre").value = conductor.nombre
            document.getElementById("identificacion").value = conductor.identificacion
            document.getElementById("telefono").value = conductor.telefono
            document.getElementById("email").value = conductor.email
            document.getElementById("numero_licencia").value = conductor.numero_licencia
            document.getElementById("fecha_vencimiento").value = conductor.fecha_vencimiento

        } else {
            console.log('La propiedad array no existe en la respuesta');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });



document.getElementById("editConductor").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const jsonData = JSON.stringify(Object.fromEntries(formData));



    fetch(`https://esenttiapp-production.up.railway.app/api/conductores/${id}`, {

        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        },
        body: jsonData,
    })


    .then((response) => {
            if (!response.ok) {
                throw new Error("Error al enviar los datos del formulario");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Respuesta del servidor:", data);
            Swal.fire({
                title: "¡Buen trabajo!",
                text: "Has actualizado un conductor.",
                icon: "success",
            });
        })
        .then(response => {
            time();
        })
        .catch((error) => {
            console.error("Error:", error);
        });


    function time() {
        const editConductorForm = document.getElementById('editConductor');
        if (editConductorForm) { // Check if the element exists
            editConductorForm.reset();
            setTimeout(() => {
                window.location.href = `/view/conductores/create.html`;
            }, 1200);
        } else {
            console.error("Error: 'editConductor' element not found.");
        }
    }
});