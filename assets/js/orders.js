document.addEventListener('DOMContentLoaded', function () {
  var orders = window.AC.readOrders();
  var listEl = document.getElementById('ordersList');
  var emptyEl = document.getElementById('ordersEmptyState');

  var STATUS = {
    'pending': { label: 'Pending Review', cls: 'status-pending', icon: 'bi-hourglass-split' },
    'price-ready': { label: 'Price Ready', cls: 'status-price-ready', icon: 'bi-eye' },
    'paid': { label: 'Paid', cls: 'status-paid', icon: 'bi-check-circle' }
  };

  if (!orders.length) {
    listEl.innerHTML = '';
    emptyEl.classList.add('show');
    return;
  }

  var rows = '<div class="orders-row head"><span>Order</span><span>Date</span><span>Status</span><span>Price</span><span></span></div>';
  rows += orders.map(function (o) {
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
  listEl.innerHTML = rows;
});
