document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('#siteHeader');
  const syncHeader = () => header?.classList.toggle('scrolled', window.scrollY > 16);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  const revealItems = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('show'));
  }

  document.querySelectorAll('.heart-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      button.classList.toggle('active');
      const icon = button.querySelector('i');
      if (icon) {
        icon.classList.toggle('bi-heart');
        icon.classList.toggle('bi-heart-fill');
      }
    });
  });

  const homeTabs = [...document.querySelectorAll('[data-home-filter]')];
  const homeProducts = [...document.querySelectorAll('[data-home-product]')];
  homeTabs.forEach((tab) => tab.addEventListener('click', () => {
    homeTabs.forEach((item) => item.classList.remove('active'));
    tab.classList.add('active');
    const category = tab.dataset.homeFilter;
    homeProducts.forEach((product) => {
      product.style.display = category === 'all' || product.dataset.category === category ? '' : 'none';
    });
  }));

  const industryImage = document.querySelector('#industryImage');
  const industryButtons = [...document.querySelectorAll('.industry-switch')];
  industryButtons.forEach((button) => {
    const activate = () => {
      industryButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      if (!industryImage || !button.dataset.industryImg) return;
      industryImage.style.opacity = '0';
      setTimeout(() => {
        industryImage.src = button.dataset.industryImg;
        industryImage.style.opacity = '1';
      }, 140);
    };
    button.addEventListener('mouseenter', activate);
    button.addEventListener('focus', activate);
    button.addEventListener('click', activate);
  });

  const productCards = [...document.querySelectorAll('.product-wrap')];
  const resultCount = document.querySelector('#resultCount');
  const emptyState = document.querySelector('#emptyState');
  const desktopSearch = document.querySelector('#productSearch');
  const mobileSearch = document.querySelector('#productSearchMobile');
  const categoryButtons = [...document.querySelectorAll('.shop-cat-v5[data-filter]')];
  const categoryRadios = [...document.querySelectorAll('input[type="radio"][value]')];
  const filterLinks = [...document.querySelectorAll('[data-filter-link]')];
  const sortSelect = document.querySelector('#sortProducts');
  const grid = document.querySelector('#productGrid');
  let activeCategory = 'all';
  let searchTerm = '';

  function applyShopFilters() {
    if (!productCards.length) return;
    let visible = 0;
    productCards.forEach((card) => {
      const text = (card.dataset.product || '').toLowerCase();
      const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
      const matchesSearch = !searchTerm || text.includes(searchTerm);
      const show = matchesCategory && matchesSearch;
      card.classList.toggle('d-none', !show);
      if (show) visible += 1;
    });
    if (resultCount) resultCount.textContent = `${visible} product${visible === 1 ? '' : 's'}`;
    emptyState?.classList.toggle('d-none', visible !== 0);
  }

  function setCategory(category) {
    activeCategory = category || 'all';
    categoryButtons.forEach((button) => button.classList.toggle('active', button.dataset.filter === activeCategory));
    categoryRadios.forEach((radio) => { radio.checked = radio.value === activeCategory; });
    applyShopFilters();
  }

  categoryButtons.forEach((button) => button.addEventListener('click', () => setCategory(button.dataset.filter)));
  categoryRadios.forEach((radio) => radio.addEventListener('change', () => { if (radio.checked) setCategory(radio.value); }));
  filterLinks.forEach((link) => link.addEventListener('click', (event) => {
    if (!productCards.length) return;
    event.preventDefault();
    setCategory(link.dataset.filterLink);
    document.querySelector('.shop-catalog-v5')?.scrollIntoView({ behavior: 'smooth' });
  }));

  function syncSearch(value, source) {
    searchTerm = value.trim().toLowerCase();
    if (desktopSearch && source !== desktopSearch) desktopSearch.value = value;
    if (mobileSearch && source !== mobileSearch) mobileSearch.value = value;
    applyShopFilters();
  }
  desktopSearch?.addEventListener('input', () => syncSearch(desktopSearch.value, desktopSearch));
  mobileSearch?.addEventListener('input', () => syncSearch(mobileSearch.value, mobileSearch));

  sortSelect?.addEventListener('change', () => {
    if (!grid) return;
    const items = [...productCards];
    if (sortSelect.value === 'az') items.sort((a, b) => (a.dataset.name || '').localeCompare(b.dataset.name || ''));
    if (sortSelect.value === 'za') items.sort((a, b) => (b.dataset.name || '').localeCompare(a.dataset.name || ''));
    items.forEach((item) => grid.appendChild(item));
  });

  document.querySelector('[data-clear-filters]')?.addEventListener('click', () => {
    setCategory('all');
    syncSearch('', null);
  });

  if (productCards.length) {
    const categoryFromUrl = new URLSearchParams(window.location.search).get('cat');
    if (categoryFromUrl) setCategory(categoryFromUrl);
  }

  document.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-view]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      grid?.classList.toggle('list-view', button.dataset.view === 'list');
    });
  });

  const quickViewElement = document.querySelector('#quickViewModal');
  const quickView = quickViewElement && window.bootstrap ? new bootstrap.Modal(quickViewElement) : null;
  document.querySelectorAll('[data-quick-view]').forEach((button) => {
    button.addEventListener('click', () => {
      const title = document.querySelector('#quickTitle');
      const copy = document.querySelector('#quickCopy');
      const image = document.querySelector('#quickImage');
      if (title) title.textContent = button.dataset.title || '';
      if (copy) copy.textContent = button.dataset.copy || '';
      if (image) image.src = button.dataset.image || '';
      quickView?.show();
    });
  });

  let cartCount = 0;
  const countNodes = [...document.querySelectorAll('[data-cart-count]')];
  const cartItems = document.querySelector('[data-cart-items]');
  const toastElement = document.querySelector('#cartToast');
  const toast = toastElement && window.bootstrap ? bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 1700 }) : null;

  document.querySelectorAll('[data-add]').forEach((button) => {
    button.addEventListener('click', () => {
      cartCount += 1;
      countNodes.forEach((node) => { node.textContent = cartCount; });
      const title = button.closest('article')?.querySelector('h3')?.textContent || document.querySelector('#quickTitle')?.textContent || 'Selected product';
      if (cartItems) {
        if (cartCount === 1) cartItems.innerHTML = '';
        const item = document.createElement('div');
        item.className = 'cart-item-v5';
        item.innerHTML = `<div><strong>${title}</strong><small>Qty 1 · Price after review</small></div>`;
        cartItems.appendChild(item);
      }
      toast?.show();
    });
  });
});
