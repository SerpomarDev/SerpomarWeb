function createHeader() {
    const headerHTML = `
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

    const headerContainer = document.getElementById('header-container');
    headerContainer.innerHTML = headerHTML;

    // Disparar el evento personalizado después de insertar el encabezado
    const event = new CustomEvent('headerLoaded');
    window.dispatchEvent(event);
}

window.onload = createHeader;