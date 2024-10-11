const columnDefs = [
    { headerName: "id", field: "id", hide: false },
    { headerName: "Pedido", field: "pedido" },
    { headerName: "Orden Servicio", field: "orden_servicio" },
    { headerName: "Fecha Global", field: "fecha_global" },
    { headerName: "Fecha Programa", field: "fecha_programa" },
    { headerName: "Confirmacion Traida", field: "confirmacion_traida" },
    { headerName: "Ingreso Planta", field: "ingreso_planta" },
    { headerName: "Documentos Lleno", field: "documentos_lleno" },
    { headerName: "Cita Puerto", field: "cita_puerto" },
    { headerName: "Observacion OP", field: "observacion_op" },
    { headerName: "Validacion Piso", field: "validacion_piso" },
    { headerName: "Alerta Repetidos", field: "alerta_repetidos" },
    { headerName: "Remisionado", field: "remisionado" },
    { headerName: "Modalidad", field: "modalidad" },
    { headerName: "Vehiculo", field: "vehiculo" },
    { headerName: "Conductor", field: "conductor" },
    { headerName: "Hora Cita KTN", field: "hora_cita_ktn" },
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
    { headerName: "Puede Bajar Piso", field: "puede_bajar_piso" },
    { headerName: "Tipo Modalidad", field: "tipo_modalidad" },
    { headerName: "Sitio Cargue", field: "sitio_cargue" },
    { headerName: "Remision", field: "remision" },
    { headerName: "Manifiesto", field: "manifiesto" },
    { headerName: "Dias Libres Piso", field: "dias_libres_piso" },
    { headerName: "Status", field: "status" },
    { headerName: "Obs Viaje Fallido", field: "obs_viaje_fallido" },
    { headerName: "Cumplimiento", field: "cumplimiento" },
    { headerName: "Cedula Conductor", field: "cedula_conductor" },
    { headerName: "Destino2", field: "destino2" },
    { headerName: "Generador", field: "generador" },
    { headerName: "Estado Operación", field: "estado_operación" },
    { headerName: "On Time", field: "on_time" },
    { headerName: "Horas Planta", field: "horas_planta" },
  ];
  
  fetch("http://127.0.0.1:8000/api/planeacion", {
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
        orden_servicio: Preprogramar.orden_servicio,
        fecha_global: Preprogramar.fecha_global,
        fecha_programa: Preprogramar.fecha_programa,
        confirmacion_traida: Preprogramar.confirmacion_traida,
        ingreso_planta: Preprogramar.ingreso_planta,
        documentos_lleno: Preprogramar.documentos_lleno,
        cita_puerto: Preprogramar.cita_puerto,
        observacion_op: Preprogramar.observacion_op,
        validacion_piso: Preprogramar.validacion_piso,
        alerta_repetidos: Preprogramar.alerta_repetidos,
        remisionado: Preprogramar.remisionado,
        modalidad: Preprogramar.modalidad,
        vehiculo: Preprogramar.vehiculo,
        conductor: Preprogramar.conductor,
        hora_cita_ktn: Preprogramar.hora_cita_ktn,
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
        puede_bajar_piso: Preprogramar.puede_bajar_piso,
        tipo_modalidad: Preprogramar.tipo_modalidad,
        sitio_cargue: Preprogramar.sitio_cargue,
        remision: Preprogramar.remision,
        manifiesto: Preprogramar.manifiesto,
        dias_libres_piso: Preprogramar.dias_libres_piso,
        status: Preprogramar.status,
        obs_viaje_fallido: Preprogramar.obs_viaje_fallido,
        cumplimiento: Preprogramar.cumplimiento,
        cedula_conductor: Preprogramar.cedula_conductor,
        destino2: Preprogramar.destino2,
        generador: Preprogramar.generador,
        estado_operación: Preprogramar.estado_operación,
        on_time: Preprogramar.on_time,
        horas_planta: Preprogramar.horas_planta,
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
        const idContenedor = updatedRowData.id_contenedor;
  
        Swal.fire({
          title: '¿Confirmar cambio?',
          text: "Se actualizará la información en la base de datos",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, confirmar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            fetch(`http://127.0.0.1:8000/api/planeacion/${id}`, {
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
              Swal.fire(
                '¡Actualizado!',
                'El registro ha sido actualizado.',
                'success'
              )
            })
            .catch(error => {
              console.error('Error al actualizar datos:', error);
              Swal.fire(
                'Error',
                'No se pudo actualizar el registro.',
                'error'
              )
            });
          }
        })
      }
    };
  
    const eGridDiv = document.getElementById('preprogramar');
    new agGrid.Grid(eGridDiv, gridOptions);
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
  });

