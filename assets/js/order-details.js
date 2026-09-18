document.addEventListener('DOMContentLoaded', function () {
  var params = new URLSearchParams(window.location.search);
  var id = params.get('id');
  var order = id ? window.AC.findOrder(id) : window.AC.readOrders()[0];

  if (!order) {
    document.getElementById('orderDetailWrap').innerHTML = '<div class="empty-state show"><i class="bi bi-receipt"></i><h2>Order not found</h2><p>We couldn\'t find that order.</p><a class="btn btn-dark" href="orders.html">Back to My Orders</a></div>';
    return;
  }

  var STATUS = {
    'pending': { label: 'Pending Review', cls: 'status-pending', icon: 'bi-hourglass-split' },
    'price-ready': { label: 'Price Ready', cls: 'status-price-ready', icon: 'bi-eye' },
    'paid': { label: 'Paid', cls: 'status-paid', icon: 'bi-check-circle' }
  };
  var st = STATUS[order.status];

  document.getElementById('odId').textContent = order.id;
  document.getElementById('odDate').textContent = order.date;
  document.getElementById('odStatus').innerHTML = '<i class="bi ' + st.icon + '"></i> ' + st.label;
  document.getElementById('odStatus').className = 'status-pill ' + st.cls;

  document.getElementById('odItems').innerHTML = order.items.map(function (p) {
    return '' +
      '<div class="cart-row">' +
        '<div class="cart-thumb"><img src="' + p.img + '" alt="' + p.name + '"></div>' +
        '<div class="cart-info">' +
          '<span class="cart-cat">' + p.catLabel + '</span>' +
          '<h3>' + p.name + '</h3>' +
          '<span class="cart-note">Qty: ' + p.qty + '</span>' +
        '</div>' +
      '</div>';
  }).join('');

  var panel = document.getElementById('odPricePanel');
  if (order.status === 'pending') {
    panel.className = 'order-price-panel pending';
    panel.innerHTML = '<div><i class="bi bi-hourglass-split" style="margin-right:8px;"></i><span class="amount">Our team is reviewing this order</span><p style="margin:6px 0 0; font-size:12.5px; font-weight:400;">Your confirmed price will appear here — we\'ll notify you once it\'s ready.</p></div>';
  } else if (order.status === 'price-ready') {
    panel.className = 'order-price-panel';
    panel.innerHTML = '<div><span style="font-size:12px; color:var(--ink-soft); font-weight:600;">CONFIRMED ORDER PRICE</span><div class="amount">₹' + order.price.toLocaleString('en-IN') + '</div></div><a class="btn btn-dark" href="payment.html?id=' + order.id + '">Pay Online <i class="bi bi-arrow-right"></i></a>';
  } else {
    panel.className = 'order-price-panel';
    panel.innerHTML = '<div><span style="font-size:12px; color:var(--ink-soft); font-weight:600;">PAID AMOUNT</span><div class="amount">₹' + order.price.toLocaleString('en-IN') + '</div></div><span class="status-pill status-paid"><i class="bi bi-check-circle"></i> Payment Complete</span>';
  }
});
