document.addEventListener('DOMContentLoaded', function() {
  loadSidebar();

  $("#layoutv2-placeholder").load("/Componentes/layoutv2.html", function() {
    console.log('layoutv2 loaded'); // Mensaje de depuración
    initializeLoginComponent(); // Inicializa el componente después de cargar el contenido
    attachLoginFormEvent(); // Agrega el evento al formulario de login
    initializeInactivityMonitor(); // Inicializa el monitor de inactividad
  });
});

function loadSidebar() {
  var loggedInUser = localStorage.getItem('loggedInUser');
  if (!loggedInUser) {
    // Redirige a logout.html si no hay usuario autenticado
    window.location.href = '/logout.html';
    return;
  }

  fetch('/Componentes/layout.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.text();
    })
    .then(data => {
      const layoutPlaceholder = document.querySelector('#layout-placeholder');
      if (layoutPlaceholder) {
        layoutPlaceholder.innerHTML = data;
        console.log('Sidebar loaded'); // Mensaje de depuración
        initializeMenu(loggedInUser);
        initScripts(); // Mover initScripts aquí puede garantizar que se ejecute después de que el contenido se haya cargado
      } else {
        console.error('Error: #layout-placeholder no encontrado');
      }
    })
    .catch(error => console.error('Error loading sidebar:', error));
}

function initializeMenu(loggedInUser) {
  $(document).ready(function() {
    console.log('Document ready'); // Mensaje de depuración

    $('#menu > li').hide();

    switch (loggedInUser) {
      // ROL VISITANTE **************************************************
      case 'visitante@serpomar.com':
        $('#menu > li:contains("Tu Rol: Visitante")').show();
        $('#menu-Dashboard').show();
        $('#menu-Dashboard ul li').hide();
        $('#menu-Dashboard ul li:contains("Dashboard")').show();
        break;
      // ROL VISITANTE **************************************************

      // ROL GENERAL **************************************************
      case 'admin@serpomar.com':
      case 'alexander.jimenez@serpomar.com':
      case 'lmaldonado@serpomar.com':
      case 'hugo.contreras@serpomar.com':
      case 'daniel.tinoco@serpomar.com':
      case 'yamid.agudelo@serpomar.com':
      case 'piedad.petro@serpomar.com':
      case 'michelle.echeverria@serpomar.com':
      case 'lvera@serpomar.com':
      case 'contabilidad@serpomar.com':
      case 'miguel.martinez@serpomar.com':
      case 'jglaguado@synergycaribe.com.co':
        $('#menu > li:contains("Tu Rol: General")').show();
        $('#menu > li').show();
        $('#menu > li:contains("Tu Rol: Coordinador")').hide();
        $('#menu > li:contains("Tu Rol: Analista de T.")').hide();
        $('#menu > li:contains("Tu Rol: Contabilidad")').hide();
        $('#menu > li:contains("Tu Rol: Control Acceso")').hide();
        $('#menu > li:contains("Tu Rol: Acceso Patio")').hide();
        $('#menu > li:contains("Tu Rol: Patio")').hide();
        $('#menu > li:contains("Tu Rol: Visitante")').hide();
        break;
      // ROL GENERAL **************************************************  

      // ROL COORDINADOR ***************************************************
      case 'edgar.florez@serpomar.com':
      case 'rafael.caicedo@serpomar.com':
      case 'brayan.balceiro@serpomar.com':
      case 'operacion.nacional1@serpomar.com': 
      case 'lina.young@serpomar.com':
      case 'vanesa.Cord.transportes.esenttia@serpomar.com':
      case 'mariaC.Cord.transportes.esenttia@serpomar.com':
        $('#menu > li:contains("Tu Rol: Coordinador")').show();
        $('#menu-transporte').show();
        $('#menu-transporte ul li').show();
        $('#menu-reporte').show();
        $('#menu-reporte ul li').show();
        $('#menu-patio').show();
        $('#menu-patio ul li').hide();
        $('#menu-patio ul li:contains("Inventario")').show();
        $('#menu-patio ul li:contains("Orden Cargue")').show();
        $('#menu-operaciones').show();
        $('#menu-operaciones ul li').hide();
        $('#menu-operaciones ul li:contains("Tablero General de Operaciones")').show();
        $('#menu-equipos').show();
        $('#menu-equipos ul li').hide();
        $('#menu-equipos ul li:contains("Flota")').show();
        break;
      // ROL COORDINADOR **************************************************


      // ROL ADMIN COORDINADOR ***************************************************
      case 'susana.negrette@serpomar.com':
      case 'henry.goethe@serpomar.com': 
      case 'carlos.carrasquilla@serpomar.com':
      case 'stephanie.otero@serpomar.com':
        $('#menu > li:contains("Tu Rol: Coordinador")').show();
        $('#menu-transporte').show();
        $('#menu-transporte ul li').show();
        $('#menu-crear').show();
        $('#menu-crear ul li').show();
        $('#menu-reporte').show();
        $('#menu-reporte ul li').show();
        $('#menu-patio').show();
        $('#menu-patio ul li').hide();
        $('#menu-patio ul li:contains("Inventario")').show();
        $('#menu-patio ul li:contains("Orden Cargue")').show();
        $('#menu-operaciones').show();
        $('#menu-operaciones ul li').hide();
        $('#menu-operaciones ul li:contains("Tablero General de Operaciones")').show();
        $('#menu-equipos').show();
        $('#menu-equipos ul li').hide();
        $('#menu-equipos ul li:contains("Flota")').show();
        break;
      // ROL ADMIN COORDINADOR **************************************************


      // ROL ANALISTA **************************************************
      case 'nayelis.tordecilla@serpomar.com':
      case 'keyla.castro@serpomar.com':
      case 'analistaimportaciones@serpomar.com':
      case 'yoleidys.alcazar@serpomar.com':
      case 'hector.fonseca@serpomar.com': 
      case 'darlinesV.transporte.esenttia@serpomar.com':
      case 'amauryM.transporte.esenttia@serpomar.com':
      case 'albertoT.analista.esenttia@serpomar.com':
        $('#menu > li:contains("Tu Rol: Analista de T.")').show();
        $('#menu-transporte').show();
        $('#menu-transporte ul li').show();
        $('#menu-reporte').show();
        $('#menu-reporte ul li').show();
        $('#menu-patio').show();
        $('#menu-patio ul li').hide();
        $('#menu-patio ul li:contains("Inventario")').show();
        $('#menu-patio ul li:contains("Orden Cargue")').show();
        $('#menu-operaciones').show();
        $('#menu-operaciones ul li').hide();
        $('#menu-operaciones ul li:contains("Tablero General de Operaciones")').show();
        $('#menu-equipos').show();
        $('#menu-equipos ul li').hide();
        $('#menu-equipos ul li:contains("Flota")').show();
        break;
      // ROL ANALISTA **************************************************

      // ROL CONTABILIDAD **************************************************
      case 'recepcion@serpomar.com':
      case 'Recepcion.facturas@serpomar.com':
      case 'katerine.pedroza@serpomar.com':
      case 'aprendiz.contabilidad@serpomar.com':
        $('#menu > li:contains("Tu Rol: Contabilidad")').show();
        $('#menu-contabilidad').show();
        $('#menu-contabilidad ul li').show();
        $('#menu-reporte').show();
        $('#menu-reporte ul li').show();
        $('#menu-operaciones').show();
        $('#menu-operaciones ul li').hide();
        $('#menu-operaciones ul li:contains("Tablero General de Operaciones")').show();
        $('#menu-transporte').show();
        $('#menu-transporte ul li').hide();
        $('#menu-transporte ul li:contains("Orden de S.")').show();
        break;
      // ROL CONTABILIDAD **************************************************     

      // ROL CONTROL ACCESO **************************************************
      case 'controlacceso@serpomar.com':
        $('#menu > li:contains("Tu Rol: Control Acceso")').show();
        $('#menu-patio').show();
        $('#menu-patio ul li').hide();
        $('#menu-patio ul li:contains("Acceso Patio")').show();
        $('#menu-patio ul li:contains("Inventario")').show();
        break;
      // ROL CONTROL ACCESO **************************************************

      // ROL ACCESO PATIO **************************************************
      case 'patio@serpomar.com':
        $('#menu > li:contains("Tu Rol: Acceso Patio")').show();
        $('#menu-patio').show();
        $('#menu-patio ul li').hide();
        $('#menu-patio ul li:contains("Inventario")').show();
        break;
      // ROL ACCESO PATIO **************************************************

      // ROL PATIO **************************************************
      case 'transporte@serpomar.com':
      case 'esenttiainhouse@serpomar.com':
        $('#menu > li:contains("Tu Rol: Patio")').show();
        $('#menu-patio').show();
        $('#menu-patio ul li').hide();
        $('#menu-patio ul li:contains("Orden Cargue")').show();
        $('#menu-patio ul li:contains("Inventario")').show();
        break;
      // ROL PATIO **************************************************

      default:
        $('#menu > li').show();
        break;
    }

    $('.has-arrow').each(function() {
      var $this = $(this);
      var $subMenu = $this.next('ul');
      $subMenu.hide();
      $this.attr('aria-expanded', 'false');
      console.log('Submenu hidden for:', $this);
    });

    $('.has-arrow').off('click').on('click', function(e) {
      e.preventDefault();
      var $this = $(this);
      var $subMenu = $this.next('ul');

      if ($this.attr('aria-expanded') === 'true') {
        $subMenu.slideUp(300);
        $this.attr('aria-expanded', 'false');
      } else {
        $('.has-arrow[aria-expanded="true"]').attr('aria-expanded', 'false').next('ul').slideUp(300);
        $subMenu.slideDown(300);
        $this.attr('aria-expanded', 'true');
      }
      console.log('Submenu toggled for:', $this);
    });

    $('#logout-button').click(function() {
      localStorage.removeItem('loggedInUser');
      window.location.href = '/index.html';
    });
  });
}

function initScripts() {
  const sidebar = document.querySelector('#sidebar');
  const logo = document.querySelector('#nodhus-logo');
  if (sidebar && logo) {
    const links = sidebar.querySelectorAll('a');

    let timeout;

    const keepSidebarOpen = () => {
      clearTimeout(timeout);
      sidebar.classList.add('open');
    };

    const closeSidebarWithDelay = () => {
      timeout = setTimeout(() => {
        sidebar.classList.remove('open');
      }, 500);
    };

    logo.addEventListener('mouseenter', keepSidebarOpen);
    logo.addEventListener('mouseleave', closeSidebarWithDelay);
    sidebar.addEventListener('mouseenter', keepSidebarOpen);
    sidebar.addEventListener('mouseleave', closeSidebarWithDelay);

    links.forEach(link => {
      link.addEventListener('mouseenter', keepSidebarOpen);
      link.addEventListener('mouseleave', closeSidebarWithDelay);
    });
  } 

  const dropdowns = document.querySelectorAll('#menu .dropdown > a');
  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener('click', function(e) {
      e.preventDefault();
      const parent = this.parentElement;
      const submenu = parent.querySelector('ul');

      if (parent.classList.contains('open')) {
        parent.classList.remove('open');
        $(submenu).slideUp(300);
      } else {
        document.querySelectorAll('#menu .dropdown').forEach((item) => {
          item.classList.remove('open');
          $(item.querySelector('ul')).slideUp(300);
        });
        parent.classList.add('open');
        $(submenu).slideDown(300);
      }
    });
  });
}

// Funciones para manejar la inactividad del usuario
let inactivityTimeout;

function resetInactivityTimeout() {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(() => {
    localStorage.removeItem('loggedInUser');
    window.location.href = '/inactividad.html';
  }, 10 * 60 * 1000); // 10 minutos en milisegundos
}

function initializeInactivityMonitor() {
  window.onload = resetInactivityTimeout;
  document.onmousemove = resetInactivityTimeout;
  document.onkeypress = resetInactivityTimeout;
  document.onscroll = resetInactivityTimeout;
  document.onclick = resetInactivityTimeout;
  document.ontouchstart = resetInactivityTimeout;
}

// Llama a la función para inicializar el monitor de inactividad
initializeInactivityMonitor();
