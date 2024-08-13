function actualizarEstado(idOperacion,nuevoEstado) {
  fetch(`https://esenttiapp-production.up.railway.app/api/actualizaroperacion/${nuevoEstado}/${idOperacion}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("authToken")}`
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
        enabled: true,
        //summary: true
    },
    sort: false,
    resizable: true,
    columns: [{
      name:"#",
      hidden: false,
    },"Placa","Conductor","Aliado","Cliente","Ruta","Tarifa","Estado operación","Fecha",{
        name:'Estado Operación',
        formatter: (cell, row) => {
          return gridjs.h('select', {
              onchange: (e) => {
                  const nuevoEstado = e.target.value;
                  actualizarEstado(row.cells[0].data, nuevoEstado);
              },
          }, [
              gridjs.h('option', { value: '' }, 'Seleccione'),
              gridjs.h('option', { value: 'En curso' }, 'En curso'),
              gridjs.h('option', { value: 'Finalizado' }, 'Finalizado'),
              gridjs.h('option', { value: 'Demora' }, 'Demora'),
              gridjs.h('option', { value: 'Libre' }, 'Libre')
          ]);
      },
    }],
    server: {
        url: "https://esenttiapp-production.up.railway.app/api/showoperacion",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
      },
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((asignacion) => [
                  asignacion.id,
                  asignacion.placa,
                  asignacion.conductor,
                  asignacion.aliado,
                  asignacion.ruta,
                  asignacion.tarifa,
                  asignacion.cliente,
                  asignacion.estado_operacion,
                  asignacion.fecha
                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    },
    style: {
      table: {with:"80%"}
    },
    
}).render(document.getElementById('operacion'))

localStorage.setItem("authToken", data.token);

function time() {
  setTimeout(() => {
    window.location.href = `/view/operacion/operacion.html`;
  }, 1500);
}