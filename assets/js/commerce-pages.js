document.addEventListener('DOMContentLoaded', () => {
  const premium = document.createElement('link');
  premium.rel = 'stylesheet';
  premium.href = 'assets/css/premium-overrides.css';
  document.head.appendChild(premium);

  const footer = document.querySelector('.journey-footer');
  if (footer) {
    footer.className = 'premium-footer';
    footer.innerHTML = `<div class="container premium-footer-top"><div class="premium-footer-top-grid"><div class="premium-footer-brand"><div class="premium-footer-logo"><img src="assets/img/logo.svg" alt="Agarwal Crockery House"></div><div><h3>Professional hospitality buying, made simpler.</h3><p>Shop, submit your requirement, review private pricing and complete payment from one connected account journey.</p></div></div><div class="premium-footer-action"><a href="shop.html"><div><small>CONTINUE SHOPPING</small>Browse the complete catalogue</div><i class="bi bi-arrow-up-right"></i></a></div></div></div><div class="container premium-footer-main"><div class="premium-footer-note"><span>AGARWAL CROCKERY HOUSE</span><p>B2B hospitality supply for restaurants, hotels, cafes, institutions and commercial kitchens.</p><div class="premium-footer-mini"><b>Private Pricing</b><b>Business Orders</b><b>Order History</b></div></div><div class="premium-footer-col"><span>SHOP</span><a href="shop.html">All Products</a><a href="shop.html?cat=crockery">Crockery</a><a href="shop.html?cat=glassware">Glassware</a><a href="shop.html?cat=catering">Buffet & Catering</a></div><div class="premium-footer-col"><span>ACCOUNT</span><a href="login.html">Login</a><a href="register.html">Create Account</a><a href="orders.html">My Orders</a><a href="cart.html">Order Basket</a></div><div class="premium-footer-col"><span>BUSINESS</span><a href="index.html#project">Complete Kitchen Projects</a><a href="checkout.html">Submit an Order</a><a href="order-details.html">Order Details</a><a href="orders.html">Order Support</a></div></div><div class="container premium-footer-bottom"><span>© 2026 Agarwal Crockery House</span><div><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Shipping</a><a href="#">Returns</a></div></div>`;
  }

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
    const minus = control.querySelector('[data-qty-minus]');
    const plus = control.querySelector('[data-qty-plus]');
    minus?.addEventListener('click', () => {
      const value = Math.max(1, Number(input?.value || 1) - 1);
      if (input) input.value = value;
    });
    plus?.addEventListener('click', () => {
      const value = Number(input?.value || 1) + 1;
      if (input) input.value = value;
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
      const item = button.closest('.cart-item');
      item?.remove();
      const remaining = document.querySelectorAll('.cart-item').length;
      const count = document.querySelector('[data-cart-page-count]');
      if (count) count.textContent = `${remaining} item${remaining === 1 ? '' : 's'}`;
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
      const old = button.innerHTML;
      button.innerHTML = '<i class="bi bi-check2"></i> Added to order';
      button.disabled = true;
      setTimeout(() => {
        button.innerHTML = old;
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
    button.classList.remove('journey-btn');
    button.classList.add('journey-btn', 'journey-btn-dark');
    button.disabled = true;
  });
});
