
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
      columns: [{
        name:'id_co',
        hidden:true,
      },"SP","DO PEDIDO","Numero contenedor","Tipo transporte","Cliente",{
        name:'Acción',
        formatter:(cell,row)=>{
          return gridjs.h('button',{
            className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
            onClick: () => asignar(row.cells[0].data)
          },'Asignar');
        }
      }],
      fixedHeader: true,
      server: {
        url: ``,
        then: (data) => {
          if (Array.isArray(data) && data.length > 0) {
            return data.map((contenedorEx) => [
              contenedorEx.id,
              contenedorEx.do_sp,
              contenedorEx.do_pedido,
              contenedorEx.numero_co,
              contenedorEx.tipo_transporte,
              contenedorEx.cliente
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
    }).render(document.getElementById('acceso'));


document.getElementById('craeateAccesoPatio').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const formData = new FormData(this);
  
    const jsonData = JSON.stringify(Object.fromEntries(formData));

    console.log(jsonData)
    
    fetch('https://esenttiapp-production.up.railway.app/api/accesopatio', {
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
          text: "¡Has creado un Cliente",
          icon: "success",
        });
    })
    .then((response)=>{
     time();
    })
  });

function time() {
    document.getElementById('craeateAccesoPatio').reset();
    setTimeout(() => {
        window.location.href = ``; 
    },1200);
}