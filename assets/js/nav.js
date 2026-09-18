/* Builds and drives the category mega menu from window.AC_CATEGORIES */
document.addEventListener('DOMContentLoaded', function () {
  var wrap = document.getElementById('megaWrap');
  var btn = document.getElementById('megaBtn');
  var panel = document.getElementById('megaPanel');
  if (!wrap || !btn || !panel || !window.AC_CATEGORIES) return;

  var ICONS = {
    'kitchen-equipment': 'bi-grid-3x3-gap',
    'bain-marie': 'bi-cup-hot',
    'commercial-oven': 'bi-square',
    'commercial-mixer': 'bi-arrow-repeat',
    'dustbins': 'bi-trash3',
    'tableware': 'bi-circle',
    'service-products': 'bi-bell',
    'crockery': 'bi-circle-half',
    'bar-items': 'bi-cup-straw',
    'cutlery': 'bi-list',
    'glassware': 'bi-cup',
    'waffle-cone-maker': 'bi-grid'
  };

  var cats = window.AC_CATEGORIES;
  var mainCol = document.createElement('div');
  mainCol.className = 'mega-col-main';
  var subCol = document.createElement('div');
  subCol.className = 'mega-col-subs';

  var allLink = document.createElement('a');
  allLink.href = 'shop.html';
  allLink.className = 'mega-main-link all-link';
  allLink.innerHTML = '<span class="mega-icon"><i class="bi bi-shop"></i></span><span class="label">All Products</span>';
  mainCol.appendChild(allLink);

  function renderSubs(cat) {
    subCol.innerHTML = '';
    var h = document.createElement('h4');
    h.textContent = cat.label;
    subCol.appendChild(h);
    if (cat.subs.length) {
      cat.subs.forEach(function (s) {
        var a = document.createElement('a');
        a.href = 'shop.html?cat=' + s.id;
        a.className = 'mega-sub-link';
        a.textContent = s.label;
        subCol.appendChild(a);
      });
      var shopAll = document.createElement('a');
      shopAll.href = 'shop.html?cat=' + cat.id;
      shopAll.className = 'mega-shop-all';
      shopAll.innerHTML = 'Shop all ' + cat.label + ' <i class="bi bi-arrow-right"></i>';
      subCol.appendChild(shopAll);
    } else {
      var p = document.createElement('p');
      p.className = 'mega-empty';
      p.innerHTML = 'Browse the full ' + cat.label + ' range. <a href="shop.html?cat=' + cat.id + '">View products &rarr;</a>';
      subCol.appendChild(p);
    }
  }

  cats.forEach(function (cat, i) {
    var a = document.createElement('a');
    a.href = 'shop.html?cat=' + cat.id;
    a.className = 'mega-main-link';
    a.dataset.catIndex = i;
    a.innerHTML = '<span class="mega-icon"><i class="bi ' + (ICONS[cat.id] || 'bi-dot') + '"></i></span>' +
      '<span class="label">' + cat.label + '</span>' +
      (cat.subs.length ? '<i class="bi bi-chevron-right"></i>' : '');
    a.addEventListener('mouseenter', function () { setActive(i); });
    a.addEventListener('focus', function () { setActive(i); });
    mainCol.appendChild(a);
  });

  function setActive(i) {
    mainCol.querySelectorAll('.mega-main-link').forEach(function (el) { el.classList.remove('active'); });
    var active = mainCol.querySelector('[data-cat-index="' + i + '"]');
    if (active) active.classList.add('active');
    renderSubs(cats[i]);
  }

  panel.appendChild(mainCol);
  panel.appendChild(subCol);
  setActive(0);

  function openMenu() { wrap.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
  function closeMenu() { wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    wrap.classList.contains('open') ? closeMenu() : openMenu();
  });
  document.addEventListener('click', function (e) {
    if (!wrap.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
});
