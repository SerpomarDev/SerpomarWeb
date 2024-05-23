function loadNavHeader() {
    fetch('/componentes/navheader.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('#navheader-container').innerHTML = data;

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
