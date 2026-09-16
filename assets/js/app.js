document.addEventListener('DOMContentLoaded', () => {
  // Scroll reveal
  const revealItems = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('show'));
  }

  // Wishlist interaction
  document.querySelectorAll('.wishlist-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      button.classList.toggle('active');
      const icon = button.querySelector('i');
      icon?.classList.toggle('bi-heart');
      icon?.classList.toggle('bi-heart-fill');
    });
  });

  // Home featured product tabs
  const homeTabs = [...document.querySelectorAll('[data-home-filter]')];
  const homeProducts = [...document.querySelectorAll('[data-home-product]')];
  homeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      homeTabs.forEach((item) => item.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.dataset.homeFilter;
      homeProducts.forEach((product) => {
        product.style.display = category === 'all' || product.dataset.category === category ? '' : 'none';
      });
    });
  });

  // Shop filters, search and sorting
  const productCards = [...document.querySelectorAll('.product-wrap')];
  const resultCount = document.querySelector('#resultCount');
  const emptyState = document.querySelector('#emptyState');
  const desktopSearch = document.querySelector('#productSearch');
  const mobileSearch = document.querySelector('#productSearchMobile');
  const shopCategoryButtons = [...document.querySelectorAll('.shop-category-card[data-filter]')];
  const categoryRadios = [...document.querySelectorAll('input[type="radio"][value]')];
  const filterLinks = [...document.querySelectorAll('[data-filter-link]')];
  const sortSelect = document.querySelector('#sortProducts');
  const grid = document.querySelector('#productGrid');
  let activeCategory = 'all';
  let searchTerm = '';

  const setActiveCategory = (category) => {
    activeCategory = category || 'all';
    shopCategoryButtons.forEach((button) => button.classList.toggle('active', button.dataset.filter === activeCategory));
    categoryRadios.forEach((radio) => { radio.checked = radio.value === activeCategory; });
    applyShopFilters();
  };

  const applyShopFilters = () => {
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
  };

  shopCategoryButtons.forEach((button) => button.addEventListener('click', () => setActiveCategory(button.dataset.filter)));
  categoryRadios.forEach((radio) => radio.addEventListener('change', () => { if (radio.checked) setActiveCategory(radio.value); }));
  filterLinks.forEach((link) => link.addEventListener('click', (event) => {
    if (!productCards.length) return;
    event.preventDefault();
    setActiveCategory(link.dataset.filterLink);
    window.scrollTo({ top: document.querySelector('.shop-catalog')?.offsetTop - 100 || 0, behavior: 'smooth' });
  }));

  const syncSearch = (value, source) => {
    searchTerm = value.trim().toLowerCase();
    if (source !== desktopSearch && desktopSearch) desktopSearch.value = value;
    if (source !== mobileSearch && mobileSearch) mobileSearch.value = value;
    applyShopFilters();
  };
  desktopSearch?.addEventListener('input', () => syncSearch(desktopSearch.value, desktopSearch));
  mobileSearch?.addEventListener('input', () => syncSearch(mobileSearch.value, mobileSearch));

  sortSelect?.addEventListener('change', () => {
    if (!grid) return;
    const products = [...productCards];
    if (sortSelect.value === 'az') products.sort((a, b) => (a.dataset.name || '').localeCompare(b.dataset.name || ''));
    if (sortSelect.value === 'za') products.sort((a, b) => (b.dataset.name || '').localeCompare(a.dataset.name || ''));
    products.forEach((product) => grid.appendChild(product));
  });

  document.querySelector('[data-clear-filters]')?.addEventListener('click', () => {
    setActiveCategory('all');
    syncSearch('', null);
  });

  // Read ?cat= from URLs
  if (productCards.length) {
    const categoryFromUrl = new URLSearchParams(window.location.search).get('cat');
    if (categoryFromUrl) setActiveCategory(categoryFromUrl);
  }

  // Grid/list view
  document.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-view]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      grid?.classList.toggle('list-view', button.dataset.view === 'list');
    });
  });

  // Quick view modal
  const quickViewModalElement = document.querySelector('#quickViewModal');
  const quickViewModal = quickViewModalElement && window.bootstrap ? new bootstrap.Modal(quickViewModalElement) : null;
  document.querySelectorAll('[data-quick-view]').forEach((button) => {
    button.addEventListener('click', () => {
      const title = document.querySelector('#quickTitle');
      const copy = document.querySelector('#quickCopy');
      const image = document.querySelector('#quickImage');
      if (title) title.textContent = button.dataset.title || '';
      if (copy) copy.textContent = button.dataset.copy || '';
      if (image) image.src = button.dataset.image || '';
      quickViewModal?.show();
    });
  });

  // Cart interaction
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
        item.innerHTML = `<div class="cart-item-image"><i class="bi bi-box"></i></div><div><strong>${title}</strong><small>Qty 1 · Price after review</small></div>`;
        cartItemsNode.appendChild(item);
      }
      const icon = button.querySelector('i');
      if (icon) {
        const previous = icon.className;
        icon.className = 'bi bi-check2';
        setTimeout(() => { icon.className = previous; }, 1200);
      }
      cartToast?.show();
    });
  });
});
