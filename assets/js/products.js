/* Agarwal Crockery House — shared demo catalogue + cart store */
(function (global) {
  var PRODUCTS = [
    { id: 'p1', name: 'Ivory Porcelain 24-Piece Dinner Set', cat: 'dinner-sets', catLabel: 'Dinner Sets', desc: 'Fine porcelain dinnerware with a soft ivory glaze, crafted for everyday elegance.', img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=700&q=84', badge: 'NEW' },
    { id: 'p2', name: 'Terracotta Glaze Serving Bowl Set', cat: 'serveware', catLabel: 'Serveware', desc: 'Hand-finished serving bowls that bring warmth and texture to your table.', img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=84' },
    { id: 'p3', name: 'Crystal-Cut Water Tumbler, Set of 6', cat: 'glassware', catLabel: 'Glassware', desc: 'Brilliant cut glass tumblers that catch the light at every dinner table.', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=84', badge: 'NEW' },
    { id: 'p4', name: 'Festive Tableware Gift Box', cat: 'gifts', catLabel: 'Gift Collections', desc: 'A curated gift set of fine tableware, boxed and ready for gifting.', img: 'https://images.unsplash.com/photo-1746343365753-5ddd9f7f3994?auto=format&fit=crop&w=700&q=84' },
    { id: 'p5', name: 'Matte Stoneware Dinner Plates, Set of 6', cat: 'plates-bowls', catLabel: 'Plates & Bowls', desc: 'Understated matte stoneware plates that suit every kind of meal.', img: 'https://images.unsplash.com/photo-1584346133934-a3afd2a33c5b?auto=format&fit=crop&w=700&q=84' },
    { id: 'p6', name: 'Classic Steel Kitchen Storage Set', cat: 'kitchen', catLabel: 'Kitchen Items', desc: 'Durable stainless steel canisters for everyday kitchen organisation.', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=700&q=84' },
    { id: 'p7', name: 'Stemmed Wine Glass, Set of 4', cat: 'glassware', catLabel: 'Glassware', desc: 'Elegant stemware designed for both everyday use and special occasions.', img: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=700&q=84', badge: 'NEW' },
    { id: 'p8', name: 'Hand-Painted Ceramic Serving Platter', cat: 'serveware', catLabel: 'Serveware', desc: 'A statement platter with hand-painted detailing for festive serving.', img: 'https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?auto=format&fit=crop&w=700&q=84' },
    { id: 'p9', name: 'Royal Blue Porcelain Dinner Set, 32-Piece', cat: 'dinner-sets', catLabel: 'Dinner Sets', desc: 'A richly detailed dinner set for gatherings that deserve the best table.', img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=700&q=84' },
    { id: 'p10', name: 'Everyday Soup &amp; Cereal Bowls, Set of 6', cat: 'plates-bowls', catLabel: 'Plates & Bowls', desc: 'Versatile bowls sized for soups, cereal and everyday comfort food.', img: 'https://images.unsplash.com/photo-1591183384591-6dc933488cca?auto=format&fit=crop&w=700&q=84' },
    { id: 'p11', name: 'Copper Finish Kitchen Utensil Set', cat: 'kitchen', catLabel: 'Kitchen Items', desc: 'A striking copper-finish utensil set that upgrades daily cooking.', img: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=700&q=84' },
    { id: 'p12', name: 'Wedding Gift Hamper — Tableware Edition', cat: 'gifts', catLabel: 'Gift Collections', desc: 'A premium gifting hamper of curated tableware for weddings and housewarmings.', img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=700&q=84', badge: 'NEW' }
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
      { id: 'ACH-10231', date: '2026-09-02', status: 'paid', price: 8450, items: [PRODUCTS[0], PRODUCTS[2]].map(function(p){ return Object.assign({}, p, { qty: 1 }); }) },
      { id: 'ACH-10254', date: '2026-09-10', status: 'price-ready', price: 3120, items: [PRODUCTS[4]].map(function(p){ return Object.assign({}, p, { qty: 2 }); }) },
      { id: 'ACH-10267', date: '2026-09-16', status: 'pending', price: null, items: [PRODUCTS[6], PRODUCTS[8]].map(function(p){ return Object.assign({}, p, { qty: 1 }); }) }
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
