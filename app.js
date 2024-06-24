// Objeto con las credenciales válidas
const credentials = {
  "alexander.jimenez@serpomar.com": "serpomar2024",
  "admin@serpomar.com": "serpomar2024",
  "controlacceso@serpomar.com": "Cserpomar2024",
  "patio@serpomar.com": "Pserpomar2024",
  "transporte@serpomar.com": "Stransporte2024",
  "trensas@serpomar.com": "Tserpomar2024",
  "Susana.negrette@serpomar.com": "Sserpomar2024",
  "henry.goethe@serpomar.com": "Hserpomar2024",
  "esenttiainhouse@serpomar.com": "Eserpomar2024",
  "Carlos.carrasquilla@serpomar.com": "Cserpomar2024",
  "gyplac.etex@serpomar.com": "Gserpomar2024",
  "jglaguado@synergycaribe.com.co": "Jserpomar2024",
  "lmaldonado@serpomar.com": "serpomar2024"
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
          window.location.href = './dashboard.html';
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
