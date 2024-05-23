function loadSidebar() {
    fetch('/componentes/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('#sidebar-container').innerHTML = data;
            console.log('Sidebar loaded'); // Mensaje de depuración

            // Inicializar menús desplegables usando jQuery
            $(document).ready(function() {
                // Asegurarse de que todos los submenús estén cerrados al cargar la página
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
