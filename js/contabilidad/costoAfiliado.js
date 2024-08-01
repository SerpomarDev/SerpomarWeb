new gridjs.Grid({
    search: true,
    language: {
        search: {
            placeholder: '🔍 Buscar...'
        }
    },
    pagination: {
        limit: 20,
        enabled: false,
    },
    sort: true,
    fixedHeader: true,
    height: '400px',
    columns: [
        { name: "id", hidden: true },
        "Fecha", "SP", "Contenedor", "Placa", "Aliado", {
            name: "Tarifa",
            formatter: (_, row) => `$ ${(row.cells[6].data).toLocaleString()}`
        },
        "Ruta", "Conductor", "Estado","#factura",
        {
            name: "seleccione",
            formatter: (cell, row) => {
              return gridjs.h('input', {
                  type: 'checkbox',
                  id: `checkbox-${row.cells[0].data}`,
                  className: 'row-checkbox'
              });
            }
        },{
                name:"#factura",
                hidden:false,
                formatter: (cell, row) => {
                    return gridjs.html(`<input type="text" id="factura-${row.cells[0].data}" placeholder="Ingrese #factura">`);
                }
        },
        {
            name: "enviar",
            formatter: (cell, row) => {
              return gridjs.h('button', {
                  className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
                  onClick: () => actualizarFactura()
              }, 'Enviar');
          }
        },
        {
            name: "pagado",
            formatter: (cell, row) => {
              return gridjs.h('button', {
                  className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
                  onClick: () => actualizarPagado(row.cells[0].data),
              }, 'pagar');
          }
        }
    ],
    fixedHeader: true,
    server: {
        url: `http://esenttiapp.test/api/asignacionespendientepago`,
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map(asigControl => [
                    asigControl.id,
                    asigControl.fecha,
                    asigControl.do_sp,
                    asigControl.numero_contenedor,
                    asigControl.placa,
                    asigControl.aliado,
                    asigControl.tarifa,
                    asigControl.ruta,
                    asigControl.nombre,
                    asigControl.estado,
                    asigControl.numero_factura,
                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    },
    resizable: true,
    style: {
        table: { width: "100%" }
    }
}).render(document.getElementById('costoAfiliado'));



function actualizarFactura() {
  // Obtener los IDs seleccionados y sus números de factura
  const checkboxes = document.querySelectorAll('.row-checkbox:checked');
  const payload = Array.from(checkboxes).map(checkbox => {
    const id = checkbox.id.replace('checkbox-', '');
    const facturaInput = document.getElementById(`factura-${id}`);
    const row = checkbox.closest('tr');
    return {
        id: id,
        numero_factura: facturaInput ? facturaInput.value : '',
        fecha: row.cells[1].innerText,
        sp: row.cells[2].innerText,
        numero_contenedor: row.cells[3].innerText,
        placa: row.cells[4].innerText,
        aliado: row.cells[5].innerText,
        tarifa: row.cells[6].innerText,
        ruta: row.cells[7].innerText,
        nombre: row.cells[8].innerText,
        estado: row.cells[9].innerText
    };
  });

  fetch('http://esenttiapp.test/api/actualizarfacturas', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(data => {
    Swal.fire({
      title: "¡Actualizado!",
      text: "El estado ha sido actualizado.",
      icon: "success"
    });

    excelCostoAfiliado(payload)
    
    setTimeout(() => {
        location.reload();
    }, 1500);
  })
  .catch(error => {
      console.error('Error:', error);
  });
}

function actualizarPagado(id){
    actualizarPagado(id)
}