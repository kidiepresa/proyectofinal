document.getElementById("logout").addEventListener("click", function() {
    localStorage.removeItem("username");
    alert("Su sesión ha sido cerrada con éxito.")
    window.location.href = "login.html";
    });