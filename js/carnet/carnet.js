// Configuración Firebase (reemplaza con tus credenciales)
const firebaseConfig = {
    apiKey: "AIzaSyBQh7eqWl_iu02oDPds3nQMigzSrHDOFn0",
    authDomain: "serpomar-driver-mysql-f8df6.firebaseapp.com",
    projectId: "serpomar-driver-mysql-f8df6",
    storageBucket: "serpomar-driver-mysql-f8df6.appspot.com",
    messagingSenderId: "840427888757",
    appId: "1:840427888757:web:b8250feec992a76510583c"
};

// Inicio Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

function generarCarnet() {
    // Obtener los valores del formulario
    var nombreCompleto = document.getElementById("nombre").value;
    var nombres = nombreCompleto.split(' ');
    var primer_nombre = nombres[0];
    var segundo_nombre = nombres[1] || null;

    // Obtener apellidos
    var apellidoCompleto = document.getElementById("apellido").value;
    var apellidos = apellidoCompleto.split(' ');
    var primer_apellido = apellidos[0];
    var segundo_apellido = apellidos[1] || null;

    var identificacion = document.getElementById("id").value;
    var cargo = document.getElementById("cargo").value;
    var rh = document.getElementById("rh").value;
    var proceso = document.getElementById("Proceso").value;
    var foto = document.getElementById("foto").files[0];

    // Validar que se haya seleccionado una foto
    if (!foto) {
        alert("Por favor, selecciona una foto.");
        return;
    }

    // Validar campos del formulario (puedes agregar más validaciones)
    if (!nombreCompleto || !apellidoCompleto || !identificacion || !cargo || !rh || !proceso) {
        alert("Por favor, completa todos los campos del formulario.");
        return;
    }

    // Crear un objeto con los datos del formulario (sin la foto todavía)
    var datosCarnet = {
        primer_nombre: primer_nombre,
        segundo_nombre: segundo_nombre,
        primer_apellido: primer_apellido,
        segundo_apellido: segundo_apellido,
        identificacion: identificacion,
        cargo: cargo,
        rh: rh,
        proceso: proceso,
        foto: null // Se actualizará después de leer la foto
    };

    // Leer la foto usando FileReader
    const reader = new FileReader();

    reader.onloadend = function() {
        // Actualizar el objeto datosCarnet con la data URL de la foto
        datosCarnet.foto = reader.result;

        // Enviar los datos al servidor (opcional, si necesitas guardarlos)
        fetch("https://esenttiapp-production.up.railway.app/api/carnet", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify(datosCarnet)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                // ... (código para manejar la respuesta del servidor) ...
            })
            .catch(error => {
                console.error("Error al enviar los datos al servidor:", error);
                alert("Error al guardar los datos del carnet. Por favor, inténtalo de nuevo.");
            });

        // Generar el carnet HTML
        const carnetHTML = `
            <center>
                <div id="back01">
                    <div id="front01">
                        <div class="headfoot01"></div>
                        <div class="header01">
                            <table cellspacing="0px" cellpadding="0px">
                                <tr>
                                    <td rowspan="2">
                                        <img src="/img/logocontorno.png" width="130px" height="100%" alt="Logo.jpg">
                                    </td>
                                </tr>
                            </table>
                            <hr class="details03">
                            <br>
                        </div>
                        <div class="card01">CARNET IDETIFICATIVO</div>
                        <div id="image01">
                            <img src="${datosCarnet.foto}" alt="Profile.jpg" id="profile01"> 
                        </div>
                        <div id="carnet-content"></div> 
                        <div class="header01">
                            <hr class="details03"><br>
                            Facilitamos y acompañamos experiencias logísticas multimodales.
                        </div>
                        <div class="headfoot01"> </div>
                    </div>
                </div>
            </center>
        `;

        const headerContainer = document.getElementById('header-container');
        headerContainer.innerHTML = carnetHTML;

        // Llamar a construirCarnet después de que el carnetHTML se haya insertado
        construirCarnet(); 
    }

    // Iniciar la lectura de la foto
    reader.readAsDataURL(foto);
}

function construirCarnet() {
    // Obtener los valores del formulario 
    var nombreCompleto = document.getElementById("nombre").value;
    var apellidoCompleto = document.getElementById("apellido").value;
    var identificacion = document.getElementById("id").value;
    var cargo = document.getElementById("cargo").value;
    var rh = document.getElementById("rh").value;
    var proceso = document.getElementById("Proceso").value;

    // Construir el contenido del carnet
    const carnetContent = `
        <table>
            <tr>
                <td colspan="2"></td> 
            </tr>
            <tr>
                <td colspan="2" id="name01">${nombreCompleto} ${apellidoCompleto}</td> 
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
                                <th class="details02">ID:</th>
                                <td class="details01">${identificacion}</td>
                            </tr>
                            <tr>
                                <th class="details02">Cargo:</th>
                                <td class="details01">${cargo}</td>
                            </tr>
                            <tr>
                                <th class="details02">RH:</th>
                                <td class="details01">${rh}</td>
                            </tr>
                            <tr>
                                <th class="details02">PROCESO:</th>
                                <td class="details01">${proceso}</td> 
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
    `;

    // Insertar el contenido del carnet en el div correspondiente
    const carnetContentDiv = document.getElementById('carnet-content');
    carnetContentDiv.innerHTML = carnetContent;
}

function descargarImagen() {
    const carnet = document.getElementById('back01');
    html2canvas(carnet, { 
        scale: 5,
        dpi: 300,
        letterRendering: true
    }).then(canvas => {
        const enlace = document.createElement('a');
        enlace.download = "carnet.png";
        enlace.href = canvas.toDataURL('image/png'); 
        enlace.click();
    });
}