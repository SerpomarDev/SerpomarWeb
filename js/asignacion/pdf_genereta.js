function downloadPDF() {
    var tarifaField = document.getElementById('tarifa1');
    var tarifaLabel = tarifaField.previousElementSibling;
    var buttons = document.querySelectorAll('.btn-primary');
    var logo = document.getElementById('logo');

    // Hide elements
    tarifaField.style.display = 'none';
    tarifaLabel.style.display = 'none';
    buttons.forEach(button => button.style.display = 'none');
    logo.style.display = 'none';

    // Clone the form content
    var formContent = document.querySelector('.modal-body').cloneNode(true);
    formContent.querySelectorAll('input, select').forEach(element => {
        element.style.display = '';
        element.style.padding = '0px 0px'; // Reduce padding
        element.style.fontSize = '12px'; // Reduce font size
        element.style.height = '12px';
        element.parentElement.style.marginBottom = '0px'; // Reduce margin for PDF
    });

    // Create a container for the repeated content
    var container = document.createElement('div');
    container.style.textAlign = "center"; // Center the content

    for (var i = 0; i < 4; i++) {
        var section = document.createElement('div');
        section.className = "form-section";
        section.style.margin = '0 0 0px 0'; // Add 5px margin at the bottom between sections
        section.style.padding = '0'; // Remove padding

        // Create header container
        var headerContainer = document.createElement('div');
        headerContainer.className = "header-container";
        headerContainer.style.marginBottom = '0'; // Remove margin below the header
        headerContainer.style.paddingBottom = '0'; // Remove padding below the header

        // Add the logo
        var logoClone = logo.cloneNode(true);
        logoClone.style.display = 'inline-block';
        logoClone.style.width = '120px'; // Adjust logo width
        logoClone.style.height = 'auto'; // Maintain aspect ratio
        headerContainer.appendChild(logoClone);

        // Add the header info
        var headerInfo = document.createElement('div');
        headerInfo.className = 'header-info';
        headerInfo.style.marginBottom = '0'; // Remove margin below the header info
        headerInfo.style.paddingBottom = '0'; // Remove padding below the header info
        headerInfo.innerHTML = `
            <p style="margin: 0; padding: 0;"><strong>FORMATO ORDEN DE CARGUE</strong></p>
            <p style="margin: 0; padding: 0;">FECHA: 22/01/2024 - VERSION: 010 - CODIGO: FOR-OPE-001</p>
        `;
        headerContainer.appendChild(headerInfo);

        // Add the header container to the section
        section.appendChild(headerContainer);

        // Add the form content
        section.appendChild(formContent.cloneNode(true));

        container.appendChild(section);
    }

    var element = document.createElement('div');
    element.appendChild(container);

    // Define PDF options to fit all sections in one page
    var opt = {
        margin: [0.1, 0], // Margen reducido
        filename: 'solicitud_de_servicio.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save().then(function() {
        // Show elements again
        tarifaField.style.display = 'block';
        tarifaLabel.style.display = 'block';
        buttons.forEach(button => button.style.display = 'block');
        logo.style.display = 'none';
    });
}
