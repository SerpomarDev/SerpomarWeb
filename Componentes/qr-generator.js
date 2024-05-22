document.getElementById('generateQR').addEventListener('click', function() {
    var fechaSolicitud = document.getElementById('fecha_solicitud').value;
    var idPlaca = document.getElementById('id_placa').value;
    var idConductor = document.getElementById('id_conductor').value;
    var modalidad = document.getElementById('modalidad').value;
    var idTipoOperacion = document.getElementById('id_tipo_operacion').value;
    var idDestino1 = document.getElementById('id_sitio_inspeccion').value;
    var idDestino2 = document.getElementById('id_sitio_inspeccion').value;
    var idDestino3 = document.getElementById('id_sitio_inspeccion').value;
    var idNaviera = document.getElementById('id_naviera').value;
    var contenedor = document.getElementById('contenedor').value;
    var idTipoContenedor = document.getElementById('id_tipo_contenedor').value;
    var peso = document.getElementById('peso').value;
    var funcionarioTransporte = document.getElementById('funcionario_transporte').value;
    var precinto = document.getElementById('precinto').value;
    var vencimientoCutofi = document.getElementById('vencimiento_cutofi').value;
    var horaSoli = document.getElementById('hora_soli').value;
    var fechaSoli = document.getElementById('fecha_soli').value;
    var observaciones = document.getElementById('observaciones').value;

    var qrData = `
        Fecha de Solicitud: ${fechaSolicitud}
        Placa: ${idPlaca}
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
        Fecha de Solicitud: ${fechaSoli}
        Observaciones: ${observaciones}
    `;

    var qr = qrcode(0, 'L');
    qr.addData(qrData);
    qr.make();
    document.getElementById('qrcode').innerHTML = qr.createImgTag();
    
    // Show the modal
    $('#qrModal').modal('show');
});
