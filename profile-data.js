// ===== PROFILE DATA GENERATOR (FIXED VERSION) =====
// File untuk generate sample data di halaman profile dengan tracking terintegrasi

console.log('📊 Profile data generator loading...');

// ===== SAMPLE PRODUCTS DATA =====
const sampleUserProducts = [
  {
    id: 'prod-user-001',
    name: 'iPhone 13 Pro',
    price: 13500000,
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800',
    category: 'iPhone',
    status: 'active',
    grade: 'A',
    battery: '92%',
    storage: '8GB + 256GB',
    views: 245,
    dateAdded: '2025-10-10'
  },
  {
    id: 'prod-user-002',
    name: 'Samsung Galaxy S22',
    price: 9800000,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
    category: 'Android',
    status: 'sold',
    grade: 'B+',
    battery: '88%',
    storage: '8GB + 128GB',
    views: 182,
    dateAdded: '2025-10-05'
  },
  {
    id: 'prod-user-003',
    name: 'iPad Air 5',
    price: 8500000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
    category: 'Tablet',
    status: 'pending',
    grade: 'A',
    battery: '95%',
    storage: '256GB',
    views: 89,
    dateAdded: '2025-10-16'
  }
];

// ===== SAMPLE ORDERS DATA =====
const sampleUserOrders = [
  {
    id: 'ORD-20251018001',
    date: '2025-10-18',
    status: 'processing',
    items: [
      {
        name: 'iPhone 14 Pro Max',
        image: 'https://media.karousell.com/media/photos/products/2024/7/5/iphone_14_promax_256gb_silver__1720185076_53ffec9c_progressive.jpg',
        details: '256GB - Silver',
        price: 20000000,
        quantity: 1
      }
    ],
    shipping: {
      method: 'JNE Regular',
      address: 'Jakarta Pusat',
      estimatedDelivery: '2025-10-22'
    },
    payment: {
      method: 'Bank Transfer',
      status: 'paid'
    },
    total: 20000000
  },
  {
    id: 'ORD-20251015002',
    date: '2025-10-15',
    status: 'shipped',
    items: [
      {
        name: 'Samsung Galaxy S23',
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
        details: '8GB + 256GB',
        price: 12000000,
        quantity: 1
      }
    ],
    shipping: {
      method: 'JNT Express',
      address: 'Bandung',
      trackingNumber: 'JT1234567890',
      estimatedDelivery: '2025-10-19'
    },
    payment: {
      method: 'COD',
      status: 'pending'
    },
    total: 12000000
  },
  {
    id: 'ORD-20251012003',
    date: '2025-10-12',
    status: 'completed',
    items: [
      {
        name: 'Google Pixel 7',
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
        details: '8GB + 128GB',
        price: 9200000,
        quantity: 1
      }
    ],
    shipping: {
      method: 'SiCepat',
      address: 'Surabaya',
      trackingNumber: 'SC9876543210',
      deliveredDate: '2025-10-15'
    },
    payment: {
      method: 'Bank Transfer',
      status: 'paid'
    },
    total: 9200000
  },
  {
    id: 'ORD-20251010004',
    date: '2025-10-10',
    status: 'cancelled',
    items: [
      {
        name: 'OnePlus 11',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
        details: '12GB + 256GB',
        price: 8700000,
        quantity: 1
      }
    ],
    shipping: {
      method: 'JNE Regular',
      address: 'Medan'
    },
    payment: {
      method: 'Bank Transfer',
      status: 'refunded'
    },
    total: 8700000,
    cancelReason: 'Dibatalkan oleh pembeli'
  }
];

// ===== SAMPLE AUCTIONS DATA =====
const sampleUserAuctions = [
  {
    id: 'AUC-001',
    productName: 'iPhone 15 Pro Max',
    image: 'https://images.tokopedia.net/img/cache/700/VqbcmM/2023/10/27/e692ce96-2164-4c9c-9f58-b8dda1ef3037.jpg',
    startingBid: 15000000,
    currentBid: 16500000,
    totalBids: 128,
    endTime: '2025-10-20 18:00:00',
    status: 'active',
    myMaxBid: 16500000
  },
  {
    id: 'AUC-002',
    productName: 'Samsung Galaxy S23 Ultra',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
    startingBid: 10000000,
    currentBid: 11800000,
    totalBids: 87,
    endTime: '2025-10-19 20:00:00',
    status: 'outbid',
    myMaxBid: 11200000
  },
  {
    id: 'AUC-003',
    productName: 'iPad Pro 11',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
    startingBid: 9000000,
    currentBid: 11500000,
    totalBids: 156,
    endTime: '2025-10-15 16:00:00',
    status: 'won',
    myMaxBid: 11500000,
    winDate: '2025-10-15'
  }
];

// ===== SAMPLE PAWNSHOP DATA =====
const sampleUserPawnshop = [
  {
    id: 'PAWN-001',
    productName: 'iPhone 12 Pro',
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800',
    estimatedValue: 10000000,
    loanAmount: 7000000,
    interestRate: 2.5,
    duration: 3,
    startDate: '2025-09-18',
    endDate: '2025-12-18',
    status: 'active',
    remainingDays: 61,
    totalPayment: 7525000
  },
  {
    id: 'PAWN-002',
    productName: 'MacBook Air M2',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    estimatedValue: 15000000,
    loanAmount: 10000000,
    interestRate: 2.5,
    duration: 2,
    startDate: '2025-08-10',
    endDate: '2025-10-10',
    status: 'redeemed',
    redeemedDate: '2025-10-08',
    totalPayment: 10500000
  }
];

// ===== FORMAT FUNCTIONS =====
function formatPrice(price) {
  return new Intl.NumberFormat('id-ID').format(price);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('id-ID', options);
}

function getStatusLabel(status) {
  const labels = {
    'active': 'Aktif',
    'sold': 'Terjual',
    'pending': 'Pending',
    'processing': 'Diproses',
    'shipped': 'Dikirim',
    'completed': 'Selesai',
    'cancelled': 'Dibatalkan',
    'won': 'Menang',
    'outbid': 'Terlewati',
    'redeemed': 'Ditebus'
  };
  return labels[status] || status;
}

// ===== TRACKING HELPER FUNCTION =====
function trackOrder(orderId) {
  console.log('📦 Tracking order:', orderId);
  
  // Show simple alert for immediate feedback
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border: 2px solid rgba(0, 191, 255, 0.5);
    border-radius: 12px;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 10000;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    animation: slideIn 0.3s ease;
  `;
  
  notification.innerHTML = `
    <i class="bi bi-arrow-repeat" style="font-size: 24px; color: #00bfff; animation: spin 1s linear infinite;"></i>
    <span style="color: #fff; font-size: 14px;">Memuat data pelacakan...</span>
  `;
  
  document.body.appendChild(notification);
  
  // Add spin animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes slideIn {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  // Redirect after short delay
  setTimeout(() => {
    window.location.href = `order-tracking.html?order=${orderId}`;
  }, 800);
}

// ===== RENDER FUNCTIONS =====
function renderProducts(products = sampleUserProducts) {
  if (products.length === 0) {
    return `
      <div class="empty-state">
        <i class="bi bi-box-seam"></i>
        <h3>Belum Ada Produk</h3>
        <p>Anda belum memiliki produk yang dijual. Mulai upload produk pertama Anda!</p>
        <button class="btn-add-product" onclick="window.location.href='index.html'">
          <i class="bi bi-plus-circle"></i>
          Upload Produk
        </button>
      </div>
    `;
  }

  return products.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <div class="product-info">
        <div class="product-header">
          <div>
            <h4 class="product-title">${product.name}</h4>
            <div class="product-details">
              <span class="product-detail-item">
                <i class="bi bi-star"></i> Grade ${product.grade}
              </span>
              <span class="product-detail-item">
                <i class="bi bi-battery-charging"></i> ${product.battery}
              </span>
              <span class="product-detail-item">
                <i class="bi bi-hdd"></i> ${product.storage}
              </span>
              <span class="product-detail-item">
                <i class="bi bi-eye"></i> ${product.views} views
              </span>
            </div>
          </div>
          <span class="product-status ${product.status}">${getStatusLabel(product.status)}</span>
        </div>
        <div class="product-price">Rp ${formatPrice(product.price)}</div>
        <div class="product-actions">
          <button class="btn-product-action btn-view">
            <i class="bi bi-eye"></i> Lihat
          </button>
          <button class="btn-product-action btn-edit">
            <i class="bi bi-pencil"></i> Edit
          </button>
          <button class="btn-product-action btn-delete">
            <i class="bi bi-trash"></i> Hapus
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== RENDER ORDERS WITH TRACKING (INTEGRATED) =====
function renderOrders(orders = sampleUserOrders, filterStatus = 'all') {
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
          ${(order.status === 'shipped' || order.status === 'processing') ? `
            <button class="btn-product-action btn-view btn-track-order" 
                    data-order-id="${order.id}"
                    style="background: linear-gradient(135deg, #00ffff, #00ccff); color: #000; border: none; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);">
              <i class="bi bi-geo-alt-fill" style="font-size: 16px;"></i> 
              <span>Lacak Paket</span>
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

function renderAuctions(auctions = sampleUserAuctions) {
  if (auctions.length === 0) {
    return `
      <div class="empty-state">
        <i class="bi bi-gavel"></i>
        <h3>Belum Ada Lelang</h3>
        <p>Anda belum mengikuti lelang apapun. Ikuti lelang untuk mendapatkan gadget dengan harga terbaik!</p>
        <button class="btn-add-product" onclick="window.location.href='lelang.html'">
          <i class="bi bi-hammer"></i>
          Lihat Lelang
        </button>
      </div>
    `;
  }

  return auctions.map(auction => `
    <div class="product-card">
      <img src="${auction.image}" alt="${auction.productName}" class="product-image">
      <div class="product-info">
        <div class="product-header">
          <div>
            <h4 class="product-title">${auction.productName}</h4>
            <div class="product-details">
              <span class="product-detail-item">
                <i class="bi bi-hammer"></i> ${auction.totalBids} Bids
              </span>
              <span class="product-detail-item">
                <i class="bi bi-clock"></i> ${auction.status === 'active' ? 'Aktif' : auction.status === 'won' ? 'Menang' : 'Terlewati'}
              </span>
            </div>
          </div>
          <span class="product-status ${auction.status === 'active' ? 'active' : auction.status === 'won' ? 'sold' : 'pending'}">
            ${auction.status === 'active' ? 'Berlangsung' : auction.status === 'won' ? 'Menang' : 'Terlewati'}
          </span>
        </div>
        <div style="margin: 15px 0;">
          <div style="color: #aaa; font-size: 13px; margin-bottom: 5px;">Bid Tertinggi:</div>
          <div class="product-price">Rp ${formatPrice(auction.currentBid)}</div>
          <div style="color: #aaa; font-size: 13px; margin-top: 5px;">Bid Anda: Rp ${formatPrice(auction.myMaxBid)}</div>
        </div>
        <div class="product-actions">
          <button class="btn-product-action btn-view">
            <i class="bi bi-eye"></i> Lihat Detail
          </button>
          ${auction.status === 'active' ? `
            <button class="btn-product-action btn-edit">
              <i class="bi bi-hammer"></i> Bid Lagi
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function renderPawnshop(items = sampleUserPawnshop) {
  if (items.length === 0) {
    return `
      <div class="empty-state">
        <i class="bi bi-gem"></i>
        <h3>Belum Ada Gadget yang Digadaikan</h3>
        <p>Anda belum menggadaikan gadget apapun. Butuh dana cepat? Gadaikan gadgetmu sekarang!</p>
        <button class="btn-add-product" onclick="window.location.href='pegadaian.html'">
          <i class="bi bi-coin"></i>
          Gadaikan Sekarang
        </button>
      </div>
    `;
  }

  return items.map(item => `
    <div class="product-card">
      <img src="${item.image}" alt="${item.productName}" class="product-image">
      <div class="product-info">
        <div class="product-header">
          <div>
            <h4 class="product-title">${item.productName}</h4>
            <div class="product-details">
              <span class="product-detail-item">
                <i class="bi bi-cash"></i> Pinjaman: Rp ${formatPrice(item.loanAmount)}
              </span>
              <span class="product-detail-item">
                <i class="bi bi-percent"></i> Bunga ${item.interestRate}%/bulan
              </span>
              <span class="product-detail-item">
                <i class="bi bi-calendar"></i> ${item.duration} bulan
              </span>
              ${item.status === 'active' ? `
                <span class="product-detail-item">
                  <i class="bi bi-clock"></i> ${item.remainingDays} hari lagi
                </span>
              ` : ''}
            </div>
          </div>
          <span class="product-status ${item.status === 'active' ? 'active' : 'sold'}">
            ${getStatusLabel(item.status)}
          </span>
        </div>
        <div style="margin: 15px 0;">
          <div style="color: #aaa; font-size: 13px; margin-bottom: 5px;">Total Pembayaran:</div>
          <div class="product-price">Rp ${formatPrice(item.totalPayment)}</div>
          <div style="color: #aaa; font-size: 13px; margin-top: 10px;">
            <div>Mulai: ${formatDate(item.startDate)}</div>
            <div>Berakhir: ${formatDate(item.endDate)}</div>
            ${item.redeemedDate ? `<div style="color: #2ed573;">Ditebus: ${formatDate(item.redeemedDate)}</div>` : ''}
          </div>
        </div>
        <div class="product-actions">
          <button class="btn-product-action btn-view">
            <i class="bi bi-file-text"></i> Detail
          </button>
          ${item.status === 'active' ? `
            <button class="btn-product-action btn-edit" style="background: rgba(46, 213, 115, 0.1); color: #2ed573; border-color: rgba(46, 213, 115, 0.3);">
              <i class="bi bi-cash-coin"></i> Tebus
            </button>
            <button class="btn-product-action btn-delete">
              <i class="bi bi-calendar-plus"></i> Perpanjang
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

// ===== LOAD DATA WITH SAMPLE =====
function loadProductsWithSample() {
  const productsList = document.getElementById('products-list');
  if (!productsList) return;

  const showSample = localStorage.getItem('showSampleData') !== 'false';

  if (showSample) {
    productsList.innerHTML = renderProducts(sampleUserProducts);
    updateStatsWithSample();
  } else {
    productsList.innerHTML = renderProducts([]);
  }
}

function loadOrdersWithSample(filterStatus = 'all') {
  const ordersList = document.getElementById('orders-list');
  if (!ordersList) return;

  const showSample = localStorage.getItem('showSampleData') !== 'false';

  if (showSample) {
    ordersList.innerHTML = renderOrders(sampleUserOrders, filterStatus);
    
    // CRITICAL FIX: Attach click events to tracking buttons
    setTimeout(() => {
      const trackButtons = document.querySelectorAll('.btn-track-order');
      console.log('🔧 Attaching events to', trackButtons.length, 'tracking buttons');
      
      trackButtons.forEach(btn => {
        // Remove any existing listeners
        btn.replaceWith(btn.cloneNode(true));
      });
      
      // Re-query after replacement
      document.querySelectorAll('.btn-track-order').forEach(btn => {
        const orderId = btn.getAttribute('data-order-id');
        
        // Add click event
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('🖱️ Track button clicked for order:', orderId);
          trackOrder(orderId);
        });
        
        // Add hover effect
        btn.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 6px 25px rgba(0, 255, 255, 0.5)';
        });
        
        btn.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = '0 4px 15px rgba(0, 255, 255, 0.3)';
        });
        
        console.log('✅ Event attached to button:', orderId);
      });
    }, 200);
    
  } else {
    ordersList.innerHTML = renderOrders([], filterStatus);
  }
}

function loadAuctionsWithSample() {
  const auctionsList = document.getElementById('auctions-list');
  if (!auctionsList) return;

  const showSample = localStorage.getItem('showSampleData') !== 'false';

  if (showSample) {
    auctionsList.innerHTML = renderAuctions(sampleUserAuctions);
  } else {
    auctionsList.innerHTML = renderAuctions([]);
  }
}

function loadPawnshopWithSample() {
  const pawnshopList = document.getElementById('pawnshop-list');
  if (!pawnshopList) return;

  const showSample = localStorage.getItem('showSampleData') !== 'false';

  if (showSample) {
    pawnshopList.innerHTML = renderPawnshop(sampleUserPawnshop);
  } else {
    pawnshopList.innerHTML = renderPawnshop([]);
  }
}

function updateStatsWithSample() {
  const showSample = localStorage.getItem('showSampleData') !== 'false';

  if (showSample && sampleUserProducts.length > 0) {
    const totalProducts = sampleUserProducts.length;
    const soldProducts = sampleUserProducts.filter(p => p.status === 'sold').length;
    const activeProducts = sampleUserProducts.filter(p => p.status === 'active').length;
    const pendingProducts = sampleUserProducts.filter(p => p.status === 'pending').length;

    document.getElementById('stat-products').textContent = totalProducts;
    document.getElementById('stat-orders').textContent = sampleUserOrders.length;
    document.getElementById('stat-rating').textContent = '4.8';

    document.getElementById('stats-total-products').textContent = totalProducts;
    document.getElementById('stats-sold-products').textContent = soldProducts;
    document.getElementById('stats-pending-products').textContent = pendingProducts;
    document.getElementById('stats-avg-rating').textContent = '4.8';
  }
}

// ===== SETUP ORDER FILTERS =====
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
      console.log('🔍 Filter clicked:', status);
      loadOrdersWithSample(status);
    };
  });
}

// ===== EXPORT FOR GLOBAL USE =====
window.profileDataGenerator = {
  sampleUserProducts,
  sampleUserOrders,
  sampleUserAuctions,
  sampleUserPawnshop,
  renderProducts,
  renderOrders,
  renderAuctions,
  renderPawnshop,
  loadProductsWithSample,
  loadOrdersWithSample,
  loadAuctionsWithSample,
  loadPawnshopWithSample,
  updateStatsWithSample,
  trackOrder // Export trackOrder function
};

// Export trackOrder as global function
window.trackOrder = trackOrder;

console.log('✅ Profile data generator loaded successfully with tracking integration');