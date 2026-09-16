document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('#siteHeader');
  const megaPanel = document.querySelector('#megaPanel');
  const megaToggle = document.querySelector('[data-mega-toggle]');
  const searchLayer = document.querySelector('#searchLayer');
  const searchToggles = [...document.querySelectorAll('[data-search-toggle]')];
  const searchCloses = [...document.querySelectorAll('[data-search-close]')];

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 14);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const closeMega = () => {
    megaPanel?.classList.remove('open');
    megaToggle?.classList.remove('active');
  };

  megaToggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    const open = megaPanel?.classList.toggle('open');
    megaToggle.classList.toggle('active', !!open);
  });

  document.addEventListener('click', (event) => {
    if (megaPanel?.classList.contains('open') && !megaPanel.contains(event.target) && !megaToggle?.contains(event.target)) closeMega();
  });

  const openSearch = () => {
    closeMega();
    searchLayer?.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchLayer?.querySelector('input')?.focus(), 120);
  };
  const closeSearch = () => {
    searchLayer?.classList.remove('open');
    document.body.style.overflow = '';
  };
  searchToggles.forEach((button) => button.addEventListener('click', openSearch));
  searchCloses.forEach((button) => button.addEventListener('click', closeSearch));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMega();
      closeSearch();
    }
  });

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

  const categoryControls = [...document.querySelectorAll('[data-category-control]')];
  const categoryStageImage = document.querySelector('#categoryStageImage');
  const categoryStageTitle = document.querySelector('#categoryStageTitle');
  const categoryStageCopy = document.querySelector('#categoryStageCopy');
  const categoryStageLink = document.querySelector('#categoryStageLink');

  const activateCategory = (button) => {
    if (!button) return;
    categoryControls.forEach((item) => item.classList.toggle('active', item === button));
    if (categoryStageImage) {
      categoryStageImage.style.opacity = '0';
      setTimeout(() => {
        categoryStageImage.src = button.dataset.image || categoryStageImage.src;
        categoryStageImage.alt = button.dataset.title || 'Agarwal category';
        categoryStageImage.style.opacity = '1';
      }, 160);
    }
    if (categoryStageTitle) categoryStageTitle.textContent = button.dataset.title || '';
    if (categoryStageCopy) categoryStageCopy.textContent = button.dataset.copy || '';
    if (categoryStageLink) categoryStageLink.href = button.dataset.link || 'shop.html';
  };
  categoryControls.forEach((button) => {
    button.addEventListener('click', () => activateCategory(button));
    button.addEventListener('mouseenter', () => activateCategory(button));
  });

  const industryButtons = [...document.querySelectorAll('[data-industry]')];
  const industryImage = document.querySelector('#industryImage');
  const industryCopy = document.querySelector('#industryCopy');
  const activateIndustry = (button) => {
    if (!button) return;
    industryButtons.forEach((item) => item.classList.toggle('active', item === button));
    if (industryImage) {
      industryImage.style.opacity = '0';
      setTimeout(() => {
        industryImage.src = button.dataset.image || industryImage.src;
        industryImage.alt = button.querySelector('b')?.textContent || 'Industry';
        industryImage.style.opacity = '1';
      }, 150);
    }
    if (industryCopy) industryCopy.textContent = button.dataset.copy || '';
  };
  industryButtons.forEach((button) => {
    button.addEventListener('mouseenter', () => activateIndustry(button));
    button.addEventListener('click', () => activateIndustry(button));
  });

  document.querySelectorAll('.wish-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      button.classList.toggle('active');
      const icon = button.querySelector('i');
      icon?.classList.toggle('bi-heart');
      icon?.classList.toggle('bi-heart-fill');
    });
  });

  const productCards = [...document.querySelectorAll('.product-wrap')];
  const categoryButtons = [...document.querySelectorAll('.shop-category[data-filter]')];
  const filterLinks = [...document.querySelectorAll('[data-filter-link]')];
  const drawerRadios = [...document.querySelectorAll('input[name="drawerCategory"]')];
  const productSearch = document.querySelector('#productSearch');
  const globalShopSearch = document.querySelector('#globalShopSearch');
  const resultCount = document.querySelector('#resultCount');
  const emptyState = document.querySelector('#emptyState');
  const sortSelect = document.querySelector('#sortProducts');
  const productGrid = document.querySelector('#productGrid');
  let activeCategory = 'all';
  let searchTerm = '';

  const applyFilters = () => {
    if (!productCards.length) return;
    let visible = 0;
    productCards.forEach((card) => {
      const categoryMatch = activeCategory === 'all' || card.dataset.category === activeCategory;
      const text = `${card.dataset.product || ''} ${card.dataset.name || ''}`.toLowerCase();
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
    drawerRadios.forEach((radio) => { radio.checked = radio.value === activeCategory; });
    applyFilters();
  };

  categoryButtons.forEach((button) => button.addEventListener('click', () => setCategory(button.dataset.filter)));
  drawerRadios.forEach((radio) => radio.addEventListener('change', () => { if (radio.checked) setCategory(radio.value); }));
  filterLinks.forEach((link) => link.addEventListener('click', (event) => {
    if (!productCards.length) return;
    event.preventDefault();
    setCategory(link.dataset.filterLink || 'all');
    closeMega();
    closeSearch();
    document.querySelector('.shop-catalogue')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  const syncSearch = (value) => {
    searchTerm = (value || '').trim().toLowerCase();
    if (productSearch && productSearch.value !== value) productSearch.value = value;
    if (globalShopSearch && globalShopSearch.value !== value) globalShopSearch.value = value;
    applyFilters();
  };
  productSearch?.addEventListener('input', () => syncSearch(productSearch.value));
  globalShopSearch?.addEventListener('input', () => syncSearch(globalShopSearch.value));

  if (productCards.length) {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('cat');
    const queryParam = params.get('q');
    if (categoryParam) setCategory(categoryParam);
    if (queryParam) syncSearch(queryParam);
  }

  sortSelect?.addEventListener('change', () => {
    if (!productGrid) return;
    const cards = [...productCards];
    if (sortSelect.value === 'az') cards.sort((a, b) => (a.dataset.name || '').localeCompare(b.dataset.name || ''));
    if (sortSelect.value === 'za') cards.sort((a, b) => (b.dataset.name || '').localeCompare(a.dataset.name || ''));
    cards.forEach((card) => productGrid.appendChild(card));
  });

  document.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-view]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      productGrid?.classList.toggle('list-view', button.dataset.view === 'list');
    });
  });

  const quickModalElement = document.querySelector('#quickViewModal');
  const quickModal = quickModalElement && window.bootstrap ? new bootstrap.Modal(quickModalElement) : null;
  document.querySelectorAll('[data-quick-view]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const title = document.querySelector('#quickTitle');
      const copy = document.querySelector('#quickCopy');
      const image = document.querySelector('#quickImage');
      const spec = document.querySelector('#quickSpec');
      if (title) title.textContent = button.dataset.title || '';
      if (copy) copy.textContent = button.dataset.copy || '';
      if (image) image.src = button.dataset.image || '';
      if (spec) spec.textContent = button.dataset.spec || '';
      quickModal?.show();
    });
  });

  let cartCount = 0;
  const cartCountNodes = [...document.querySelectorAll('[data-cart-count]')];
  const cartItemsNode = document.querySelector('[data-cart-items]');
  const toastElement = document.querySelector('#cartToast');
  const cartToast = toastElement && window.bootstrap ? bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 1800 }) : null;
  const updateCartCount = () => cartCountNodes.forEach((node) => { node.textContent = cartCount; });
  const getProductName = (button) => {
    const article = button.closest('[data-product-name], .product-wrap');
    return article?.dataset.productName || article?.dataset.name || article?.querySelector('h3')?.textContent || document.querySelector('#quickTitle')?.textContent || 'Selected product';
  };

  document.querySelectorAll('[data-add]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      cartCount += 1;
      updateCartCount();
      const title = getProductName(button);
      if (cartItemsNode) {
        if (cartCount === 1) cartItemsNode.innerHTML = '';
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `<div class="cart-item-image"><i class="bi bi-box"></i></div><div><strong>${title}</strong><small>Qty 1 · Private price after review</small></div>`;
        cartItemsNode.appendChild(item);
      }
      const icon = button.querySelector('i');
      if (icon) {
        const previous = icon.className;
        icon.className = 'bi bi-check2';
        setTimeout(() => { icon.className = previous; }, 1000);
      }
      cartToast?.show();
    });
  });

  // Connect the homepage and catalogue to the complete prototype journey.
  document.querySelectorAll('.header-icon[aria-label="Account"]').forEach((link) => {
    if (link.tagName === 'A') link.href = 'login.html';
  });

  document.querySelectorAll('.merch-info a, .catalogue-copy h3, .catalogue-media > img').forEach((node) => {
    if (node.tagName === 'A') {
      if (!node.getAttribute('href') || node.getAttribute('href') === '#') node.href = 'product.html';
    } else {
      node.style.cursor = 'pointer';
      node.addEventListener('click', (event) => {
        if (event.target.closest('button')) return;
        window.location.href = 'product.html';
      });
    }
  });

  document.querySelectorAll('.site-footer a, .mobile-menu a').forEach((link) => {
    const label = link.textContent.trim().toLowerCase();
    if (label === 'my orders') link.href = 'orders.html';
  });

  const mobileBody = document.querySelector('#mobileMenu .offcanvas-body');
  if (mobileBody && !mobileBody.querySelector('[data-commerce-mobile-links]')) {
    const commerceLinks = document.createElement('div');
    commerceLinks.dataset.commerceMobileLinks = 'true';
    commerceLinks.innerHTML = '<hr><a href="login.html">Login / Register</a><a href="cart.html">Order Basket</a><a href="orders.html">My Orders</a>';
    mobileBody.appendChild(commerceLinks);
  }

  const cartDrawerButton = document.querySelector('#cartDrawer .button-solid.w-100');
  if (cartDrawerButton) {
    cartDrawerButton.textContent = 'Review Order Basket';
    cartDrawerButton.addEventListener('click', () => { window.location.href = 'cart.html'; });
  }
});
