let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

fetch(`https://esenttiapp-production.up.railway.app/api/editplaca/${id}`, {
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
            const placa = data[0];
            document.getElementById("id_placa").value = placa.id_placa
            document.getElementById("placa").value = placa.placa
            document.getElementById("eje").value = placa.eje
            document.getElementById("tipologia").value = placa.tipologia
            document.getElementById("id_aliado").value = placa.id_aliado
            document.getElementById("soat").value = placa.soat
            document.getElementById("fecha_vencimientos").value = placa.fecha_vencimientos
            document.getElementById("numero_poliza").value = placa.numero_poliza
            document.getElementById("tecnomecanica").value = placa.tecnomecanica
            document.getElementById("fecha_vencimientot").value = placa.fecha_vencimientot
            document.getElementById("gps").value = placa.gps
            document.getElementById("webgps").value = placa.webgps
            document.getElementById("usuariogps").value = placa.usuariogps
            document.getElementById("contrasenagps").value = placa.contrasenagps

        } else {
            console.log('La propiedad array no existe en la respuesta');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });

new gridjs.Grid({
    search: true,
    language: {
        search: {
            placeholder: '🔍 Buscar...'
        }
    },
    pagination: {
        limit: 10,
        enabled: true,
    },
    columns: ["Placa", "Eje", "Tipologia", "Propietario", {
        name: 'Telefono',
        hidden: true,
    }],
    server: {
        url: "https://esenttiapp-production.up.railway.app/api/showplaca",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((placa) => [
                    placa.placa,
                    placa.eje,
                    placa.tipologia,
                    placa.id_aliado,
                    placa.soat,
                    placa.fecha_vencimientos,
                    placa.numero_poliza,
                    placa.tecnomecanica,
                    placa.fecha_vencimientot,
                    placa.gps,
                    placa.webgps
                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    }
}).render(document.getElementById('placaEdit'));


document.getElementById("editPlaca").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const jsonData = JSON.stringify(Object.fromEntries(formData));

    fetch(`https://esenttiapp-production.up.railway.app/api/placas/${id}`, {
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
                text: "Has actualizado una Placa.",
                icon: "success",
            });
        })
        .then(response => {
            time();
        })
        .catch((error) => {
            console.error("Error:", error);
        });
});

function time() {
    document.getElementById('createPlaca').reset();
    setTimeout(() => {
        window.location.href = `/view/placas/edit.html`;
    }, 1200);
}