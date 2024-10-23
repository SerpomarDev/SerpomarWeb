new gridjs.Grid({
    search: true,
    language: {
      search: {
        placeholder: '🔍 Buscar...'
      }
    },
    pagination: {
      limit: 10,
      enabled: true,
    },
    resizable: true,
    sort: false,
    columns: [
      "#",
      "Placa",
      "Vence Soat",
      "Vence Tecnicomecanica",
      {
        name: 'ON / OFF',
        formatter: (cell, row) => {
          const inactivo = row.cells[4].data; // ¡Corregido! Índice 4 en lugar de 5 (0-indexado)
  
          let inputElement;
  
          const switchElement = gridjs.h('label', { class: 'switch' }, [
            gridjs.h('input', {
              type: 'checkbox',
              checked: !inactivo,
              ref: (el) => { inputElement = el },
              onchange: () => {
                Swal.fire({
                  title: 'Actualizando...',
                  didOpen: () => {
                    Swal.showLoading()
                  },
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  showConfirmButton: false
                });
  
                fetch(`https://esenttiapp-production.up.railway.app/api/placas/${row.cells[0].data}`, { // Endpoint para actualizar placas
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
                  },
                  body: JSON.stringify({ inactivo: !inputElement.checked })
                })
                  .then(response => {
                    if (!response.ok) {
                      throw new Error('Error al actualizar el estado de la placa');
                    }
                    // Mostrar un mensaje de éxito con SweetAlert
                    Swal.fire({
                      icon: 'success',
                      title: 'Estado actualizado',
                      showConfirmButton: false,
                      timer: 1500
                    });
                  })
                  .catch(error => {
                    // Mostrar un mensaje de error con SweetAlert
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Error al actualizar el estado de la placa'
                    });
  
                    console.error(error);
                  });
              }
            }),
            gridjs.h('span', { class: 'slider round' })
          ]);
  
          return switchElement;
        },
      },
    ],
  
    server: {
      url: "https://esenttiapp-production.up.railway.app/api/cargarplaca",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      },
      then: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          return data.map((placas) => [
            placas.id_placa,
            placas.placa,
            placas.fecha_vencimientos,
            placas.fecha_vencimientot,
            placas.inactivo // Asegúrate de que "inactivo" esté en la posición correcta
          ]); 
        } else {
          console.error("La respuesta del servidor no contiene datos válidos.");
          return [];
        }
      }
    }
  
  }).render(document.getElementById('placas'));