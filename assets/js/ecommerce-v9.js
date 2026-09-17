document.addEventListener('DOMContentLoaded', () => {
  const ensureStylesheet = (href) => {
    if ([...document.querySelectorAll('link[rel="stylesheet"]')].some((link) => link.getAttribute('href') === href)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };

  ensureStylesheet('assets/css/premium-overrides.css');
  ensureStylesheet('assets/css/premium-v10.css');
  ensureStylesheet('assets/css/hero-fix-v10.css');

  const qs = (selector, context = document) => context.querySelector(selector);
  const qsa = (selector, context = document) => [...context.querySelectorAll(selector)];

  // Repair the hero promo markup. The original HTML used nested anchors inside
  // promo tiles, which browsers auto-correct differently and can push the promo
  // copy over the main hero text. Rebuilding this small block guarantees valid DOM.
  const heroSide = qs('.hero-side');
  if (heroSide) {
    heroSide.innerHTML = `
      <a class="promo-tile" href="shop.html?cat=crockery">
        <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1000&q=86" alt="Crockery collection">
        <div class="promo-copy">
          <span>CROCKERY</span>
          <h3>Dinnerware for professional service</h3>
          <b class="promo-link">Shop crockery <i class="bi bi-arrow-right"></i></b>
        </div>
      </a>
      <a class="promo-tile" href="shop.html?cat=glassware">
        <img src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1000&q=86" alt="Hospitality glassware">
        <div class="promo-copy">
          <span>GLASSWARE</span>
          <h3>Built for everyday hospitality use</h3>
          <b class="promo-link">Shop glassware <i class="bi bi-arrow-right"></i></b>
        </div>
      </a>`;
  }

  const premiumFooterMarkup = `
    <div class="container premium-footer-top">
      <div class="premium-footer-top-grid">
        <div class="premium-footer-brand">
          <div class="premium-footer-logo"><img src="assets/img/logo.svg" alt="Agarwal Crockery House"></div>
          <div>
            <h3>Everything your hospitality business needs, in one buying journey.</h3>
            <p>Shop crockery, glassware, buffetware and commercial kitchen essentials, or share a complete kitchen requirement with Agarwal.</p>
          </div>
        </div>
        <div class="premium-footer-action">
          <a href="shop.html">
            <div><small>START SOURCING</small>Explore the complete catalogue</div>
            <i class="bi bi-arrow-up-right"></i>
          </a>
        </div>
      </div>
    </div>
    <div class="container premium-footer-main">
      <div class="premium-footer-note">
        <span>AGARWAL CROCKERY HOUSE</span>
        <p>A B2B hospitality store built for restaurants, hotels, cafes, institutions and commercial kitchens.</p>
        <div class="premium-footer-mini"><b>Private Pricing</b><b>Business Orders</b><b>Repeat Buying</b></div>
      </div>
      <div class="premium-footer-col">
        <span>SHOP</span>
        <a href="shop.html">All Products</a>
        <a href="shop.html?cat=crockery">Crockery</a>
        <a href="shop.html?cat=glassware">Glassware</a>
        <a href="shop.html?cat=catering">Buffet & Catering</a>
        <a href="shop.html?cat=equipment">Kitchen Equipment</a>
      </div>
      <div class="premium-footer-col">
        <span>ACCOUNT</span>
        <a href="login.html">Login</a>
        <a href="register.html">Create Account</a>
        <a href="orders.html">My Orders</a>
        <a href="cart.html">Order Basket</a>
      </div>
      <div class="premium-footer-col">
        <span>BUSINESS</span>
        <a href="index.html#project">Complete Kitchen Projects</a>
        <a href="checkout.html">Submit an Order</a>
        <a href="index.html#why">Why Agarwal</a>
        <a href="orders.html">Order Support</a>
      </div>
    </div>
    <div class="container premium-footer-bottom">
      <span>© 2026 Agarwal Crockery House</span>
      <div><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Shipping</a><a href="#">Returns</a></div>
    </div>`;

  const footer = qs('.site-footer');
  if (footer) {
    footer.className = 'premium-footer';
    footer.innerHTML = premiumFooterMarkup;
  }

  // Add a premium collection-led commerce section only to the homepage.
  const homeHero = qs('.commerce-hero');
  const popularSection = qs('.section-soft .product-grid')?.closest('.section');
  if (homeHero && popularSection && !qs('.premium-collections')) {
    const collections = document.createElement('section');
    collections.className = 'premium-collections';
    collections.innerHTML = `
      <div class="container">
        <div class="premium-collections-head">
          <div><span>CURATED FOR HOSPITALITY</span><h2>Shop by the way your space serves.</h2></div>
          <p>Move from individual products to complete table-service and hospitality collections designed around real business use.</p>
        </div>
        <div class="premium-collection-grid">
          <a class="premium-collection-card" href="shop.html?cat=crockery">
            <img src="https://images.pexels.com/photos/6611480/pexels-photo-6611480.jpeg?auto=compress&cs=tinysrgb&w=1500" alt="Restaurant crockery collection">
            <div class="premium-collection-copy"><span>RESTAURANT TABLE SERVICE</span><h3>Build a coordinated crockery range.</h3><p>Plates, bowls, cups and serving pieces for daily commercial service.</p><b>Shop crockery <i class="bi bi-arrow-right"></i></b></div>
          </a>
          <a class="premium-collection-card" href="shop.html?cat=catering">
            <img src="https://images.pexels.com/photos/28271468/pexels-photo-28271468.jpeg?auto=compress&cs=tinysrgb&w=1100" alt="Buffet and serving collection">
            <div class="premium-collection-copy"><span>BUFFET & BANQUET</span><h3>Presentation built for volume.</h3><p>Service and display pieces for buffet, banquet and catering use.</p><b>Explore buffetware <i class="bi bi-arrow-right"></i></b></div>
          </a>
          <a class="premium-collection-card" href="shop.html?cat=glassware">
            <img src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1100&q=86" alt="Hospitality glassware collection">
            <div class="premium-collection-copy"><span>BEVERAGE SERVICE</span><h3>Glassware for everyday hospitality.</h3><p>Practical beverageware for restaurants, hotels and events.</p><b>Shop glassware <i class="bi bi-arrow-right"></i></b></div>
          </a>
        </div>
      </div>`;
    popularSection.insertAdjacentElement('afterend', collections);
  }

  const whySection = qs('#why');
  if (whySection && !qs('.premium-buyer-section')) {
    const buyerSection = document.createElement('section');
    buyerSection.className = 'premium-buyer-section';
    buyerSection.id = 'why';
    buyerSection.innerHTML = `
      <div class="container">
        <div class="premium-buyer-head">
          <div><span>BUILT FOR BUSINESS BUYERS</span><h2>Premium buying experience. Practical business workflow.</h2></div>
          <p>Direct buyers can shop immediately. Procurement teams can submit formal requirements. Repeat customers can return to My Orders, review private pricing and reorder without starting again.</p>
        </div>
        <div class="premium-buyer-grid">
          <article><i class="bi bi-search"></i><h3>Find products faster</h3><p>Search by category, product type and business requirement without browsing long supplier lists.</p></article>
          <article><i class="bi bi-lock"></i><h3>Private business pricing</h3><p>Build the order first. Agarwal reviews the requirement and confirms pricing before payment.</p></article>
          <article><i class="bi bi-receipt"></i><h3>Formal order history</h3><p>Track submitted requirements, reviewed pricing and completed orders from one account.</p></article>
          <article><i class="bi bi-arrow-repeat"></i><h3>Repeat ordering</h3><p>Returning buyers can use previous orders as a faster starting point for the next requirement.</p></article>
        </div>
      </div>`;
    whySection.replaceWith(buyerSection);
  }

  const CART_KEY = 'agarwalPrototypeCartCount';
  const getCount = () => Number(localStorage.getItem(CART_KEY) || 0);
  const setCount = (count) => {
    localStorage.setItem(CART_KEY, String(count));
    qsa('[data-cart-count]').forEach((node) => { node.textContent = count; });
  };
  setCount(getCount());

  const toast = qs('#commerceToast');
  let toastTimer;
  const showToast = (text = 'Added to your order') => {
    if (!toast) return;
    const label = qs('[data-toast-text]', toast);
    if (label) label.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  };

  qsa('[data-add-order]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      setCount(getCount() + 1);
      const previous = button.innerHTML;
      button.innerHTML = '<i class="bi bi-check2"></i> Added';
      button.disabled = true;
      showToast();
      setTimeout(() => {
        button.innerHTML = previous;
        button.disabled = false;
      }, 1000);
    });
  });

  qsa('[data-wish]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      button.classList.toggle('active');
      const icon = qs('i', button);
      if (icon) icon.className = button.classList.contains('active') ? 'bi bi-heart-fill' : 'bi bi-heart';
    });
  });

  qsa('[data-product-link]').forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('button')) return;
      window.location.href = 'product.html';
    });
  });

  const shopGrid = qs('#shopProductGrid');
  const cards = qsa('.product-card[data-category]', shopGrid || document);
  const categoryButtons = qsa('[data-shop-category]');
  const search = qs('#shopSearch');
  const sort = qs('#shopSort');
  const result = qs('#shopResultCount');
  const empty = qs('#shopEmpty');
  let activeCategory = 'all';
  let searchTerm = '';

  const applyFilters = () => {
    let visible = 0;
    cards.forEach((card) => {
      const categoryMatches = activeCategory === 'all' || card.dataset.category === activeCategory;
      const text = (card.dataset.search || card.innerText).toLowerCase();
      const searchMatches = !searchTerm || text.includes(searchTerm);
      const show = categoryMatches && searchMatches;
      card.style.display = show ? '' : 'none';
      if (show) visible += 1;
    });
    if (result) result.textContent = `${visible} product${visible === 1 ? '' : 's'}`;
    if (empty) empty.style.display = visible ? 'none' : 'block';
  };

  const setCategory = (category) => {
    activeCategory = category || 'all';
    categoryButtons.forEach((button) => button.classList.toggle('active', button.dataset.shopCategory === activeCategory));
    qsa('input[name="categoryFilter"]').forEach((radio) => { radio.checked = radio.value === activeCategory; });
    applyFilters();
  };

  categoryButtons.forEach((button) => button.addEventListener('click', () => setCategory(button.dataset.shopCategory)));
  qsa('input[name="categoryFilter"]').forEach((radio) => radio.addEventListener('change', () => { if (radio.checked) setCategory(radio.value); }));
  search?.addEventListener('input', () => { searchTerm = search.value.trim().toLowerCase(); applyFilters(); });

  const params = new URLSearchParams(window.location.search);
  if (cards.length) {
    if (params.get('cat')) setCategory(params.get('cat'));
    if (params.get('q')) {
      searchTerm = params.get('q').toLowerCase();
      if (search) search.value = params.get('q');
      applyFilters();
    }
  }

  sort?.addEventListener('change', () => {
    if (!shopGrid) return;
    const sorted = [...cards];
    if (sort.value === 'az') sorted.sort((a, b) => (a.dataset.name || '').localeCompare(b.dataset.name || ''));
    if (sort.value === 'za') sorted.sort((a, b) => (b.dataset.name || '').localeCompare(a.dataset.name || ''));
    sorted.forEach((card) => shopGrid.appendChild(card));
  });

  qsa('[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
      qsa('[data-view]').forEach((node) => node.classList.remove('active'));
      button.classList.add('active');
      shopGrid?.classList.toggle('list-view', button.dataset.view === 'list');
    });
  });

  const quickModalElement = qs('#quickViewModal');
  const quickModal = quickModalElement && window.bootstrap ? new bootstrap.Modal(quickModalElement) : null;
  qsa('[data-quick]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const card = button.closest('.product-card');
      if (!card) return;
      const image = qs('#quickImage');
      const title = qs('#quickTitle');
      const copy = qs('#quickCopy');
      if (image) image.src = qs('.product-media img', card)?.src || '';
      if (title) title.textContent = qs('.product-title', card)?.textContent || '';
      if (copy) copy.textContent = qs('.product-sub', card)?.textContent || '';
      quickModal?.show();
    });
  });

  const mobileFilter = qs('#mobileFilter');
  qsa('[data-open-mobile-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      if (mobileFilter && window.bootstrap) bootstrap.Offcanvas.getOrCreateInstance(mobileFilter).show();
    });
  });
});
