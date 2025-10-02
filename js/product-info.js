function initProduct(){

    const productID = localStorage.getItem("prodID");
    const catID = localStorage.getItem("catID");
    fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
    .then(response => response.json())
    .then(data => {
        showProduct(data);
        }).catch(error => console.error('Error al cargar el producto', error));

    }
    

function showProduct(producto){
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
    <p>Añadir al carrito</p>
    `;
    
}



function showRelatedProducts(){
    const relatedProducts = JSON.parse(localStorage.getItem("relatedProducts"));
    const relatedContainer = document.getElementById("productos-relacionados");
    relatedContainer.innerHTML = "";
    console.log(relatedProducts);
    const slides = Math.ceil((relatedProducts.length - 1) / 3);
    let contador = relatedProducts.length - 1;
    for (let i = 0; i < slides; i++) {
        let div = document.createElement("div");
        div.classList.add("carousel-item");
        if (i === 0) {
            div.classList.add("active");
        }
        let colDiv = document.createElement("div");
        colDiv.classList.add("row", "justify-content-center");
        for (let j = 0; j < 3; j++) {
            if (contador >= 0) {
                let producto = relatedProducts[contador];
                console.log(relatedProducts[contador]);
                console.log(i);
                if (producto.id == localStorage.getItem("prodID")) {
                    producto = relatedProducts[contador - 1];
                    contador--;
                }
                if (contador >= 0) {
                    if (producto.id != localStorage.getItem("prodID")) {
                        let cardDiv = document.createElement("div");
                        cardDiv.classList.add("col-12", "col-md-4", "d-flex", "justify-content-center");
                        cardDiv.innerHTML = `
                            <div class="card w-75">
                                <img src="${producto.image}" class="card-img-top" alt="${producto.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${producto.name}</h5>
                                    <button onclick="producto()" class="btn btn-primary">Ver producto</button>
                                </div>
                            </div>
                        `;
                        colDiv.appendChild(cardDiv);
                        div.appendChild(colDiv);
                        contador--;
                    }
                }
            }
        }
        relatedContainer.appendChild(div);
    }
}

document.addEventListener("DOMContentLoaded", function(e){

initProduct();
showRelatedProducts()


})






document.addEventListener("DOMContentLoaded", function(e){

initProduct();


})


