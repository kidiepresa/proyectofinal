function initProduct(){

    const productID = localStorage.getItem("prodID");
    const catID = localStorage.getItem("catID");
    fetch(`https://japceibal.github.io/emercado-api/cats_products/${catID}.json`)
    .then(response => response.json())
    .then(data => {
        const producto = data.products.find(p => p.id == productID);
        showProduct(producto);
        }).catch(error => console.error('Error al cargar el producto', error));

    }
    

function showProduct(producto){
    document.getElementById("imagen-producto").innerHTML = `
    <img src="${producto.image}" style="width:100%; border: 1px solid lightgray; border-radius: 5px; padding: 5px;">
    `;
    document.getElementById("info-producto").innerHTML = `
    <h1>${producto.name}</h1>
    <p>${producto.description}</p>
    <p> ${producto.currency} ${producto.cost}</p>
    <p>Se han vendido: ${producto.soldCount} unidades </p>
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
                                    <a href="product-info.html" class="btn btn-primary">Ver producto</a>
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


