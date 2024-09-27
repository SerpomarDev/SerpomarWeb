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
            name: 'id',
            hidden: true,
        }, "Placa", "web gps", "usuario", "Clave", 
       
    ],
    server: {
        url: "https://esenttiapp-production.up.railway.app/api/showplaca",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                data.sort((a, b) => b.id_placa - a.id_placa);

                return data.map((placa) => [
                    placa.id_placa,
                    placa.placa,
                    placa.webgps,
                    placa.usuario,
                    placa.contrasenia
                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    }
}).render(document.getElementById('Placa'));