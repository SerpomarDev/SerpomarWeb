// Objeto con las credenciales válidas
const credentials = {

  
    // ROL GENERAL
    "visitante@serpomar.com": "Vserpomar202417",
    // ROL GENERAL 

    // ROL GENERAL
    "alexander.jimenez@serpomar.com": "ALserpomar20240",
    "admin@serpomar.com": "serpomar2024",
    "jglaguado@synergycaribe.com.co": "Jserpomar2024",
    "lmaldonado@serpomar.com": "LMserpomar202417",
    "hugo.contreras@serpomar.com": "HCserpomar202418",
    "daniel.tinoco@serpomar.com": "DTserpomar202419",
    "yamid.agudelo@serpomar.com": "YAserpomar202420",
    "piedad.petro@serpomar.com": "PPserpomar202421",
    "michelle.echeverria@serpomar.com": "MEserpomar202422",
    "lvera@serpomar.com": "LVserpomar202423",
    "contabilidad@serpomar.com": "COserpomar202424",
    "miguel.martinez@serpomar.com": "MMserpomar202425",
    "stephanie.otero@serpomar.com": "Stserpomar202426",
    "lina.young@serpomar.com": "Lyserpomar202427",
    // ROL GENERAL 

    // ROL COORDINADOR
    "edgar.florez@serpomar.com": "Eserpomar20241",
    "rafael.caicedo@serpomar.com": "Rserpomar20242",
    "susana.negrette@serpomar.com": "Sserpomar20243",
    "brayan.balceiro@serpomar.com": "Bserpomar20244",
    "henry.goethe@serpomar.com": "Hserpomar20245",
    "operacion.nacional1@serpomar.com": "Oserpomar20246",
    "carlos.carrasquilla@serpomar.com": "Cserpomar20247",
    "vanesa.Cord.transportes.esenttia@serpomar.com": "Vserpomar20250",
    "mariaC.Cord.transportes.esenttia@serpomar.com": "MCserpomar20251",
    // ROL COORDINADOR

    // ROL ADMIN COORDINADOR
    "susana.negrette@serpomar.com": "Sserpomar20243",
    "henry.goethe@serpomar.com": "Hserpomar20245",
    "carlos.carrasquilla@serpomar.com": "Cserpomar20247",
    // ROL ADMIN COORDINADOR     

    // ROL ANALISTA
    "nayelis.tordecilla@serpomar.com": "Nserpomar20248",
    "keyla.castro@serpomar.com": "Kserpomar20249",
    "analistaimportaciones@serpomar.com": "Aserpomar202410",
    "yoleidys.alcazar@serpomar.com": "Yserpomar202411",
    "hector.fonseca@serpomar.com": "Hserpomar202412",
    "darlinesV.transporte.esenttia@serpomar.com": "DVserpomar20252",
    "amauryM.transporte.esenttia@serpomar.com": "AMserpomar20252",
    "albertoT.analista.esenttia@serpomar.com": "ATserpomar20252",
    // ROL ANALISTA

    // ROL CONTABILIDAD
    "recepcion@serpomar.com": "Rserpomar202413",
    "Recepcion.facturas@serpomar.com": "RFserpomar202414",
    "katerine.pedroza@serpomar.com": "KAserpomar202415",
    "aprendiz.contabilidad@serpomar.com": "APserpomar202416",
    // ROL CONTABILIDAD       
    
    // ROL CONTROL ACCESO 
    "controlacceso@serpomar.com": "Cserpomar2024",
    // ROL CONTROL ACCESO
  
    // ROL ACCESO PATIO
    "patio@serpomar.com": "Pserpomar2024",
    // ROL ACCESO PATIO
 
    // ROL PATIO
    "transporte@serpomar.com": "Stransporte2024",
    "esenttiainhouse@serpomar.com": "Eserpomar2024",
    // ROL PATIO
};

function attachLoginFormEvent() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Previene el envío estándar del formulario

      // Obtiene los valores de los campos de usuario y contraseña
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Comprueba si el nombre de usuario existe y si la contraseña coincide
      if (credentials[username] && credentials[username] === password) {
        // Guarda el usuario en el localStorage
        localStorage.setItem('loggedInUser', username);
        
        // Redirige al usuario a la página adecuada
        if (username === "gyplac.etex@serpomar.com") {
          window.location.href = './gyplac.html';
        } else {
          window.location.href = './home.html';
        }
      } else {
        alert('Usuario o contraseña incorrectos');
      }
    });
  } else {
    console.error("Login form not found!");
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Asegura que el evento se adjunte después de que el contenido del formulario esté cargado
  $("#layoutv2-placeholder").load("/Componentes/layoutv2.html", function() {
    console.log('layoutv2 loaded'); // Mensaje de depuración
    initializeLoginComponent(); // Inicializa el componente después de cargar el contenido
    attachLoginFormEvent(); // Agrega el evento al formulario de login
  });
});
