let selectedRating = 0; 
let totalRatings = 0;
let promedio = 0;
let commentsAPI = [];
let suma = 0;
let prod = {};

function loadComents() {
    const prodID = localStorage.getItem('prodID');


    let savedComments = JSON.parse(localStorage.getItem(`comments-${prodID}`));

    if (savedComments) {
        showComments(savedComments);
    } else {
        // Si no hay, cargar los de la API y guardarlos
        fetch(`https://japceibal.github.io/emercado-api/products_comments/${prodID}.json`)
            .then(response => response.json())
            .then(data => {
                commentsAPI = data;
                localStorage.setItem(`comments-${prodID}`, JSON.stringify(commentsAPI));
                showComments(commentsAPI);
            })
            .catch(error => console.error('Error al cargar comentarios:', error));
    }
}

function initProduct(){
    const productID = localStorage.getItem("prodID");
    fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
    .then(response => response.json())
    .then(data => {
        showProduct(data);
        showRelatedProducts(data);
            prod = data;
        }).catch(error => console.error('Error al cargar el producto', error));
}
    
function showProduct(producto){
    const prodID = localStorage.getItem('prodID');
    let cantidad_vendidos 
        if (producto.soldCount == 0) {
          cantidad_vendidos = "Ninguna unidad vendida. Sé el primero en probar este producto!";
        }else if (producto.soldCount == 1){
          cantidad_vendidos = "Se ha venidido 1 unidad";
        }else cantidad_vendidos = `Se han vendido ${producto.soldCount} unidades.`;


     let imagenPrincipal = `
    <div id="galeria">
      <img id="main-image" src="${producto.images[0]}" 
           style="width:100%; border: 1px solid lightgray; border-radius: 5px; padding: 5px;">
      <div id="thumbnails" style="display:flex; gap:5px; margin-top:10px;">
        ${producto.images
          .map(
            (img, i) => `
          <img src="${img}" 
               onclick="document.getElementById('main-image').src='${img}'" 
               style="width:80px; height:80px; object-fit:cover; cursor:pointer; border:1px solid gray; border-radius:5px;">
        `
          )
          .join("")}
      </div>
    </div>
  `;

  document.getElementById("imagen-producto").innerHTML = imagenPrincipal;
    document.getElementById("info-producto").innerHTML = `
    <h1>${producto.name}</h1>
    <p>${producto.description}</p>
    <p> ${producto.currency} ${producto.cost}</p>
    <p> ${cantidad_vendidos}</p>
    <p>Calificación promedio: ${localStorage.getItem(`qualification-${prodID}`) || ' Este producto aún no ha sido calificado'} </p>
    <button id="comprar" class="btn btn-primary" onclick="buyProduct()" >Comprar</button>
    <button class="btn btn-primary" onclick="location.href='cart.html'">Añadir al carrito</button>
    `;

}

function rate(stars) {
    selectedRating = stars;
    const allStars = document.querySelectorAll('#stars .star');
    allStars.forEach((star, index) => {
        if (index < stars) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function showComments(comments) {
    const prodID = localStorage.getItem('prodID');
    const container = document.getElementById('commentsList');
    let html = '';  
    comments.forEach(comment => {
        
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < comment.score) {
                stars += '<i class="fas fa-star" style="color: #ffd700;"></i>';
            } else {
                stars += '<i class="far fa-star" style="color: #ddd;"></i>';
            }
        }
        html += `
            <div class="comment-card">
                <div class="d-flex justify-content-between">
                    <strong>${comment.user}</strong>
                    <small>${comment.dateTime}</small>
                </div>
                <div class="my-2">${stars}</div>
                <p>${comment.description}</p>
            </div>
        `;
    });
        suma = comments.reduce((acc, c) => acc + c.score, 0);
        promedio = (suma / comments.length).toFixed(1);
        localStorage.setItem(`qualification-${prodID}`, promedio);
    container.innerHTML = html;
}

function formatDate(date) {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0'); // Enero = 0
    const y = date.getFullYear();

    const h = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');

    return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

function addComment() {
    const prodID = localStorage.getItem('prodID');
    const text = document.getElementById('commentText').value;
    const user = localStorage.getItem('username');
    
    if (!text || selectedRating === 0) {
        alert('Completa todos los campos');
        return;
    }
    
    const newComment = {
        product: parseInt(localStorage.getItem('prodID')),
        score: selectedRating,
        description: text,
        user: user,
        dateTime: formatDate(new Date())
    };
    let comments = (JSON.parse(localStorage.getItem(`comments-${prodID}`)) || []);
    comments.unshift(newComment);


    
    if (comments.length > 0) {
        suma = comments.reduce((acc, c) => acc + c.score, 0);
        promedio = (suma / comments.length).toFixed(1);
}

    localStorage.setItem(`comments-${prodID}`, JSON.stringify(comments));
    localStorage.setItem(`qualification-${prodID}`, promedio);
    showComments(comments);
    document.getElementById('commentText').value = '';
    selectedRating = 0
    rate(0);
}

function showRelatedProducts(product) {
    const container = document.getElementById('relatedProducts');
    let html = '';
    product.relatedProducts.forEach((related, index) => {
        html += `
            <div class="card m-2" style="width: 18rem; cursor:pointer;" onclick="selectProduct(${related.id})">
                <img src="${related.image}" class="card-img-top" alt="${related.name}">
                <div class="card-body">
                    <h5 class="card-title">${related.name}</h5>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function selectProduct(id) {
  localStorage.setItem('prodID', id)
  window.location = 'product-info.html'
}

function buyProduct() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    
    const index = carrito.findIndex(item => item.id === prod.id);

    if (index === -1) {
        const productoConCantidad = { ...prod, cantidad: 1 };
        carrito.push(productoConCantidad);
    } else {
        carrito[index].cantidad += 1;
    }
    
    localStorage.setItem("carrito", JSON.stringify(carrito));
    window.location = 'cart.html';
}


document.addEventListener("DOMContentLoaded", function(e){

    initProduct();
    loadComents();
    const prodID = localStorage.getItem('prodID');
    const savedComments = localStorage.getItem(`comments-${prodID}`);
    const savedQualification = localStorage.getItem(`qualification-${prodID}`);
    if (savedComments) {
        showComments(JSON.parse(savedComments));
    }
    else if (savedQualification == null) {document.getElementById(`commentsList`).innerHTML += `<p>No hay comentarios aún. Sé el primero en comentar!</p>`;}
    
    
    applyThemePreference()
    setupThemeSwitch()
   

})
    

    