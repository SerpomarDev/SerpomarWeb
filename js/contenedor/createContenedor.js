let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

liquidarSp(id)
cargarValores(id)

function cargarValores(id){
  fetch(`https://esenttiapp-production.up.railway.app/api/uploadsolisev/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener los datos de la API");
      }
      return response.json();
    })
    .then((data) => {
      if(data.length > 0) {
        const ordneSev = data[0];
        document.getElementById("id_solicitud_servicio").value = ordneSev.id_primario;
        document.getElementById("do_pedido").value = ordneSev.do_pedido;
        document.getElementById("do_sp").value = ordneSev.do_sp;
        document.getElementById("contendedor").value = ordneSev.contendedor;
        document.getElementById("id_cliente").value = ordneSev.id_cliente;
        document.getElementById("cliente").value = ordneSev.cliente;
        document.getElementById("imp_exp").value = ordneSev.imp_exp;
        document.getElementById("eta").value = ordneSev.eta;
        document.getElementById("levante").value = ordneSev.levante;
        document.getElementById("documental").value = ordneSev.documental;
        document.getElementById("fisico").value = ordneSev.fisico;
        document.getElementById("libre_hasta").value = ordneSev.libre_hasta;
        document.getElementById("bodega_hasta").value = ordneSev.bodega_hasta;
        document.getElementById("propuesta").value = ordneSev.propuesta;

        // Actualizar el contenido del dashboard_bar
        document.querySelector(".dashboard_bar").textContent = ordneSev.do_sp;

        let id_primario = ordneSev.id_primario
        tableByClt(id_primario)

        let id_cliente = ordneSev.id_cliente;
        detalles(id_cliente)

      } else {
        console.log('La propiedad array no existe en la respuesta');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function tableByClt(id_primario){

  new gridjs.Grid({
    search: true,
    language:{
      search:{
          placeholder: '🔍 Buscar...'
      }
    },
    // pagination: {
    //     limit:5,
    //     enabled: false,
    //     //summary: true
    // },
    sort: false,
    columns: [{
      name:'id_co',
      hidden: true,
    },"SP",{
      name:"Numero contenedor",
      attributes: (cell,row)=>{
        if(cell){
            return{
              'data-cell-content': cell,
              onclick:()=>detalles(row.cells[0].data),
              'style': 'cursor: pointer; color: #6495ED;  font-weight: bold;',
            }
        }
      }
    },"Estado operación",{
    name:'Acción',
      formatter:(cell,row)=>{
        return gridjs.h('button',{
          className: 'py-2 mb-4 px-4 border rounded bg-blue-600 ',
          'data-bs-toggle': 'modal',
          'data-bs-target': '#asignarModal',
        onClick: () => asignar(row.cells[0].data)
        },'asignar')
      }
    },{
      name:"Detalles",
      formatter:(cell,row)=>{
        return gridjs.h('button',{
          className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
          onClick: () => ordenServicio(row.cells[0].data)
        },'datos')
      }
    },{
      name:"Pre-liquidar",
      formatter:(cell,row)=>{
        return gridjs.h('button',{
          className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
          onClick: () => preLiquidar(row.cells[0].data)
        },'ir')
      }
    },{
      name:"Acción",
      formatter:(cell,row)=>{
        return gridjs.h('button',{
          className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
          onClick: () => editContenedor(row.cells[0].data)
        },'editar')
      }
    }],
    fixedHeader: true,
    //height: '400px',
    server: {
        url: `https://esenttiapp-production.up.railway.app/api/preasigcont/${id}`,
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((contenedorEx) => [
                  contenedorEx.id,
                  contenedorEx.do_sp,
                  contenedorEx.numero_co,
                  contenedorEx.estado_operacion,
                  contenedorEx.id_cliente,
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
}).render(document.getElementById('contenedor'));

function detalles(id){
  
  let cliente  = id_cliente

  if(cliente === 6){
    window.location.href = `/view/asignacion_esenttia/asignacion_esenttia.html?id=${id}`
  }else{
    window.location.href = `/view/asignacion/asignacion.html?id=${id}`
  }
 
}

function asignar(id){
  window.location.href = `/view/modal/modal.html?id=${id}`
}

function editContenedor(id){
  window.location.href = `/view/contenedor/edit.html?id=${id}`
}

function preLiquidar(id){
  window.location.href = `/view/liquidar/pre_liquidar.html?id=${id}`
}
}

function liquidarSp(id){
  let liquidar  = document.getElementById('BtnLiquidar')

  liquidar.addEventListener('click', function(){
    window.location.href = `/view/liquidar/liquidar.html?id=${id}`
  })
 }

 function ordenServicio(id){
  window.location.href = `/view/orden_servicio/create.html?id=${id}`
 }
