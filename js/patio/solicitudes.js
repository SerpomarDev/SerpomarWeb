new gridjs.Grid({
    search: true,
    language:{
        search:{
            placeholder: '🔍 Buscar...'
        }
    },
    pagination: {
        limit:10,
        enabled: true,
    },
    resizable: true,
    sort: false,
    columns: ["SP","Cliente","Placa","Conductor", "Cedula", "Contenedor", "Tipo","Modalidad","Origen","Destino",{
        name:'Ubicar',
        hidden: true,
    }],
    server: {
        url: 'https://esenttiapp-production.up.railway.app/api/',
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((
                patcont) => [
                    
                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    }
}).render(document.getElementById('solicitudes'));