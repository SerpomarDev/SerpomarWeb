document.getElementById('inspeccionForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Función para obtener el valor de un campo de radio, o un valor predeterminado si no está seleccionado
    function getRadioValue(name) {
        const checkedRadio = document.querySelector(`input[name="${name}"]:checked`);
        return checkedRadio ? checkedRadio.value : null;
    }

    // Capturamos los datos del formulario
    const formData = {
        fecha_inspeccion: document.getElementById('fecha_inspeccion') ? document.getElementById('fecha_inspeccion').value : '',
        responsable: document.getElementById('responsable') ? document.getElementById('responsable').value : '',

        // Items
        item1_c: getRadioValue('puertas_seguras') === 'C',
        item1_nc: getRadioValue('puertas_seguras') === 'NC',
        observaciones_item1: document.querySelector('input[name="observaciones_puertas"]') ? document.querySelector('input[name="observaciones_puertas"]').value : '',

        item2_c: getRadioValue('ventanas_seguras') === 'C',
        item2_nc: getRadioValue('ventanas_seguras') === 'NC',
        observaciones_item2: document.querySelector('input[name="observaciones_ventanas"]') ? document.querySelector('input[name="observaciones_ventanas"]').value : '',

        item3_c: getRadioValue('puerta_interna') === 'C',
        item3_nc: getRadioValue('puerta_interna') === 'NC',
        observaciones_item3: document.querySelector('input[name="observaciones_puerta_interna"]') ? document.querySelector('input[name="observaciones_puerta_interna"]').value : '',

        item4_c: getRadioValue('senalizacion') === 'C',
        item4_nc: getRadioValue('senalizacion') === 'NC',
        observaciones_item4: document.querySelector('input[name="observaciones_senalizacion"]') ? document.querySelector('input[name="observaciones_senalizacion"]').value : '',

        item5_c: getRadioValue('cctv') === 'C',
        item5_nc: getRadioValue('cctv') === 'NC',
        observaciones_item5: document.querySelector('input[name="observaciones_cctv"]') ? document.querySelector('input[name="observaciones_cctv"]').value : '',

        item6_c: getRadioValue('dvr_seguro') === 'C',
        item6_nc: getRadioValue('dvr_seguro') === 'NC',
        observaciones_item6: document.querySelector('input[name="observaciones_dvr"]') ? document.querySelector('input[name="observaciones_dvr"]').value : '',

        item7_c: getRadioValue('minuta_control') === 'C',
        item7_nc: getRadioValue('minuta_control') === 'NC',
        observaciones_item7: document.querySelector('input[name="observaciones_minuta"]') ? document.querySelector('input[name="observaciones_minuta"]').value : '',

        item8_c: getRadioValue('puertas_enrollables') === 'C',
        item8_nc: getRadioValue('puertas_enrollables') === 'NC',
        observaciones_item8: document.querySelector('input[name="observaciones_puertas_enrollables"]') ? document.querySelector('input[name="observaciones_puertas_enrollables"]').value : '',

        item9_c: getRadioValue('cctv_muelles') === 'C',
        item9_nc: getRadioValue('cctv_muelles') === 'NC',
        observaciones_item9: document.querySelector('input[name="observaciones_cctv_muelles"]') ? document.querySelector('input[name="observaciones_cctv_muelles"]').value : '',

        item10_c: getRadioValue('cctv_interior') === 'C',
        item10_nc: getRadioValue('cctv_interior') === 'NC',
        observaciones_item10: document.querySelector('input[name="observaciones_cctv_interior"]') ? document.querySelector('input[name="observaciones_cctv_interior"]').value : '',

        item11_c: getRadioValue('paredes_aseguradas') === 'C',
        item11_nc: getRadioValue('paredes_aseguradas') === 'NC',
        observaciones_item11: document.querySelector('input[name="observaciones_paredes"]') ? document.querySelector('input[name="observaciones_paredes"]').value : '',

        item12_c: getRadioValue('desagues_rejillas') === 'C',
        item12_nc: getRadioValue('desagues_rejillas') === 'NC',
        observaciones_item12: document.querySelector('input[name="observaciones_desagues"]') ? document.querySelector('input[name="observaciones_desagues"]').value : '',

        item13_c: getRadioValue('banos_higiene') === 'C',
        item13_nc: getRadioValue('banos_higiene') === 'NC',
        observaciones_item13: document.querySelector('input[name="observaciones_banos"]') ? document.querySelector('input[name="observaciones_banos"]').value : '',

        item14_c: getRadioValue('puertas_operativas') === 'C',
        item14_nc: getRadioValue('puertas_operativas') === 'NC',
        observaciones_item14: document.querySelector('input[name="observaciones_puertas_operativas"]') ? document.querySelector('input[name="observaciones_puertas_operativas"]').value : '',

        item15_c: getRadioValue('mallas_perimetrales') === 'C',
        item15_nc: getRadioValue('mallas_perimetrales') === 'NC',
        observaciones_item15: document.querySelector('input[name="observaciones_mallas_perimetrales"]') ? document.querySelector('input[name="observaciones_mallas_perimetrales"]').value : '',

        item16_c: getRadioValue('patio_iluminacion') === 'C',
        item16_nc: getRadioValue('patio_iluminacion') === 'NC',
        observaciones_item16: document.querySelector('input[name="observaciones_patio_iluminacion"]') ? document.querySelector('input[name="observaciones_patio_iluminacion"]').value : '',

        item17_c: getRadioValue('patio_cctv') === 'C',
        item17_nc: getRadioValue('patio_cctv') === 'NC',
        observaciones_item17: document.querySelector('input[name="observaciones_patio_cctv"]') ? document.querySelector('input[name="observaciones_patio_cctv"]').value : '',

        firma_responsable: document.getElementById('firma_responsable') ? document.getElementById('firma_responsable').value : ''
    };

    try {
        // Obtenemos el token desde el almacenamiento local
        const token = localStorage.getItem("authToken");

        // Realizamos la solicitud POST con autorización
        const response = await fetch('https://esenttiapp-production.up.railway.app/api/inspeccionFisica', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Añadimos el encabezado de autorización
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // Si la respuesta es exitosa, mostramos un mensaje de éxito con SweetAlert
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Inspección guardada exitosamente.',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                // Limpiamos el formulario
                document.getElementById('inspeccionForm').reset();
                // Desmarcamos todas las opciones de radio
                document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
            });
        } else {
            // Si hay algún error, lo manejamos aquí con SweetAlert
            const errorData = await response.json();
            console.error('Error en la solicitud:', errorData);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al guardar la inspección.',
                confirmButtonText: 'Aceptar'
            });
        }
    } catch (error) {
        // Manejamos cualquier error de la solicitud con SweetAlert
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al guardar la inspección.',
            confirmButtonText: 'Aceptar'
        });
    }
});