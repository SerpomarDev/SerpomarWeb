   const columnDefses = [
    { headerName: "id", field: "id", hide: true },
    { headerName: "Contenedor", field: "contenedor", hide: false },
    { headerName: "Tipo Contenedor", field: "tipo_contenedor", hide: false },
    { headerName: "Lleno / Vacio", field: "lleno_vacio", hide: false },
    { headerName: "Cantidad Dias", field: "cantidad_dias", hide: false }
  ];
  
  fetch("https://esenttiapp-production.up.railway.app/api/cargarinventario", {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
  })
  .then(response => response.json())
  .then(data => {

    const hoyColombia = moment().tz('America/Bogota').startOf('day'); 

    const filteredData = data.filter(Preprogramar => {
        try {

            const fechaItem = moment(Preprogramar.fecha_global).tz('America/Bogota').startOf('day');
  
            return fechaItem.isSame(hoyColombia);
        } catch (error) {
            console.error("Error al convertir la fecha:", Preprogramar.fecha_global, error);
            return false;
        }
    });
  
    const processedData = filteredData.map(Preprogramar => {
        return {
            id: Preprogramar.id,
            contenedor: Preprogramar.contenedor,
            tipo_contenedor: Preprogramar.tipo_contenedor,
            lleno_vacio: Preprogramar.lleno_vacio,
            cantidad_dias: Preprogramar.cantidad_dias,
            
        };
    });
  
    const gridOptions = {
        columnDefs: columnDefses,
        paginationPageSize: 20,
        rowData: processedData,
        groupDisplayType: 'groupRows',
        suppressRowClickSelection: true, 
    
        groupRowAggNodes: (nodes) => {
            const groupedNodes = {};
            nodes.forEach(node => {
                const estadoOperacion = node.data.estado_operacion;
                if (!groupedNodes[estadoOperacion]) {
                    groupedNodes[estadoOperacion] = [];
                }
                groupedNodes[estadoOperacion].push(node);
            });
  
            const sortedNodes = estadosOperacion.map(estado => groupedNodes[estado]).filter(Boolean);
  
            return sortedNodes.flat();
        }
    };
  
    const eGridDiv = document.getElementById('cargar-estados');
    new agGrid.Grid(eGridDiv, gridOptions);
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
  });