function guardarPerfil() {  
        const perfil = { nombre: document.getElementById('nombre').value, 
            apellido: document.getElementById('apellido').value, 
            email: document.getElementById('email').value, 
            telefono: document.getElementById('telefono').value };  
            localStorage.setItem('userProfile', JSON.stringify(perfil)); 
            cargarPerfil();
            Swal.fire({
            icon: 'success',
            title: 'Perfil Actualizado',
            text: 'Su perfil ha sido actualizado con éxito.',
            confirmButtonText: 'Aceptar',
            });
        }

function cargarPerfil() {  
    const nombre = localStorage.getItem("username");
    const datos = document.getElementById("ingresar-datos");
    const input = document.getElementById('fileInput');
    const preview = document.getElementById('imagen');
    const savedImage = localStorage.getItem('imagenGuardada');
    const perfilJSON = localStorage.getItem('userProfile');

    if (!perfilJSON) {
      console.log('No hay perfil guardado');
      document.getElementById('editar-perfil').style.display = 'none';
      document.getElementById('profileForm').style.display = 'block';
      return;
    }
    

    document.getElementById('profileForm').style.display = 'none';
    document.getElementById('editar-perfil').style.display = 'inline-block';
    document.getElementById('editar-perfil').addEventListener('click', function() {
      document.getElementById('profileForm').style.display = 'block';
      document.getElementById('nombr').style.display = 'none';
      document.getElementById('apellid').style.display = 'none';
      document.getElementById('emai').style.display = 'none';
      document.getElementById('telefon').style.display = 'none';
      
      const perf = JSON.parse(perfilJSON);
      document.getElementById('nombre').value = perf.nombre;
      document.getElementById('apellido').value = perf.apellido;
      document.getElementById('email').value = perf.email;
      document.getElementById('telefono').value = perf.telefono;
      this.style.display = 'none';
    });
    
    const perfil = JSON.parse(perfilJSON);
    document.getElementById('nombr').textContent = perfil.nombre;
    document.getElementById('apellid').textContent = perfil.apellido;
    document.getElementById('emai').textContent = perfil.email;
    document.getElementById('telefon').textContent = perfil.telefono;

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



document.getElementById("profileForm").addEventListener("submit", function(event) {
    event.preventDefault();

    Swal.fire({
        title: '¿Desea guardar los cambios?',
        text: "Si no guarda, los cambios se perderán.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Descartar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            guardarPerfil();
            Swal.fire({
                icon: 'success',
                title: 'Perfil Actualizado',
                text: 'Su perfil ha sido actualizado con éxito.',
                confirmButtonText: 'Aceptar',
            });
        } 

        if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('Cambios descartados', '', 'info');
        }

        document.getElementById('profileForm').style.display = 'none';
        document.getElementById('nombr').style.display = 'block';
        document.getElementById('apellid').style.display = 'block';
        document.getElementById('emai').style.display = 'block';
        document.getElementById('telefon').style.display = 'block';
        document.getElementById('editar-perfil').style.display = 'inline-block'
        ;
    });
});

document.addEventListener("DOMContentLoaded", function() {
    cargarPerfil();
})