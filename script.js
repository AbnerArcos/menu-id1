// ===============================
// VARIABLES GLOBALES
// ===============================
let cart = [];

// ===============================
document.addEventListener("DOMContentLoaded", () => {

  const tabs = document.querySelectorAll(".tab");
  const sections = document.querySelectorAll(".section");
  const topBar = document.querySelector(".top-bar");

  const modal = document.querySelector(".product-modal");
  const overlay = document.querySelector(".overlay");

  const modalImage = document.getElementById("modalImage");
  const modalName = document.getElementById("modalName");
  const modalDescription = document.getElementById("modalDescription");
  const quantityValue = document.getElementById("quantityValue");

  const cartBar = document.querySelector(".cart-bar");
  const cartImages = document.querySelector(".cart-images");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");
const sheetTotal = document.getElementById("sheetTotal");


  const cartSheet = document.getElementById("cartSheet");
  const cartSheetContent = document.getElementById("cartSheetContent");
// ===============================
// ENVIAR A WHATSAPP
// ===============================


const confirmModal = document.getElementById("confirmModal");
const confirmItems = document.getElementById("confirmItems");
const confirmTotal = document.getElementById("confirmTotal");

document.getElementById("sendWhatsApp")
  .addEventListener("click", () => {

    if (cart.length === 0) return;

    confirmItems.innerHTML = "";

    let total = 0;

    cart.forEach(item => {

      const subtotal = item.price * item.quantity;
      total += subtotal;

      const div = document.createElement("div");
      div.classList.add("confirm-item");

      div.innerHTML = `
        <img src="${item.image}" />
        <div>
          <div>${item.name}</div>
          <small>${item.quantity} x ${item.price}€</small>
        </div>
        <div style="margin-left:auto;font-weight:bold;">
          ${subtotal}€
        </div>
      `;

      confirmItems.appendChild(div);
    });

    confirmTotal.textContent = `${total}€`;

    confirmModal.classList.add("active");
});
document.getElementById("cancelConfirm")
  .addEventListener("click", () => {
    confirmModal.classList.remove("active");
});

document.getElementById("confirmSend")
  .addEventListener("click", () => {

    let message = "Hola, quiero hacer el siguiente pedido:%0A%0A";
    let total = 0;

    cart.forEach(item => {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      message += `• ${item.name} x${item.quantity} - ${subtotal}€%0A`;
    });

    message += `%0A*Total: ${total}€*`;

    const phoneNumber = "529811064643";

    const url =
      `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(url, "_blank");

    confirmModal.classList.remove("active");
});


  let quantity = 1;
  let currentActive = "";

  // ===============================
  // TABS CLICK
  // ===============================
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = document.getElementById(tab.dataset.target);
      const offset = topBar.offsetHeight + 20;

      const topPosition =
        target.getBoundingClientRect().top +
        window.pageYOffset - offset;

      window.scrollTo({
        top: topPosition,
        behavior: "smooth"
      });
    });
  });

  // ===============================
  // SCROLL SPY
  // ===============================
  window.addEventListener("scroll", () => {

    sections.forEach(section => {

      const sectionTop =
        section.offsetTop - topBar.offsetHeight - 60;

      const sectionBottom =
        sectionTop + section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionBottom
      ) {
        currentActive = section.id;
      }
    });

    tabs.forEach(tab => {
      tab.classList.remove("active");

      if (tab.dataset.target === currentActive) {
        tab.classList.add("active");
        tab.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest"
        });
      }
    });

  });

  // ===============================
  // ABRIR MODAL
  // ===============================
  document.querySelectorAll(".add-btn").forEach(button => {

    button.addEventListener("click", e => {

      const item = e.target.closest(".item");

      modalImage.src = item.dataset.image;
      modalName.textContent = item.dataset.name;
      modalDescription.textContent = item.dataset.description;

      quantity = 1;
      quantityValue.textContent = quantity;

      modal.classList.add("active");
      overlay.classList.add("active");
	  cartBar.classList.remove("active");

    });

  });

  // ===============================
  // CONTROL CANTIDAD
  // ===============================
  document.getElementById("plus").addEventListener("click", () => {
    quantity++;
    quantityValue.textContent = quantity;
  });

  document.getElementById("minus").addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      quantityValue.textContent = quantity;
    }
  });

  overlay.addEventListener("click", closeModal);
  document.querySelector(".close-modal")
  .addEventListener("click", closeModal);


  function closeModal() {
  modal.classList.remove("active");
  overlay.classList.remove("active");

  if (cart.length > 0) {
    cartBar.classList.add("active");
  }
}


  // ===============================
  // AGREGAR AL CARRITO
  // ===============================
  document.querySelector(".add-cart-btn")
    .addEventListener("click", () => {

      const price = parseFloat(
        document.querySelector(
          `.item[data-name="${modalName.textContent}"]`
        ).dataset.price
      );

      const existing = cart.find(
        item => item.name === modalName.textContent
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({
          name: modalName.textContent,
          image: modalImage.src,
          price: price,
          quantity: quantity
        });
      }

      updateCartBar();
      closeModal();
    });

  // ===============================
  // ACTUALIZAR BARRA INFERIOR
  // ===============================
  function updateCartBar() {

    if (cart.length === 0) {
      cartBar.classList.remove("active");
      return;
    }

    cartBar.classList.add("active");
    cartImages.innerHTML = "";

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;
    });

    cart.slice(0, 2).forEach(item => {
      const img = document.createElement("img");
      img.src = item.image;
      cartImages.appendChild(img);
    });

    cartCount.textContent =
      `${totalItems} producto${totalItems > 1 ? "s" : ""}`;

    cartTotal.textContent = `${totalPrice}€`;
	sheetTotal.textContent = `${totalPrice}€`;

  }

  // ===============================
  // ABRIR CARRITO
  // ===============================
  document.getElementById("goToCart")
    .addEventListener("click", () => {
      renderCart();
      cartSheet.classList.add("active");
    });

  document.getElementById("closeCart")
    .addEventListener("click", () => {
      cartSheet.classList.remove("active");
    });

  // ===============================
  // RENDER CARRITO
  // ===============================
  function renderCart() {

    cartSheetContent.innerHTML = "";

    cart.forEach((product, index) => {

      const item = document.createElement("div");
      item.classList.add("cart-item");

      item.innerHTML = `
        <div class="delete-zone">Eliminar</div>
        <div class="cart-item-inner">
          <img src="${product.image}" />
          <div>
            <div>${product.name}</div>
            <small>${product.price}€</small>
          </div>
          <div class="cart-controls">
            ${
              product.quantity > 1
                ? `<button class="minus">-</button>`
                : `<button class="trash">🗑</button>`
            }
            <span>${product.quantity}</span>
            <button class="plus">+</button>
          </div>
        </div>
      `;

      // EVENTOS
      item.querySelector(".plus")
        .addEventListener("click", () => {
          cart[index].quantity++;
          renderCart();
          updateCartBar();
        });

      const minusBtn = item.querySelector(".minus");
      if (minusBtn) {
        minusBtn.addEventListener("click", () => {
          cart[index].quantity--;
          renderCart();
          updateCartBar();
        });
      }

      const trashBtn = item.querySelector(".trash");
      if (trashBtn) {
        trashBtn.addEventListener("click", () => {
          item.classList.add("swiped");

          item.querySelector(".delete-zone")
            .addEventListener("click", () => {
              cart.splice(index, 1);
              renderCart();
              updateCartBar();
            });
        });
      }

      cartSheetContent.appendChild(item);
    });
  }

});
