/* Builds and drives the category mega menu from window.AC_CATEGORIES */
document.addEventListener('DOMContentLoaded', function () {
  var wrap = document.getElementById('megaWrap');
  var btn = document.getElementById('megaBtn');
  var panel = document.getElementById('megaPanel');
  if (!wrap || !btn || !panel || !window.AC_CATEGORIES) return;

  var cats = window.AC_CATEGORIES;
  var mainCol = document.createElement('div');
  mainCol.className = 'mega-col-main';
  var subCol = document.createElement('div');
  subCol.className = 'mega-col-subs';

  var allLink = document.createElement('a');
  allLink.href = 'shop.html';
  allLink.className = 'mega-main-link all-link';
  allLink.innerHTML = 'All Products';
  mainCol.appendChild(allLink);

  function renderSubs(cat) {
    subCol.innerHTML = '';
    if (cat.subs.length) {
      var h = document.createElement('h4');
      h.textContent = cat.label;
      subCol.appendChild(h);
      cat.subs.forEach(function (s) {
        var a = document.createElement('a');
        a.href = 'shop.html?cat=' + s.id;
        a.className = 'mega-sub-link';
        a.textContent = s.label;
        subCol.appendChild(a);
      });
    } else {
      var h2 = document.createElement('h4');
      h2.textContent = cat.label;
      subCol.appendChild(h2);
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
    a.innerHTML = '<span>' + cat.label + '</span>' + (cat.subs.length ? '<i class="bi bi-chevron-right"></i>' : '');
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
