function initCart() {

    const carrito = localStorage.getItem("carrito");

        if (carrito) {
           for (let product of JSON.parse(carrito)) {
                document.getElementById("row").innerHTML += `
                <div class="card mb-3" style="max-width: 540px;">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${product.images[0]}" class="img-fluid rounded-start" alt="${product.description}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${product.name}</h5>
                                <p class="card-text">${product.currency} ${product.cost}</p>
                                <p class="card-text">${product.description}</p>
                            </div>
                        </div>
                        <button class="btn btn-danger mb-3" onclick="removeFromCart(${product.id})">Eliminar del carrito</button>
                        <input type="number btn btn-secondary mb-3">Cantidad: 1</input>
                    </div>
                </div>
                `;
            };
        }

}


document.addEventListener("DOMContentLoaded", function(e){
    initCart();
});