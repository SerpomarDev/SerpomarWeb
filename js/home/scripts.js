$(function() {
    $("#layout-placeholder").load("/Componentes/layout.html", function() {
        initScripts(); // Ejecuta los scripts necesarios después de cargar el componente
    });
});

function initScripts() {
    const slides = document.querySelector('.slides');
    const messages = document.querySelector('.messages');
    let index = 0;

    setInterval(() => {
        index = (index + 1) % 3;
        messages.style.transform = `translateX(${-index * 100 / 3}%)`;
    }, 5000); // Cambia la imagen y el mensaje cada 5 segundos

    // Control de la apertura del sidebar
    const sidebar = document.querySelector('#sidebar');
    const logo = document.querySelector('#nodhus-logo');
    const links = sidebar.querySelectorAll('a');

    let timeout;

    const keepSidebarOpen = () => {
        clearTimeout(timeout);
        sidebar.classList.add('open');
    };

    const closeSidebarWithDelay = () => {
        timeout = setTimeout(() => {
            sidebar.classList.remove('open');
        }, 500); // Retraso antes de cerrar el sidebar
    };

    logo.addEventListener('mouseenter', keepSidebarOpen);
    logo.addEventListener('mouseleave', closeSidebarWithDelay);
    sidebar.addEventListener('mouseenter', keepSidebarOpen);
    sidebar.addEventListener('mouseleave', closeSidebarWithDelay);

    // Asegurar que el sidebar no se cierra al interactuar con los enlaces
    links.forEach(link => {
        link.addEventListener('mouseenter', keepSidebarOpen);
        link.addEventListener('mouseleave', closeSidebarWithDelay);
    });

    // Control del submenú
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
