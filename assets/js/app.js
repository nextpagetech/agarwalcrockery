document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('#siteHeader');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const reveals = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    reveals.forEach((item) => observer.observe(item));
  } else {
    reveals.forEach((item) => item.classList.add('show'));
  }

  document.querySelectorAll('.heart-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      button.classList.toggle('active');
      const icon = button.querySelector('i');
      if (!icon) return;
      icon.classList.toggle('bi-heart');
      icon.classList.toggle('bi-heart-fill');
    });
  });

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

  const productCards = [...document.querySelectorAll('.product-wrap')];
  const resultCount = document.querySelector('#resultCount');
  const emptyState = document.querySelector('#emptyState');
  const desktopSearch = document.querySelector('#productSearch');
  const mobileSearch = document.querySelector('#productSearchMobile');
  const categoryButtons = [...document.querySelectorAll('.shop-cat-v4[data-filter]')];
  const categoryRadios = [...document.querySelectorAll('input[type="radio"][value]')];
  const filterLinks = [...document.querySelectorAll('[data-filter-link]')];
  const sortSelect = document.querySelector('#sortProducts');
  const grid = document.querySelector('#productGrid');

  let activeCategory = 'all';
  let searchTerm = '';

  const applyFilters = () => {
    if (!productCards.length) return;
    let visible = 0;
    productCards.forEach((card) => {
      const text = (card.dataset.product || '').toLowerCase();
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
    applyFilters();
  };

  categoryButtons.forEach((button) => button.addEventListener('click', () => setCategory(button.dataset.filter)));
  categoryRadios.forEach((radio) => radio.addEventListener('change', () => { if (radio.checked) setCategory(radio.value); }));
  filterLinks.forEach((link) => link.addEventListener('click', (event) => {
    if (!productCards.length) return;
    event.preventDefault();
    setCategory(link.dataset.filterLink || 'all');
    document.querySelector('.shop-catalog-v4')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  const syncSearch = (value, source) => {
    searchTerm = value.trim().toLowerCase();
    if (desktopSearch && source !== desktopSearch) desktopSearch.value = value;
    if (mobileSearch && source !== mobileSearch) mobileSearch.value = value;
    applyFilters();
  };

  desktopSearch?.addEventListener('input', () => syncSearch(desktopSearch.value, desktopSearch));
  mobileSearch?.addEventListener('input', () => syncSearch(mobileSearch.value, mobileSearch));

  document.querySelector('[data-clear-filters]')?.addEventListener('click', () => {
    setCategory('all');
    syncSearch('', null);
  });

  if (productCards.length) {
    const categoryFromUrl = new URLSearchParams(window.location.search).get('cat');
    if (categoryFromUrl) setCategory(categoryFromUrl);
  }

  sortSelect?.addEventListener('change', () => {
    if (!grid) return;
    const cards = [...productCards];
    if (sortSelect.value === 'az') cards.sort((a, b) => (a.dataset.name || '').localeCompare(b.dataset.name || ''));
    if (sortSelect.value === 'za') cards.sort((a, b) => (b.dataset.name || '').localeCompare(a.dataset.name || ''));
    cards.forEach((card) => grid.appendChild(card));
  });

  document.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-view]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      grid?.classList.toggle('list-view', button.dataset.view === 'list');
    });
  });

  const quickViewElement = document.querySelector('#quickViewModal');
  const quickViewModal = quickViewElement && window.bootstrap ? new bootstrap.Modal(quickViewElement) : null;
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

  let cartCount = 0;
  const cartCountNodes = [...document.querySelectorAll('[data-cart-count]')];
  const cartItems = document.querySelector('[data-cart-items]');
  const toastElement = document.querySelector('#cartToast');
  const toast = toastElement && window.bootstrap ? bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 1700 }) : null;

  const updateCartCount = () => cartCountNodes.forEach((node) => { node.textContent = cartCount; });
  const getProductName = (button) => button.closest('article')?.querySelector('h3')?.textContent || document.querySelector('#quickTitle')?.textContent || 'Selected product';

  document.querySelectorAll('[data-add]').forEach((button) => {
    button.addEventListener('click', () => {
      cartCount += 1;
      updateCartCount();
      const name = getProductName(button);
      if (cartItems) {
        if (cartCount === 1) cartItems.innerHTML = '';
        const item = document.createElement('div');
        item.className = 'cart-item-v4';
        item.innerHTML = `<span><i class="bi bi-box"></i></span><div><strong>${name}</strong><small>Qty 1 · Price after review</small></div>`;
        cartItems.appendChild(item);
      }
      const icon = button.querySelector('i');
      if (icon) {
        const previous = icon.className;
        icon.className = 'bi bi-check2';
        setTimeout(() => { icon.className = previous; }, 1100);
      }
      toast?.show();
    });
  });
});