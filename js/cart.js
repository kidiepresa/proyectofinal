function initCart() {

    const carrito = localStorage.getItem("carrito");

        if (carrito) {
            for (let product of JSON.parse(carrito)) {
                document.getElementById("row").innerHTML += `
                <div class="card" style="max-width: 1400px;">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${product.images[0]}" class="img-fluid rounded-start" alt="${product.description}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${product.name}</h5>
                                <p class="card-text">${product.currency} ${product.cost}</p>
                                <div class="col-6">
                                    <label for="cantidad">Cantidad:</label>
                                    <input type="number" min="1" value="${product.cantidad}" id="${product.id}" class="cantidad-input">
                                    <br><br><br>
                                    <button class="btn btn-danger mb-3" onclick="removeFromCart(${product.id})">Eliminar del carrito</button>
                                </div>
                            </div>
                        </div>
                        <p>Subtotal: ${product.currency} <span class="subtotal" id="${product.id}">${product.cost * product.cantidad}</span></p>
                    </div>
                </div>
                <br><br>
                `;
            };
        }
        document.querySelectorAll(".cantidad-input").forEach(input => {
        input.addEventListener("change", cambiarCantidad);
        });
}

function cambiarCantidad(e) {
    const id = e.target.getAttribute("id");
    const nuevaCantidad = parseInt(e.target.value);

    let carrito = JSON.parse(localStorage.getItem("carrito"));
    carrito = carrito.map(p => {
        if (p.id == id) p.cantidad = nuevaCantidad;
        return p;
    });

    localStorage.setItem("carrito", JSON.stringify(carrito));
    const subtotal = document.querySelector(`.subtotal[id="${id}"]`);
    const producto = carrito.find(p => p.id == id);
    subtotal.innerText = producto.cost * producto.cantidad;
    actualizarTotal();
}

function actualizarTotal() {
    const carrito = JSON.parse(localStorage.getItem("carrito"));
    const dolar = 40;
    let totalUYU = carrito.reduce((sum, p) => {
            if (p.currency === "UYU") return sum + p.cost * p.cantidad;
                 else return sum + p.cost * p.cantidad * dolar; 
                }, 0);

    let totalUSD = carrito.reduce((sum, p) => {
            if (p.currency === "USD") return sum + p.cost * p.cantidad;
                else return sum + (p.cost * p.cantidad) / dolar; 
                }, 0);

    document.getElementById("total-pesos").innerText = `Total en pesos:  ${totalUYU} UYU`;
    document.getElementById("total-dolares").innerText = `Total en dolares:  ${totalUSD} USD`;
}

function removeFromCart(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito"));
    carrito = carrito.filter(p => p.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    location.reload();}

document.addEventListener("DOMContentLoaded", function(e){
    initCart();
    actualizarTotal();
});