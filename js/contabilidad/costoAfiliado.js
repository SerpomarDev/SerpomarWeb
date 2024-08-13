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
        { name: "id", hidden: false },
        "Fecha", "SP", "Contenedor", "Placa", "Aliado", {
            name: "Tarifa",
            formatter: (_, row) => `$ ${(row.cells[6].data).toLocaleString()}`
        },
        "Ruta", "Conductor", "Estado","Observaciones",{
            name:"#ordencompra",
            hidden:true,
        },{
            name: 'Soportes',
            hidden: false,
            formatter: (cell, row) => {
              return gridjs.html(
                `<button id="btn-${row.cells[0].data}" class="upload-btn no-file" onclick="uploadId(${row.cells[0].data})">Ver Adjuntar</button>`
              );
            }
        },
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
                name:"#ordencompra",
                hidden:false,
                formatter: (cell, row) => {
                    return gridjs.html(`<input type="text" id="factura-${row.cells[0].data}">`);
                }
        },
        {
            name: "enviar",
            formatter: (cell, row) => {
              return gridjs.h('button', {
                  className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
                  onClick: () => actualizarFactura(row.cells[0].data)
              }, 'Enviar');
          }
        },
        {
            name: "Verificar",
            hidden: false,
            formatter: (cell, row) => {
              return gridjs.h('button', {
                  className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
                  onClick: () => verificarAdjuntos(row.cells[0].data),
              }, 'Verificar');
          }
        }
    ],
    fixedHeader: true,
    server: {
        url: `https://esenttiapp-production.up.railway.app/api/asignacionespendienteordencompra`,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
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
                    asigControl.descripcion,
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

localStorage.setItem("authToken", data.token);

function actualizarFactura() {
  // Obtener los IDs seleccionados y sus números de factura
  const checkboxes = document.querySelectorAll('.row-checkbox:checked');
   
  if (checkboxes.length === 0) {
        Swal.fire({
            title: "Advertencia",
            text: "Debe seleccionar al menos un registro para actualizar.",
            icon: "warning"
        });
        return;
    }

  const payload = Array.from(checkboxes).map(checkbox => {
    const id = checkbox.id.replace('checkbox-', '');
    const ordenInput = document.getElementById(`factura-${id}`);
    const row = checkbox.closest('tr');
    return {
        id: id,
        orden_compra: ordenInput ? ordenInput.value : '',
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

  fetch('https://esenttiapp-production.up.railway.app/api/actualizarfacturas', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("authToken")}`
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

function verificarAdjuntos(id){
    verificarAdjuntos(id)
}
