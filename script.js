let cart = [];

const isDesktop = () => window.innerWidth >= 768;

document.addEventListener("DOMContentLoaded", () => {

  const tabs       = document.querySelectorAll(".tab");
  const sections   = document.querySelectorAll(".section");
  const topBar     = document.querySelector(".top-bar");
  const modal      = document.querySelector(".product-modal");
  const overlay    = document.querySelector(".overlay");
  const cartBar    = document.querySelector(".cart-bar");
  const cartSheet  = document.getElementById("cartSheet");
  const cartSheetContent = document.getElementById("cartSheetContent");
  const cartImages = document.querySelector(".cart-images");

  const modalImage       = document.getElementById("modalImage");
  const modalName        = document.getElementById("modalName");
  const modalDescription = document.getElementById("modalDescription");
  const modalNotes       = document.getElementById("modalNotes");
  const quantityValue    = document.getElementById("quantityValue");
  const cartCount        = document.getElementById("cartCount");
  const cartTotal        = document.getElementById("cartTotal");
  const sheetTotal       = document.getElementById("sheetTotal");
  const confirmModal     = document.getElementById("confirmModal");
  const confirmItems     = document.getElementById("confirmItems");
  const confirmTotal     = document.getElementById("confirmTotal");
  const sidebarItems     = document.getElementById("sidebarItems");
  const sidebarEmpty     = document.getElementById("sidebarEmpty");
  const sidebarFooter    = document.getElementById("sidebarFooter");
  const sidebarTotal     = document.getElementById("sidebarTotal");

  let quantity = 1;
  let currentActive = "";

  // =====================
  // TABS — scroll to section
  // =====================
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = document.getElementById(tab.dataset.target);
      const offset = topBar.offsetHeight + 20;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.pageYOffset - offset,
        behavior: "smooth"
      });
    });
  });

  // =====================
  // SCROLL SPY
  // =====================
  window.addEventListener("scroll", () => {
    sections.forEach(section => {
      const top    = section.offsetTop - topBar.offsetHeight - 60;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) currentActive = section.id;
    });

    tabs.forEach(tab => {
      tab.classList.remove("active");
      if (tab.dataset.target === currentActive) {
        tab.classList.add("active");
        const tabsContainer = document.querySelector(".tabs");
        tabsContainer.scrollTo({
          left: tab.offsetLeft - tabsContainer.offsetWidth / 2 + tab.offsetWidth / 2,
          behavior: "smooth"
        });
      }
    });
  });

  // =====================
  // ABRIR MODAL
  // =====================
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const item = e.target.closest(".item");
      modalImage.src         = item.dataset.image;
      modalName.textContent  = item.dataset.name;
      modalDescription.textContent = item.dataset.description;
      quantity = 1;
      quantityValue.textContent = 1;
      modal.classList.add("active");
      overlay.classList.add("active");
      cartBar.classList.remove("active");
    });
  });

  // =====================
  // CANTIDAD
  // =====================
  document.getElementById("plus").addEventListener("click", () => {
    quantity++;
    quantityValue.textContent = quantity;
  });

  document.getElementById("minus").addEventListener("click", () => {
    if (quantity > 1) { quantity--; quantityValue.textContent = quantity; }
  });

  // =====================
  // CERRAR MODAL
  // =====================
  function closeModal() {
    modal.classList.remove("active");
    overlay.classList.remove("active");
    if (cart.length > 0) cartBar.classList.add("active");
  }

  overlay.addEventListener("click", closeModal);
  document.querySelector(".close-modal").addEventListener("click", closeModal);

  // =====================
  // AGREGAR AL CARRITO
  // =====================
  document.querySelector(".add-cart-btn").addEventListener("click", () => {
    const price    = parseFloat(document.querySelector(`.item[data-name="${modalName.textContent}"]`).dataset.price);
    const noteValue = modalNotes.value.trim();
    const existing  = cart.find(i => i.name === modalName.textContent && i.price === price && i.note === noteValue);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ name: modalName.textContent, image: modalImage.src, price, quantity, note: noteValue });
    }

    modalNotes.value = "";
    if (navigator.vibrate) navigator.vibrate(50);
    updateCartBar();
    closeModal();
  });

  // =====================
  // ACTUALIZAR BARRA / SIDEBAR
  // =====================
  function updateCartBar() {
    if (cart.length === 0) { cartBar.classList.remove("active"); }
    else {
      cartBar.classList.add("active");
      cartImages.innerHTML = "";
      let totalItems = 0, totalPrice = 0;
      cart.forEach(item => { totalItems += item.quantity; totalPrice += item.price * item.quantity; });
      cart.slice(0, 2).forEach(item => {
        const img = document.createElement("img");
        img.src = item.image;
        cartImages.appendChild(img);
      });
      cartCount.textContent = `${totalItems} producto${totalItems > 1 ? "s" : ""}`;
      cartTotal.textContent = `${totalPrice}$`;
      sheetTotal.textContent = `${totalPrice}$`;
    }
    renderSidebar();
  }

  // =====================
  // SIDEBAR DESKTOP
  // =====================
  function renderSidebar() {
    if (!sidebarItems) return;
    sidebarItems.innerHTML = "";

    if (cart.length === 0) {
      sidebarEmpty.style.display = "flex";
      sidebarFooter.classList.remove("visible");
      return;
    }

    sidebarEmpty.style.display = "none";
    sidebarFooter.classList.add("visible");

    let total = 0;
    cart.forEach((product, index) => {
      total += product.price * product.quantity;

      const div = document.createElement("div");
      div.classList.add("sidebar-item");
      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <div class="sidebar-item-info">
          <div class="sidebar-item-name">${product.name}</div>
          <div class="sidebar-item-price">$${product.price} MXN</div>
          ${product.note ? `<div class="sidebar-item-note">📝 ${product.note}</div>` : ""}
        </div>
        <div class="sidebar-item-controls">
          ${product.quantity > 1
            ? `<button class="s-minus">-</button>`
            : `<button class="s-trash">🗑</button>`}
          <span>${product.quantity}</span>
          <button class="s-plus">+</button>
        </div>
      `;

      div.querySelector(".s-plus").addEventListener("click", () => { cart[index].quantity++; updateCartBar(); });
      const sm = div.querySelector(".s-minus");
      if (sm) sm.addEventListener("click", () => { cart[index].quantity--; updateCartBar(); });
      const st = div.querySelector(".s-trash");
      if (st) st.addEventListener("click", () => { cart.splice(index, 1); updateCartBar(); });

      sidebarItems.appendChild(div);
    });

    sidebarTotal.textContent = `$${total} MXN`;
  }

  // =====================
  // CARRITO SHEET
  // =====================
  document.getElementById("goToCart").addEventListener("click", () => {
    renderCart();
    cartSheet.classList.add("active");
  });

  document.getElementById("closeCart").addEventListener("click", () => {
    cartSheet.classList.remove("active");
  });

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
            <small>${product.price}$</small>
            ${product.note ? `<div class="cart-note">📝 ${product.note}</div>` : ""}
          </div>
          <div class="cart-controls">
            ${product.quantity > 1 ? `<button class="minus">-</button>` : `<button class="trash">🗑</button>`}
            <span>${product.quantity}</span>
            <button class="plus">+</button>
          </div>
        </div>
      `;

      item.querySelector(".plus").addEventListener("click", () => { cart[index].quantity++; renderCart(); updateCartBar(); });

      const minusBtn = item.querySelector(".minus");
      if (minusBtn) minusBtn.addEventListener("click", () => { cart[index].quantity--; renderCart(); updateCartBar(); });

      const trashBtn = item.querySelector(".trash");
      if (trashBtn) trashBtn.addEventListener("click", () => {
        item.classList.add("swiped");
        item.querySelector(".delete-zone").addEventListener("click", () => { cart.splice(index, 1); renderCart(); updateCartBar(); });
      });

      // Swipe para deshacer
      let startX = 0;
      const inner = item.querySelector(".cart-item-inner");
      inner.addEventListener("touchstart", e => { startX = e.touches[0].clientX; });
      inner.addEventListener("touchend", e => {
        if (!item.classList.contains("swiped")) return;
        if (e.changedTouches[0].clientX - startX > 60) item.classList.remove("swiped");
      });

      cartSheetContent.appendChild(item);
    });
  }

  // =====================
  // WHATSAPP (compartido)
  // =====================
  function openConfirmModal() {
    if (cart.length === 0) return;
    if (navigator.vibrate) navigator.vibrate(40);
    confirmItems.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      const div = document.createElement("div");
      div.classList.add("confirm-item");
      div.innerHTML = `
        <img src="${item.image}" />
        <div><div>${item.name}</div><small>${item.quantity} x ${item.price}$</small></div>
        <div style="margin-left:auto;font-weight:bold;">${subtotal}$</div>
      `;
      confirmItems.appendChild(div);
    });
    confirmTotal.textContent = `${total}$`;
    confirmModal.classList.add("active");
  }

  document.getElementById("sendWhatsApp").addEventListener("click", openConfirmModal);

  const sidebarWA = document.getElementById("sidebarWhatsApp");
  if (sidebarWA) sidebarWA.addEventListener("click", openConfirmModal);

  document.getElementById("cancelConfirm").addEventListener("click", () => {
    confirmModal.classList.remove("active");
  });

  document.getElementById("confirmSend").addEventListener("click", () => {
    if (navigator.vibrate) navigator.vibrate([80, 40, 80]);

    let message = "Hola, quiero hacer el siguiente pedido:\n\n";
    let total = 0;

    cart.forEach(item => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      message += `• ${item.name} x${item.quantity} - ${subtotal} MXN`;
      if (item.note) message += `\n  📝 Nota: ${item.note}`;
      message += "\n";
    });

    message += `\nTotal: ${total} MXN`;
    window.open(`https://wa.me/529811064643?text=${encodeURIComponent(message)}`, "_blank");

    cart = [];
    updateCartBar();
    renderCart();
    confirmModal.classList.remove("active");
    cartSheet.classList.remove("active");
    showSuccessMessage();
  });

  // =====================
  // TOAST
  // =====================
  function showSuccessMessage() {
    const msg = document.createElement("div");
    msg.classList.add("success-toast");
    msg.textContent = "✅ Pedido enviado correctamente";
    document.body.appendChild(msg);
    setTimeout(() => msg.classList.add("show"), 50);
    setTimeout(() => { msg.classList.remove("show"); setTimeout(() => msg.remove(), 300); }, 2500);
  }

});
