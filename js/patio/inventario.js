new gridjs.Grid({
    search: true,
    language:{
      search:{
          placeholder: '🔍 Buscar...'
      }
    },
    pagination: {
        limit:5,
        enabled: false,
    },
    sort: false,
    columns: ["contenedor","cliente","Tipo de contenedor","Tipo transporte","Cutoff","operación",{
      name:'Acción',
      hidden:'true',
          formatter:(cell,row)=>{
              return gridjs.h('button',{
                className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
                onClick: () => asignar(row.cells[0].data)
              },'Entrada');
            },
    }],
    fixedHeader: true,
    server: {
      url: `https://esenttiapp-production.up.railway.app/api/cargarsinestado`,
      then: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          return data.map((ordenCargue) => [
            ordenCargue.contenedor,
            ordenCargue.cliente,
            ordenCargue.tipo_contenedor,
            ordenCargue.modalidad,
            ordenCargue.cutoff,
            ordenCargue.operacion
          ]);
        } else {
          console.error("La respuesta del servidor no contiene datos válidos.");
          return [];
        }
      }
    },
    resizable: true,
    style: {
      table: {with:"80%"}
    }
  }).render(document.getElementById('inventario'));