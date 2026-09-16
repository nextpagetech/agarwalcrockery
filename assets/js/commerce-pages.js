document.addEventListener('DOMContentLoaded', () => {
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
