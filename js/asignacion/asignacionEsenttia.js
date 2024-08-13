let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

cargarValores(id)
function cargarValores(id){

  fetch(`https://esenttiapp-production.up.railway.app/api/asignacioncontenedors/${id}`,{
    method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
  })
  .then((responde) => {
    if (!responde) {
      throw new Error("Error al obtener los datos de la API");
    }
    return responde.json();
  })
  .then((data) => {
    if (data.length > 0) {
      const asigcont = data[0];
      document.getElementById("id_contenedor").value = asigcont.id_contenedor;
      document.getElementById("id_cliente").value = asigcont.id_cliente;
      document.getElementById("imp_exp").value = asigcont.imp_exp;

      let impExpValor = asigcont.imp_exp
      let id_cliente  = asigcont.id_cliente
      let id_contenedor = asigcont.id_contenedor
  
     crearTablas(id_contenedor,id_cliente,impExpValor)
  
    } else {
      console.log("La propiedad array no existe en la respuesta");
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
  
  }
  function crearTablas (id_contenedor,id_cliente, impExpValor){

    if (impExpValor === 'importacion') {
      document.getElementById('cargarImpoEs').style.display = 'block';
      document.getElementById('cargarExpoEs').style.display = 'none';
    } else if (impExpValor === 'exportacion') {
      document.getElementById('cargarImpoEs').style.display = 'none';
      document.getElementById('cargarExpoEs').style.display = 'block';
    } else {
      document.getElementById('cargarImpoEs').style.display = 'none';
      document.getElementById('cargarExpoEs').style.display = 'none';
  }
  
  // Tabala Exportacion
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
          //summary: true
      },
      sort: false,
      columns: [{ 
        name:'id_contenedor',
        hidden:true
      },
      {
        name:'asignacion_contenedor',
        hidden:true,
      },"Cliente","Placa","Conductor",{
        name:"Numero contenedor",
        attributes: (cell,row)=>{
          if(cell){
              return{
                'data-cell-content': cell,
                onclick:()=>addordenSer(row.cells[0].data),
                'style': 'cursor: pointer',
              }
          }
        }
      },"Tipo transporte","Tipo operacion","Fecha cita","Hora cita","Fecha documental","Cutoff fisico","Fecha propuesta",{
      name:'Acción',
      hidden:false,
        formatter:(cell,row)=>{
          return gridjs.h('button',{
            className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
            onClick: () => editAsignacion(row.cells[0].data)
          },'Editar')
        }
    }],
      fixedHeader: true,
      //height: '400px',
      server: {
          url: `https://esenttiapp-production.up.railway.app/api/uploadexpo/${id_contenedor}/${id_cliente}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
          },
          then: (data) => {
              if (Array.isArray(data) && data.length > 0) {
                  return data.map((asigContEx) => [
                    asigContEx.id_contenedor,
                    asigContEx.asignacion_contenedor,
                    asigContEx.cliente,
                    asigContEx.placa,
                    asigContEx.conductor,
                    asigContEx.numero_contenedores,
                    asigContEx.tipo_transporte,
                    asigContEx.tipo_operacion,
                    asigContEx.fecha_cita,
                    asigContEx.hora_cita,
                    asigContEx.fecha_doucmental,
                    asigContEx.fecha_fisico,
                    asigContEx.fecha_propuesta
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
  }).render(document.getElementById('cargarExpoEs'));

    localStorage.setItem("authToken", data.token);
  
  // Tabala Importacion
    new gridjs.Grid({
    search: true,
    language:{
      search:{
          placeholder: '🔍 Buscar...'
      }
    },
    pagination: {
        limit:5,
        enabled: true,
    },
    sort: false,
    columns: [{ 
      name:'id_contenedor',
      hidden:true
    },{
      name:'asignacion_contenedor',
      hidden:true,
    },"Cliente","Placa","Conductor",{
      name:"Numero contenedor",
      attributes: (cell,row)=>{
        if(cell){
            return{
              'data-cell-content': cell,
              onclick:()=>addordenSer(row.cells[0].data),
              'style': 'cursor: pointer',
            }
        }
      }
    },"Tipo transporte","Tipo operacion","Fecha cita","Hora cita","Fecha eta","Fecha levante","Libre hasta","Bodegaje hasta","Fecha Propuesta",{
      name:'Acción',
      hidden:false,
        formatter:(cell,row)=>{
          return gridjs.h('button',{
            className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
            onClick: () => editAsignacion(row.cells[0].data)
          },'Editar')
        }
    }],
    fixedHeader: true,
    server: {
        url: `https://esenttiapp-production.up.railway.app/api/uploadimpo/${id_contenedor}/${id_cliente}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((asigContImp) => [
                  asigContImp.id_contenedor,
                  asigContImp.asignacion_contenedor,
                  asigContImp.cliente,
                  asigContImp.placa,
                  asigContImp.conductor,
                  asigContImp.numero_contenedores,
                  asigContImp.tipo_transporte,
                  asigContImp.tipo_operacion,
                  asigContImp.fecha_cita,
                  asigContImp.hora_cita,
                  asigContImp.fecha_eta,
                  asigContImp.fecha_levante,
                  asigContImp.libre_hasta,
                  asigContImp.bodegaje_hasta,
                  asigContImp.fecha_propuesta
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
    }).render(document.getElementById('cargarImpoEs'));
  }

  localStorage.setItem("authToken", data.token);

document.getElementById("saveAsignacionEsentt").addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(this);

  const jsonData = JSON.stringify(Object.fromEntries(formData));
  console.log(jsonData)

  fetch("https://esenttiapp-production.up.railway.app/api/saveasignacion", {
    method: "POST",
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
    })
    .then((data) => {
      Swal.fire({
        title: "¡Buen trabajo!",
        text: " La asignacion se ha creado de forma exitosa.",
        icon: "success",
        showConfirmButton: false,
      });
    })
    .then((response) => {
      time();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});


function editAsignacionEsnt(id){
  window.location.href = `/view/asignacion_esenttia/edit.html?id=${id}`
}

function time() {
document.getElementById("saveAsignacionEsentt").reset();
setTimeout(() => {
  window.location.href = ``;
}, 1500);
}

function editAsignacion(id){
  window.location.href = `/view/asignacion_esenttia/edit.html?id=${id}`
}

function addordenSer(id){
  window.location.href = `/view/orden_servicio/create.html?id=${id}`
}