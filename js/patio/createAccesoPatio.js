
function actualizarEstado(idOperacion,nuevoEstado) {
  fetch(`https://esenttiapp-production.up.railway.app/api/actualizaroperacionp/${nuevoEstado}/${idOperacion}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        estado: nuevoEstado,
        id: idOperacion
      }),
  })
  .then(response => response.json())
  .then(data => {
      console.log('Estado actualizado con éxito:', data);
      Swal.fire({
        title: "¡Buen trabajo!",
        text: "Estado actualizado!",
        icon: "success"
    });
  })
  .then((response)=>{
    time()
  })
  .catch((error) => {
      console.error('Error al actualizar el estado:', error);
  });
}
    
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
        name:"id",
        hidden:true,
      },"contenedor","cliente","Tipo de contenedor","Tipo transporte","Cutoff","operacion",{
        name:'Acción',
        formatter: (cell, row) => {
          return gridjs.h('select', {
              onchange: (e) => {
                  const nuevoEstado = e.target.value;
                  actualizarEstado(row.cells[0].data, nuevoEstado);
              },
          }, [
              gridjs.h('option', { value: '' }, 'Seleccione'),
              gridjs.h('option', { value: 'ENTRADA' }, 'ENTRADA'),
              gridjs.h('option', { value: 'SALIDA' }, 'SALIDA'),
              gridjs.h('option', { value: 'RECHAZADO' }, 'RECHAZADO'),
          ]);
      },
      }],
      fixedHeader: true,
      server: {
        url: 'https://esenttiapp-production.up.railway.app/api/uploadordencargue',
        then: (data) => {
          if (Array.isArray(data) && data.length > 0) {
            return data.map((ordenCargue) => [
              ordenCargue.id,
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