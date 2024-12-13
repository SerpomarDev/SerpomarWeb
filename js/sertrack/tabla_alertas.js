document.addEventListener('DOMContentLoaded', function() {

    const columnDefsAle = [
        { headerName: "idS", field: "id_primario", hide: false },
        { headerName: "idC", field: "id_contenedor", hide: false },
        { headerName: "Contenedor", field: "numero_contenedor" },
        { headerName: "Libre Hasta", field: "libre_hasta" },
        { headerName: "Bodegaje Hasta", field: "bodegaje_hasta" },
        { headerName: "Fecha cita", field: "fecha_cita", hide: true },
        { headerName: "Fecha_notificacion", field: "fecha_notificacion", hide: true },
        { headerName: "Fecha Devolucion", field: "fecha_devolucion", hide: true },
        { 
            headerName: "Alerta Libre Hasta", 
            field: "alerta_lh",
            cellStyle: params => {
                switch (params.value) {
                    case 'OK': return { color: 'blue' };
                    case 'ALTA 2 dias': return { color: 'orange' };
                    default: 
                        if (params.value.startsWith('BIEN')) {
                            return { color: 'green' }; 
                        } else if (params.value.startsWith('CRITICO')) {
                            return { color: 'red' };
                        }
                        return null;
                }
            }
        },
        { 
            headerName: "Alerta Bodegaje Hasta", 
            field: "alerta_bh",
            cellStyle: params => {
                switch (params.value) {
                    case 'OK': return { color: 'blue' };
                    case 'ALTA 2 dias': return { color: 'orange' };
                    default: 
                        if (params.value.startsWith('BIEN')) {
                            return { color: 'green' }; 
                        } else if (params.value.startsWith('CRITICO')) {
                            return { color: 'red' };
                        }
                        return null;
                }
            } 
        },
    ];

    fetch("https://esenttiapp-production.up.railway.app/api/registroestadistico",{
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const datosFiltrados = data.filter(item => 
            item.cliente === "ESENTTIA S A" && 
            item.modalidad === "importacion" && 
            item.libre_hasta !== null && 
            item.fecha_notificacion !== null && 
            item.bodegaje_hasta !== null
        );

        const processedData = datosFiltrados.map(ordenCargue => {
            // Calcular la diferencia en días
            const hoy = new Date();
            const libreHasta = new Date(ordenCargue.libre_hasta);
            const bodegajeHasta = new Date(ordenCargue.bodegaje_hasta);
            const diffLibreHasta = Math.ceil((libreHasta - hoy) / (1000 * 60 * 60 * 24));
            const diffBodegajeHasta = Math.ceil((bodegajeHasta - hoy) / (1000 * 60 * 60 * 24));

            // Determinar el nivel de alerta para Libre Hasta
            let alertaLH;
            if (diffLibreHasta >= 3) {
                alertaLH = "BIEN +" + diffLibreHasta + " dias"; 
            } else if (diffLibreHasta <= 2 && diffLibreHasta > 1) {
                alertaLH = "ALTA 2 dias";
            } else if (diffLibreHasta <= 1 && diffLibreHasta >= 0) {
                alertaLH = "CRITICO " + (diffLibreHasta * -1) + " dia(s)"; 
            } else {
                alertaLH = "CRITICO " + (diffLibreHasta * -1) + " dia(s)"; 
            }
            if (ordenCargue.fecha_devolucion) {
                alertaLH = "OK";
            }

            // Determinar el nivel de alerta para Bodegaje Hasta 
            let alertaBH;
            if (ordenCargue.fecha_cita) {  // <-- Priorizar fecha_cita
                alertaBH = "OK"; 
            } else {
                if (diffBodegajeHasta >= 3) {
                    alertaBH = "BIEN +" + diffBodegajeHasta + " dias"; 
                } else if (diffBodegajeHasta <= 2 && diffBodegajeHasta > 1) {
                    alertaBH = "ALTA 2 dias";
                } else if (diffBodegajeHasta <= 1 && diffBodegajeHasta >= 0){
                    alertaBH = "CRITICO " + (diffBodegajeHasta * -1) + " dia(s)"; 
                } else {
                    alertaBH = "CRITICO " + (diffBodegajeHasta * -1) + " dia(s)"; 
                }
                if (ordenCargue.fecha_devolucion) {
                    alertaBH = "OK";
                }
            }

            return {
                id_primario: ordenCargue.id_primario,
                id_contenedor: ordenCargue.id_contenedor,
                numero_contenedor: ordenCargue.numero_contenedor,
                libre_hasta: ordenCargue.libre_hasta,
                bodegaje_hasta: ordenCargue.bodegaje_hasta,
                fecha_cita: ordenCargue.fecha_cita,
                fecha_notificacion: ordenCargue.fecha_notificacion,
                fecha_devolucion: ordenCargue.fecha_devolucion,
                alerta_lh: alertaLH, 
                alerta_bh: alertaBH, 
            };
        });

        const gridOptions = {
            columnDefs: columnDefsAle,
            defaultColDef: {
                resizable: true,
                sortable: false,
                flex: 1,
                minWidth: 100,
            },
            groupDisplayType: "groupRows",
            groupDefaultExpanded: 0, 
            enableRangeSelection: true,
            suppressMultiRangeSelection:true,
            rowSelection: 'multiple',
            rowData: processedData, 
        };
        
        const eGridDiv = document.getElementById('alertas-impo');
        new agGrid.Grid(eGridDiv, gridOptions);

    })
    .catch(error => {
        console.error("Error al cargar los datos:", error);
    });

});