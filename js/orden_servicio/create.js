let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");


fetch(`https://esenttiapp-production.up.railway.app/api/showcontenedor/${id}`)
.then((response)=>{
    if(!response.ok){
      throw new Error("Error al obtener los datos de la API");
    }
    return response.json()
  })
.then((data)=>{
    if(data.length > 0) {
      const contenedor = data[0];
        document.getElementById('id_contenedor').value = contenedor.id;
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


document.getElementById('saveOrdenServicio').addEventListener('submit',function(event){
    event.preventDefault();

    const formData = new FormData(this);
    const jsonData = JSON.stringify(Object.fromEntries(formData));

    console.log(jsonData)
    fetch('https://esenttiapp-production.up.railway.app/api/ordenservicios',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      time();
    })
    .catch((error) => {
        console.error("Error:", error);
    });
  });


  function time() {
    document.getElementById('saveOrdenServicio').reset();
    setTimeout(() => {
        window.location.href = ``; 
    },  1200);
  }  

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
    },"Numero serie","Fecha cargue", "Hora cargue", "Fecha descargue", "Hora descargue","Fecha devolucion", "Fecha inspeccion","Patio",{
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
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((
                  ordenSev) => [
                    ordenSev.id,
                    ordenSev.id_asig_cont,
                    ordenSev.numero_co,
                    ordenSev.fecha_cargue,
                    ordenSev.hora_cargue,
                    ordenSev.fecha_descargue,
                    ordenSev.hora_descargue,
                    ordenSev.fecha_devolucion,
                    ordenSev.fecha_inspeccion,
                    ordenSev.patio
                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    }
}).render(document.getElementById('ordenSev'));

function editOrdenseV(id){
    window.location.href = `/view/orden_servicio/edit.html?id=${id}`
}

function patio(id){
  window.location.href = `/view/patio/solicitud_ingreso.html?id=${id}`
}