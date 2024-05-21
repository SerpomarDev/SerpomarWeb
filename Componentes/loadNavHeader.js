function loadNavHeader() {
    fetch('/componentes/navheader.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('#navheader-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading nav-header:', error));
}

document.addEventListener('DOMContentLoaded', loadNavHeader);
