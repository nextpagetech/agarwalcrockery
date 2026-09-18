document.addEventListener('DOMContentLoaded', function () {
  var dash = document.getElementById('acctDashboard');
  if (!dash) return;

  var orders = window.AC.readOrders();
  var pending = orders.filter(function (o) { return o.status === 'pending'; }).length;
  var ready = orders.filter(function (o) { return o.status === 'price-ready'; }).length;

  document.getElementById('statTotal').textContent = orders.length;
  document.getElementById('statPending').textContent = pending;
  document.getElementById('statReady').textContent = ready;

  var STATUS = {
    'pending': { label: 'Pending Review', cls: 'status-pending', icon: 'bi-hourglass-split' },
    'price-ready': { label: 'Price Ready', cls: 'status-price-ready', icon: 'bi-eye' },
    'paid': { label: 'Paid', cls: 'status-paid', icon: 'bi-check-circle' }
  };

  var recent = orders.slice(0, 3);
  var recentEl = document.getElementById('recentOrdersList');
  if (recent.length) {
    recentEl.innerHTML = '<div class="orders-row head"><span>Order</span><span>Date</span><span>Status</span><span>Price</span><span></span></div>' +
      recent.map(function (o) {
        var st = STATUS[o.status];
        var priceHtml = o.status === 'pending'
          ? '<span class="order-price hidden-price"><i class="bi bi-lock"></i> Under review</span>'
          : '<span class="order-price">₹' + o.price.toLocaleString('en-IN') + '</span>';
        return '' +
          '<div class="orders-row">' +
            '<span class="order-id">' + o.id + '</span>' +
            '<span class="order-date">' + o.date + '</span>' +
            '<span class="status-pill ' + st.cls + '"><i class="bi ' + st.icon + '"></i> ' + st.label + '</span>' +
            priceHtml +
            '<a class="view-link" href="order-details.html?id=' + o.id + '">View <i class="bi bi-arrow-right"></i></a>' +
          '</div>';
      }).join('');
  } else {
    recentEl.innerHTML = '<p style="font-size:13px; color:var(--ink-soft); padding:8px 0;">No orders yet.</p>';
  }
});
