const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

function applyThemePreference() {
  const darkModeEnabled = localStorage.getItem('darkMode') === 'true'
  const themeSwitch = document.getElementById('themeSwitch')
  if (darkModeEnabled) {
    document.body.classList.add('dark-mode')
    themeSwitch.checked = true 
  } else {
    document.body.classList.remove('dark-mode')
    themeSwitch.checked = false 
  }
}


function toggleTheme() {
  const isDarkMode = document.body.classList.toggle('dark-mode')
  localStorage.setItem('darkMode', isDarkMode) 
}

function setupThemeSwitch() {
  const themeSwitch = document.getElementById('themeSwitch')
  themeSwitch.addEventListener('change', toggleTheme)
}



document.addEventListener("DOMContentLoaded" , function(event){
if(localStorage.getItem("username")){
        document.getElementById("usuario").textContent = localStorage.getItem("username");
    }

if (!localStorage.getItem("username")){
      alert("Para visitar nuestra página primero debe iniciar sesión.")
      window.location = "login.html"
    } 

    applyThemePreference();
    setupThemeSwitch();

})

const usuario = document.getElementById("usuario");
const dropdown = document.getElementById("userDropdown");
const logoutBtn = document.getElementById("logout-btn");

usuario.addEventListener("click", (e) => {
  e.preventDefault();
  dropdown.classList.toggle("show");
});

document.addEventListener("click", (e) => {
  if (!usuario.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove("show");
  }
});

function logOut() {
    Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        text: 'Su sesión ha sido cerrada con éxito.',
        confirmButtonText: 'Aceptar',
    }).then(() => {
        localStorage.removeItem("username");
        window.location.href = "login.html";
    });
}

function actualizarCantidadCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let cantidadCarrito = 0;
    carrito.forEach(item => {
        cantidadCarrito += item.cantidad;
    });
    const carritoCantidadElemento = document.getElementById("carritoCantidad");
    carritoCantidadElemento.textContent = cantidadCarrito;
}

document.addEventListener("DOMContentLoaded", function() {
    actualizarCantidadCarrito();
});