function createHeader() {
  const headerContainer = document.getElementById("header-container");
  if (!headerContainer) {
    console.error("Error: No se encontró el contenedor del header.");
    return;
  }

  // Crea el contenido del header
  headerContainer.innerHTML = `
    <header>
      <img src="/img/nodhus.png" alt="Nodhus Logo" class="logo" id="nodhus-logo">
      <div class="header">
        <div class="inner">
          <div class="user-ui">
            <div class="user-menu-toggle">
              <div class="profile-img" style="background-image: url('/img/configuraciones.png')"></div>
              <span class="simple-arrow fa fa-chevron-down"></span>
            </div>
            <div class="user-menu">
              <div class="menu-nav">
                <div class="profile-section">
                  <div class="profile-info">
                    <p>Tu Rol</p>
                  </div>
                </div>
                <li><span class="fas fa-user"></span> Perfil</li>
                <li><span class="fa fa-cogs"></span> Ajustes</li>
                <li><span class="fa fa-question"></span> Ayuda</li>
                <a href="javascript:void(0)" id="logout-button" class="logout-link" aria-expanded="false">
                  <i class="fas fa-sign-out-alt"></i>
                  <span class="nav-text">Cerrar Sesión</span>
                </a>
              </div>
            </div>
            <div class="sign-out-icon">
              <div class="settings-icon">
                <div class="profile-icon">
                  <i class="fas fa-user-circle"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="floating-button">
        <i class="fas fa-comment-alt"></i>
      </button>
    </header>
    <div id="loading-spinner" class="spinner" style="display: none;">
      <div class="loading-spinner"></div>
      <i class="fas fa-spinner fa-spin"></i>
    </div>
    <div class="dlabnav">
      <div id="layout">
        <div class="dlabnav" id="sidebar">
          <div class="dlabnav-scroll sidebar-scroll">
            <ul class="metismenu" id="menu">
              <li id="roles-container"></li>
              <li id="menu-items-container"></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;

  // Configura el botón flotante
  setupFloatingButton();

  // Configura eventos adicionales si es necesario
  setupLogoutEvent();

  // Dispara un evento personalizado indicando que el header se ha cargado
  const event = new CustomEvent("headerLoaded");
  window.dispatchEvent(event);
}

// Configuración del botón flotante
function setupFloatingButton() {
  const floatingButton = document.querySelector(".floating-button");
  if (!floatingButton) {
    console.error("Error: No se encontró el botón flotante.");
    return;
  }

  floatingButton.addEventListener("click", () => {
    Swal.fire({
      title: "PQRS",
      html: generatePQRSForm(),
      showCloseButton: true,
      focusConfirm: false,
      preConfirm: handlePQRSFormSubmission,
    });
  });
}

// Genera el formulario de PQRS en HTML
function generatePQRSForm() {
  return `
    <style>
      #pqrs-form { /* Estilos del formulario */ }
      /* Agregar aquí los estilos del formulario */
    </style>
    <form id="pqrs-form">
      <div class="form-group">
        <label for="tipo"><i class="fas fa-question-circle"></i> Tipo de solicitud:</label>
        <select id="tipo" name="tipo" class="form-control">
          <option value="peticion">Petición</option>
          <option value="soporte">Queja</option>
          <option value="reclamo">Reclamo</option>
          <option value="sugerencia">Sugerencia</option>
        </select>
      </div>
      <div class="form-group">
        <label for="nombre"><i class="fas fa-user"></i> Nombre completo:</label>
        <input type="text" id="nombre" name="nombre" class="form-control" required>
      </div>
      <div class="form-group">
        <label for="email"><i class="fas fa-envelope"></i> Correo electrónico:</label>
        <input type="email" id="email" name="email" class="form-control" required>
      </div>
      <div class="form-group">
        <label for="mensaje"><i class="fas fa-comment-alt"></i> Comentario:</label>
        <textarea id="mensaje" name="mensaje" class="form-control" required></textarea>
      </div>
    </form>
  `;
}

// Maneja la lógica de envío del formulario PQRS
function handlePQRSFormSubmission() {
  const form = document.getElementById("pqrs-form");
  if (!form) return;

  const tipo = form.tipo.value;
  const nombre = form.nombre.value;
  const email = form.email.value;
  const mensaje = form.mensaje.value;

  return Swal.fire({
    title: "¿Estás seguro de enviar estos datos?",
    html: `
      Tipo: ${tipo}<br>
      Nombre: ${nombre}<br>
      Email: ${email}<br>
      Mensaje: ${mensaje}
    `,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, enviar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      sendPQRSData({ tipo, nombre, email, mensaje });
    }
  });
}

// Envía los datos del formulario a los endpoints
function sendPQRSData(data) {
  const request1 = fetch("https://api-pqrs-7vca.onrender.com/enviar_correo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const request2 = fetch(
    "https://esenttiapp-production.up.railway.app/api/ticket",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  Promise.all([request1, request2])
    .then((responses) => {
      if (responses.some((response) => !response.ok)) {
        throw new Error("Error en una o ambas solicitudes");
      }
      Swal.fire("Datos enviados con éxito a ambos endpoints", "", "success");
    })
    .catch((error) => {
      Swal.fire("Error", error.message, "error");
    });
}

// Configura el evento de cierre de sesión
function setupLogoutEvent() {
  const logoutButton = document.getElementById("logout-button");
  if (!logoutButton) return;

  logoutButton.addEventListener("click", () => {
    console.log("Cerrar sesión");
    // Lógica para cerrar sesión
  });
}

// Inicia la carga del header
window.onload = createHeader;
