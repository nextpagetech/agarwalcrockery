document.addEventListener('DOMContentLoaded', function () {
  var PRODUCTS = window.AC.PRODUCTS;
  var grid = document.getElementById('shopGrid');
  var resultCount = document.getElementById('resultCount');
  var emptyState = document.getElementById('shopEmpty');
  var searchInput = document.getElementById('shopSearch');
  var sortSelect = document.getElementById('shopSort');
  var chipsRow = document.getElementById('shopChips');
  var catInputs = document.querySelectorAll('input[name="catFilter"]');
  var clearBtn = document.getElementById('filterClear');

  var CAT_LABELS = {
    'dinner-sets': 'Dinner Sets', 'plates-bowls': 'Plates & Bowls', 'glassware': 'Glassware',
    'serveware': 'Serveware', 'kitchen': 'Kitchen Items', 'gifts': 'Gift Collections'
  };

  function cardHtml(p) {
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
  }

  function activeCats() {
    return Array.from(catInputs).filter(function (i) { return i.checked; }).map(function (i) { return i.value; });
  }

  function render() {
    var cats = activeCats();
    var term = (searchInput.value || '').trim().toLowerCase();
    var list = PRODUCTS.filter(function (p) {
      var catOk = !cats.length || cats.indexOf(p.cat) !== -1;
      var searchOk = !term || (p.name + ' ' + p.desc + ' ' + p.catLabel).toLowerCase().indexOf(term) !== -1;
      return catOk && searchOk;
    });

    var sortVal = sortSelect.value;
    if (sortVal === 'az') list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    if (sortVal === 'za') list.sort(function (a, b) { return b.name.localeCompare(a.name); });
    if (sortVal === 'newest') list.sort(function (a, b) { return (b.badge === 'NEW') - (a.badge === 'NEW'); });

    grid.innerHTML = list.map(cardHtml).join('');
    resultCount.innerHTML = '<b>' + list.length + '</b> product' + (list.length === 1 ? '' : 's');
    emptyState.classList.toggle('show', list.length === 0);

    chipsRow.innerHTML = cats.map(function (c) {
      return '<span class="shop-chip">' + CAT_LABELS[c] + '<button data-remove-cat="' + c + '" aria-label="Remove filter"><i class="bi bi-x"></i></button></span>';
    }).join('') + (term ? '<span class="shop-chip">"' + term + '"<button data-remove-search><i class="bi bi-x"></i></button></span>' : '');

    chipsRow.querySelectorAll('[data-remove-cat]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var val = btn.getAttribute('data-remove-cat');
        catInputs.forEach(function (i) { if (i.value === val) i.checked = false; });
        render();
      });
    });
    var removeSearch = chipsRow.querySelector('[data-remove-search]');
    if (removeSearch) removeSearch.addEventListener('click', function () { searchInput.value = ''; render(); });
  }

  catInputs.forEach(function (i) { i.addEventListener('change', render); });
  searchInput.addEventListener('input', render);
  sortSelect.addEventListener('change', render);
  clearBtn.addEventListener('click', function () {
    catInputs.forEach(function (i) { i.checked = false; });
    searchInput.value = '';
    sortSelect.value = 'featured';
    render();
  });

  var params = new URLSearchParams(window.location.search);
  if (params.get('cat')) {
    catInputs.forEach(function (i) { if (i.value === params.get('cat')) i.checked = true; });
  }
  if (params.get('q')) searchInput.value = params.get('q');

  var filterPanel = document.getElementById('filterPanel');
  var filterBackdrop = document.getElementById('filterBackdrop');
  document.querySelectorAll('[data-open-filter]').forEach(function (btn) {
    btn.addEventListener('click', function () { filterPanel.classList.add('open'); filterBackdrop.classList.add('show'); });
  });
  document.querySelectorAll('[data-close-filter]').forEach(function (btn) {
    btn.addEventListener('click', function () { filterPanel.classList.remove('open'); filterBackdrop.classList.remove('show'); });
  });

  render();
});
