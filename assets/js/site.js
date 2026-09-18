/* Shared header/toast/add-to-cart wiring — include after products.js on every page.
   Uses event delegation so dynamically-rendered cards (shop filtering) work too. */
document.addEventListener('DOMContentLoaded', function () {
  var toast = document.querySelector('.toast-note');
  var toastText = toast ? toast.querySelector('[data-toast-text]') : null;

  function showToast(text) {
    if (!toast) return;
    if (toastText) toastText.textContent = text;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }
  window.ACShowToast = showToast;

  document.addEventListener('click', function (e) {
    var addBtn = e.target.closest('[data-add-order]');
    if (addBtn) {
      e.preventDefault();
      var card = addBtn.closest('[data-id]');
      var id = card ? card.getAttribute('data-id') : addBtn.getAttribute('data-id');
      if (id && window.AC) window.AC.addToCart(id, 1);
      var titleEl = card ? card.querySelector('.product-title') : null;
      showToast((titleEl ? titleEl.textContent.trim() : 'Product') + ' added to your order');
      addBtn.classList.add('added');
      var original = addBtn.innerHTML;
      addBtn.innerHTML = '<i class="bi bi-check2"></i> Added';
      setTimeout(function () { addBtn.innerHTML = original; addBtn.classList.remove('added'); }, 1200);
      return;
    }
    var wishBtn = e.target.closest('[data-wish]');
    if (wishBtn) {
      e.preventDefault();
      wishBtn.classList.toggle('active');
      var icon = wishBtn.querySelector('i');
      if (icon) { icon.classList.toggle('bi-heart'); icon.classList.toggle('bi-heart-fill'); }
    }
  });
});
