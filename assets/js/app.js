document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('#siteHeader');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 16);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Subtle reveal only; no large or distracting motion.
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

  // Wishlist.
  document.querySelectorAll('.wishlist-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      button.classList.toggle('active');
      const icon = button.querySelector('i');
      if (!icon) return;
      icon.classList.toggle('bi-heart');
      icon.classList.toggle('bi-heart-fill');
    });
  });

  // Homepage product tabs.
  const homeTabs = [...document.querySelectorAll('[data-home-filter]')];
  const homeProducts = [...document.querySelectorAll('[data-home-product]')];
  homeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      homeTabs.forEach((item) => item.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.dataset.homeFilter || 'all';
      homeProducts.forEach((product) => {
        product.style.display = category === 'all' || product.dataset.category === category ? '' : 'none';
      });
    });
  });

  // Shop catalogue.
  const productCards = [...document.querySelectorAll('.product-wrap')];
  const resultCount = document.querySelector('#resultCount');
  const emptyState = document.querySelector('#emptyState');
  const desktopSearch = document.querySelector('#productSearch');
  const mobileSearch = document.querySelector('#productSearchMobile');
  const categoryButtons = [...document.querySelectorAll('.shop-category[data-filter]')];
  const categoryRadios = [...document.querySelectorAll('input[type="radio"][value]')];
  const filterLinks = [...document.querySelectorAll('[data-filter-link]')];
  const sortSelect = document.querySelector('#sortProducts');
  const productGrid = document.querySelector('#productGrid');
  let activeCategory = 'all';
  let searchTerm = '';

  const applyShopFilters = () => {
    if (!productCards.length) return;
    let visible = 0;
    productCards.forEach((card) => {
      const productText = (card.dataset.product || '').toLowerCase();
      const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
      const matchesSearch = !searchTerm || productText.includes(searchTerm);
      const show = matchesCategory && matchesSearch;
      card.classList.toggle('d-none', !show);
      if (show) visible += 1;
    });
    if (resultCount) resultCount.textContent = `${visible} product${visible === 1 ? '' : 's'}`;
    emptyState?.classList.toggle('d-none', visible !== 0);
  };

  const setCategory = (category) => {
    activeCategory = category || 'all';
    categoryButtons.forEach((button) => button.classList.toggle('active', button.dataset.filter === activeCategory));
    categoryRadios.forEach((radio) => { radio.checked = radio.value === activeCategory; });
    applyShopFilters();
  };

  const setSearch = (value, source) => {
    searchTerm = (value || '').trim().toLowerCase();
    if (desktopSearch && source !== desktopSearch) desktopSearch.value = value || '';
    if (mobileSearch && source !== mobileSearch) mobileSearch.value = value || '';
    applyShopFilters();
  };

  categoryButtons.forEach((button) => button.addEventListener('click', () => setCategory(button.dataset.filter)));
  categoryRadios.forEach((radio) => radio.addEventListener('change', () => { if (radio.checked) setCategory(radio.value); }));
  filterLinks.forEach((link) => link.addEventListener('click', (event) => {
    if (!productCards.length) return;
    event.preventDefault();
    setCategory(link.dataset.filterLink);
    document.querySelector('.shop-catalog-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  desktopSearch?.addEventListener('input', () => setSearch(desktopSearch.value, desktopSearch));
  mobileSearch?.addEventListener('input', () => setSearch(mobileSearch.value, mobileSearch));

  document.querySelector('[data-clear-filters]')?.addEventListener('click', () => {
    setCategory('all');
    setSearch('', null);
  });

  if (productCards.length) {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('cat');
    const query = params.get('q');
    if (category) setCategory(category);
    if (query) setSearch(query, null);
  }

  sortSelect?.addEventListener('change', () => {
    if (!productGrid) return;
    const items = [...productCards];
    if (sortSelect.value === 'az') items.sort((a, b) => (a.dataset.name || '').localeCompare(b.dataset.name || ''));
    if (sortSelect.value === 'za') items.sort((a, b) => (b.dataset.name || '').localeCompare(a.dataset.name || ''));
    items.forEach((item) => productGrid.appendChild(item));
  });

  document.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-view]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      productGrid?.classList.toggle('list-view', button.dataset.view === 'list');
    });
  });

  // Quick view.
  const quickModalElement = document.querySelector('#quickViewModal');
  const quickModal = quickModalElement && window.bootstrap ? new bootstrap.Modal(quickModalElement) : null;
  document.querySelectorAll('[data-quick-view]').forEach((button) => {
    button.addEventListener('click', () => {
      const title = document.querySelector('#quickTitle');
      const copy = document.querySelector('#quickCopy');
      const image = document.querySelector('#quickImage');
      if (title) title.textContent = button.dataset.title || '';
      if (copy) copy.textContent = button.dataset.copy || '';
      if (image) image.src = button.dataset.image || '';
      quickModal?.show();
    });
  });

  // Cart/order interaction.
  let cartCount = 0;
  const cartCountNodes = [...document.querySelectorAll('[data-cart-count]')];
  const cartItemsNode = document.querySelector('[data-cart-items]');
  const toastElement = document.querySelector('#cartToast');
  const cartToast = toastElement && window.bootstrap ? bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 1800 }) : null;

  const updateCartCount = () => cartCountNodes.forEach((node) => { node.textContent = cartCount; });
  const getProductTitle = (button) => button.closest('article')?.querySelector('h3')?.textContent || document.querySelector('#quickTitle')?.textContent || 'Selected product';

  document.querySelectorAll('[data-add]').forEach((button) => {
    button.addEventListener('click', () => {
      cartCount += 1;
      updateCartCount();
      const title = getProductTitle(button);

      if (cartItemsNode) {
        if (cartCount === 1) cartItemsNode.innerHTML = '';
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `<div class="cart-item-icon"><i class="bi bi-box"></i></div><div><strong>${title}</strong><small>Qty 1 · Price after review</small></div>`;
        cartItemsNode.appendChild(item);
      }

      const icon = button.querySelector('i');
      if (icon) {
        const oldClass = icon.className;
        icon.className = 'bi bi-check2';
        window.setTimeout(() => { icon.className = oldClass; }, 1000);
      }
      cartToast?.show();
    });
  });
});
