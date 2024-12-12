
let gridOptions; 

const columnDefs = [
  { headerName: "id", field: "id", hide: false}, 
  { headerName: "Pedido", field: "pedido" },



  { 
    headerName: "Fecha Global", 
    field: "fecha_global",
    filter: "agDateColumnFilter",
    floatingFilter: true,
    filterParams: {
      browserDatePicker: true, 
      comparator: (filterLocalDateAtMidnight, cellValue) => {
        const [year, month, day] = cellValue.split('-');
        const cellDate = new Date(year, month - 1, day); 
        cellDate.setHours(0, 0, 0, 0);
        const filterDate = new Date(filterLocalDateAtMidnight); 

        if (cellDate.getTime() === filterDate.getTime()) {
          return 0;
        }
        if (cellDate < filterDate) {
          return -1;
        }
        if (cellDate > filterDate) {
          return 1;
        }
      },
    }
  },


  { 
    headerName: "Fecha Programa", 
    field: "fecha_programa",
    filter: "agDateColumnFilter",
    floatingFilter: true,
    filterParams: {
      browserDatePicker: true, 
      comparator: (filterLocalDateAtMidnight, cellValue) => {
        const [year, month, day] = cellValue.split('-');
        const cellDate = new Date(year, month - 1, day); 
        cellDate.setHours(0, 0, 0, 0);
        const filterDate = new Date(filterLocalDateAtMidnight); 

        if (cellDate.getTime() === filterDate.getTime()) {
          return 0;
        }
        if (cellDate < filterDate) {
          return -1;
        }
        if (cellDate > filterDate) {
          return 1;
        }
      },
    }
  },
  
  { headerName: "Ingreso Planta", field: "ingreso_planta" },
  { headerName: "Documentos Lleno", field: "documentos_lleno" },
  {
    headerName: "Cita Puerto",
    field: "cita_puerto",
    cellEditor: 'agRichSelectCellEditor',
    cellEditorParams: {
      values: getDatesWithHoursAndMinutes(7), // <-- Llamamos a la nueva función (7 días)
      cellHeight: 50,
    },
    valueFormatter: params => {
      if (params.value) {
        return params.value; // <-- Mostramos la fecha y hora tal cual
      }
      return '';
    }
  },
  { headerName: "Observacion OP", field: "observacion_op" },
  { headerName: "Validacion Piso", field: "validacion_piso" },
 
  { headerName: "Remisionado", field: "remisionado" },
 
  { headerName: "Vehiculo", field: "vehiculo" },
  { headerName: "Conductor", field: "conductor" },

  { headerName: "Cantidad Cont", field: "cantidad_cont" },
  { headerName: "Incoterms", field: "incoterms" },
  { headerName: "Cliente", field: "cliente" },
  { headerName: "Contenedor", field: "contenedor" },
  { headerName: "Tara", field: "tara" },
  { headerName: "Payload", field: "payload" },
  { headerName: "UVI", field: "uvi" },
  { headerName: "N Servicio", field: "n_servicio" },
  { headerName: "Reserva", field: "reserva" },
  { headerName: "Linea Naviera", field: "linea_naviera" },
  { headerName: "Patio Retiro", field: "patio_retiro" },
  { headerName: "Tipo Contenedor", field: "tipo_contenedor" },
  { headerName: "Peso Mercancia", field: "peso_mercancia" },
  { headerName: "Puerto Ingreso", field: "puerto_ingreso" },
  { headerName: "Motonave", field: "motonave" },
  { headerName: "Fecha Documental", field: "fecha_documental" },
  { headerName: "Corte Documental", field: "corte_documental" },
  { headerName: "Fecha Fisico", field: "fecha_fisico" },
  { headerName: "ETA MN", field: "eta_mn" },
 
  { headerName: "Tipo Modalidad", field: "tipo_modalidad"},
  { headerName: "Sitio Cargue", field: "sitio_cargue" },
  { headerName: "Remision", field: "remision" },
  { headerName: "Manifiesto", field: "manifiesto" },
  { headerName: "Dias Libres Piso", field: "dias_libre_piso" },
  { headerName: "Dias Libres Piso", field: "dias_libres_piso", hide: true},
  { headerName: "Placa puerto", field: "placa_puerto" },
  {
    headerName: "Conductor puerto",
    field: "conductor_puerto",
    editable: true,
    cellEditor: "agSelectCellEditor",
    onCellValueChanged: async (params) => {
      if (params.newValue) {
        try {
          // Llamada al endpoint para obtener la información del conductor
          const response = await fetch(`https://mi-api.com/conductores?nombre=${params.newValue}`);
          const data = await response.json();

          // Actualizar el valor del campo "cedula"
          if (data && data.cedula) {
            params.node.setDataValue("cedula", data.cedula);
          } else {
            console.warn("No se encontró información para el conductor seleccionado");
          }
        } catch (error) {
          console.error("Error al obtener los datos del conductor:", error);
        }
      }
    },
  },
  { headerName: "Cedula", 
    field: "cedula",
    editable:false
  },

 
  // { headerName: "Cedula Conductor", field: "cedula_conductor" },
 
  //{ headerName: "Estado Operación", field: "estado_operacion" },
  { headerName: "On Time", field: "on_timec" },
  { headerName: "Estado Operación", field: "estado_operacion" },
  //{ headerName: "Horas Planta", field: "horas_planta" },
  //{ headerName: "Fecha Retiro Vacio", field: "fecha_retiro_vacio" },
 
];

function getDatesWithHoursAndMinutes() {
  const datesWithHours = [];
  const now = moment(); // Usamos moment() para obtener la fecha y hora actual

  // Iteramos para los próximos 7 días
  for (let i = 0; i < 2; i++) { 
    const currentDate = moment().add(i, 'days'); 
    for (let j = 0; j < 24; j++) { 
      const hour = j.toString().padStart(2, '0');
      const minute = '00'; 
      const dateString = `${currentDate.format('DD-MM-YYYY')} ${hour}:${minute}`;
      const dateMoment = moment(dateString, 'DD-MM-YYYY HH:mm'); // Convertimos a objeto moment

      // Comparamos si la fecha es igual o posterior a la actual
      if (dateMoment.isSameOrAfter(now)) { 
        datesWithHours.push(dateString);
      }
    }
  }
  return datesWithHours;
}

fetch("https://sertrack-production.up.railway.app/api/intervalfifteenday", {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
  }
})
  .then(response => response.json())
  .then(data => {
    const processedData = data.map(Preprogramar => {
      return {
        id: Preprogramar.id,
        pedido: Preprogramar.pedido, 

        fecha_global: Preprogramar.fecha_global,
        fecha_programa: Preprogramar.fecha_programa,
        ingreso_planta: Preprogramar.ingreso_planta,
        documentos_lleno: Preprogramar.documentos_lleno,
        cita_puerto: Preprogramar.cita_puerto,
        observacion_op: Preprogramar.observacion_op,
        validacion_piso: Preprogramar.validacion_piso,
      
        remisionado: Preprogramar.remisionado,
        
        vehiculo: Preprogramar.vehiculo,
        conductor: Preprogramar.conductor,
      
        cantidad_cont: Preprogramar.cantidad_cont,
        incoterms: Preprogramar.incoterms,
        cliente: Preprogramar.cliente,
        contenedor: Preprogramar.contenedor,
        tara: Preprogramar.tara,
        payload: Preprogramar.payload,
        uvi: Preprogramar.uvi,
        n_servicio: Preprogramar.n_servicio,
        reserva: Preprogramar.reserva,
        linea_naviera: Preprogramar.linea_naviera,
        patio_retiro: Preprogramar.patio_retiro,
        tipo_contenedor: Preprogramar.tipo_contenedor,
        peso_mercancia: Preprogramar.peso_mercancia,
        puerto_ingreso: Preprogramar.puerto_ingreso,
        motonave: Preprogramar.motonave,
        fecha_documental: Preprogramar.fecha_documental,
        corte_documental: Preprogramar.corte_documental,
        fecha_fisico: Preprogramar.fecha_fisico,
        eta_mn: Preprogramar.eta_mn,
       
        sitio_cargue: Preprogramar.sitio_cargue,
        remision: Preprogramar.remision,
        manifiesto: Preprogramar.manifiesto,
        dias_libres_piso: Preprogramar.dias_libres_piso,
        placa_puerto: Preprogramar.placa_puerto,
        conductor_puerto: Preprogramar.conductor_puerto,

        
        // cedula_conductor: Preprogramar.cedula_conductor,
      
        //estado_operacion: Preprogramar.estado_operacion,
        on_timec: Preprogramar.on_timec,
        estado_operacion: Preprogramar.estado_operacion,
        horas_planta: Preprogramar.horas_planta,
        fecha_retiro_vacio: Preprogramar.fecha_retiro_vacio,
        dias_libre_piso: Preprogramar.dias_libre_piso,
      };
    });

    gridOptions = {
      columnDefs: columnDefs,
      defaultColDef: {
        resizable: true,
        sortable: false,
        filter: "agTextColumnFilter",
        floatingFilter: true,
        flex: 1,
        minWidth: 100,
        editable: true
      },
      rowSelection: 'multiple',
      enableRangeSelection: true,
      suppressMultiRangeSelection: true,
      pagination: true,
      paginationPageSize: 20,
      rowData: processedData,

      onCellValueChanged: (event) => {
        const updatedRowData = event.data;
        const id = updatedRowData.id;

        Swal.fire({
          title: 'Actualizando...',
          text: "Se actualizará la información en la base de datos",
          icon: 'info',
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          position: 'top-end',
          showConfirmButton: false
        });

        setTimeout(() => {
          fetch(`https://sertrack-production.up.railway.app/api/planeacion/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify(updatedRowData)
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Error al actualizar datos');
              }
              console.log('Datos actualizados correctamente');
              Swal.fire({
                title: '¡Actualizado!',
                text: 'El registro ha sido actualizado.',
                icon: 'success',
                timer: 1000,
                timerProgressBar: true,
                toast: true,
                position: 'top-end',
                showConfirmButton: false
              });
            })
            .catch(error => {
              console.error('Error al actualizar datos:', error);
              Swal.fire(
                'Error',
                'No se pudo actualizar el registro.',
                'error'
              );
            });
        }, 2000);
      }
    };

    const eGridDiv = document.getElementById('preprogramar');
    new agGrid.Grid(eGridDiv, gridOptions);
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
  });

function deleteSelectedRows() {
  const selectedRows = gridOptions.api.getSelectedRows();

  if (selectedRows.length === 0) {
    Swal.fire(
      'Ninguna fila seleccionada',
      'Por favor, selecciona al menos una fila para eliminar.',
      'warning'
    );
    return;
  }

  Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción eliminará los registros seleccionados de la base de datos.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar'
  }).then((result) => {
    if (result.isConfirmed) {
      const idsToDelete = selectedRows.map(row => row.id);
      idsToDelete.forEach(id => {
        fetch(`https://sertrack-production.up.railway.app/api/deletecst/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al eliminar el registro');
            }
            // Eliminar las filas seleccionadas del grid
            gridOptions.api.applyTransaction({ remove: selectedRows }); 
          })
          .catch(error => {
            console.error('Error al eliminar el registro:', error);
            Swal.fire(
              'Error',
              'No se pudo eliminar el registro.',
              'error'
            );
          });
      });

      Swal.fire(
        'Eliminados!',
        'Los registros han sido eliminados.',
        'success'
      );
    }
  });
}