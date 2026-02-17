document.addEventListener("DOMContentLoaded", function(){

  /* ================= ELEMENTOS MODAL PRODUCTO ================= */

  const productModal = document.getElementById("productModal");
  const productNameEl = document.getElementById("productName");
  const quantityEl = document.getElementById("quantity");
  const productCommentEl = document.getElementById("productComment");

  const minusBtn = document.getElementById("minusBtn");
  const plusBtn = document.getElementById("plusBtn");
  const confirmAdd = document.getElementById("confirmAdd");
  const cancelAdd = document.getElementById("cancelAdd");

  let selectedProduct = null;
  let selectedPrice = 0;
  let selectedQuantity = 1;

  /* ================= CARRITO ================= */

  let cart = JSON.parse(localStorage.getItem("cart"));
  if(!Array.isArray(cart)){
    cart = [];
  }

  const floatingCart = document.getElementById("floatingCart");
  const cartModal = document.getElementById("cartModal");

  /* ================= MODAL CONFIRMAR ================= */

  const confirmModal = document.getElementById("confirmModal");
  const confirmOrderList = document.getElementById("confirmOrderList");
  const confirmTotalEl = document.getElementById("confirmTotal");

  /* ================= ABRIR MODAL PRODUCTO ================= */

  document.querySelectorAll(".add-btn").forEach(button=>{
    button.addEventListener("click", function(){

      selectedProduct = this.dataset.name;
      selectedPrice = Number(this.dataset.price);
      selectedQuantity = 1;

      productNameEl.innerText = selectedProduct;
      quantityEl.innerText = selectedQuantity;
      productCommentEl.value = "";

      productModal.style.display = "flex";
    });
  });

  /* ================= BOTONES + y - ================= */

  minusBtn.addEventListener("click", ()=>{
    if(selectedQuantity > 1){
      selectedQuantity--;
      quantityEl.innerText = selectedQuantity;
    }
  });

  plusBtn.addEventListener("click", ()=>{
    selectedQuantity++;
    quantityEl.innerText = selectedQuantity;
  });

  /* ================= CONFIRMAR AGREGAR ================= */

  confirmAdd.addEventListener("click", ()=>{

    const selectedComment = productCommentEl.value.trim();

    let product = cart.find(p => 
      p.name === selectedProduct &&
      p.comment === selectedComment
    );

    if(product){
      product.quantity += selectedQuantity;
    } else {
      cart.push({
        name: selectedProduct,
        price: selectedPrice,
        quantity: selectedQuantity,
        comment: selectedComment
      });
    }

    saveCart();
    updateCartUI();
    productModal.style.display = "none";
  });

  cancelAdd.addEventListener("click", ()=>{
    productModal.style.display = "none";
  });

  function saveCart(){
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateCartUI(){

    let count = 0;
    let total = 0;

    cart.forEach(item=>{
      count += item.quantity;
      total += item.price * item.quantity;
    });

    document.getElementById("cartBadge").innerText = count;
    document.getElementById("cart-count").innerText = count + " productos";
    document.getElementById("cart-total").innerText = "$" + total;
    document.getElementById("modalTotal").innerText = total;

    renderCartItems();
  }

  /* ================= RENDER PRODUCTOS ================= */

  function renderCartItems(){

    const container = document.getElementById("cartItems");
    container.innerHTML = "";

    cart.forEach((item, index)=>{

      const div = document.createElement("div");
      div.classList.add("cart-item");

      div.innerHTML = `
        <div style="flex:1;">
          <strong>${item.name}</strong>
          ${item.comment ? `<div class="item-comment">📝 ${item.comment}</div>` : ""}
          <div>$${item.price * item.quantity}</div>
        </div>

        <div class="cart-controls">
          <button class="minus-btn">-</button>
          <span>${item.quantity}</span>
          <button class="plus-btn">+</button>
        </div>

        <button class="remove-btn">X</button>
      `;

      div.querySelector(".plus-btn").addEventListener("click", ()=>{
        item.quantity++;
        saveCart();
        updateCartUI();
      });

      div.querySelector(".minus-btn").addEventListener("click", ()=>{

        if(item.quantity === 1){
          const confirmar = confirm("¿Deseas eliminar este producto del carrito?");
          if(!confirmar) return;
          cart.splice(index,1);
        } else {
          item.quantity--;
        }

        saveCart();
        updateCartUI();
      });

      div.querySelector(".remove-btn").addEventListener("click", ()=>{
        const confirmar = confirm("¿Seguro que deseas eliminar este producto?");
        if(!confirmar) return;
        cart.splice(index,1);
        saveCart();
        updateCartUI();
      });

      container.appendChild(div);
    });
  }

  /* ================= ABRIR Y CERRAR CARRITO ================= */

  floatingCart.addEventListener("click", ()=>{
    cartModal.style.display = "flex";
  });

  document.getElementById("closeCartBtn")
    .addEventListener("click", ()=>{
      cartModal.style.display = "none";
  });

  /* ================= ABRIR MODAL CONFIRMACION ================= */

  document.getElementById("sendWhatsapp")
    .addEventListener("click", ()=>{

      if(cart.length === 0){
        alert("Tu carrito está vacío");
        return;
      }

      confirmOrderList.innerHTML = "";
      let total = 0;

      cart.forEach(item=>{
        const div = document.createElement("div");
        div.style.marginBottom = "8px";

        div.innerHTML = `
          • ${item.name} x${item.quantity} - $${item.price * item.quantity}
          ${item.comment ? `<div style="font-size:12px;">📝 ${item.comment}</div>` : ""}
        `;

        confirmOrderList.appendChild(div);
        total += item.price * item.quantity;
      });

      confirmTotalEl.innerText = total;
      confirmModal.style.display = "flex";
  });

  /* ================= CANCELAR ENVIO ================= */

  document.getElementById("cancelSend")
    .addEventListener("click", ()=>{
      confirmModal.style.display = "none";
  });

  /* ================= CONFIRMAR ENVIO WHATSAPP ================= */

  document.getElementById("confirmSend")
    .addEventListener("click", ()=>{

      let mensaje = "Hola Chef 👨‍🍳, quiero hacer el siguiente pedido:%0A%0A";
      let total = 0;

      cart.forEach(item=>{
        mensaje += `• ${item.name} x${item.quantity} - $${item.price * item.quantity}%0A`;

        if(item.comment){
          mensaje += `   Nota: ${item.comment}%0A`;
        }

        total += item.price * item.quantity;
      });

      mensaje += `%0A🧾 Total: $${total}`;

      const numero = "529811064643"; // 👈 PON TU NUMERO
      const url = `https://wa.me/${numero}?text=${mensaje}`;

      window.open(url, "_blank");

      confirmModal.style.display = "none";
  });

  /* ================= DRAG CARRITO ================= */

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  floatingCart.addEventListener("mousedown", (e)=>{
    isDragging = true;
    offsetX = e.clientX - floatingCart.offsetLeft;
    offsetY = e.clientY - floatingCart.offsetTop;
  });

  document.addEventListener("mousemove", (e)=>{
    if(isDragging){
      floatingCart.style.left = (e.clientX - offsetX) + "px";
      floatingCart.style.top = (e.clientY - offsetY) + "px";
    }
  });

  document.addEventListener("mouseup", ()=>{
    isDragging = false;
  });

  document.addEventListener("touchstart", (e)=>{
    isDragging = true;
    offsetX = e.touches[0].clientX - floatingCart.offsetLeft;
    offsetY = e.touches[0].clientY - floatingCart.offsetTop;
  }, { passive:false });

  document.addEventListener("touchmove", (e)=>{
    if(isDragging){
      e.preventDefault();
      floatingCart.style.left = (e.touches[0].clientX - offsetX) + "px";
      floatingCart.style.top = (e.touches[0].clientY - offsetY) + "px";
    }
  }, { passive:false });

  document.addEventListener("touchend", ()=>{
    isDragging = false;
  });

  updateCartUI();

});
