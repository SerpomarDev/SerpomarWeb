function actualizarEstado(idOperacion, nuevoEstado) {
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
  .then(response => response.json().then(data => ({ status: response.status, body: data })))
  .then(({ status, body }) => {
      if (status === 400 && body.message === 'El contenedor no tiene una entrada registrada.') {
          Swal.fire({
              title: "Advertencia",
              text: body.message,
              icon: "warning"
          });
      } else if (status >= 200 && status < 300) {
          Swal.fire({
              title: "¡Buen trabajo!",
              text: "Estado actualizado!",
              icon: "success"
          });
          time();
      } else {
          throw new Error(body.message);
      }
  })
  .catch((error) => {
      console.error('Error al actualizar el estado:', error);
      Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error"
      });
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
  pagination: {
        limit:50,
        enabled: false,
    },
  sort: false,
  columns: [{
    name:"id",
    hidden:true,
  },"Fecha solicitud","contenedor","cliente","Tipo de contenedor","Tipo transporte","Cutoff","operacion",{
    name:"Comentarios",
    hidden:true,
  },{
    name:'Acción',
    formatter: (cell, row) => {
      const operacion = row.cells[6].data;
      const selectElement = gridjs.h('select', {
          onchange: (e) => {
              const nuevoEstado = e.target.value;
              actualizarEstado(row.cells[0].data, nuevoEstado);
              if (nuevoEstado === 'RECHAZADO') {
                e.target.disabled = true;
              }
          },
          disabled: operacion === 'RECHAZADO'
      }, [
          gridjs.h('option', { value: '' }, 'Seleccione'),
          gridjs.h('option', { value: 'ENTRADA' }, 'ENTRADA'),
          gridjs.h('option', { value: 'SALIDA' }, 'SALIDA'),
          gridjs.h('option', { value: 'RECHAZADO' }, 'RECHAZADO'),
      ]);
      return selectElement;
    },
  },{
    name:"Observacion",
    hidden:true,
    formatter: (cell, row) => {
      return gridjs.html(`<textarea id="observacion-${row.cells[0].data}">${''}</textarea>`);
    }
  },{
    name:'Acción',
    hidden:true,
    formatter:(cell,row)=>{
      return gridjs.h('button',{
        className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
        onClick: () => {
          const comentarioTexto = document.getElementById(`observacion-${row.cells[0].data}`).value;
          comentario(row.cells[0].data, comentarioTexto);
        }
      },'guardar');
    }
  }],
  fixedHeader: true,
  server: {
    url: 'https://esenttiapp-production.up.railway.app/api/uploadordencargue',
    then: (data) => {
      if (Array.isArray(data) && data.length > 0) {
        return data.map((ordenCargue) => [
          ordenCargue.id,
          ordenCargue.fecha_solicitud,
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
    table: {width:"80%"}
  }
}).render(document.getElementById('acceso'));

function time() {
    document.getElementById('craeateAccesoPatio').reset();
    setTimeout(() => {
       window.location.href = `/view/patio/acceso_patio.html`; 
    },1200);
}

function salidaContenedor($contenedor,$operacion){
  fetch(`https://esenttiapp-production.up.railway.app/api/actualizaroperacionp/${contenedor}/${operacion}`, {
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
