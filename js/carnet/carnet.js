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
        foto: null // Se actualizará después de subir la foto
    };

    // Subir la foto a Firebase Storage
    const storageRef = storage.ref(`foto_carnet/${datosCarnet.identificacion}/${foto.name}`);
    const uploadTask = storageRef.put(foto);

    uploadTask.on('state_changed', 
        (snapshot) => {
            // Puedes mostrar el progreso de la subida aquí si lo deseas
            // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log('Upload is ' + progress + '% done');
        }, 
        (error) => {
            console.error("Error al subir la foto:", error);
            alert("Error al subir la foto. Por favor, inténtalo de nuevo.");
        }, 
        () => {
            // Obtener la URL de descarga de la foto
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                // Actualizar el objeto datosCarnet con la URL de la foto
                datosCarnet.foto = downloadURL;

                // Enviar los datos al servidor
                fetch("https://esenttiapp-production.up.railway.app/api/carnet", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
                    },
                    body: JSON.stringify(datosCarnet)
                })
                .then(response => {
                    // Verificar el código de estado de la respuesta
                    if (!response.ok) {
                        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
                    }
                    return response.json(); // Parsear la respuesta como JSON
                })
                .then(data => {
                    console.log(data); // Imprimir la respuesta del servidor

                    // Verificar si la respuesta del servidor es exitosa
                    // Ajustar la condición según la respuesta del servidor
                    if (data.id) { // Ejemplo: verificar si se recibió un ID
                        // Esperar un tiempo para que la imagen se cargue completamente
                        setTimeout(() => {
                            // Actualizar el carnet HTML con los valores del formulario
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
                                                <img src="${datosCarnet.foto}" alt="Profile.jpg" id="profile01" onload="construirCarnet()"> 
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

                            // Insertar el HTML en el contenedor
                            const headerContainer = document.getElementById('header-container');
                            headerContainer.innerHTML = carnetHTML;
                        }, 3000); // Esperar 3 segundos
                    } else {
                        // Mostrar un mensaje de error si la respuesta del servidor no es exitosa
                        // Verificar si hay un mensaje de error específico del servidor
                        const errorMessage = data.message || "Error al guardar los datos del carnet.";
                        alert(errorMessage); 
                    }
                })
                .catch(error => {
                    console.error("Error al enviar los datos al servidor:", error);
                    alert("Error al guardar los datos del carnet. Por favor, inténtalo de nuevo.");
                });
            });
        }
    );
}

function construirCarnet() {
    // Obtener los valores del formulario (de nuevo, para asegurar que estén actualizados)
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


function descargarPDF() {
    const carnet = document.getElementById('back01');
    html2canvas(carnet, { 
        scale: 5, 
        dpi: 300,
        letterRendering: true,
        onclone: function (doc) {
            doc.getElementById('back01').style.width = '185px'; 
        } 
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