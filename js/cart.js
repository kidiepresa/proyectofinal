let dolar_venta;
let totalUYU;
let totalUSD

function initCart() {


    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    const row = document.getElementById("row");
    

      if (carrito.length > 0) {
    row.innerHTML = ''; 
    for (let product of carrito) {
        row.innerHTML += `
        <div class="card mb-4 shadow rounded" style="max-width: 100%;">
            <div class="row g-0 align-items-center">
                
                <div class="col-md-4 text-center">
                    <img src="${product.images[0]}" class="img-fluid rounded p-3" alt="${product.description}" style="max-height: 250px; object-fit: contain;">
                </div>

                <!-- Información del producto -->
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text text-secondary">${product.currency} ${product.cost.toLocaleString()}</p>

                        <div class="d-flex align-items-center mb-2">
                            <label for="${product.id}" class="me-2 mb-0 fw-semibold">Cantidad:</label>
                            <input type="number" min="1" value="${product.cantidad}" id="${product.id}" class="form-control cantidad-input" style="width:80px;">
                        </div>

                        <p class="mb-2">
                            Subtotal: 
                            <span class="fw-bold text-primary">
                                ${product.currency} <span class="subtotal" id="${product.id}">${(product.cost * product.cantidad).toLocaleString()}</span>
                            </span>
                        </p>

                        <button class="btn btn-danger btn-sm" style="background-color:#ff6b6b; border:none;" 
                            onmouseover="this.style.backgroundColor='#ff4c4c'" 
                            onmouseout="this.style.backgroundColor='#ff6b6b'" 
                            onclick="removeFromCart(${product.id})">
                            Eliminar
                        </button>
                    </div>
                </div>

            </div>
        </div>
        `;
    }
}else{
            document.getElementById("row").innerHTML = `
                    <div id="carrito-vacio" style="text-align: center; padding: 50px;">
                        <img src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png" alt="Carrito vacío"  style="width: 100px; opacity: 0.5; margin-bottom: 20px;">
                        <h2>Tu carrito está vacío</h2>
                        <p>Parece que todavía no agregaste productos.</p>
                        <a href="index.html" class="btn btn-primary" style="margin-top: 20px;"> Ir a comprar </a>
                    </div>
                    `;

            document.getElementById("totales").innerHTML = "";
            document.getElementById("totales").style.display = "none";
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

function dolar(){
    fetch("https://uy.dolarapi.com/v1/cotizaciones/usd")
    .then(res => res.json())
    .then(data => {
        dolar_venta = data.venta;
        actualizarTotal();
    })
  .catch(err => console.error(err));
}

function actualizarTotal() {
    const carrito = JSON.parse(localStorage.getItem("carrito"));
    const dolar = dolar_venta;
    totalUYU = carrito.reduce((sum, p) => {
            if (p.currency === "UYU") return sum + p.cost * p.cantidad;
                 else return sum + p.cost * p.cantidad * dolar; 
                }, 0);

                
    document.getElementById("total-pesos").innerText = `Total en pesos:  ${totalUYU.toFixed(2)} UYU`
    costoEnvio();
    actualizarCantidadCarrito();
}

function removeFromCart(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito"));
    carrito = carrito.filter(p => p.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    location.reload();
}

function costoEnvio() {
  const porcentajeEnvio = parseFloat(document.getElementById("tipoEnvio").value);

  const costo = totalUYU * porcentajeEnvio; 
  const totalConEnvio = totalUYU + costo;
  document.getElementById("subtotal").innerText = `Productos: ${totalUYU.toFixed(2)} UYU`;
  document.getElementById("costo-envio").innerText = `Costo de envío: ${costo.toFixed(2)} UYU`;
  document.getElementById("total-pesos").innerText = `Total final: ${totalConEnvio.toFixed(2)} UYU`;
}

function guardarFormaPago() {
    const formaPago = document.querySelector('input[name="formaPago"]:checked');
    if (!formaPago) {
        Swal.fire('Error', 'Por favor, selecciona una forma de pago', 'error');
        return;
    }

    localStorage.setItem('formaPago', formaPago.value);
    Swal.fire('¡Listo!', `Forma de pago seleccionada: ${formaPago.value}`, 'success');

    const modal = bootstrap.Modal.getInstance(document.getElementById('modalPago'));
    modal.hide();

    document.getElementById('metodo-pago').innerText = `Método de pago: ${formaPago.value}`;
}

function validarCompra() {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");

    const tipoEnvio = parseFloat(document.getElementById('tipoEnvio').value);
    if (!tipoEnvio || tipoEnvio === 0) {
        Swal.fire('Error', 'Selecciona un tipo de envío antes de finalizar la compra.', 'error');
        return;
    }

    const departamento = document.getElementById('departamento').value.trim();
    const localidad = document.getElementById('localidad').value.trim();
    const calle = document.getElementById('calle').value.trim();
    const numero = document.getElementById('numero').value.trim();
    const esquina = document.getElementById('esquina').value.trim();

    if (!departamento || !localidad || !calle || !numero || !esquina) {
        Swal.fire('Error', 'Completa todos los campos de la dirección de envío.', 'error');
        return;
    }
    
    const formaPago = localStorage.getItem('formaPago');
    if (!formaPago) {
        Swal.fire('Error', 'Debes seleccionar una forma de pago antes de finalizar la compra.', 'error');
        return;
    }
    Swal.fire({
        icon: 'success',
        title: '¡Compra realizada!',
        html: `
            Gracias por tu compra.<br>
            Método de pago: <b>${formaPago}</b><br>
            Envío a: ${calle} ${numero}, esquina ${esquina}, ${localidad}, ${departamento}.
        `
    }).then(() => {
        localStorage.removeItem("carrito");
        localStorage.removeItem('formaPago');
        location.reload();
    });
}


document.addEventListener("DOMContentLoaded", function(e){
    dolar();
    initCart();
    const formaPagoGuardada = localStorage.getItem('formaPago');
    if (formaPagoGuardada) {
        document.getElementById('metodo-pago').innerText = `Método de pago: ${formaPagoGuardada}`;
    }
});