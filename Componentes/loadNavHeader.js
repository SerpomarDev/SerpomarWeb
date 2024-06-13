function loadNavHeader() {
    fetch('/componentes/navheader.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('#navheader-container').innerHTML = data;

            // Verificar si el usuario logeado es "experiencia@h3max.com"
            const userEmail = getLoggedInUserEmail(); // Obtiene el correo del usuario logeado del localStorage

            if (userEmail === "experiencia@h3max.com") {
                document.getElementById('logo-large').src = '/img/h3max.png';
                document.getElementById('logo-small').src = '/img/h3max.png';
            } else {
                document.getElementById('logo-large').src = '/img/logo.png';
                document.getElementById('logo-small').src = '/img/logopeque.png';
            }

            // Sidebar toggle functionality using the logo
            const sidebarToggle = document.querySelector('.sidebar-toggle');
            const sidebar = document.querySelector('.dlabnav');
            const container = document.querySelector('.container');

            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                container.classList.toggle('open');
            });
        })
        .catch(error => console.error('Error loading nav-header:', error));
}

document.addEventListener('DOMContentLoaded', loadNavHeader);

// Esta función obtiene el correo del usuario logeado desde el localStorage
function getLoggedInUserEmail() {
    return localStorage.getItem('loggedInUser');
}
