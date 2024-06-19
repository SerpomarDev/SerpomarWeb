document.addEventListener('DOMContentLoaded', function() {
    loadSidebar();
    
    $("#layoutv2-placeholder").load("/Componentes/layoutv2.html", function() {
      console.log('layoutv2 loaded'); // Mensaje de depuración
      initializeLoginComponent(); // Inicializa el componente después de cargar el contenido
      attachLoginFormEvent(); // Agrega el evento al formulario de login
    });
  });
  
  function loadSidebar() {
    var loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
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
        case 'gyplac.etex@serpomar.com':
          $('#menu > li').each(function() {
            var text = $(this).find('.nav-text').text().trim();
            if (text === 'Cargue' || text === 'Vacios' || text === 'Cerrar sesión') {
              $(this).show();
            }
          });
          break;
        case 'jglaguado@synergycaribe.com.co':
          $('#menu > li').each(function() {
            var text = $(this).find('.nav-text').text().trim();
            if (text !== 'Cargue' && text !== 'Vacios') {
              $(this).show();
            }
          });
          break;
        case 'henry.goethe@serpomar.com':
        case 'susana.negrette@serpomar.com':
        case 'Carlos.carrasquilla@serpomar.com':
          $('#menu-patio').show();
          $('#menu-patio ul li').hide();
          $('#menu-patio ul li:contains("Orden Cargue")').show();
          $('#menu-patio ul li:contains("Inventario")').show();
          $('#menu-patio ul li:contains("Crear Cliente")').show();
          $('#menu-patio ul li:contains("Crear Condu")').show();
          $('#menu-patio ul li:contains("Crear Placa")').show();
          break;
        case 'controlacceso@serpomar.com':
          $('#menu-patio').show();
          $('#menu-patio ul li').hide();
          $('#menu-patio ul li:contains("Acceso Patio")').show();
          $('#menu-patio ul li:contains("Inventario")').show();
          break;
        case 'patio@serpomar.com':
          $('#menu-patio').show();
          $('#menu-patio ul li').hide();
          $('#menu-patio ul li:contains("Inventario")').show();
          break;
        case 'transporte@serpomar.com':
        case 'esenttiainhouse@serpomar.com':
          $('#menu-patio').show();
          $('#menu-patio ul li').hide();
          $('#menu-patio ul li:contains("Orden Cargue")').show();
          $('#menu-patio ul li:contains("Inventario")').show();
          break;
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
  
      $('.has-arrow').click(function(e) {
        e.preventDefault();
        var $this = $(this);
        var $subMenu = $this.next('ul');
        $subMenu.slideToggle(300);
        $this.attr('aria-expanded', $this.attr('aria-expanded') === 'false' ? 'true' : 'false');
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
          submenu.style.display = 'none';
        } else {
          document.querySelectorAll('#menu .dropdown').forEach((item) => {
            item.classList.remove('open');
            item.querySelector('ul').style.display = 'none';
          });
          parent.classList.add('open');
          submenu.style.display = 'block';
        }
      });
    });
  }
  