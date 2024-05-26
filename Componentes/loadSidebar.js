function loadSidebar() {
    // Verifica si hay un usuario autenticado
    var loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        // Redirige a logout.html si no hay usuario autenticado
        window.location.href = '/logout.html';
        return;
    }

    fetch('/componentes/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('#sidebar-container').innerHTML = data;
            console.log('Sidebar loaded'); // Mensaje de depuración

            // Inicializa menús desplegables usando jQuery
            $(document).ready(function() {
                console.log('Document ready'); // Mensaje de depuración

                // Oculta todo el menú por defecto
                $('#menu > li').hide();

                // Mostrar siempre Dashboard y Cerrar sesión
                $('#menu > li').each(function() {
                    var text = $(this).find('.nav-text').text().trim();
                    if (text === 'Dashboard' || text === 'Cerrar sesión') {
                        $(this).show();
                    }
                });

                // Verifica si hay un usuario autenticado
                if (loggedInUser) {
                    // Mostrar menús según el usuario autenticado
                    switch (loggedInUser) {
                        case 'controlacceso@serpomar.com':
                            // Acceso a "acceso a patio", "inventario" y "cerrar sesión"
                            $('#menu-patio').show();
                            $('#menu-patio ul li').hide();
                            $('#menu-patio ul li:contains("Acceso Patio")').show();
                            $('#menu-patio ul li:contains("Inventario")').show();
                            break;
                        case 'patio@serpomar.com':
                            // Acceso a "inventario" y "cerrar sesión"
                            $('#menu-patio').show();
                            $('#menu-patio ul li').hide();
                            $('#menu-patio ul li:contains("Inventario")').show();
                            break;
                        case 'transporte@serpomar.com':
                            // Acceso a "orden de cargue", "inventario" y "cerrar sesión"
                            $('#menu-patio').show();
                            $('#menu-patio ul li').hide();
                            $('#menu-patio ul li:contains("Orden Cargue")').show();
                            $('#menu-patio ul li:contains("Inventario")').show();
                            break;
                        default:
                            // Mostrar todos los menús para otros usuarios
                            $('#menu > li').show();
                            break;
                    }

                    // Funcionalidad del botón de cerrar sesión
                    $('#logout-button').click(function() {
                        localStorage.removeItem('loggedInUser');
                        window.location.href = '/login.html'; // Redirige a la página de inicio de sesión
                    });


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
                }
            });
        })
        .catch(error => console.error('Error loading sidebar:', error));
}

document.addEventListener('DOMContentLoaded', loadSidebar);
