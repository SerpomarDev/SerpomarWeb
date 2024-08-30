new gridjs.Grid({
    search: true,
    language: {
        search: {
            placeholder: '🔍 Buscar...'
        }
    },
    pagination: {
        limit: 20,
        enabled: true,
    },
    resizable: true,
    sort: false,
    columns: [{
        name: '#',
        hidden: false,
    }, "involucrado", "F. Solicitud", "H. Suceso", "Area", "Descripción", "Testigo", ],
    server: {
        url: "https://esenttiapp-production.up.railway.app/api/formatonovedad",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                // Ordenar los datos por id_placa en orden descendente
                // data.sort((a, b) => b.id - a.id);

                return data.map((formatos) => [
                    formatos.id,
                    formatos.involucrado,
                    formatos.fecha_suceso,
                    formatos.hora_suceso,
                    formatos.area_suceso,
                    formatos.descripcion,
                    formatos.testigo
                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    }
}).render(document.getElementById('formatos'));