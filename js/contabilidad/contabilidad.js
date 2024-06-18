new gridjs.Grid({
    search: false,
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
    columns: ["SP",{
        name:"Valor Total",
        formatter:(_,row)=> `$ ${(row.cells[1].data).toLocaleString()}`
    },"Fecha notificación",],
    server: {
        url: `https://esenttiapp-production.up.railway.app/api/showliquidacion`,
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((liquidacion) => [
                    liquidacion.do_sp,
                    liquidacion.valor_total,
                    liquidacion.fecha_creacion,
                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    }
}).render(document.getElementById('contabilidad'));