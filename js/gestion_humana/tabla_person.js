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
    { headerName: "Año", field: "anio" },
    { headerName: "Mes", field: "mes" },
    { headerName: "Día", field: "dia" },
    { headerName: "Lugar Trabajo", field: "lugar_trabajo" },
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

const eGridDiv = document.getElementById('personal');

const gridContainer = document.createElement('div');
gridContainer.style.width = '100%';
gridContainer.style.height = '650px';
gridContainer.style.margin = '20px auto';
eGridDiv.appendChild(gridContainer); 

fetch("https://esenttiapp-production.up.railway.app/api/loadpersonas", {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
    }
})
.then(response => response.json())
.then(data => {
    if (Array.isArray(data) && data.length > 0) {
        const gridOptions = {
            columnDefs: columnDefs,
            defaultColDef: {
                resizable: true,
                sortable: false, 
                filter: "agTextColumnFilter",
                floatingFilter: true,
                flex: 1,
                minWidth: 100,
            },
            pagination: true,
            paginationPageSize: 10,
            rowData: data 
        };

        new agGrid.Grid(gridContainer, gridOptions); 
    } else {
        console.error("La respuesta del servidor no contiene datos válidos.");
        const gridOptions = {
            columnDefs: columnDefs,
            rowData: [] 
        };

        new agGrid.Grid(gridContainer, gridOptions);
    }
})
.catch(error => {
    console.error("Error al cargar los datos:", error);
});