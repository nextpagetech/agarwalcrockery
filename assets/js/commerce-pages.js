document.addEventListener('DOMContentLoaded', () => {
  const ensureStylesheet = (href) => {
    if ([...document.querySelectorAll('link[rel="stylesheet"]')].some((link) => link.getAttribute('href') === href)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };

  ensureStylesheet('assets/css/premium-overrides.css');
  ensureStylesheet('assets/css/premium-v10.css');
  ensureStylesheet('assets/css/premium-v11.css');
  ensureStylesheet('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap');

  const footer = document.querySelector('.journey-footer');
  if (footer) {
    footer.className = 'premium-footer';
    footer.innerHTML = `
      <div class="container premium-footer-top">
        <div class="premium-footer-top-grid">
          <div class="premium-footer-brand">
            <div class="premium-footer-logo"><img src="assets/img/logo.svg" alt="Agarwal Crockery House"></div>
            <div>
              <h3>Your hospitality order, connected from product to payment.</h3>
              <p>Shop products, submit the requirement, review private pricing and complete payment from one connected Agarwal account journey.</p>
            </div>
          </div>
          <div class="premium-footer-action">
            <a href="shop.html"><div><small>CONTINUE SOURCING</small>Browse the complete catalogue</div><i class="bi bi-arrow-up-right"></i></a>
          </div>
        </div>
      </div>
      <div class="container premium-footer-main">
        <div class="premium-footer-note">
          <span>AGARWAL CROCKERY HOUSE</span>
          <p>A B2B hospitality store built for restaurants, hotels, cafes, institutions and commercial kitchens.</p>
          <div class="premium-footer-mini"><b>Private Pricing</b><b>Business Orders</b><b>Order History</b></div>
        </div>
        <div class="premium-footer-col"><span>SHOP</span><a href="shop.html">All Products</a><a href="shop.html?cat=commercial-kitchen">Commercial Kitchen Equipments</a>
        <a href="shop.html?cat=crockery">Crockery</a>
        <a href="shop.html?cat=cutlery">Cutlery</a>
        <a href="shop.html?cat=glassware">Glassware</a></div>
        <div class="premium-footer-col"><span>ACCOUNT</span><a href="login.html">Login</a><a href="register.html">Create Account</a><a href="orders.html">My Orders</a><a href="cart.html">Order Basket</a></div>
        <div class="premium-footer-col"><span>BUSINESS</span><a href="index.html#project">Complete Kitchen Projects</a><a href="checkout.html">Submit an Order</a><a href="order-details.html">Order Details</a><a href="orders.html">Order Support</a></div>
      </div>
      <div class="container premium-footer-bottom"><span>© 2026 Agarwal Crockery House</span><div><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Shipping</a><a href="#">Returns</a></div></div>`;
  }

  const CART_KEY = 'agarwalPrototypeCartCount';
  const getCartCount = () => Number(localStorage.getItem(CART_KEY) || 0);
  const setCartCount = (count) => {
    localStorage.setItem(CART_KEY, String(Math.max(0, count)));
    document.querySelectorAll('.journey-icon .count, [data-cart-count]').forEach((node) => { node.textContent = Math.max(0, count); });
  };
  setCartCount(getCartCount());

  document.querySelectorAll('[data-thumb]').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('[data-thumb]').forEach((item) => item.classList.remove('active'));
      thumb.classList.add('active');
      const main = document.querySelector('[data-main-product-image]');
      if (main && thumb.dataset.image) main.src = thumb.dataset.image;
    });
  });

  document.querySelectorAll('[data-qty-control]').forEach((control) => {
    const input = control.querySelector('input');
    control.querySelector('[data-qty-minus]')?.addEventListener('click', () => {
      if (input) input.value = Math.max(1, Number(input.value || 1) - 1);
    });
    control.querySelector('[data-qty-plus]')?.addEventListener('click', () => {
      if (input) input.value = Number(input.value || 1) + 1;
    });
  });

  document.querySelectorAll('[data-detail-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const row = button.closest('.detail-row');
      row?.classList.toggle('open');
      const icon = button.querySelector('i');
      if (icon) icon.className = row?.classList.contains('open') ? 'bi bi-dash' : 'bi bi-plus';
    });
  });

  document.querySelectorAll('[data-password-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.querySelector(button.dataset.passwordToggle);
      if (!target) return;
      target.type = target.type === 'password' ? 'text' : 'password';
      const icon = button.querySelector('i');
      if (icon) icon.className = target.type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
    });
  });

  document.querySelectorAll('[data-remove-item]').forEach((button) => {
    button.addEventListener('click', () => {
      button.closest('.cart-item')?.remove();
      const remaining = document.querySelectorAll('.cart-item').length;
      const count = document.querySelector('[data-cart-page-count]');
      if (count) count.textContent = `${remaining} item${remaining === 1 ? '' : 's'}`;
      setCartCount(Math.max(0, getCartCount() - 1));
    });
  });

  document.querySelectorAll('[data-order-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-order-filter]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.orderFilter;
      document.querySelectorAll('[data-order-status]').forEach((card) => {
        card.style.display = filter === 'all' || card.dataset.orderStatus === filter ? '' : 'none';
      });
    });
  });

  document.querySelectorAll('[data-add-cart-demo]').forEach((button) => {
    button.addEventListener('click', () => {
      const previous = button.innerHTML;
      button.innerHTML = '<i class="bi bi-check2"></i> Added to order';
      button.disabled = true;
      setCartCount(getCartCount() + 1);
      setTimeout(() => {
        button.innerHTML = previous;
        button.disabled = false;
      }, 1400);
    });
  });

  const checkoutForm = document.querySelector('[data-checkout-form]');
  checkoutForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    window.location.href = 'orders.html';
  });

  const paymentForm = document.querySelector('[data-payment-form]');
  paymentForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = paymentForm.querySelector('button[type="submit"]');
    if (!button) return;
    button.innerHTML = '<i class="bi bi-check2-circle"></i> Payment complete';
    button.classList.add('journey-btn-dark');
    button.disabled = true;
  });
});
