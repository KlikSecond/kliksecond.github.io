// ===== ORDER TRACKING SYSTEM =====
// Sistem pelacakan pesanan terintegrasi dengan users.js

console.log('📦 Order Tracking System loading...');

const OrderTrackingSystem = {
  
  // Sample tracking data (akan diganti dengan data dari users.js)
  trackingData: {
    'ORD-20251018001': {
      orderId: 'ORD-20251018001',
      orderDate: '2025-10-18',
      status: 'shipped',
      courier: 'JNE Regular',
      trackingNumber: 'JT1234567890ID',
      estimatedArrival: '2025-10-22',
      shippingAddress: 'Jakarta Pusat, DKI Jakarta',
      progress: 60,
      items: [
        {
          name: 'iPhone 14 Pro Max',
          image: 'https://media.karousell.com/media/photos/products/2024/7/5/iphone_14_promax_256gb_silver__1720185076_53ffec9c_progressive.jpg',
          specs: '256GB - Silver',
          price: 20000000,
          quantity: 1
        }
      ],
      timeline: [
        {
          status: 'completed',
          icon: 'check-circle-fill',
          title: 'Pesanan Dikonfirmasi',
          description: 'Pesanan Anda telah dikonfirmasi dan sedang diproses oleh penjual',
          date: '18 Okt 2025, 10:30',
          location: 'Jakarta Selatan'
        },
        {
          status: 'completed',
          icon: 'box-seam-fill',
          title: 'Pesanan Dikemas',
          description: 'Produk sedang dikemas dengan packaging aman untuk pengiriman',
          date: '18 Okt 2025, 14:20',
          location: 'Warehouse Jakarta'
        },
        {
          status: 'completed',
          icon: 'truck',
          title: 'Diambil Kurir',
          description: 'Paket telah diambil oleh kurir JNE dan dalam perjalanan ke sorting center',
          date: '19 Okt 2025, 09:15',
          location: 'Jakarta Selatan'
        },
        {
          status: 'active',
          icon: 'geo-alt-fill',
          title: 'Dalam Pengiriman',
          description: 'Paket dalam perjalanan menuju alamat tujuan Anda',
          date: '20 Okt 2025, 08:45',
          location: 'Jakarta Pusat Hub'
        },
        {
          status: 'pending',
          icon: 'house-door-fill',
          title: 'Akan Tiba',
          description: 'Paket akan segera tiba di alamat Anda',
          date: 'Estimasi: 22 Okt 2025',
          location: 'Jakarta Pusat'
        }
      ]
    },
    'ORD-20251015002': {
      orderId: 'ORD-20251015002',
      orderDate: '2025-10-15',
      status: 'processing',
      courier: 'J&T Express',
      trackingNumber: 'JT9876543210ID',
      estimatedArrival: '2025-10-19',
      shippingAddress: 'Bandung, Jawa Barat',
      progress: 40,
      items: [
        {
          name: 'Samsung Galaxy S23',
          image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
          specs: '8GB + 256GB',
          price: 12000000,
          quantity: 1
        }
      ],
      timeline: [
        {
          status: 'completed',
          icon: 'check-circle-fill',
          title: 'Pesanan Dikonfirmasi',
          description: 'Pesanan Anda telah dikonfirmasi dan sedang diproses',
          date: '15 Okt 2025, 11:00',
          location: 'Bandung'
        },
        {
          status: 'completed',
          icon: 'box-seam-fill',
          title: 'Pesanan Dikemas',
          description: 'Produk sedang dikemas dengan packaging aman',
          date: '15 Okt 2025, 15:30',
          location: 'Warehouse Bandung'
        },
        {
          status: 'active',
          icon: 'truck',
          title: 'Menunggu Pickup',
          description: 'Menunggu kurir untuk mengambil paket',
          date: '16 Okt 2025, 09:00',
          location: 'Bandung'
        },
        {
          status: 'pending',
          icon: 'geo-alt-fill',
          title: 'Dalam Pengiriman',
          description: 'Paket akan segera dikirim ke alamat Anda',
          date: 'Estimasi: 18 Oktober 2025',
          location: 'Pontianak'
        },
        {
          status: 'pending',
          icon: 'house-door-fill',
          title: 'Akan Tiba',
          description: 'Paket akan segera tiba di alamat Anda',
          date: 'Estimasi: 19 Okt 2025',
          location: 'Pontianak'
        }
      ]
    }
  },

  // Initialize tracking page
  init() {
    if (!this.isTrackingPage()) {
      console.log('⏸️ Not on tracking page, skipping init');
      return;
    }

    console.log('🔄 Initializing Order Tracking System...');
    
    // Get order ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order');

    if (!orderId) {
      this.showError('Order ID tidak ditemukan');
      return;
    }

    // Show loading
    this.showLoading();

    // Simulate loading delay (for better UX)
    setTimeout(() => {
      this.loadTrackingData(orderId);
    }, 800);
  },

  // Check if current page is tracking page
  isTrackingPage() {
    return window.location.pathname.includes('order-tracking.html');
  },

  // Show loading state
  showLoading() {
    document.getElementById('tracking-loading').style.display = 'flex';
    document.getElementById('tracking-error').style.display = 'none';
    document.getElementById('tracking-content').style.display = 'none';
  },

  // Show error state
  showError(message) {
    document.getElementById('tracking-loading').style.display = 'none';
    document.getElementById('tracking-error').style.display = 'block';
    document.getElementById('tracking-content').style.display = 'none';

    const errorElement = document.getElementById('tracking-error');
    const errorMessage = errorElement.querySelector('p');
    if (errorMessage) {
      errorMessage.textContent = message;
    }
  },

  // Show content
  showContent() {
    document.getElementById('tracking-loading').style.display = 'none';
    document.getElementById('tracking-error').style.display = 'none';
    document.getElementById('tracking-content').style.display = 'block';
  },

  // Load tracking data
  loadTrackingData(orderId) {
    console.log('📊 Loading tracking data for:', orderId);

    // Get tracking data
    const data = this.trackingData[orderId];

    if (!data) {
      this.showError('Data pelacakan tidak ditemukan untuk pesanan ini');
      return;
    }

    // Update page with data
    this.updateTrackingPage(data);
    this.showContent();

    console.log('✅ Tracking data loaded successfully');
  },

  // Update tracking page with data
  updateTrackingPage(data) {
    // Update header
    document.getElementById('order-id').textContent = data.orderId;
    document.getElementById('order-date').textContent = this.formatDate(data.orderDate);
    
    // Update status badge
    const statusBadge = document.getElementById('status-badge');
    statusBadge.textContent = this.getStatusLabel(data.status);
    statusBadge.className = `tracking-status-badge ${data.status}`;

    // Update shipping info
    document.getElementById('courier-name').textContent = data.courier;
    document.getElementById('tracking-number').textContent = data.trackingNumber;
    document.getElementById('shipping-address').textContent = data.shippingAddress;
    document.getElementById('estimated-arrival').textContent = this.formatDate(data.estimatedArrival);

    // Update progress bar
    this.updateProgressBar(data.progress);

    // Render timeline
    this.renderTimeline(data.timeline);

    // Render products
    this.renderProducts(data.items);
  },

  // Update progress bar
  updateProgressBar(progress) {
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');

    setTimeout(() => {
      progressBar.style.width = progress + '%';
      progressPercentage.textContent = progress + '% Complete';
    }, 300);
  },

  // Render timeline
  renderTimeline(timeline) {
    const container = document.getElementById('tracking-timeline');
    
    container.innerHTML = timeline.map(item => `
      <div class="timeline-item ${item.status}">
        <div class="timeline-icon">
          <i class="bi bi-${item.icon}"></i>
        </div>
        <div class="timeline-content">
          <h4 class="timeline-title">
            ${item.title}
            ${item.status === 'completed' ? '<i class="bi bi-check-circle-fill" style="color: #2ed573; font-size: 18px;"></i>' : ''}
          </h4>
          <p class="timeline-description">${item.description}</p>
          <div class="timeline-date">
            <i class="bi bi-clock"></i>
            ${item.date}
          </div>
          ${item.location ? `
            <div class="timeline-location">
              <i class="bi bi-geo-alt"></i>
              ${item.location}
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
  },

  // Render products
  renderProducts(items) {
    const container = document.getElementById('product-list');
    
    container.innerHTML = items.map(item => `
      <div class="product-item">
        <img src="${item.image}" alt="${item.name}" class="product-image">
        <div class="product-details">
          <h4 class="product-name">${item.name}</h4>
          <p class="product-specs">${item.specs} • Qty: ${item.quantity}</p>
          <p class="product-price">Rp ${this.formatPrice(item.price)}</p>
        </div>
      </div>
    `).join('');
  },

  // Format date
  formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  },

  // Format price
  formatPrice(price) {
    return new Intl.NumberFormat('id-ID').format(price);
  },

  // Get status label
  getStatusLabel(status) {
    const labels = {
      'processing': '⏳ Diproses',
      'shipped': '🚚 Dikirim',
      'completed': '✅ Selesai',
      'cancelled': '❌ Dibatalkan'
    };
    return labels[status] || status;
  },

  // Copy tracking number
  copyTrackingNumber() {
    const trackingNumber = document.getElementById('tracking-number').textContent;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(trackingNumber).then(() => {
        this.showNotification('Nomor resi berhasil disalin!', 'success');
      }).catch(err => {
        console.error('Error copying:', err);
        this.showNotification('Gagal menyalin nomor resi', 'error');
      });
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = trackingNumber;
      textarea.style.position = 'fixed';
      textarea.style.opacity = 0;
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        document.execCommand('copy');
        this.showNotification('Nomor resi berhasil disalin!', 'success');
      } catch (err) {
        console.error('Error copying:', err);
        this.showNotification('Gagal menyalin nomor resi', 'error');
      }
      
      document.body.removeChild(textarea);
    }
  },

  // Contact WhatsApp
  contactWhatsApp() {
    const phoneNumber = '6281234567890'; // Replace with actual number
    const message = encodeURIComponent('Halo, saya butuh bantuan mengenai pesanan saya');
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
  },

  // Contact Email
  contactEmail() {
    const email = 'support@kliksecond.com'; // Replace with actual email
    const subject = encodeURIComponent('Bantuan Pesanan');
    const body = encodeURIComponent('Halo tim Klik Second,\n\nSaya butuh bantuan mengenai pesanan saya.\n\n');
    const url = `mailto:${email}?subject=${subject}&body=${body}`;
    window.location.href = url;
  },

  // Show notification
  showNotification(message, type = 'info') {
    const existing = document.querySelector('.tracking-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `tracking-notification ${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border: 2px solid ${type === 'success' ? 'rgba(46, 213, 115, 0.5)' : 'rgba(255, 107, 107, 0.5)'};
      border-radius: 12px;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 10000;
      min-width: 300px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      animation: slideInRight 0.3s ease;
    `;

    const iconColor = type === 'success' ? '#2ed573' : '#ff6b6b';
    const iconName = type === 'success' ? 'check-circle-fill' : 'x-circle-fill';

    notification.innerHTML = `
      <i class="bi bi-${iconName}" style="font-size: 24px; color: ${iconColor};"></i>
      <span style="color: #fff; font-size: 14px;">${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  },

  // Open tracking from profile page
  openTracking(orderId) {
    window.location.href = `order-tracking.html?order=${orderId}`;
  }
};

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    OrderTrackingSystem.init();
  });
} else {
  OrderTrackingSystem.init();
}

// Export for global use
window.OrderTrackingSystem = OrderTrackingSystem;

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

console.log('✅ Order Tracking System loaded successfully');