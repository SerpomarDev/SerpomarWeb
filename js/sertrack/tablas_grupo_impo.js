let table; // Declara la variable para la instancia de Tabulator

document.addEventListener("DOMContentLoaded", () => {
  // Configuración inicial de Tabulator
  table = new Tabulator("#tabla-combinada", {
    data: [], // Inicializar con un array vacío
    layout: "fitDataFill",
    responsiveLayout: "collapse", // Ocultar columnas que no caben en la pantalla
    height: "100%", // Altura del 100%
    pagination: false,
    movableColumns: true,
    groupBy: ["fuente", "tipo_contenedor"], // Agrupar por fuente y tipo de contenedor
    groupStartOpen: false, // Iniciar con todos los grupos contraídos
    groupToggleElement: "header", // Permitir expandir/contraer al hacer clic en el encabezado del grupo
    columns: [
      { title: "Fuente", field: "fuente", headerHozAlign: "center" },
      { title: "Contenedor", field: "contenedor", headerHozAlign: "center" },
      {
        title: "Tipo de contenedor",
        field: "tipo_contenedor",
        headerHozAlign: "center",
      },
      { title: "Pedido", field: "pedido", headerHozAlign: "center" },
      {
        title: "Días en patio",
        field: "dias_en_patio",
        headerHozAlign: "center",
        formatter: function (cell, formatterParams, onRendered) {
          const rowData = cell.getRow().getData();
          if (rowData.fuente === "Vacios en Patio por Devolución") {
            return cell.getValue();
          } else {
            return "";
          }
        },
      },
      {
        title: "Fecha Cita",
        field: "fecha_cita",
        headerHozAlign: "center",
        formatter: function (cell, formatterParams, onRendered) {
          const rowData = cell.getRow().getData();
          if (rowData.fuente === "Citas Programadas") {
            return cell.getValue();
          } else {
            return "";
          }
        },
      },
      {
        title: "Producto",
        field: "producto",
        headerHozAlign: "center",
        formatter: function (cell, formatterParams, onRendered) {
          const rowData = cell.getRow().getData();
          if (rowData.fuente === "Citas Programadas") {
            return cell.getValue();
          } else {
            return "";
          }
        },
      },
      {
        title: "Placa",
        field: "placa",
        headerHozAlign: "center",
        formatter: function (cell, formatterParams, onRendered) {
          const rowData = cell.getRow().getData();
          if (
            rowData.fuente === "Citas Programadas" ||
            rowData.fuente === "EN PATIO SERPOMAR"
          ) {
            return cell.getValue();
          } else {
            return "";
          }
        },
      },
      {
        title: "Sitio Descargue",
        field: "sitio",
        headerHozAlign: "center",
        formatter: function (cell, formatterParams, onRendered) {
          const rowData = cell.getRow().getData();
          if (rowData.fuente === "Citas Programadas") {
            return cell.getValue();
          } else {
            return "";
          }
        },
      },
      {
        title: "Naviera",
        field: "naviera",
        headerHozAlign: "center",
        formatter: function (cell, formatterParams, onRendered) {
          const rowData = cell.getRow().getData();
          if (rowData.fuente === "EN PATIO SERPOMAR") {
            return cell.getValue();
          } else {
            return "";
          }
        },
      },
      {
        title: "Fecha Notificación",
        field: "fecha_notificacion",
        headerHozAlign: "center",
        formatter: function (cell, formatterParams, onRendered) {
          const rowData = cell.getRow().getData();
          if (rowData.fuente === "Pendiente por cita") {
            return cell.getValue();
          } else {
            return "";
          }
        },
      },
      {
        title: "Cantidad",
        field: "cantidad",
        headerHozAlign: "center",
        formatter: function (cell, formatterParams, onRendered) {
          const rowData = cell.getRow().getData();
          if (rowData.fuente === "Pendiente por cita") {
            let cantidad = 0;
            const group = cell.getRow().getGroup();
            if (group) {
              const subGroups = group.getSubGroups();
              if (subGroups.length > 0) {
                // Si hay subgrupos, sumar las cantidades de cada subgrupo
                subGroups.forEach((subGroup) => {
                  cantidad += subGroup.getRows().length;
                });
              } else {
                // Si no hay subgrupos, contar las filas del grupo actual
                cantidad = group.getRows().length;
              }
            }
            return cantidad;
          } else {
            return "";
          }
        },
      },
    ],
  });

  function fetchData() {
    console.log("fetchData ejecutándose...");
    return Promise.all([
      fetch(
        `https://esenttiapp-production.up.railway.app/api/registroestadistico`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      ),
      fetch("https://esenttiapp-production.up.railway.app/api/cargarinventario", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }),
    ]);
  }

  function renderTable(dataRegistro, dataInventario) {
    console.log("renderTable ejecutándose...");
    const clienteFiltrar = localStorage.getItem("cliente");
    const fechaSeleccionada = localStorage.getItem("fechaSeleccionada");
    const fechaSeleccionadaDate = fechaSeleccionada
      ? new Date(fechaSeleccionada + "T00:00:00")
      : null;

    console.log("renderTable - fechaSeleccionada:", fechaSeleccionada);
    console.log("renderTable - fechaSeleccionadaDate:", fechaSeleccionadaDate);

    const datosCitas = dataRegistro
      .filter((item) => {
        const fechaCita = item.fecha_cita ? new Date(item.fecha_cita) : null;
        if (fechaCita) {
          fechaCita.setHours(0, 0, 0, 0);
        }
        const cumpleCondicion =
          item.cliente === clienteFiltrar &&
          item.modalidad === "importacion" &&
          fechaCita !== null &&
          (!fechaSeleccionadaDate ||
            fechaCita.toDateString() === fechaSeleccionadaDate.toDateString());

        return cumpleCondicion;
      })
      .map((item) => ({
        fuente: "Citas Programadas",
        id: item.id_primario,
        contenedor: item.numero_contenedor,
        pedido: item.pedido,
        fecha_cita: item.fecha_cita,
        cliente: item.cliente,
        modalidad: item.modalidad,
        producto: item.producto,
        placa_puerto: item.placa_puerto,
        sitio: item.sitio_cargue_descargue,
      }));

    const datosVacios = dataInventario
      .filter(
        (item) =>
          item.lleno_vacio === "VACIO" &&
          item.cliente === clienteFiltrar &&
          item.modalidad === "IMPORTACION"
      )
      .map((item) => ({
        fuente: "Vacios en Patio por Devolución",
        id: item.id,
        contenedor: item.contenedor,
        tipo_contenedor: item.tipo_contenedor,
        dias_en_patio: item.cantidad_dias,
      }));

    const datosInventario = dataInventario
      .filter(
        (item) =>
          item.lleno_vacio === "LLENO" &&
          item.cliente === clienteFiltrar &&
          item.modalidad === "IMPORTACION"
      )
      .map((item) => ({
        fuente:
          item.tipo_contenedor === "20 ISO"
            ? "EN PATIO SERPOMAR"
            : "EN PATIO SERPOMAR",
        id: item.id,
        contenedor: item.contenedor,
        tipo_contenedor: item.tipo_contenedor,
        naviera: item.naviera,
        placa: item.placa,
      }));

    const datosPendientesPorCita = dataRegistro
      .filter(
        (item) =>
          item.cliente === clienteFiltrar &&
          item.modalidad === "importacion" &&
          item.fecha_notificacion !== null &&
          item.fecha_cita === null
      )
      .map((item) => ({
        fuente: "Pendiente por cita",
        id: item.id_primario,
        contenedor: item.numero_contenedor,
        fecha_notificacion: item.fecha_notificacion,
      }));

    const datosCombinados = [
      ...datosPendientesPorCita,
      ...datosCitas,
      ...datosVacios,
      ...datosInventario,
    ];

    // Usar setData para actualizar los datos de la tabla
    table.setData(datosCombinados);
  }

  // Configurar el input de fecha
  const calendarInput = document.querySelector(".calendar");
  if (calendarInput) {
    const fechaActual = new Date();
    const fechaActualFormateada = fechaActual.toISOString().split("T")[0];
    calendarInput.value = fechaActualFormateada;

    localStorage.setItem("fechaSeleccionada", fechaActualFormateada);

    calendarInput.addEventListener("change", () => {
      localStorage.setItem("fechaSeleccionada", calendarInput.value);
      window.dispatchEvent(new CustomEvent("fechaCambiada"));
    });

    // Cargar datos iniciales
    fetchData().then((responses) => {
      Promise.all(responses.map((response) => response.json()))
        .then(([dataRegistro, dataInventario]) => {
          renderTable(dataRegistro, dataInventario);
        });
    });
  } else {
    console.error("No se encontró el elemento con clase 'calendar'");
  }

  // Manejar cambios en el localStorage y el evento personalizado
  window.addEventListener("storage", (event) => {
    if (event.key === "fechaSeleccionada") {
      fetchData().then((responses) => {
        Promise.all(responses.map((response) => response.json()))
          .then(([dataRegistro, dataInventario]) => {
            renderTable(dataRegistro, dataInventario);
          });
      });
    }
  });

  window.addEventListener("fechaCambiada", () => {
    fetchData().then((responses) => {
      Promise.all(responses.map((response) => response.json()))
        .then(([dataRegistro, dataInventario]) => {
          renderTable(dataRegistro, dataInventario);
        });
    });
  });
});