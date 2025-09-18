const ORDER_ASC_BY_PRICE = "PRICE_ASC"; 
const ORDER_DESC_BY_PRICE = "PRICE_DESC";
const ORDER_BY_SOLD = "SOLD_DESC";

let currentProductsArray;
let currentSortOrder;
let currentCriteriaOrder; 
let currentCatName;

let minPrice = undefined;
let maxPrice = undefined;
let search = undefined;

//ORDENA LOS PRODUCTOS
function sortProducts(criteria, array){ 
    if(criteria === ORDER_ASC_BY_PRICE){
        array.sort((a, b) => a.cost - b.cost);
    } else if(criteria === ORDER_DESC_BY_PRICE){
        array.sort((a, b) => b.cost - a.cost);
    } else if(criteria === ORDER_BY_SOLD){
        array.sort((a, b) => b.soldCount - a.soldCount);
    }
    return array;
}


//APLICA EL FILTRO DE PRECIO Y BÚSQUEDA, SI NO HAY NO HACE NADA
function filterProducts(){
    minPrice = +document.getElementById("rangeFilterPriceMin").value;
    maxPrice = +document.getElementById("rangeFilterPriceMax").value;
    search = document.getElementById("searchinput").value.toLowerCase();


    let filteredProducts = currentProductsArray.filter(product => {
      const byPrice = (!minPrice || product.cost >= minPrice) &&
                (!maxPrice || product.cost <= maxPrice);  
      
      const bySearch = !search ||                           //  
      product.name.toLowerCase().includes(search) ||        //
      product.description.toLowerCase().includes(search);   //  ESTO FUE 
                                                            //  LO Q AGREGUE PARA Q HAGA 
      return byPrice && bySearch;                           //  LA BUSQUEDA CHIQUILINES
    })
    
    let criteria;
    if(document.getElementById("sortAsc").checked){
        criteria = ORDER_ASC_BY_PRICE;
    } else if(document.getElementById("sortDesc").checked){
        criteria = ORDER_DESC_BY_PRICE;
    } else if(document.getElementById("sortByRel").checked){
        criteria = ORDER_BY_SOLD;
    }

    let sorted = sortProducts(criteria, filteredProducts);
    showProducts(sorted, currentCatName);

}

//RECIBE LOS PRODUCTOS FILTRADOS Y/O ORDENADOS Y LOS ACTUALIZA EN PANTALLA
function showProducts(array, catName){
    const productos = document.getElementById("productos");
    const titulo = document.getElementById("titulo")
    productos.innerHTML = "";
    titulo.innerHTML ="";

    let titulo_div = document.createElement("div");
    titulo_div.classList.add("text-center", "p-4")
    titulo_div.innerHTML =`
      <h1>${catName}</h1>
      <p>Aquí verás nuestro stock actual de ${catName}<p>
    `

    titulo.prepend(titulo_div);

    array.forEach(producto => {
        let auto = document.createElement("div")
        auto.classList.add("row", "list-group-item", "list-group-item-action", "articles", "cursor-active")
        auto.style.border = "1px solid lightgray";
        auto.style.padding= "10px";
        auto.style.display = "flex";
        auto.style.gap = "20px";
        auto.onclick = function(){
          
          localStorage.setItem("prodID", producto.id);
          window.location = "product-info.html";
        };
      

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
        productos.appendChild(auto);        
    });
    
}

//INICIALIZA EL ARRAY DE PRODUCTOS Y LOS MUESTRA EN PANTALLA
function initProducts(){

const catID = localStorage.getItem("catID");
const url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;


  fetch(url)
  .then(response => response.json())
  .then(data => {

    currentProductsArray = data.products;
    currentCatName = data.catName;
    showProducts(currentProductsArray, data.catName)
    
  }).catch(error => console.error('Error al cargar los productos:', error));
}



document.addEventListener("DOMContentLoaded", function(e){

initProducts();

    document.getElementById("sortAsc").addEventListener("change", filterProducts);

    document.getElementById("sortDesc").addEventListener("change", filterProducts);

    document.getElementById("sortByRel").addEventListener("change", filterProducts);

    document.getElementById("rangeFilterCount").addEventListener("click", filterProducts);

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterPriceMin").value = "";
        document.getElementById("rangeFilterPriceMax").value = "";
        minPrice = undefined;
        maxPrice = undefined;
        filterProducts();
    })

    document.getElementById("searchinput").addEventListener("input", filterProducts);

  });
