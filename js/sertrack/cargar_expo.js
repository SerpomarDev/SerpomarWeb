const columnDefs = [
    { headerName: "id", field: "id", hide: false}, 
    { headerName: "Pedido", field: "pedido" },

    { headerName: "Fecha Global", field: "fecha_global" },
    { headerName: "Fecha Programa", field: "fecha_programa",  sort: 'desc' },
    
    { headerName: "Ingreso Planta", field: "ingreso_planta" },
    { headerName: "Documentos Lleno", field: "documentos_lleno" },
    { headerName: "Cita Puerto", field: "cita_puerto" },
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
    { headerName: "Dias Libres Piso", field: "dias_libres_piso" },

   
    // { headerName: "Cedula Conductor", field: "cedula_conductor" },
   
    //{ headerName: "Estado Operación", field: "estado_operacion" },
    { headerName: "On Time", field: "on_timec" },
    { headerName: "Estado Operación", field: "estado_operacion" },
    { headerName: "Horas Planta", field: "horas_planta" },
    { headerName: "Fecha Retiro Vacio", field: "fecha_retiro_vacio" },
  ];
  
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
        
        // cedula_conductor: Preprogramar.cedula_conductor,
      
        //estado_operacion: Preprogramar.estado_operacion,
        on_timec: Preprogramar.on_timec,
        estado_operacion: Preprogramar.estado_operacion,
        horas_planta: Preprogramar.horas_planta,
        fecha_retiro_vacio: Preprogramar.fecha_retiro_vacio,
      };
    });
  
    const gridOptions = {
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
  
          // Mostrar una notificación toast informando del cambio
          Swal.fire({
              title: 'Actualizando...',
              text: "Se actualizará la información en la base de datos",
              icon: 'info',
              timer: 1000, // La alerta se cerrará después de 2 segundos
              timerProgressBar: true, 
              toast: true, 
              position: 'top-end', 
              showConfirmButton: false // Ocultar el botón de confirmación
          });
  
          // Retrasar la actualización 2 segundos
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
                // Mostrar notificación de éxito más rápida
                Swal.fire({
                    title: '¡Actualizado!',
                    text: 'El registro ha sido actualizado.',
                    icon: 'success',
                    timer: 1000, // 1 segundo (o el tiempo que prefieras)
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
                  )
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

