function loadPreloader() {
    fetch('/componentes/preloader.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('#preloader-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading preloader:', error));
}

document.addEventListener('DOMContentLoaded', loadPreloader);
