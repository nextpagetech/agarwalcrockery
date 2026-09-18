/* Agarwal Crockery House — shared demo catalogue + cart store */
(function (global) {
  var L = global.AC_CATEGORY_LABELS || {};

  var PRODUCTS = [
    { id: 'p1', name: 'Commercial Buffet Catering Set', cat: 'catering-equipments', catLabel: L['catering-equipments'] || 'Catering Equipments', desc: 'Durable catering equipment built for high-volume events and banquets.', img: 'assets/img/catalog/p1.jpg', badge: 'NEW' },
    { id: 'p2', name: 'Commercial Dish Wash Rack Unit', cat: 'dish-wash-equipments', catLabel: L['dish-wash-equipments'] || 'Dish Wash Area Equipments', desc: 'Heavy-duty dish washing rack unit for fast-paced commercial kitchens.', img: 'assets/img/catalog/p2.jpg' },
    { id: 'p3', name: 'Stainless Steel Cooking Utensil Set', cat: 'cooking-utensils', catLabel: L['cooking-utensils'] || 'Cooking Utensils', desc: 'Restaurant-grade utensils built to withstand daily commercial cooking.', img: 'assets/img/catalog/p3.jpg' },
    { id: 'p4', name: 'Stainless Steel Preparation Table', cat: 'preparation', catLabel: L['preparation'] || 'Preparation', desc: 'Sturdy prep table with a hygienic work surface for commercial kitchens.', img: 'assets/img/catalog/p4.jpg' },
    { id: 'p5', name: 'Service &amp; Display Counter', cat: 'service-display-counter', catLabel: L['service-display-counter'] || 'Service and Display Counter', desc: 'Elegant display counter for service areas, cafes and buffet lines.', img: 'assets/img/catalog/p5.jpg', badge: 'NEW' },
    { id: 'p6', name: 'Stainless Steel Kitchen Trolley', cat: 'trolleys-racks-furniture', catLabel: L['trolleys-racks-furniture'] || 'Trolleys-Racks-Furniture', desc: 'Mobile trolley for efficient transport across commercial kitchen areas.', img: 'assets/img/catalog/p6.jpg' },
    { id: 'p7', name: 'Commercial Wash Area Sink Unit', cat: 'wash-area', catLabel: L['wash-area'] || 'Wash Area', desc: 'Heavy-duty sink unit designed for commercial wash area workflows.', img: 'assets/img/catalog/p7.jpg' },
    { id: 'p8', name: 'Electric Bain Marie, 4-Container', cat: 'bain-marie', catLabel: L['bain-marie'] || 'Bain Marie', desc: 'Reliable food-warming bain marie for buffet and catering service.', img: 'assets/img/catalog/p8.jpg', badge: 'NEW' },
    { id: 'p9', name: 'Commercial Convection Oven', cat: 'commercial-oven', catLabel: L['commercial-oven'] || 'Commercial Oven', desc: 'High-capacity oven built for consistent commercial baking and roasting.', img: 'assets/img/catalog/p9.jpg' },
    { id: 'p10', name: 'Heavy-Duty Commercial Mixer', cat: 'commercial-mixer', catLabel: L['commercial-mixer'] || 'Commercial Mixer', desc: 'Powerful mixer for high-volume dough, batter and food preparation.', img: 'assets/img/catalog/p10.jpg' },
    { id: 'p11', name: 'Stainless Steel Pedal Dustbin', cat: 'dustbins', catLabel: L['dustbins'] || 'Dustbins', desc: 'Durable pedal dustbin suited for commercial kitchens and service areas.', img: 'assets/img/catalog/p11.jpg' },
    { id: 'p12', name: 'Premium Porcelain Tableware Set', cat: 'tableware', catLabel: L['tableware'] || 'Tableware', desc: 'Elegant tableware collection crafted for professional dining service.', img: 'assets/img/catalog/p12.jpg', badge: 'NEW' },
    { id: 'p13', name: 'Stainless Steel Service Tray Set', cat: 'service-products', catLabel: L['service-products'] || 'Service Related Products', desc: 'Practical, polished service trays for restaurants and hospitality staff.', img: 'assets/img/catalog/p13.jpg' },
    { id: 'p14', name: 'Ivory Porcelain 24-Piece Dinner Set', cat: 'crockery', catLabel: L['crockery'] || 'Crockery', desc: 'Fine porcelain crockery with a soft ivory glaze, for everyday elegance.', img: 'assets/img/catalog/p14.jpg', badge: 'NEW' },
    { id: 'p15', name: 'Stainless Steel Cocktail Shaker Set', cat: 'bar-items', catLabel: L['bar-items'] || 'Bar Items', desc: 'Professional bar tools for crafting drinks with precision and style.', img: 'assets/img/catalog/p15.jpg' },
    { id: 'p16', name: 'Premium Stainless Steel Cutlery Set', cat: 'cutlery', catLabel: L['cutlery'] || 'Cutlery', desc: 'Weighted, polished cutlery built for daily restaurant and home use.', img: 'assets/img/catalog/p16.jpg' },
    { id: 'p17', name: 'Crystal-Cut Water Tumbler, Set of 6', cat: 'glassware', catLabel: L['glassware'] || 'Glassware', desc: 'Brilliant cut glass tumblers that catch the light at every table.', img: 'assets/img/catalog/p17.jpg', badge: 'NEW' },
    { id: 'p18', name: 'Commercial Waffle &amp; Cone Maker', cat: 'waffle-cone-maker', catLabel: L['waffle-cone-maker'] || 'Waffle & Cone Maker', desc: 'Reliable waffle and cone maker built for cafes and dessert counters.', img: 'assets/img/catalog/p18.jpg' }
  ];

  var CART_KEY = 'acrockery_cart';
  var ORDERS_KEY = 'acrockery_orders';

  function readCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; }
  }
  function writeCart(cart) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
    updateCartBadges();
  }
  function addToCart(productId, qty) {
    qty = qty || 1;
    var cart = readCart();
    var line = cart.find(function (l) { return l.id === productId; });
    if (line) { line.qty += qty; } else { cart.push({ id: productId, qty: qty }); }
    writeCart(cart);
  }
  function removeFromCart(productId) {
    writeCart(readCart().filter(function (l) { return l.id !== productId; }));
  }
  function setQty(productId, qty) {
    var cart = readCart();
    var line = cart.find(function (l) { return l.id === productId; });
    if (line) { line.qty = Math.max(1, qty); }
    writeCart(cart);
  }
  function cartCount() {
    return readCart().reduce(function (sum, l) { return sum + l.qty; }, 0);
  }
  function cartLines() {
    return readCart().map(function (l) {
      var p = PRODUCTS.find(function (p) { return p.id === l.id; });
      return p ? Object.assign({}, p, { qty: l.qty }) : null;
    }).filter(Boolean);
  }
  function clearCart() { writeCart([]); }

  function updateCartBadges() {
    var count = cartCount();
    document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = count; });
  }

  function readOrders() {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || seedOrders(); } catch (e) { return seedOrders(); }
  }
  function seedOrders() {
    var seeded = [
      { id: 'ACH-10231', date: '2026-09-02', status: 'paid', price: 84500, items: [PRODUCTS[7], PRODUCTS[13]].map(function(p){ return Object.assign({}, p, { qty: 1 }); }) },
      { id: 'ACH-10254', date: '2026-09-10', status: 'price-ready', price: 31200, items: [PRODUCTS[11]].map(function(p){ return Object.assign({}, p, { qty: 2 }); }) },
      { id: 'ACH-10267', date: '2026-09-16', status: 'pending', price: null, items: [PRODUCTS[16], PRODUCTS[8]].map(function(p){ return Object.assign({}, p, { qty: 1 }); }) }
    ];
    try { localStorage.setItem(ORDERS_KEY, JSON.stringify(seeded)); } catch (e) {}
    return seeded;
  }
  function placeOrder(items) {
    var orders = readOrders();
    var id = 'ACH-' + (10300 + orders.length + Math.floor(Math.random() * 90));
    var order = { id: id, date: new Date().toISOString().slice(0, 10), status: 'pending', price: null, items: items };
    orders.unshift(order);
    try { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); } catch (e) {}
    clearCart();
    return order;
  }
  function findOrder(id) {
    return readOrders().find(function (o) { return o.id === id; });
  }
  function markPaid(id) {
    var orders = readOrders();
    var o = orders.find(function (o) { return o.id === id; });
    if (o) o.status = 'paid';
    try { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', updateCartBadges);

  global.AC = {
    PRODUCTS: PRODUCTS,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    setQty: setQty,
    cartCount: cartCount,
    cartLines: cartLines,
    clearCart: clearCart,
    readOrders: readOrders,
    placeOrder: placeOrder,
    findOrder: findOrder,
    markPaid: markPaid,
    updateCartBadges: updateCartBadges
  };
})(window);
