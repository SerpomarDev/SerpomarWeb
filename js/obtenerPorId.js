document.getElementById("PreventaEdit").addEventListener("submit", function (event) {
    event.preventDefault();

    // Obtenemos los IDs seleccionados en los campos del formulario
    let idPlaca = document.getElementById("id_placa").value;
    let idConductor = document.getElementById("id_conductor").value;

    console.log("placa ". idPlaca);
    console.log("conductor ". idConductor);

    // Utilizamos la función para obtener la información asociada a los IDs
    Promise.all([
        obtenerInformacionPorId(`https://esenttiapp-production.up.railway.app/api/loadplacaid/${idPlaca}`),
        obtenerInformacionPorId(`https://esenttiapp-production.up.railway.app/api/uploadoptid/${idConductor}`)
    ])
    .then(data => {
        let placa = data[0].placa;
        let nombreConductor = data[1][0].nombre;

        console.log("Placa asociada:", placa);
        console.log("Nombre del conductor asociado:", nombreConductor);
    })
    .catch(error => {
        console.error("Error al obtener información:", error);
    });
});

function obtenerInformacionPorId(url, id) {
    return fetch(`${url}/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error("Error al obtener información por ID:", error);
            throw error;
        });
}