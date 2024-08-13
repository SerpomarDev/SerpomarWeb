let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

fetch(`https://esenttiapp-production.up.railway.app/api/showcontenedor/${id}`,{
  method: 'GET',
      headers: {
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
})
.then((response)=>{
    if(!response.ok){
      throw new Error("Error al obtener los datos de la API");
    }
    return response.json()
  })
.then((data)=>{
    if(data.length > 0) {
      const contenedor = data[0];
        document.getElementById('id_contenedor').value = contenedor.id_contenedor;
        document.getElementById('id_tipo_contenedor').value = contenedor.tipo;
        document.getElementById('nu_serie').value = contenedor.numero;
    }
    else {
      console.log('La propiedad array no existe en la respuesta');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });

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
    columns: [{
        name:'id_ords',
        hidden:true,
    },{
      name:'id_asig_cont',
      hidden:true,
    },"Numero contenedor","Fecha cargue", "Hora cargue", "Fecha descargue", "Hora descargue","Fecha devolucion","Fecha llegada planta","Hora llegada planta","Fecha inspeccion",{
        name:'Acción',
        formatter:(cell,row)=>{
            return gridjs.h('button',{
              className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
              onClick: () => editOrdenseV(row.cells[0].data)
            },'Editar')
          }
    },{
      name:"Patio",
      hidden:true,
      formatter:(cell,row)=>{
        return gridjs.h('button',{
          className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
          onclick:()=>patio(row.cells[0].data)
        },'Ir')
      }
    }],
    server: {
        url: `https://esenttiapp-production.up.railway.app/api/showordenerv/${id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
      },
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((
                  ordenSev) => [
                    ordenSev.id,
                    ordenSev.id_asigcont,
                    ordenSev.numero_co,
                    ordenSev.fecha_cargue,
                    ordenSev.hora_cargue,
                    ordenSev.fecha_descargue,
                    ordenSev.hora_descargue,
                    ordenSev.fecha_devolucion,
                    ordenSev.fecha_llegada_planta,
                    ordenSev.hora_llegada_planta,
                    ordenSev.fecha_inspeccion,
                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    }
}).render(document.getElementById('ordenSev'));

localStorage.setItem("authToken", data.token);

function editOrdenseV(id){
    window.location.href = `/view/orden_servicio/edit.html?id=${id}`
}

  document.getElementById('saveOrdenServicio').addEventListener('submit',function(event){
    event.preventDefault();
  
    const formData = new FormData(this);
    const jsonData = JSON.stringify(Object.fromEntries(formData));
  
    fetch('https://esenttiapp-production.up.railway.app/api/ordenservicios',{
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("authToken")}`
         },
        body: jsonData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar los datos del formulario');
        }
    })
    .then(data => {
        Swal.fire({
          title: "¡Buen trabajo!",
          text: "¡Has creado una orden de servicio",
          icon: "success",
        });
    })
    .then((response)=>{
      setTimeout(() => {
        history.back();
        location.reload();
      }, 1500);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
  });
 
