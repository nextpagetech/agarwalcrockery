document.addEventListener('DOMContentLoaded', function () {
  var toast = document.getElementById('homeToast');
  var toastText = toast ? toast.querySelector('[data-toast-text]') : null;
  var cartCount = document.querySelector('[data-cart-count]');
  var count = 0;

  function showToast(text) {
    if (!toast) return;
    if (toastText) toastText.textContent = text;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }

  document.querySelectorAll('[data-add-order]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      count += 1;
      if (cartCount) cartCount.textContent = count;
      var name = btn.closest('.product-card');
      var title = name ? name.querySelector('.product-title') : null;
      showToast((title ? title.textContent : 'Product') + ' added to your order');
    });
  });

  document.querySelectorAll('[data-wish]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      btn.classList.toggle('active');
      var icon = btn.querySelector('i');
      if (icon) {
        icon.classList.toggle('bi-heart');
        icon.classList.toggle('bi-heart-fill');
      }
    });
  });
});
