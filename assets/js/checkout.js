document.addEventListener('DOMContentLoaded', function () {
  var lines = window.AC.cartLines();
  var reviewEl = document.getElementById('checkoutReview');
  var countEl = document.getElementById('checkoutItemCount');
  var form = document.getElementById('checkoutForm');

  if (!lines.length) {
    window.location.href = 'cart.html';
    return;
  }

  reviewEl.innerHTML = lines.map(function (p) {
    return '' +
      '<div class="cart-row">' +
        '<div class="cart-thumb"><img src="' + p.img + '" alt="' + p.name + '"></div>' +
        '<div class="cart-info">' +
          '<span class="cart-cat">' + p.catLabel + '</span>' +
          '<h3>' + p.name + '</h3>' +
          '<span class="cart-note">Qty: ' + p.qty + '</span>' +
        '</div>' +
      '</div>';
  }).join('');

  var totalQty = lines.reduce(function (s, l) { return s + l.qty; }, 0);
  countEl.textContent = totalQty + ' item' + (totalQty === 1 ? '' : 's');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var order = window.AC.placeOrder(lines);
    window.location.href = 'order-success.html?order=' + order.id;
  });
});
