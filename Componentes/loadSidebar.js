function loadSidebar() {
    fetch('/componentes/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('#sidebar-container').innerHTML = data;

            // Inicializar menús desplegables usando jQuery
            $(document).ready(function() {
                // Asegurarse de que todos los submenús estén cerrados al cargar la página
                $('.has-arrow').each(function() {
                    var $this = $(this);
                    var $subMenu = $this.next('ul');
                    $subMenu.hide();
                    $this.attr('aria-expanded', 'false');
                });

                $('.has-arrow').click(function(e) {
                    e.preventDefault();
                    var $this = $(this);
                    var $subMenu = $this.next('ul');
                    $subMenu.slideToggle(300); // Aumentar el tiempo de animación para mayor claridad
                    $this.attr('aria-expanded', $this.attr('aria-expanded') === 'false' ? 'true' : 'false');
                });
            });
        })
        .catch(error => console.error('Error loading sidebar:', error));
}

document.addEventListener('DOMContentLoaded', loadSidebar);
