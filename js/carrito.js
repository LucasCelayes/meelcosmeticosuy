let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");


function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {

        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    
        contenedorCarritoProductos.innerHTML = "";
    
        productosEnCarrito.forEach(producto => {
    
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;
    
            contenedorCarritoProductos.append(div);
        })
    
    actualizarBotonesEliminar();
    actualizarTotal();
	
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }

}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #ff01af,rgb(249, 76, 195)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();
    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    
    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {

    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
      })
}


function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${totalCalculado}`;

    const datoTalle = document.querySelector(`#datoTalle`);


    const whatsappBtn = document.getElementById("carrito-acciones-comprar");
    whatsappBtn.addEventListener("click",() => {
        let mensaje = "Hola MelCosmeticosUY quisiera comprar los siguientes productos:\n\n";
        productosEnCarrito.forEach(producto => {
            mensaje +=`
            ${producto.titulo}
            - cantidad : ${producto.cantidad}
            - precio :${(producto.precio * producto.cantidad)
                .toFixed(2)}\n
                `;
            })
                mensaje += `
                \nEl precio total de la compra es de ${total.textContent}`;
                const url = `

                https://api.whatsapp.com/send?phone=59892508883&text=${encodeURIComponent(mensaje)} y mi forma de pago sera con ${datoTalle.value}`;
                window.open(url,"_blank")
            });


        }



    // // MERCADO PAGO EMPIEZA

    // const modalFooter = document.createElement("div");
    // modalFooter.className = "modal-footer";
    // modalFooter.innerHTML = `
    // <div class="total-price">Total:$${totalCalculado}</div>
    // <button class="btn-primary" id="checkout-btn">go to checkout</button>
    // <div id="wallet_container"></div>
    // `;
    // contenedorCarritoProductos.append(modalFooter)


    // //mp
    // const mp = new MercadoPago("APP_USR-be85699e-5aac-4b38-8ffd-7054ff26f8c7", {
    //     locale:"es-UY",
    // });
    // document.getElementById("checkout-btn").addEventListener("click",async()=>{
    //  try {
    //     const orderData = {
    //         title:"su compra en ecommerce",
    //         quantity:1,
    //         price:totalCalculado,
    //     };
    //     const response = await fetch("https://localhost:3000/create_preference", {
    //         method:"POST",
    //         headers:{
    //             "Content-Type":"application/json",
    //         },
    //         body:JSON.stringify(orderData),
    //     });
    //     const preference = await response.json();
    //     createCheckoutButton(preference.id);
    
    //  }catch (error) {
    //     alert("error");
    //  }   
    // });
    // const createCheckoutButton = (preferenceId) => {
    //     const bricksBuilder = mp.bricks();
    //     const renderComponent = async () => {
    //         if(window.checkButton) window.checkoutButton.unmount();
    //         await bricksBuilder.create("wallet","wallet_container",{
    //             initialization: {
    //                 preferenceId: preferenceId,
    //             },
    //         });
    //     };
    //     renderComponent();
        
    // };
    // // MERCADO PAGO TERMINA




function comprarCarrito() {

    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");

    

}









// // WHATSAPP
// const productosss =   localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
// const productossssss =   localStorage.setItem("total", JSON.stringify(total));
// function sendwhatsapp(){
//     var phonenumber =""
//     var boton = productosss
//     var precio = productossssss  

//    var url ="https://wa.me" + phonenumber + "?text="
//    +"*productos:* " +boton+"%0a"
//    +"*productos:* " +precio+"%0a"
   
   
//    window.open(url, '_blank').focus();
// }

// 🛒 BOTÓN COMPRAR AHORA - MERCADO PAGO
document.getElementById("comprar-btn")?.addEventListener("click", async () => {
  const productosParaEnviar = productosEnCarrito.map(p => ({
    titulo: p.titulo,
    precio: p.precio,
    cantidad: p.cantidad
  }));

  try {
    const respuesta = await fetch("/api/crear-preferencia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productosParaEnviar)
    });

    const data = await respuesta.json();

    if (data.init_point) {
      window.location.href = data.init_point;
    } else {
      alert("Error al generar el link de pago");
    }
  } catch (error) {
    console.error("Error al conectar con el backend:", error);
    alert("Ocurrió un error. Revisá la consola.");
  }
});


// ✅ BOTÓN COMPRAR AHORA - MERCADO PAGO (versión final)
document.getElementById("comprar-btn")?.addEventListener("click", async () => {
  const productosParaEnviar = productosEnCarrito.map(p => ({
    titulo: p.titulo,
    precio: p.precio,
    cantidad: p.cantidad
  }));

  try {
    const respuesta = await fetch("/api/crear-preferencia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productosParaEnviar)
    });

    const data = await respuesta.json();

    if (data.init_point) {
      window.location.href = data.init_point;
    } else {
      alert("Error al generar el link de pago");
    }
  } catch (error) {
    console.error("Error al conectar con el backend:", error);
    alert("Ocurrió un error. Revisá la consola.");
  }
});
