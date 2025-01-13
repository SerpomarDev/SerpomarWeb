const columnDefs = [
    { headerCheckboxSelection: false, checkboxSelection: true, width: 50 },
    { headerName: "id", field: "id_contenedor", hide: false },
    { headerName: "SP", field: "sp" },
    { headerName: "Pedido", field: "pedido" },
    { headerName: "Contenedor", field: "contenedor" },
    { headerName: "Cliente", field: "cliente" },
    {
      headerName: "Accion",
      cellRenderer: (params) => {
        const id = params.data.id_contenedor;
        return `<button class="py-2 px-4 bg-blue-600 text-white rounded" onclick="CrearProgramacion('${id}')"> Programar </button>`;
      },
      suppressRowClickSelection: true, // Evita conflictos con la selección de filas
    },
  ];
  
  fetch("https://esenttiapp-production.up.railway.app/api/uploadpreprogramar", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const processedData = data.map((Preprogramar) => {
        return {
          id_contenedor: Preprogramar.id_contenedor,
          sp: Preprogramar.sp,
          pedido: Preprogramar.pedido,
          contenedor: Preprogramar.contenedor,
          cliente: Preprogramar.cliente,
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
        },
        rowSelection: "multiple",
        suppressRowClickSelection: true, // Habilitar selección al hacer clic en las filas
        enableRangeSelection: true,
        suppressMultiRangeSelection: true,
        pagination: true,
        paginationPageSize: 20,
        rowData: processedData,
      };
  
      const eGridDiv = document.getElementById("preprogramar");
      new agGrid.Grid(eGridDiv, gridOptions);
    })
    .catch((error) => {
      console.error("Error al cargar los datos:", error);
      // Manejo de errores más específico
      if (error.message.includes("Network response")) {
        alert(
          "Error de red al obtener los datos. Por favor, verifica tu conexión a internet."
        );
      } else if (error.message.includes("Unexpected token")) {
        alert(
          "Error al procesar los datos del servidor. Por favor, intenta de nuevo más tarde."
        );
      } else {
        alert("Se ha producido un error. Por favor, contacta al administrador.");
      }
    });
  
  let payloadGlobal = null; // Variable para almacenar el payload global
  let isSending = false; // Variable para controlar el estado del envío
  
  // Función para deshabilitar el botón
  function disableButton() {
    const button = document.getElementById("saveButton");
    button.disabled = true;
    button.classList.add("opacity-50", "cursor-not-allowed");
  }
  
  // Función para habilitar el botón
  function enableButton() {
    const button = document.getElementById("saveButton");
    button.disabled = false;
    button.classList.remove("opacity-50", "cursor-not-allowed");
  }
  
  // Función para manejar toda la lógica
  function manejarProgramacion(accion) {
    switch (accion) {
      case "crearPayload":
        payloadGlobal = obtenerPayloadSeleccionado();
        if (payloadGlobal) {
          manejarProgramacion("mostrarModal");
        }
        break;
  
      case "mostrarModal":
        mostrarModal();
        break;
  
      case "actualizarPayloadYEnviar":
        // Solo envía si no hay una solicitud en curso
        if (!isSending) {
          actualizarPayloadConDatosModal();
          enviarDatos(payloadGlobal);
        }
        break;
  
      default:
        console.error("Acción no reconocida:", accion);
    }
  }
  
  // Función para obtener nodos seleccionados y construir el payload inicial
  function obtenerPayloadSeleccionado() {
    const selectedNodes = gridOptions.api.getSelectedNodes();
  
    if (selectedNodes.length === 0) {
      Swal.fire("Advertencia", "No has seleccionado ningún registro.", "warning");
      return null;
    }
  
    //console.log("Nodos seleccionados:", selectedNodes);
  
    return {
      programacion: selectedNodes.map((node) => ({
        id_contenedor: node.data.id_contenedor,
        // Campos del modal (inicialmente vacíos)
        fecha: "",
        tipo_servicio: "",
        origen: "",
        destino: "",
        hora: "",
      })),
    };
  }
  
  // Función para mostrar el modal
  function mostrarModal() {
    console.log("Payload inicial (antes de modal):", payloadGlobal);
  
    const modal = document.getElementById("myModal");
    modal.classList.remove("hidden");
    modal.style.display = "flex";
  }
  
  // Función para actualizar el payload con los datos ingresados en el modal
  function actualizarPayloadConDatosModal() {
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const tipo_servicio = document.getElementById("tipo_servicio").value;
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;
  
    if (!fecha || !tipo_servicio || !origen || !destino || !hora) {
      Swal.fire("Error", "Todos los campos del formulario son obligatorios.", "error");
      throw new Error("Campos del formulario incompletos");
    }
  
    payloadGlobal.programacion.forEach((item) => {
      item.fecha = fecha;
      item.tipo_servicio = tipo_servicio;
      item.origen = origen;
      item.destino = destino;
      item.hora = hora;
    });
  
    //console.log("Payload actualizado con datos del modal:", payloadGlobal);
  }
  
  // Función para enviar datos al backend
  function enviarDatos(payload) {
    //console.log("Payload enviado al backend:", JSON.stringify(payload));
  
    disableButton(); // Deshabilita el botón al iniciar el envío
    isSending = true; // Indica que hay un envío en progreso
  
    fetch("https://esenttiapp-production.up.railway.app/api/preprogramacion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(payload),
    })
    .then((response) => {
      if (!response.ok) {
        // Si la respuesta no es exitosa, lanza un error
        return response.json().then(err => { throw err; }); 
      }
      return response.json();
    })
    .then((data) => {
      //console.log("Respuesta del servidor:", data);
  
      Swal.fire({
        title: "¡Buen trabajo!",
        text: "¡Todos los registros seleccionados han sido programados!",
        icon: "success",
      });
  
      // Opcional: cerrar modal y recargar
      const modal = document.getElementById("myModal");
      modal.style.display = "none";
      setTimeout(() => location.reload(), 1500);
    })
    .catch((error) => {
      console.error("Error al enviar los datos:", error);
      let errorMessage = "Hubo un problema al enviar los datos. Por favor, inténtalo de nuevo.";
  
      // Verifica si el error es un objeto de respuesta de error con más detalles
      if (error && error.message) {
        errorMessage = error.message; 
      }
        Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
        });
    })
    .finally(() => {
      enableButton(); // Habilita el botón al finalizar el envío
      isSending = false; // Indica que el envío ha terminado
    });
  }
  
  // Ejemplo de uso para iniciar el flujo
  function CrearProgramacion() {
    manejarProgramacion("crearPayload");
  }
  
  // Enviar datos al hacer submit
  document
    .getElementById("savePreProgramar")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      manejarProgramacion("actualizarPayloadYEnviar");
    });
  
  document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
    modal.classList.add("hidden");
  
    // Asegurarse de que el botón tenga el ID "saveButton"
    const saveButton = document.querySelector(
      "#savePreProgramar button[type='submit']"
    );
    if (saveButton) {
      saveButton.id = "saveButton";
    }
  });
  
  function closeModal() {
    console.log("Botón Cerrar presionado");
    const modal = document.getElementById("myModal");
    modal.classList.add("hidden");
    modal.style.display = "none";
  }