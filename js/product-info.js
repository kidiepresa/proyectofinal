function initProduct(){

    const productID = localStorage.getItem("prodID");
    const catID = localStorage.getItem("catID");
    console.log(productID);
    console.log(catID)
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












document.addEventListener("DOMContentLoaded", function(e){

initProduct();


})


