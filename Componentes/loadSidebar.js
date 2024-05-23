function loadSidebar() {
    fetch('/componentes/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('#sidebar-container').innerHTML = data;

            // Inicializar menús desplegables usando jQuery
            $(document).ready(function(){
                $('.has-arrow').click(function(e) {
                    e.preventDefault();
                    var $this = $(this);
                    var $subMenu = $this.next('ul');
                    $subMenu.slideToggle(0);
                    $this.attr('aria-expanded', $this.attr('aria-expanded') === 'false' ? 'true' : 'false');
                });

                // Ensure all submenus are closed on page load
                $('.has-arrow').each(function() {
                    var $this = $(this);
                    var $subMenu = $this.next('ul');
                    $subMenu.hide();
                    $this.attr('aria-expanded', 'false');
                });
            });
        })
        .catch(error => console.error('Error loading sidebar:', error));
}

document.addEventListener('DOMContentLoaded', loadSidebar);
