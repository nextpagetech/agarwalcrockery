document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('#siteHeader');
  const syncHeader = () => header?.classList.toggle('scrolled', window.scrollY > 14);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  // Subtle reveal animation
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

  // Shop mega menu
  const megaMenu = document.querySelector('#megaMenu');
  const megaToggle = document.querySelector('[data-mega-toggle]');
  const closeMega = () => {
    megaMenu?.classList.remove('open');
    megaToggle?.classList.remove('active');
  };
  megaToggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    const open = megaMenu?.classList.toggle('open');
    megaToggle.classList.toggle('active', Boolean(open));
  });
  megaMenu?.addEventListener('click', (event) => event.stopPropagation());
  document.addEventListener('click', closeMega);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMega(); });

  // Search overlay
  const searchPanel = document.querySelector('#searchPanel');
  const openSearch = () => {
    if (!searchPanel) return;
    closeMega();
    searchPanel.classList.add('open');
    searchPanel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => searchPanel.querySelector('input')?.focus(), 80);
  };
  const closeSearch = () => {
    if (!searchPanel) return;
    searchPanel.classList.remove('open');
    searchPanel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  document.querySelectorAll('[data-search-toggle]').forEach((button) => button.addEventListener('click', openSearch));
  document.querySelectorAll('[data-search-close]').forEach((button) => button.addEventListener('click', closeSearch));
  searchPanel?.addEventListener('click', (event) => { if (event.target === searchPanel) closeSearch(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeSearch(); });

  // Interactive home category spotlight
  const categoryChoices = [...document.querySelectorAll('[data-category-spotlight]')];
  const categoryImage = document.querySelector('#categoryVisualImage');
  const categoryTitle = document.querySelector('#categoryVisualTitle');
  const categoryCopy = document.querySelector('#categoryVisualCopy');
  const categoryLink = document.querySelector('#categoryVisualLink');
  const activateSpotlight = (button) => {
    if (!button || !categoryImage) return;
    categoryChoices.forEach((item) => item.classList.toggle('active', item === button));
    categoryImage.style.opacity = '.25';
    window.setTimeout(() => {
      categoryImage.src = button.dataset.image || categoryImage.src;
      categoryImage.alt = button.dataset.title || '';
      if (categoryTitle) categoryTitle.textContent = button.dataset.title || '';
      if (categoryCopy) categoryCopy.textContent = button.dataset.copy || '';
      if (categoryLink) categoryLink.href = button.dataset.href || 'shop.html';
      categoryImage.style.opacity = '1';
    }, 140);
  };
  categoryChoices.forEach((button) => {
    button.addEventListener('mouseenter', () => activateSpotlight(button));
    button.addEventListener('focus', () => activateSpotlight(button));
    button.addEventListener('click', () => activateSpotlight(button));
  });

  // Wishlist
  document.querySelectorAll('.wishlist-button').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      button.classList.toggle('active');
      const icon = button.querySelector('i');
      icon?.classList.toggle('bi-heart');
      icon?.classList.toggle('bi-heart-fill');
    });
  });

  // Shop filtering, search and sorting
  const productCards = [...document.querySelectorAll('.product-wrap')];
  const resultCount = document.querySelector('#resultCount');
  const emptyState = document.querySelector('#emptyState');
  const productGrid = document.querySelector('#productGrid');
  const productSearch = document.querySelector('#productSearch');
  const globalSearchInput = document.querySelector('#globalSearchInput');
  const categoryButtons = [...document.querySelectorAll('.shop-category-pill[data-filter]')];
  const categoryRadios = [...document.querySelectorAll('input[name="categoryFilter"]')];
  const filterLinks = [...document.querySelectorAll('[data-filter-link]')];
  const sortSelect = document.querySelector('#sortProducts');
  let activeCategory = 'all';
  let searchTerm = '';

  const applyShopFilters = () => {
    if (!productCards.length) return;
    let visible = 0;
    productCards.forEach((card) => {
      const text = `${card.dataset.product || ''} ${card.dataset.name || ''}`.toLowerCase();
      const categoryMatch = activeCategory === 'all' || card.dataset.category === activeCategory;
      const searchMatch = !searchTerm || text.includes(searchTerm);
      const show = categoryMatch && searchMatch;
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

  const setSearch = (value) => {
    searchTerm = (value || '').trim().toLowerCase();
    if (productSearch) productSearch.value = value || '';
    if (globalSearchInput) globalSearchInput.value = value || '';
    applyShopFilters();
  };

  categoryButtons.forEach((button) => button.addEventListener('click', () => setCategory(button.dataset.filter)));
  categoryRadios.forEach((radio) => radio.addEventListener('change', () => { if (radio.checked) setCategory(radio.value); }));
  filterLinks.forEach((link) => link.addEventListener('click', (event) => {
    if (!productCards.length) return;
    event.preventDefault();
    setCategory(link.dataset.filterLink || 'all');
    closeMega();
    closeSearch();
    document.querySelector('.shop-catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  productSearch?.addEventListener('input', () => setSearch(productSearch.value));
  productSearch?.closest('form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    setSearch(productSearch.value);
    document.querySelector('.shop-catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  globalSearchInput?.addEventListener('input', () => { if (productCards.length) setSearch(globalSearchInput.value); });
  globalSearchInput?.closest('form')?.addEventListener('submit', (event) => {
    if (!productCards.length) return;
    event.preventDefault();
    setSearch(globalSearchInput.value);
    closeSearch();
    document.querySelector('.shop-catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  sortSelect?.addEventListener('change', () => {
    if (!productGrid) return;
    const sorted = [...productCards];
    if (sortSelect.value === 'az') sorted.sort((a, b) => (a.dataset.name || '').localeCompare(b.dataset.name || ''));
    if (sortSelect.value === 'za') sorted.sort((a, b) => (b.dataset.name || '').localeCompare(a.dataset.name || ''));
    sorted.forEach((card) => productGrid.appendChild(card));
  });

  if (productCards.length) {
    const params = new URLSearchParams(window.location.search);
    const categoryFromUrl = params.get('cat');
    const queryFromUrl = params.get('q');
    if (categoryFromUrl) setCategory(categoryFromUrl);
    if (queryFromUrl) setSearch(queryFromUrl);
  }

  // Grid / list switch
  document.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-view]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      productGrid?.classList.toggle('list-view', button.dataset.view === 'list');
    });
  });

  // Quick view
  const quickModalEl = document.querySelector('#quickViewModal');
  const quickModal = quickModalEl && window.bootstrap ? new bootstrap.Modal(quickModalEl) : null;
  document.querySelectorAll('[data-quick-view]').forEach((button) => {
    button.addEventListener('click', () => {
      const title = document.querySelector('#quickTitle');
      const image = document.querySelector('#quickImage');
      const copy = document.querySelector('#quickCopy');
      const spec = document.querySelector('#quickSpec');
      if (title) title.textContent = button.dataset.title || '';
      if (image) { image.src = button.dataset.image || ''; image.alt = button.dataset.title || 'Product'; }
      if (copy) copy.textContent = button.dataset.copy || '';
      if (spec) spec.textContent = button.dataset.spec || '';
      quickModal?.show();
    });
  });

  // Cart interaction
  let cartCount = 0;
  const cartCountNodes = [...document.querySelectorAll('[data-cart-count]')];
  const cartItems = document.querySelector('[data-cart-items]');
  const toastElement = document.querySelector('#cartToast');
  const cartToast = toastElement && window.bootstrap ? bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 1800 }) : null;
  const updateCartBadge = () => cartCountNodes.forEach((node) => { node.textContent = cartCount; });
  const productTitleForButton = (button) => button.closest('article')?.querySelector('h3')?.textContent || document.querySelector('#quickTitle')?.textContent || 'Selected product';

  document.querySelectorAll('[data-add]').forEach((button) => {
    button.addEventListener('click', () => {
      cartCount += 1;
      updateCartBadge();
      const title = productTitleForButton(button);
      if (cartItems) {
        if (cartCount === 1) cartItems.innerHTML = '';
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `<div class="cart-item-image"><i class="bi bi-box"></i></div><div><strong>${title}</strong><small>Qty 1 · Price after review</small></div>`;
        cartItems.appendChild(item);
      }
      const icon = button.querySelector('i');
      if (icon) {
        const previousClass = icon.className;
        icon.className = 'bi bi-check2';
        window.setTimeout(() => { icon.className = previousClass; }, 1100);
      }
      cartToast?.show();
    });
  });
});
