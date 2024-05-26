document.getElementById('createOrdenCargue').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const formData = new FormData(this);
  
    const jsonData = JSON.stringify(Object.fromEntries(formData));

    fetch('https://esenttiapp-production.up.railway.app/api/ordencargue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar los datos del formulario');
        }
    })
    .then(data => {
        Swal.fire({
            icon: 'success',
            title: 'Formulario enviado',
            text: 'El formulario ha sido enviado con éxito.',
            confirmButtonText: 'OK'

        }).then((result) => {
            if (result.isConfirmed) {
                generarQRCode();
            }
        });
    })
    .catch((error) => {
        console.error('Error al crear la orden:', error);
    });
  });

function time() {
    document.getElementById('createOrdenCargue').reset();
    setTimeout(() => {
        window.location.href = ``; 
    },);
}



function generarQRCode() {

    let requiredFields = document.querySelectorAll('#createOrdenCargue [required]');
    let allFieldsFilled = true;
    requiredFields.forEach(function(field) {
        if (!field.value) {
            allFieldsFilled = false;
        }
    });

    if (!allFieldsFilled) {
        Swal.fire({
            icon: 'error',
            title: 'Campos incompletos',
            text: 'Por favor, complete todos los campos requeridos.'
        });
        return;
    }

    function getSelectedText(id) {
        let select = document.getElementById(id);
        return select.options[select.selectedIndex].text;
    }

    let fechaSolicitud = document.getElementById('fecha_solicitud').value;
    let idPlaca = getSelectedText('id_placa');
    let idCliente = getSelectedText('id_cliente');
    let idConductor = getSelectedText('id_conductor');
    let modalidad = document.getElementById('modalidad').value;
    let idTipoOperacion = getSelectedText('id_tipo_operacion');
    let idDestino1 = document.getElementById('id_sitio_inspeccion');
    let idDestino2 = document.getElementById('id_sitio_inspeccion1');
    let idDestino3 = document.getElementById('id_sitio_inspeccion2');
    let idNaviera = getSelectedText('id_naviera');
    let contenedor = document.getElementById('contenedor').value;
    let idTipoContenedor = getSelectedText('id_tipo_contenedor');
    let peso = document.getElementById('peso').value;
    let funcionarioTransporte = document.getElementById('funcionario_transporte').value;
    let precinto = document.getElementById('precinto').value;
    let vencimientoCutofi = document.getElementById('vencimiento_cutoff').value;
    let horaSoli = document.getElementById('hora_soli').value;
    let observaciones = document.getElementById('observaciones').value;

    let qrData = `
        Fecha de Solicitud: ${fechaSolicitud}
        Placa: ${idPlaca}
        ID Cliente: ${idCliente}
        Conductor: ${idConductor}
        Modalidad: ${modalidad}
        Tipo de Servicio: ${idTipoOperacion}
        Destino 1: ${idDestino1}
        Destino 2: ${idDestino2}
        Destino 3: ${idDestino3}
        Naviera: ${idNaviera}
        Contenedor: ${contenedor}
        Tipo de Contenedor: ${idTipoContenedor}
        Peso: ${peso}
        Funcionario de Transporte: ${funcionarioTransporte}
        Precinto: ${precinto}
        Vencimiento Cut Off: ${vencimientoCutofi}
        Hora de Solicitud: ${horaSoli}
        Observaciones: ${observaciones}
    `;

    let qr = qrcode(0, 'L');
    qr.addData(qrData);
    qr.make();
    document.getElementById('qrcode').innerHTML = qr.createImgTag();
    
    $('#qrModal').modal('show');
}

$('#qrModal').on('hidden.bs.modal', function (e) {
    document.getElementById('qrcode').innerHTML = '';
});

document.getElementById('downloadQR').addEventListener('click', function() {
    let qrImg = document.querySelector('#qrcode img');
    let qrCanvas = document.createElement('canvas');
    let context = qrCanvas.getContext('2d');
    let qrImgWidth = qrImg.width;
    let qrImgHeight = qrImg.height;
    let titleHeight = 40;
    qrCanvas.width = qrImgWidth;
    qrCanvas.height = qrImgHeight + titleHeight;

    context.font = "20px Arial";
    context.textAlign = "center";
    context.fillText("Orden de Cargue", qrCanvas.width / 2, 30);
    context.drawImage(qrImg, 0, titleHeight, qrImgWidth, qrImgHeight);

    let link = document.createElement('a');
    link.href = qrCanvas.toDataURL("image/png");
    link.download = 'qr_code.png';
    link.click();
    time();
});

