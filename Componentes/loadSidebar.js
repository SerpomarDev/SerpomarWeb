function loadSidebar() {
    fetch('/componentes/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('#sidebar-container').innerHTML = data;
            console.log('Sidebar loaded'); // Mensaje de depuración

            // Obtiene el usuario autenticado del localStorage
            var loggedInUser = localStorage.getItem('loggedInUser');
            
            // Inicializa menús desplegables usando jQuery
            $(document).ready(function() {
                console.log('Document ready'); // Mensaje de depuración

                // Oculta todo el menú por defecto
                $('#menu > li').hide();

                // Verifica si hay un usuario autenticado
                if (loggedInUser) {
                    // Muestra solo los menús permitidos según el usuario
                    if (loggedInUser === 'transporte@serpomar.com') {
                        // Mostrar solo Dashboard y Patio
                        $('#menu > li').each(function() {
                            var id = $(this).attr('id');
                            if (id === 'menu-patio' || $(this).find('.nav-text').text().trim() === 'Dashboard') {
                                $(this).show();
                            }
                        });
                    } else {
                        // Mostrar todos los menús para otros usuarios
                        $('#menu > li').show();
                    }

                    // Mostrar el botón de cerrar sesión
                    $('#logout-button').show();
                }

                // Funcionalidad del botón de cerrar sesión
                $('#logout-button').click(function() {
                    localStorage.removeItem('loggedInUser');
                    window.location.href = '/login.html'; // Redirige a la página de inicio de sesión
                });

                // Asegúrate de que todos los submenús estén cerrados al cargar la página
                $('.has-arrow').each(function() {
                    var $this = $(this);
                    var $subMenu = $this.next('ul');
                    $subMenu.hide();
                    $this.attr('aria-expanded', 'false');
                    console.log('Submenu hidden for:', $this); // Mensaje de depuración
                });

                $('.has-arrow').click(function(e) {
                    e.preventDefault();
                    var $this = $(this);
                    var $subMenu = $this.next('ul');
                    $subMenu.slideToggle(300); // Aumentar el tiempo de animación para mayor claridad
                    $this.attr('aria-expanded', $this.attr('aria-expanded') === 'false' ? 'true' : 'false');
                    console.log('Submenu toggled for:', $this); // Mensaje de depuración
                });
            });
        })
        .catch(error => console.error('Error loading sidebar:', error));
}

document.addEventListener('DOMContentLoaded', loadSidebar);
