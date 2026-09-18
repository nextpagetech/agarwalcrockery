document.addEventListener('DOMContentLoaded', function () {
  var listEl = document.getElementById('cartList');
  var emptyEl = document.getElementById('cartEmptyState');
  var summaryEl = document.getElementById('cartSummary');
  var countEl = document.getElementById('cartItemCount');
  var summaryCountEl = document.getElementById('summaryItemCount');

  function render() {
    var lines = window.AC.cartLines();
    if (!lines.length) {
      listEl.innerHTML = '';
      listEl.style.display = 'none';
      summaryEl.style.display = 'none';
      emptyEl.classList.add('show');
      countEl.textContent = '0 items';
      if (summaryCountEl) summaryCountEl.textContent = '0';
      return;
    }
    emptyEl.classList.remove('show');
    listEl.style.display = '';
    summaryEl.style.display = '';

    listEl.innerHTML = lines.map(function (p) {
      return '' +
        '<div class="cart-row" data-id="' + p.id + '">' +
          '<div class="cart-thumb"><img src="' + p.img + '" alt="' + p.name + '"></div>' +
          '<div class="cart-info">' +
            '<span class="cart-cat">' + p.catLabel + '</span>' +
            '<h3><a href="product.html?id=' + p.id + '">' + p.name + '</a></h3>' +
            '<span class="cart-note"><i class="bi bi-lock"></i> Price after order review</span>' +
          '</div>' +
          '<div class="cart-qty">' +
            '<button type="button" data-qty-minus>−</button>' +
            '<input type="text" value="' + p.qty + '" readonly>' +
            '<button type="button" data-qty-plus>+</button>' +
          '</div>' +
          '<button class="cart-remove" data-remove aria-label="Remove item"><i class="bi bi-trash3"></i></button>' +
        '</div>';
    }).join('');

    var totalQty = lines.reduce(function (s, l) { return s + l.qty; }, 0);
    countEl.textContent = totalQty + ' item' + (totalQty === 1 ? '' : 's');
    if (summaryCountEl) summaryCountEl.textContent = totalQty;
  }

  listEl.addEventListener('click', function (e) {
    var row = e.target.closest('.cart-row');
    if (!row) return;
    var id = row.getAttribute('data-id');
    if (e.target.closest('[data-qty-plus]')) {
      var lines = window.AC.cartLines();
      var cur = lines.find(function (l) { return l.id === id; });
      window.AC.setQty(id, (cur ? cur.qty : 1) + 1);
      render();
    } else if (e.target.closest('[data-qty-minus]')) {
      var lines2 = window.AC.cartLines();
      var cur2 = lines2.find(function (l) { return l.id === id; });
      var next = (cur2 ? cur2.qty : 1) - 1;
      if (next <= 0) { window.AC.removeFromCart(id); } else { window.AC.setQty(id, next); }
      render();
    } else if (e.target.closest('[data-remove]')) {
      window.AC.removeFromCart(id);
      render();
    }
  });

  render();
});
