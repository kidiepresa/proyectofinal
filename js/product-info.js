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


     const comentarios = JSON.parse(localStorage.getItem(`comments-${prodID}`)) || [];

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
    let promedio = localStorage.getItem(`qualification-${prodID}`) || 'Este producto aún no ha sido calificado';
    document.getElementById("imagen-producto").innerHTML = imagenPrincipal;
    document.getElementById("info-producto").innerHTML = `
    <h1>${producto.name}</h1>
    <p>${producto.description}</p>
    <p> ${producto.currency} ${producto.cost}</p>
    <p> ${cantidad_vendidos}</p>
    <p id="promedio">Calificación promedio: ${promedio}</p>
    <br><br>
    <button class="comprar-btn" onclick="buyProduct(true)">Comprar</button>
    <button onclick="buyProduct(false)" class="add-to-cart">
            <span>Agregar al carrito</span>
            <svg class="morph" viewBox="0 0 64 13">
                <path d="M0 12C6 12 17 12 32 12C47.9024 12 58 12 64 12V13H0V12Z" />
            </svg>
            <div class="shirt">
                <img src="${producto.images[0]}" style="width:70px;  border-radius:20px;">
            </div>
            <div class="cart">
                <svg viewBox="0 0 36 26">
                    <path d="M1 2.5H6L10 18.5H25.5L28.5 7.5L7.5 7.5" class="shape" />
                    <path
                        d="M11.5 25C12.6046 25 13.5 24.1046 13.5 23C13.5 21.8954 12.6046 21 11.5 21C10.3954 21 9.5 21.8954 9.5 23C9.5 24.1046 10.3954 25 11.5 25Z"
                        class="wheel" />
                    <path
                        d="M24 25C25.1046 25 26 24.1046 26 23C26 21.8954 25.1046 21 24 21C22.8954 21 22 21.8954 22 23C22 24.1046 22.8954 25 24 25Z"
                        class="wheel" />
                    <path d="M14.5 13.5L16.5 15.5L21.5 10.5" class="tick" />
                </svg>
            </div>
        </button>
    `;

    gsap.registerPlugin(MorphSVGPlugin)

    document.querySelectorAll('.add-to-cart').forEach(button => {
            let morph = button.querySelector('.morph path'),
                shirt = button.querySelectorAll('.shirt svg > path')
            button.addEventListener('pointerdown', e => {
                if (button.classList.contains('active')) {
                    return
                }
                gsap.to(button, {
                    '--background-scale': .97,
                    duration: .15
                })
            })
            button.addEventListener('click', e => {
                e.preventDefault()
                if (button.classList.contains('active')) {
                    return
                }
                button.classList.add('active')
                gsap.to(button, {
                    keyframes: [{
                        '--background-scale': .97,
                        duration: .15
                    }, {
                        '--background-scale': 1,
                        delay: .125,
                        duration: 1.2,
                        ease: 'elastic.out(1, .6)'
                    }]
                })
                gsap.to(button, {
                    keyframes: [{
                        '--shirt-scale': 1,
                        '--shirt-y': '-42px',
                        '--cart-x': '0px',
                        '--cart-scale': 1,
                        duration: .4,
                        ease: 'power1.in'
                    }, {
                        '--shirt-y': '-40px',
                        duration: .3
                    }, {
                        '--shirt-y': '16px',
                        '--shirt-scale': 0.5,
                        duration: .25,
                        ease: 'none'
                    }, {
                        '--shirt-scale': 0,
                        duration: .3,
                        ease: 'none'
                    }]
                })
                gsap.to(button, {
                    '--shirt-second-y': '0px',
                    delay: .835,
                    duration: .12
                })
                gsap.to(button, {
                    keyframes: [{
                        '--cart-clip': '12px',
                        '--cart-clip-x': '3px',
                        delay: .9,
                        duration: .06
                    }, {
                        '--cart-y': '2px',
                        duration: .1
                    }, {
                        '--cart-tick-offset': '0px',
                        '--cart-y': '0px',
                        duration: .2,
                        onComplete() {
                            button.style.overflow = 'hidden'
                        }
                    }, {
                        '--cart-x': '52px',
                        '--cart-rotate': '-15deg',
                        duration: .2
                    }, {
                        '--cart-x': '104px',
                        '--cart-rotate': '0deg',
                        duration: .2,
                        clearProps: true,
                        onComplete() {
                            button.style.overflow = 'hidden'
                            button.style.setProperty('--text-o', 0)
                            button.style.setProperty('--text-x', '0px')
                            button.style.setProperty('--cart-x', '-104px')
                        }
                    }, {
                        '--text-o': 1,
                        '--text-x': '12px',
                        '--cart-x': '-75px',        
                        '--cart-y': '0px',       
                        '--cart-rotate': '0deg', 
                        '--cart-scale': .75,
                        duration: .25,
                        clearProps: true,
                        onComplete() {
                            button.classList.remove('active')
                            
                        }
                    }]
                })
                gsap.to(button, {
                    keyframes: [{
                        '--text-o': 0,
                        duration: .3
                    }]
                })
                gsap.to(morph, {
                    keyframes: [{
                        morphSVG: 'M0 12C6 12 20 10 32 0C43.9024 9.99999 58 12 64 12V13H0V12Z',
                        duration: .25,
                        ease: 'power1.out'
                    }, {
                        morphSVG: 'M0 12C6 12 17 12 32 12C47.9024 12 58 12 64 12V13H0V12Z',
                        duration: .15,
                        ease: 'none'
                    }]
                })
                gsap.to(shirt, {
                    keyframes: [{
                        morphSVG: 'M4.99997 3L8.99997 1.5C8.99997 1.5 10.6901 3 12 3C13.3098 3 15 1.5 15 1.5L19 3L23.5 8L20.5 11L19 9.5L18 22.5C18 22.5 14 21.5 12 21.5C10 21.5 5.99997 22.5 5.99997 22.5L4.99997 9.5L3.5 11L0.5 8L4.99997 3Z',
                        duration: .25,
                        delay: .25
                    }, {
                        morphSVG: 'M4.99997 3L8.99997 1.5C8.99997 1.5 10.6901 3 12 3C13.3098 3 15 1.5 15 1.5L19 3L23.5 8L20.5 11L19 9.5L18.5 22.5C18.5 22.5 13.5 22.5 12 22.5C10.5 22.5 5.5 22.5 5.5 22.5L4.99997 9.5L3.5 11L0.5 8L4.99997 3Z',
                        duration: .85,
                        ease: 'elastic.out(1, .5)'
                    }, {
                        morphSVG: 'M4.99997 3L8.99997 1.5C8.99997 1.5 10.6901 3 12 3C13.3098 3 15 1.5 15 1.5L19 3L22.5 8L19.5 10.5L19 9.5L17.1781 18.6093C17.062 19.1901 16.778 19.7249 16.3351 20.1181C15.4265 20.925 13.7133 22.3147 12 23C10.2868 22.3147 8.57355 20.925 7.66487 20.1181C7.22198 19.7249 6.93798 19.1901 6.82183 18.6093L4.99997 9.5L4.5 10.5L1.5 8L4.99997 3Z',
                        duration: 0,
                        delay: 1.25
                    }]
                })
            })
    })

    
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
            <div  class="comment-card comentarios">
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
        if (comments.length > 0) {
    suma = comments.reduce((acc, c) => acc + c.score, 0);
    promedio = (suma / comments.length).toFixed(1);
} else {
    promedio = 'Este producto aún no ha sido calificado';
}
        localStorage.setItem(`qualification-${prodID}`, promedio);
        container.innerHTML = html;
        document.getElementById("promedio").innerText = `Calificación promedio: ${promedio}`;
   
}

function formatDate(date) {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
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
        Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Completa todos los campos',
        confirmButtonText: 'Aceptar'
});
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

function buyProduct(redirigir) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    
    const index = carrito.findIndex(item => item.id === prod.id);

    if (index === -1) {
        const productoConCantidad = { ...prod, cantidad: 1 };
        carrito.push(productoConCantidad);
    } else {
        carrito[index].cantidad += 1;
    }
    
    localStorage.setItem("carrito", JSON.stringify(carrito));
    if (redirigir) window.location = 'cart.html';
    actualizarCantidadCarrito();
}

function cambiarFondo() {
    const catID = localStorage.getItem("catID");
    const urlFondo = `fondos/${catID}.jpg`;
    
    document.body.style.backgroundImage = `url('${urlFondo}')`;
    document.body.style.backgroundSize = "cover";       
    document.body.style.backgroundRepeat = "no-repeat"; 
    document.body.style.backgroundPosition = "center";  
    document.body.style.backgroundAttachment = "fixed";
}



document.addEventListener("DOMContentLoaded", function(e){
    cambiarFondo();
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
    
