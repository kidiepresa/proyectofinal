document.addEventListener("DOMContentLoaded", function(e){

const catID = localStorage.getItem("catID");
const url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    const productos = data.products;
    const container = document.querySelector("main .container")

    let titulo_div = document.createElement("div");
    titulo_div.classList.add("text-center", "p-4")
    titulo_div.innerHTML =`
      <h1>${data.catName}</h1>
      <p>Aquí verás nuestro stock actual de ${data.catName}<p>
    `

    container.prepend(titulo_div);

    productos.forEach(producto => {
        let auto = document.createElement("div")
        auto.classList.add("row")
        auto.style.border = "1px solid lightgray";
        auto.style.padding= "10px";
        auto.style.display = "flex";
        auto.style.gap = "20px";

        let cantidad_vendidos 
        if (producto.soldCount == 0) {
          cantidad_vendidos = "Ninguna unidad vendida. Sé el primero en probar este producto!";
        }else if (producto.soldCount == 1){
          cantidad_vendidos = "Se ha venidido 1 unidad";
        }else cantidad_vendidos = `Se han vendido ${producto.soldCount} unidades.`;


        auto.innerHTML = `
        <div class = "col-5">
        <img  src="${producto.image}"  class="img-thumbnail";  style=border: 1px solid lightgray; border-radius: 15px; padding: 5px;">
        </div>

          <div class="col">
                <h4>${producto.name}</h4>
                <p>${producto.description}</p>
                <p>${producto.currency} ${producto.cost}</p>
                <i class="vendidos">${cantidad_vendidos}</i>
          </div>`
        
        container.appendChild(auto);        
    });
    
  })
  .catch(error => console.error('Error al cargar los productos:', error));
})
