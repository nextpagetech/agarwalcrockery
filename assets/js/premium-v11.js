(() => {
  const qs = (selector, context = document) => context.querySelector(selector);

  // Homepage-only signature merchandising section.
  const home = qs('.commerce-hero');
  const collections = qs('.premium-collections');
  if (home && collections && !qs('.v11-signature')) {
    const section = document.createElement('section');
    section.className = 'v11-signature';
    section.innerHTML = `
      <div class="container">
        <div class="v11-signature-grid">
          <a class="v11-signature-main" href="shop.html?cat=crockery">
            <img src="https://images.pexels.com/photos/6611480/pexels-photo-6611480.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="Premium hospitality crockery collection">
            <div class="v11-signature-copy">
              <span>THE AGARWAL EDIT</span>
              <h2>A more considered way to build the table.</h2>
              <p>Explore coordinated commercial crockery designed for restaurants, hotels, banquets and institutional service.</p>
              <b>Explore the crockery edit <i class="bi bi-arrow-right"></i></b>
            </div>
          </a>
          <div class="v11-signature-side">
            <div class="v11-signature-side-head">
              <span>CURATED BUSINESS RANGES</span>
              <h3>From table service to complete hospitality supply.</h3>
              <p>Use the catalogue by product type, or move directly into the service range your business needs.</p>
            </div>
            <a class="v11-signature-mini" href="shop.html?cat=glassware">
              <img src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=88" alt="Commercial hospitality glassware">
              <div><small>BEVERAGE SERVICE</small><h4>Glassware for daily commercial use.</h4><b>Shop glassware <i class="bi bi-arrow-right"></i></b></div>
            </a>
            <a class="v11-signature-mini" href="shop.html?cat=catering">
              <img src="https://images.pexels.com/photos/28271468/pexels-photo-28271468.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Commercial serving and buffet collection">
              <div><small>BUFFET & SERVICE</small><h4>Presentation pieces built for volume.</h4><b>Explore buffetware <i class="bi bi-arrow-right"></i></b></div>
            </a>
          </div>
        </div>
      </div>`;
    collections.insertAdjacentElement('afterend', section);
  }
})();
