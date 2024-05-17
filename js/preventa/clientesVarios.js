const apiUrls = {
    local: "http://esenttia.test/api/showclivarios",
    production: "https://esenttiapp-production.up.railway.app/api/showclivarios"
};

const currentEnvironment = "production"

const apiUrl = apiUrls[currentEnvironment];

// Creamos la tabla utlizando grid js
 // Clientes Varios
 new gridjs.Grid({
    search:true,
    language:{
        search:{
            placeholder: '🔍 Buscar...'
        }
    },
      pagination: {
          limit:5,
          enabled: true
      },
      sort: false,
      columns: [{
          name: 'id',
          hidden: true
      },"Placa","Nombre","Telefono","Ejes","Tipologia","Aliado",
      "Celular","Puerto","Estado","Flota","Fecha",{
        name :'Accion',
        hidden:true,
        formatter:(cell, row)=>{
          return gridjs.h('div',{className: 'acciones-container' }, [
              gridjs.h('button',{
                  className: 'btn btn-primary',
                  onclick:()=>asignar(row.cells[0].data)
              },'Asignar')
          ])
        }
      },
    ],
      server: {
          url: "https://esenttiapp-production.up.railway.app/api/showclivarios",
          then: (data) => {
              if (Array.isArray(data) && data.length > 0) {
                  return data.map((preventa) => [
                    preventa.id,
                    preventa.placa,
                    preventa.nombre,
                    preventa.telefono,
                    preventa.ejes,
                    preventa.tipologia,
                    preventa.aliado,
                    preventa.celulara,
                    preventa.puerto,
                    preventa.estado,
                    preventa.flota,
                    preventa.fecha
                  ]);
              } else {
                  console.error("La respuesta del servidor no contiene datos válidos.");
                  return [];
              }
          }
      },
      style: {
        table: {with:"80%"}
      }
  }).render(document.getElementById('ClientesVariosPrev'));
  
  function asignar(id){
      window.location.href = `/view/asignacion/asignacion.html?id=${id}`
  }