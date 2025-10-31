// ===== UPDATE UNTUK profile-data.js =====
// Tambahkan kode ini ke file profile-data.js yang sudah ada
// Atau replace fungsi renderOrders dengan yang ini

// ===== UPDATED RENDER ORDERS FUNCTION WITH TRACKING BUTTON =====
function renderOrdersWithTracking(orders = sampleUserOrders, filterStatus = 'all') {
  let filteredOrders = orders;
  
  if (filterStatus !== 'all') {
    filteredOrders = orders.filter(order => order.status === filterStatus);
  }

  if (filteredOrders.length === 0) {
    return `
      <div class="empty-state">
        <i class="bi bi-bag-x"></i>
        <h3>Tidak Ada Pesanan</h3>
        <p>Tidak ada pesanan dengan status ini.</p>
      </div>
    `;
  }

  return filteredOrders.map(order => `
    <div class="order-card">
      <div class="order-header">
        <div>
          <div class="order-id">${order.id}</div>
          <div class="order-date">${formatDate(order.date)}</div>
        </div>
        <span class="order-status ${order.status}">${getStatusLabel(order.status)}</span>
      </div>
      <div class="order-items">
        ${order.items.map(item => `
          <div class="order-item">
            <img src="${item.image}" alt="${item.name}" class="order-item-image">
            <div class="order-item-info">
              <div class="order-item-name">${item.name}</div>
              <div class="order-item-details">${item.details} • Qty: ${item.quantity}</div>
              <div class="order-item-price">Rp ${formatPrice(item.price)}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="order-footer">
        <div>
          <span class="order-total">Total:</span>
          <span class="order-total-price">Rp ${formatPrice(order.total)}</span>
        </div>
        <div class="order-actions">
          ${order.status === 'shipped' || order.status === 'processing' ? `
            <button class="btn-product-action btn-view btn-track-order" 
                    data-order-id="${order.id}"
                    onclick="OrderTrackingSystem.openTracking('${order.id}')"
                    style="background: linear-gradient(135deg, #00ffff, #00ccff); color: #000; border: none; position: relative; overflow: hidden;">
              <i class="bi bi-geo-alt-fill"></i> 
              <span style="position: relative; z-index: 1;">Lacak Paket</span>
              <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 0; height: 0; border-radius: 50%; background: rgba(255,255,255,0.3); transition: width 0.3s, height 0.3s;"></span>
            </button>
          ` : ''}
          ${order.status === 'completed' ? `
            <button class="btn-product-action btn-edit">
              <i class="bi bi-star"></i> Beri Rating
            </button>
          ` : ''}
          <button class="btn-product-action btn-view">
            <i class="bi bi-receipt"></i> Detail
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== UPDATE loadOrdersWithSample FUNCTION =====
function loadOrdersWithSampleTracking(filterStatus = 'all') {
  const ordersList = document.getElementById('orders-list');
  if (!ordersList) return;

  setupOrderFilters(filterStatus);

  ordersList.innerHTML = '<div class="loading-spinner"><i class="bi bi-arrow-repeat"></i> Loading...</div>';

  try {
    const showSample = localStorage.getItem('showSampleData') !== 'false';

    if (showSample) {
      ordersList.innerHTML = renderOrdersWithTracking(sampleUserOrders, filterStatus);
      
      // Re-attach tracking button events after rendering
      setTimeout(() => {
        const trackButtons = document.querySelectorAll('.btn-track-order');
        trackButtons.forEach(btn => {
          btn.addEventListener('mouseenter', function() {
            const ripple = this.querySelector('span:last-child');
            if (ripple) {
              ripple.style.width = '300px';
              ripple.style.height = '300px';
            }
          });
          btn.addEventListener('mouseleave', function() {
            const ripple = this.querySelector('span:last-child');
            if (ripple) {
              ripple.style.width = '0';
              ripple.style.height = '0';
            }
          });
        });
      }, 100);
    } else {
      ordersList.innerHTML = renderOrdersWithTracking([], filterStatus);
    }
  } catch (error) {
    console.error('Error loading orders:', error);
    ordersList.innerHTML = renderErrorState('Gagal memuat pesanan');
  }
}

// ===== HELPER FUNCTION FOR ORDER FILTERS =====
function setupOrderFilters(activeStatus) {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    const status = btn.getAttribute('data-status');
    
    if (status === activeStatus) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }

    btn.onclick = () => {
      loadOrdersWithSampleTracking(status);
    };
  });
}

// ===== EXPORT UPDATED FUNCTIONS =====
if (typeof window !== 'undefined') {
  // Override original functions with tracking-enabled versions
  window.profileDataGenerator = window.profileDataGenerator || {};
  Object.assign(window.profileDataGenerator, {
    renderOrdersWithTracking,
    loadOrdersWithSampleTracking
  });
}

console.log('✅ Profile Data Tracking Integration loaded');

// ===== AUTO-REPLACE IN PROFILE HANDLER =====
// This code will automatically update profile-handler to use tracking version
if (typeof window !== 'undefined') {
  const checkProfileHandler = setInterval(() => {
    if (window.profileManager && window.profileManager.loadOrders) {
      clearInterval(checkProfileHandler);
      
      // Override loadOrders in profileManager
      const originalLoadOrders = window.profileManager.loadOrders;
      window.profileManager.loadOrders = async function(filterStatus = 'all') {
        const ordersList = document.getElementById('orders-list');
        if (!ordersList) return;

        setupOrderFilters(filterStatus);

        ordersList.innerHTML = '<div class="loading-spinner"><i class="bi bi-arrow-repeat"></i> Loading...</div>';

        try {
          if (window.profileDataGenerator && window.profileDataGenerator.loadOrdersWithSampleTracking) {
            window.profileDataGenerator.loadOrdersWithSampleTracking(filterStatus);
          } else {
            loadOrdersWithSampleTracking(filterStatus);
          }
        } catch (error) {
          console.error('Error loading orders:', error);
          ordersList.innerHTML = this.renderErrorState('Gagal memuat pesanan');
        }
      };

      console.log('✅ Profile Handler updated with tracking integration');
    }
  }, 100);

  // Timeout after 5 seconds
  setTimeout(() => {
    clearInterval(checkProfileHandler);
  }, 5000);
}