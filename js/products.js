document.addEventListener("DOMContentLoaded", function(e){

fetch('https://japceibal.github.io/emercado-api/cats_products/101.json')
  .then(response => response.json())
  .then(data => {
    const productos = data.products;
    const container = document.querySelector('main .container');

    productos.forEach(producto => {
        let auto = document.createElement("div")
        auto.style.border = "1px solid lightgray";
        auto.style.padding= "10px";
        auto.style.display = "flex";
        auto.style.gap = "20px"
        auto.innerHTML = `<img  src="${producto.image}" width="350" style="border: 1px solid lightgray; border-radius: 15px; padding: 5px;">
        <div>
                <h4>${producto.name}</h4>
                <p>${producto.description}</p>
                <p>USD ${producto.cost}</p>
                <i class="vendidos">Se han vendido ${producto.soldCount} unidades.</i>
        </div>`
        container.appendChild(auto)
    });
    
  })
  .catch(error => console.error('Error al cargar los productos:', error));
})
