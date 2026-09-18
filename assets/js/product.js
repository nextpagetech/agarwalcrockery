document.addEventListener('DOMContentLoaded', function () {
  var params = new URLSearchParams(window.location.search);
  var id = params.get('id') || 'p1';
  var product = window.AC.PRODUCTS.find(function (p) { return p.id === id; }) || window.AC.PRODUCTS[0];

  document.title = product.name + ' | Agarwal Crockery House';
  document.getElementById('pdImage').src = product.img;
  document.getElementById('pdImage').alt = product.name;
  document.getElementById('pdCat').textContent = product.catLabel;
  document.getElementById('pdTitle').textContent = product.name;
  document.getElementById('pdDesc').textContent = product.desc;
  document.getElementById('pdCrumbCat').textContent = product.catLabel;
  document.getElementById('pdCrumbCat').href = 'shop.html?cat=' + product.cat;
  document.getElementById('pdCrumbName').textContent = product.name;
  document.getElementById('addToCartBtn').setAttribute('data-id', product.id);

  var qtyInput = document.getElementById('pdQty');
  document.getElementById('qtyMinus').addEventListener('click', function () {
    qtyInput.value = Math.max(1, parseInt(qtyInput.value, 10) - 1);
  });
  document.getElementById('qtyPlus').addEventListener('click', function () {
    qtyInput.value = parseInt(qtyInput.value, 10) + 1;
  });

  document.getElementById('addToCartBtn').addEventListener('click', function (e) {
    e.preventDefault();
    var qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
    window.AC.addToCart(product.id, qty);
    if (window.ACShowToast) window.ACShowToast(product.name + ' added to your order');
  });

  var related = window.AC.PRODUCTS.filter(function (p) { return p.cat === product.cat && p.id !== product.id; }).slice(0, 4);
  if (!related.length) related = window.AC.PRODUCTS.filter(function (p) { return p.id !== product.id; }).slice(0, 4);
  var relatedGrid = document.getElementById('relatedGrid');
  relatedGrid.innerHTML = related.map(function (p) {
    return '' +
      '<article class="product-card" data-id="' + p.id + '">' +
        '<div class="product-media">' +
          (p.badge ? '<span class="new-badge">' + p.badge + '</span>' : '') +
          '<a href="product.html?id=' + p.id + '"><img src="' + p.img + '" alt="' + p.name + '"></a>' +
          '<button class="wish-btn" data-wish aria-label="Add to wishlist"><i class="bi bi-heart"></i></button>' +
        '</div>' +
        '<div class="product-body">' +
          '<span class="product-cat">' + p.catLabel + '</span>' +
          '<h3 class="product-title"><a href="product.html?id=' + p.id + '">' + p.name + '</a></h3>' +
          '<p class="product-desc">' + p.desc + '</p>' +
          '<span class="price-badge"><i class="bi bi-lock"></i> Price available after order review</span>' +
          '<div class="product-foot"><button class="add-order-btn" data-add-order><i class="bi bi-bag-plus"></i> Add to Order</button></div>' +
        '</div>' +
      '</article>';
  }).join('');
});
