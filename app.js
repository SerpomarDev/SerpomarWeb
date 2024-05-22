// Objeto con las credenciales válidas
const credentials = {

    "juan@123.com": "contraseña",
    "maria@456.com": "claveMaria",
    "pedro@789.com": "clavePedro",
    "luisa@101.com": "claveLuisa",
    "alexander.jimenez@serpomar.com": "serpomar2024",
    "admin@serpomar.com": "serpomar2024",
    "transporte@serpomar.com": "Stransporte2024"
};

document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Previene el envío estándar del formulario

  // Obtiene los valores de los campos de usuario y contraseña
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  // Comprueba si el nombre de usuario existe y si la contraseña coincide
  if (credentials[username] && credentials[username] === password) {
    window.location.href = './index.html'; // Redirige al usuario a index.html si las credenciales son correctas
  } else {
    alert('Usuario o contraseña incorrectos');
  }
});
