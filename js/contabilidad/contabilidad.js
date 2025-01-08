$(document).ready(function () {
  function actualizarContadores(data) {
    const totalSP = data.length;
    const valorTotal = data.reduce(
      (acc, liquidacion) => acc + liquidacion.valor_total,
      0
    );

    $("#total-sp-por-facturar").text(totalSP);
    $("#valor-total-sp").text(valorTotal.toLocaleString());
  }

  new gridjs.Grid({
    search: false,
    language: {
      search: {
        placeholder: "🔍 Buscar...",
      },
    },
    pagination: {
      limit: 10,
      enabled: true,
    },
    resizable: true,
    sort: false,
    columns: [
      "id",
       {
        name: "idss",
        hidden: true,
       },
      "SP",
      "DO",
      "Cliente",
      {
        name: "Valor Total",
        formatter: (_, row) => `$ ${row.cells[5].data.toLocaleString()}`,
      },
      "Fecha notificación",
      {
        name: "Numero factura",
        hidden: false,
        formatter: (cell, row) => {
          return gridjs.html(
            `<input type="text" id="factura-${row.cells[2].data}">`
          );
        },
      },
      {
        name: "Acción",
        hidden: false,
        formatter: (cell, row) => {
          return gridjs.h(
            "button",
            {
              className: "py-2 mb-4 px-4 border rounded bg-blue-600",
              onclick: () => {
                const facturaTexto = document.getElementById(
                  `factura-${row.cells[2].data}`
                ).value;
                numeroFactura(row.cells[0].data, facturaTexto);
              },
            },
            "Enviar"
          );
        },
      },
      {
        name: "Reporte",
        hidden: false,
        formatter: (cell, row) => {
          return gridjs.h(
            "button",
            {
              className: "py-2 mb-4 px-4 border rounded bg-green-600",
              id: "GeneReportExcelPreliq",
              onClick: () => {
                generarReport(row.cells[1].data);
              },
            },
            "Liquidación"
          );
        },
      },
    ],
    server: {
      url: `https://esenttiapp-production.up.railway.app/api/showliquidacion`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      then: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          actualizarContadores(data);
          return data.map((liquidacion) => [
            liquidacion.id,
            liquidacion.idss,
            liquidacion.do_sp,
            liquidacion.do_pedido,
            liquidacion.cliente,
            liquidacion.valor_total,
            liquidacion.fecha_creacion,
          ]);
        } else {
          console.error("La respuesta del servidor no contiene datos válidos.");
          return [];
        }
      },
    },
  }).render(document.getElementById("contabilidad"));

  function numeroFactura(id, factura) {
    if (!factura || factura.trim() === "") {
      Swal.fire({
        title: "Advertencia",
        text: "Por favor, ingrese un número de factura válido.",
        icon: "warning",
      });
      return; // Detener ejecución si factura está vacío
    }

    const spinner = document.getElementById("loadSpinner");
    spinner.style.display = "flex";

    fetch(
      `https://esenttiapp-production.up.railway.app/api/actualizarnfactura/${factura}/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          id: id,
          factura: factura,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        spinner.style.display = "none";

        Swal.fire({
          title: "¡Buen trabajo!",
          text: "Comentario guardado!",
          icon: "success",
        });
        setTimeout(() => {
          location.reload();
        }, 1500);
      })
      .catch((error) => {
        console.error("Error al guardar el comentario:", error);
        spinner.style.display = "none";
      });
  }
});

function generarReport(id) {

  const spinner = document.getElementById("loadSpinner");
  spinner.style.display = "flex";


  fetch(`https://esenttiapp-production.up.railway.app/api/excelpreliquidacioncontenedores/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener los datos de la API");
      }
      return response.blob();
    })
    .then((blob) => {
      // Crear un objeto URL a partir del blob
      const url = window.URL.createObjectURL(blob);

      // Crear un enlace <a> para descargar el reporte
      const a = document.createElement("a");
      a.href = url;
      a.download = "LiquidacionContenedores.xlsx";

      // Agregar el enlace al documento y hacer clic en él para descargar el reporte
      document.body.appendChild(a);
      a.click();

      spinner.style.display = "none";

      Swal.fire({
        title: "¡Buen trabajo!",
        text: "Su reporte se ha sido creado!",
        icon: "success",
      });

      // Limpiar el objeto URL y remover el enlace del documento
      window.URL.revokeObjectURL(url);
      a.remove();
    })
    .catch((error) => {
      console.error("Error", error);
      spinner.style.display = "none";
    });
}
