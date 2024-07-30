function downloadPDF() {
    var tarifaField = document.getElementById('tarifa1');
    var tarifaLabel = tarifaField.previousElementSibling;
    var buttons = document.querySelectorAll('.btn-primary');
    var buttons1 = document.querySelectorAll('.btn-secondary');
    var buttons2 = document.querySelectorAll('.btn-success');
    var logo = document.getElementById('logo');

    // Ocultar el campo y la etiqueta de tarifa en el formulario original
    tarifaField.style.display = 'none';
    tarifaLabel.style.display = 'none';
    buttons.forEach(button => button.style.display = 'none');
    buttons1.forEach(button => button.style.display = 'none');
    buttons2.forEach(button => button.style.display = 'none');
    logo.style.display = 'none';

    // Clonar el contenido del formulario
    var formContent = document.querySelector('.modal-body').cloneNode(true);

    // Remover el campo de tarifa y su etiqueta del contenido clonado
    var clonedTarifaField = formContent.querySelector('#tarifa1');
    var clonedTarifaLabel = clonedTarifaField ? clonedTarifaField.previousElementSibling : null;
    if (clonedTarifaField) clonedTarifaField.parentElement.removeChild(clonedTarifaField);
    if (clonedTarifaLabel) clonedTarifaLabel.parentElement.removeChild(clonedTarifaLabel);

    // Actualizar valores seleccionados en los selects clonados
    document.querySelectorAll('select').forEach(originalSelect => {
        var clonedSelect = formContent.querySelector('#' + originalSelect.id);
        if (clonedSelect) {
            var selectedValue = originalSelect.options[originalSelect.selectedIndex].text;
            var input = document.createElement('input');
            input.type = 'text';
            input.value = selectedValue;
            input.style.display = 'block';
            input.style.border = '1px solid #000000'; // Border similar to the form control
            input.style.borderRadius = '.25rem'; // Border radius similar to the form control
            input.style.width = '100%';
            input.style.height = '20px';
            input.style.padding = '0.375rem 0.75rem'; // Padding similar to the form control
            input.style.fontSize = '14px'; // Font size similar to the form control
            input.style.fontWeight = '400'; // Font weight similar to the form control
            input.style.lineHeight = '1.5'; // Line height similar to the form control
            input.style.color = '#000000'; // Text color similar to the form control
            input.style.backgroundColor = '#fff'; // Background color similar to the form control
            input.style.backgroundClip = 'padding-box'; // Background clip similar to the form control
            input.style.marginBottom = '0'; // Margin similar to the form control
            clonedSelect.parentElement.appendChild(input);
            clonedSelect.style.display = 'none';
        }
    });

    formContent.querySelectorAll('input').forEach(element => {
        element.style.display = '';
        element.style.padding = '0px 4px'; // Reduce padding
        element.style.fontSize = '10px'; // Reduce font size
        element.style.height = '15px';
        element.style.color = '#000000';
        element.style.border = '1px solid #000000';
        element.parentElement.style.marginBottom = '0px'; // Reduce margin for PDF
    });

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
        headerInfo.style.color = '#000000';
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