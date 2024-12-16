function generarCarnet() {
    // Obtener los valores del formulario
    var nombre = document.getElementById("nombre").value;
    var cargo = document.getElementById("cargo").value;
    var rh = document.getElementById("rh").value;
    var area = document.getElementById("area").value;
    var foto = document.getElementById("foto").files[0]; 

    // Leer la imagen seleccionada
    var reader = new FileReader();
    reader.onload = function(e) {
        // Actualizar el carnet HTML con los valores del formulario, incluyendo la foto
        const carnetHTML = `
            <center>
                <div id="back01">
                    <div id="front01">
                        <div class="headfoot01"></div>
                        <div class="header01">
                            <table cellspacing="0px" cellpadding="0px">
                                <tr>
                                    <td rowspan="2">
                                        <img src="/img/logo.png" width="130px" height="100%" alt="Logo.jpg">
                                    </td>
                                </tr>
                            </table>
                            <hr class="details03">
                            <br>
                        </div>
                        <div class="card01">CARNET IDETIFICATIVO</div>
                        <div id="image01">
                            <img src="${e.target.result}" alt="Profile.jpg" id="profile01"> 
                        </div>
                        <table>
                            <tr>
                                <td colspan="2" ID: 1007264290</td>
                            </tr>
                            <tr>
                                <td colspan="2" id="name01">${nombre}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <table style="padding: 0 14px;">
                                    <td>
                                        <table>
                                            <tr>
                                                <th class="details02">Cargo:</th>
                                                <td class="details01">${cargo}</td>
                                            </tr>
                                            <tr>
                                                <th class="details02">RH:</th>
                                                <td class="details01">${rh}</td>
                                            </tr>
                                            <tr>
                                                <th class="details02">AREA:</th>
                                                <td class="details01">${area}</td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td>
                                        <div class="box01">
                                            <img src="/img/qr-serpomar-online.svg" width="50px" height="100%" alt="Logo.jpg">
                                        </div>
                                    </td>
                                </table>
                            </tr>
                        </table>
                        <div class="header01">
                            <hr class="details03"><br>
                            Facilitamos y acompañamos experiencias logísticas multimodales.
                        </div>
                        <div class="headfoot01"> </div>
                    </div>
                </div>
            </center>
        `;

        // Insertar el HTML en el contenedor
        const headerContainer = document.getElementById('header-container');
        headerContainer.innerHTML = carnetHTML;
    }
    reader.readAsDataURL(foto); 
}

function descargarPDF() {
    const carnet = document.getElementById('back01'); 
    html2canvas(carnet, { 
        scale: 4, 
        dpi: 300 
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = canvas.width / 72 * 2.54; 
        const pdfHeight = canvas.height / 72 * 2.54;
        const pdf = new jsPDF({
            unit: 'pt',
            format: [pdfWidth, pdfHeight] 
        });
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight); 
        pdf.save("carnet.pdf");
    });
}

function descargarImagen() {
    const carnet = document.getElementById('back01');
    html2canvas(carnet, { 
        scale: 4, 
        dpi: 300 
    }).then(canvas => {
        const enlace = document.createElement('a');
        enlace.download = "carnet.png";
        enlace.href = canvas.toDataURL('image/png'); 
        enlace.click();
    });
}