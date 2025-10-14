

function guardarPerfil() {  
        const perfil = { nombre: document.getElementById('nombre').value, 
            apellido: document.getElementById('apellido').value, 
            email: document.getElementById('email').value, 
            telefono: document.getElementById('telefono').value };  
            localStorage.setItem('userProfile', JSON.stringify(perfil)); 
            Swal.fire({ icon: 'success', title: '¡Perfil guardado!', text: 'Tus datos se guardaron correctamente', timer: 2000 }); 
        }

function cargarPerfil() {  
    const nombre = localStorage.getItem("username");
    const datos = document.getElementById("datos");
    const input = document.getElementById('fileInput');
    const preview = document.getElementById('imagen');
    const savedImage = localStorage.getItem('imagenGuardada');
    const perfilJSON = localStorage.getItem('userProfile');  

    if (!perfilJSON) { 
        console.log('No hay perfil guardado'); 
        return; } 
    const perfil = JSON.parse(perfilJSON);  
    document.getElementById('nombre').value = perfil.nombre; 
    document.getElementById('apellido').value = perfil.apellido; 
    document.getElementById('email').value = perfil.email; 
    document.getElementById('telefono').value = perfil.telefono; 

    if (savedImage) {
      preview.src = savedImage;
      preview.style.display = 'block';
    }
    input.addEventListener('change', function () {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
          const imageBase64 = e.target.result;
          preview.src = imageBase64;
          preview.style.display = 'block';
          localStorage.setItem('imagenGuardada', imageBase64);
        };

        reader.readAsDataURL(file);
      }
    });
} 


document.getElementById("logout").addEventListener("click", function() {
    localStorage.removeItem("username");
    alert("Su sesión ha sido cerrada con éxito.")
    window.location.href = "login.html";
    });

document.getElementById("profileForm").addEventListener("submit", function(event) {
    event.preventDefault();
    guardarPerfil();
});




document.addEventListener("DOMContentLoaded", function() {
    cargarPerfil();
})