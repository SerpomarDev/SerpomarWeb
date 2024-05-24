
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
    time()
  })
  .catch((error) => {
      console.error('Error al actualizar el estado:', error);
  });
}

function comentario(id, comentario) {
  fetch(`https://esenttiapp-production.up.railway.app/api/actualizarcomentario/${comentario}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: id,
      comentario: comentario
    }),
  })
  .then(response => response.json())
  .then(data => {
      console.log('Comentario guardado con éxito:', data);
      Swal.fire({
        title: "¡Buen trabajo!",
        text: "Comentario guardado!",
        icon: "success"
      });
      time()
  })
  .catch((error) => {
      console.error('Error al guardar el comentario:', error);
  });
}
    
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
      // },
      sort: false,
      columns: [{
        name:"id",
        hidden:true,
      },"contenedor","cliente","Tipo de contenedor","Tipo transporte","Cutoff","operacion","Comentarios",{
        name:'Acción',
        formatter: (cell, row) => {
          return gridjs.h('select', {
              onchange: (e) => {
                  const nuevoEstado = e.target.value;
                  actualizarEstado(row.cells[0].data, nuevoEstado);

                  if(e.target.value === 'RECHAZADO'){
                    row.cells[8].data.disabled = true;
                  }
              },
          }, [
              gridjs.h('option', { value: '' }, 'Seleccione'),
              gridjs.h('option', { value: 'ENTRADA' }, 'ENTRADA'),
              gridjs.h('option', { value: 'SALIDA' }, 'SALIDA'),
              gridjs.h('option', { value: 'RECHAZADO' }, 'RECHAZADO'),
          ]);

      },
      }
      ,{
        name:"Observacion",
        formatter: (cell, row) => {
          return gridjs.html(`<textarea id="observacion-${row.cells[0].data}">${''}</textarea>`);
        }
      },{
        name:'Acción',
      formatter:(cell,row)=>{
        return gridjs.h('button',{
          className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
          onClick: () => {
            const comentarioTexto = document.getElementById(`observacion-${row.cells[0].data}`).value;
            comentario(row.cells[0].data, comentarioTexto);
          }
        },'guardar');
      }
      }
    ],
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
              ordenCargue.operacion,
              ordenCargue.comentario

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

function time() {
    document.getElementById('craeateAccesoPatio').reset();
    setTimeout(() => {
        window.location.href = `/view/patio/acceso_patio.html`; 
    },1200);
}
