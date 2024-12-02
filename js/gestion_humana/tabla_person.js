let gridInstance;

const columnDefs = [
    { headerName: "#", field: "id", hide: true },
    { headerName: "Fecha Ingreso", field: "fecha_ingreso" },
    { headerName: "Contratación", field: "contratacion" },
    { headerName: "Nombre", field: "nombre" },
    { headerName: "Apellidos", field: "apellidos" },
    { headerName: "Tipo Identificación", field: "tipo_identificacion" },
    { headerName: "Identificación", field: "identificacion" },
    { headerName: "Género", field: "genero" },
    { headerName: "Fecha Nacimiento", field: "fecha_nacimiento" },
    { headerName: "Mes Cumpleaños", field: "mes_cumpleanios" },
    { headerName: "Rango Edad", field: "rango_edad" },
    { headerName: "Lugar Nacimiento", field: "lugar_nacimiento" },
    { headerName: "Departamento", field: "departamento" },
    { headerName: "Nacionalidad", field: "nacionalidad" },
    { headerName: "Número Contacto", field: "numero_contacto" },
    { headerName: "Lugar Residencia", field: "lugar_residencia" },
    { headerName: "Estrato", field: "estrato" },
    { headerName: "Escolaridad", field: "escolaridad" },
    { headerName: "Estado Civil", field: "estado_civil" },
    { headerName: "Antigüedad", field: "antiguedad" },
    { headerName: "Años", field: "anos_antiguedad" },
    { headerName: "Meses", field: "meses_antiguedad" },
    { headerName: "Area Trabajo", field: "lugar_trabajo" },
    { headerName: "Cargo", field: "cargo" },
    { headerName: "Salario Base", field: "salario_base" },
    { headerName: "Bonificación", field: "bonificacion" },
    { headerName: "Proyecto", field: "proyecto" },
    { headerName: "Jefe Inmediato", field: "jefe_inmediato" },
    { headerName: "Periodo Prueba", field: "periodo_prueba" },
    { headerName: "Tipo Contrato", field: "tipo_contrato" },
    { headerName: "ARL", field: "arl" },
    { headerName: "EPS", field: "eps" },
    { headerName: "AFP", field: "afp" },
    { headerName: "Número Hijos", field: "numero_hijos" },
    { headerName: "Personas a Cargo", field: "personas_acargo" },
    { headerName: "Ciclo Familiar", field: "ciclo_familiar" },
    { headerName: "Enfermedad", field: "enfermedad" },
    { headerName: "Cual", field: "cual" },
    { headerName: "Bebidas Alcohólicas", field: "bebidas_alcoholicas" },
    { headerName: "Fuma", field: "fuma" },
    { headerName: "Deporte", field: "deporte" },
    { headerName: "Grupo Riesgo", field: "grupo_riesgo" },
    { headerName: "Cual Pertenece", field: "cual_pertenece" },
];

fetch("https://esenttiapp-production.up.railway.app/api/loadpersonas", {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
    }
})
.then((response) => response.json())
.then((data) => {
    const processedData = data.map((persona) => {
        return {
            id: persona.id,
            fecha_ingreso: persona.fecha_ingreso,
            contratacion: persona.contratacion,
            nombre: persona.nombre,
            apellidos: persona.apellidos,
            tipo_identificacion: persona.tipo_identificacion,
            identificacion: persona.identificacion,
            genero: persona.genero,
            fecha_nacimiento: persona.fecha_nacimiento,
            mes_cumpleanios: persona.mes_cumpleanios,
            rango_edad: persona.rango_edad,
            lugar_nacimiento: persona.lugar_nacimiento,
            departamento: persona.departamento,
            nacionalidad: persona.nacionalidad,
            numero_contacto: persona.numero_contacto,
            lugar_residencia: persona.lugar_residencia,
            estrato: persona.estrato,
            escolaridad: persona.escolaridad,
            estado_civil: persona.estado_civil,
            antiguedad: persona.antiguedad,
            anos_antiguedad: persona.anos_antiguedad,
            meses_antiguedad: persona.meses_antiguedad,
            lugar_trabajo: persona.lugar_trabajo,
            cargo: persona.cargo,
            salario_base: persona.salario_base,
            bonificacion: persona.bonificacion,
            proyecto: persona.proyecto,
            jefe_inmediato: persona.jefe_inmediato,
            periodo_prueba: persona.periodo_prueba,
            tipo_contrato: persona.tipo_contrato,
            arl: persona.arl,
            eps: persona.eps,
            afp: persona.afp,
            numero_hijos: persona.numero_hijos,
            personas_acargo: persona.personas_acargo,
            ciclo_familiar: persona.ciclo_familiar,
            enfermedad: persona.enfermedad,
            cual: persona.cual,
            bebidas_alcoholicas: persona.bebidas_alcoholicas,
            fuma: persona.fuma,
            deporte: persona.deporte,
            grupo_riesgo: persona.grupo_riesgo,
            cual_pertenece: persona.cual_pertenece,
        };
    });

    const gridOptions = {
        columnDefs: columnDefs,
        defaultColDef: {
            resizable: true,
            sortable: true,
            filter: "agTextColumnFilter",
            floatingFilter: true,
            editable: true
        },
        pagination: true,
        paginationPageSize: 7,
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
                fetch(`https://esenttiapp-production.up.railway.app/api/gestionHumana/${id}`, {
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
        },
    };

    const eGridDiv = document.getElementById("personal");
    gridInstance = new agGrid.Grid(eGridDiv, gridOptions);
})
.catch((error) => {
    console.error("Error al cargar los datos:", error);
});
