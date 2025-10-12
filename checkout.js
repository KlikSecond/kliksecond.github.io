// ===== CHECKOUT SYSTEM (FIXED VERSION) =====
// File ini menghandle seluruh proses checkout dari step 1 hingga pembayaran

console.log('🛒 Checkout system loaded');

// ===== PARTICLES.JS =====
particlesJS("particles-js", {
  particles: {
    number: { value: 60 },
    color: { value: "#00ffff" },
    shape: { type: "circle" },
    opacity: { value: 0.4 },
    size: { value: 3 },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#00ffff",
      opacity: 0.3,
      width: 1
    },
    move: { enable: true, speed: 1.5 }
  }
});

// ===== GLOBAL VARIABLES =====
let currentStep = 1;
let productData = null;
let customerInfo = {};
let selectedPaymentMethod = null;
let orderData = {};

// Promo codes database
const promoCodes = {
  'KLIKSECOND10': { discount: 0.10, description: '10% Off' },
  'WELCOME50': { discount: 50000, description: 'Diskon Rp 50.000' },
  'GADGET20': { discount: 0.20, description: '20% Off' }
};

// ===== NOTIFICATION SYSTEM (PERSISTENT) =====
const NotificationSystem = {
  // Add notification to user's notification list
  addNotification(username, notificationData) {
    try {
      // Get all users data from localStorage
      let usersData = JSON.parse(localStorage.getItem('klikSecondUsers') || '{"users":[]}');
      
      // Find user
      const user = usersData.users.find(u => u.username === username);
      
      if (user) {
        // Initialize notifications array if not exists
        if (!user.notifications) {
          user.notifications = [];
        }
        
        // Create notification object
        const notification = {
          id: `notif-${Date.now()}`,
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          date: new Date().toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          read: false,
          productId: notificationData.productId || null,
          orderId: notificationData.orderId || null
        };
        
        // Add to beginning of array (newest first)
        user.notifications.unshift(notification);
        
        // Save back to localStorage
        localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
        
        // Also update window.usersData if exists
        if (window.usersData) {
          const windowUser = window.usersData.users.find(u => u.username === username);
          if (windowUser) {
            if (!windowUser.notifications) {
              windowUser.notifications = [];
            }
            windowUser.notifications.unshift(notification);
          }
        }
        
        console.log('✅ Notification added successfully:', notification);
        return true;
      } else {
        console.error('❌ User not found:', username);
        return false;
      }
    } catch (e) {
      console.error('❌ Error adding notification:', e);
      return false;
    }
  },
  
  // Sync localStorage with window.usersData
  syncUsersData() {
    try {
      const storedUsers = localStorage.getItem('klikSecondUsers');
      if (storedUsers && window.usersData) {
        const parsedUsers = JSON.parse(storedUsers);
        window.usersData.users = parsedUsers.users;
        console.log('✅ Users data synced from localStorage');
      }
    } catch (e) {
      console.error('❌ Error syncing users data:', e);
    }
  },
  
  // Initialize localStorage with window.usersData if not exists
  initializeUsersData() {
    try {
      const storedUsers = localStorage.getItem('klikSecondUsers');
      if (!storedUsers && window.usersData) {
        localStorage.setItem('klikSecondUsers', JSON.stringify(window.usersData));
        console.log('✅ Users data initialized in localStorage');
      } else {
        // Sync from localStorage to window
        this.syncUsersData();
      }
    } catch (e) {
      console.error('❌ Error initializing users data:', e);
    }
  }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  console.log('📱 Initializing checkout page...');
  
  // Initialize users data in localStorage
  NotificationSystem.initializeUsersData();
  
  // Load product from URL parameter
  loadProductData();
  
  // Initialize form handlers
  initializeFormHandlers();
  
  // Initialize payment method selection
  initializePaymentSelection();
  
  // Auto-fill if user is logged in
  autoFillCustomerInfo();
  
  console.log('✅ Checkout initialized');
});

// ===== LOAD PRODUCT DATA =====
function loadProductData() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (!productId) {
    alert('Produk tidak ditemukan!');
    window.location.href = 'index.html';
    return;
  }
  
  // Get product from products data
  if (window.productsData) {
    const allProducts = [
      ...window.productsData.tablets,
      ...window.productsData.android,
      ...window.productsData.iphone
    ];
    
    productData = allProducts.find(p => p.id === productId);
  }
  
  if (!productData) {
    alert('Data produk tidak ditemukan!');
    window.location.href = 'index.html';
    return;
  }
  
  console.log('✅ Product loaded:', productData.name);
  
  // Display product in summary
  displayProductSummary();
}

// ===== DISPLAY PRODUCT SUMMARY =====
function displayProductSummary() {
  const summaryContainer = document.getElementById('product-summary');
  
  summaryContainer.innerHTML = `
    <div class="product-item">
      <div class="product-image">
        <img src="${productData.images[0]}" alt="${productData.name}">
      </div>
      <div class="product-details">
        <h4>${productData.name}</h4>
        <div class="product-specs">${productData.storage} • ${productData.condition}</div>
        <div class="product-price">Rp ${formatPrice(productData.price)}</div>
      </div>
    </div>
  `;
  
  // Update price breakdown
  updatePriceBreakdown();
}

// ===== UPDATE PRICE BREAKDOWN =====
function updatePriceBreakdown(discountAmount = 0) {
  const productPrice = productData.price;
  const adminFee = 5000;
  const shippingFee = 0; // Gratis ongkir
  const total = productPrice + adminFee - discountAmount;
  
  document.getElementById('product-price').textContent = `Rp ${formatPrice(productPrice)}`;
  document.getElementById('admin-fee').textContent = `Rp ${formatPrice(adminFee)}`;
  document.getElementById('discount').textContent = discountAmount > 0 ? `- Rp ${formatPrice(discountAmount)}` : 'Rp 0';
  document.getElementById('total-price').textContent = `Rp ${formatPrice(total)}`;
  
  // Store in orderData
  orderData.subtotal = productPrice;
  orderData.adminFee = adminFee;
  orderData.shippingFee = shippingFee;
  orderData.discount = discountAmount;
  orderData.total = total;
}

// ===== FORMAT PRICE =====
function formatPrice(price) {
  return new Intl.NumberFormat('id-ID').format(price);
}

// ===== AUTO-FILL CUSTOMER INFO =====
function autoFillCustomerInfo() {
  // Check if user is logged in
  if (window.SessionManager && window.SessionManager.isLoggedIn()) {
    const user = window.SessionManager.getCurrentUser();
    
    if (user) {
      document.getElementById('customer-name').value = user.fullname || '';
      document.getElementById('customer-email').value = user.email || '';
      document.getElementById('customer-phone').value = user.phone || '';
      
      console.log('✅ Customer info auto-filled');
    }
  }
}

// ===== INITIALIZE FORM HANDLERS =====
function initializeFormHandlers() {
  const customerForm = document.getElementById('customer-info-form');
  
  if (customerForm) {
    customerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleCustomerInfoSubmit();
    });
  }
}

// ===== HANDLE CUSTOMER INFO SUBMIT =====
function handleCustomerInfoSubmit() {
  // Get form values
  customerInfo = {
    name: document.getElementById('customer-name').value.trim(),
    email: document.getElementById('customer-email').value.trim(),
    phone: document.getElementById('customer-phone').value.trim(),
    address: document.getElementById('customer-address').value.trim(),
    city: document.getElementById('customer-city').value.trim(),
    postal: document.getElementById('customer-postal').value.trim(),
    notes: document.getElementById('customer-notes').value.trim()
  };
  
  // Validate
  if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
    showNotification('error', 'Mohon lengkapi semua data yang wajib diisi!');
    return;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customerInfo.email)) {
    showNotification('error', 'Format email tidak valid!');
    return;
  }
  
  // Validate phone format
  if (!/^08\d{8,11}$/.test(customerInfo.phone)) {
    showNotification('error', 'Format nomor telepon tidak valid! (08xxxxxxxxxx)');
    return;
  }
  
  console.log('✅ Customer info validated:', customerInfo);
  
  // Go to step 2
  goToStep(2);
}

// ===== INITIALIZE PAYMENT SELECTION =====
function initializePaymentSelection() {
  const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
  
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      selectedPaymentMethod = this.value;
      console.log('💳 Payment method selected:', selectedPaymentMethod);
    });
  });
}

// ===== GO TO STEP =====
function goToStep(step) {
  // Hide all steps
  document.querySelectorAll('.checkout-section').forEach(section => {
    section.classList.add('hidden');
  });
  
  // Show selected step
  document.getElementById(`step-${step}`).classList.remove('hidden');
  
  // Update step indicators
  document.querySelectorAll('.step').forEach((stepEl, index) => {
    stepEl.classList.remove('active', 'completed');
    
    if (index + 1 < step) {
      stepEl.classList.add('completed');
    } else if (index + 1 === step) {
      stepEl.classList.add('active');
    }
  });
  
  currentStep = step;
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== PROCEED TO CONFIRMATION =====
function proceedToConfirmation() {
  if (!selectedPaymentMethod) {
    showNotification('error', 'Pilih metode pembayaran terlebih dahulu!');
    return;
  }
  
  // Display confirmation
  displayConfirmation();
  
  // Go to step 3
  goToStep(3);
}

// ===== DISPLAY CONFIRMATION =====
function displayConfirmation() {
  // Customer info
  document.getElementById('confirm-customer-info').innerHTML = `
    <p><strong>Nama:</strong> ${customerInfo.name}</p>
    <p><strong>Email:</strong> ${customerInfo.email}</p>
    <p><strong>Telepon:</strong> ${customerInfo.phone}</p>
    <p><strong>Alamat:</strong> ${customerInfo.address}, ${customerInfo.city} ${customerInfo.postal}</p>
    ${customerInfo.notes ? `<p><strong>Catatan:</strong> ${customerInfo.notes}</p>` : ''}
  `;
  
  // Payment method
  const paymentNames = {
    'gopay': 'GoPay',
    'ovo': 'OVO',
    'dana': 'DANA',
    'shopeepay': 'ShopeePay',
    'bca': 'BCA Virtual Account',
    'bri': 'BRI Virtual Account',
    'bni': 'BNI Virtual Account',
    'mandiri': 'Mandiri Virtual Account',
    'qris': 'QRIS',
    'credit-card': 'Kartu Kredit/Debit',
    'cod': 'COD (Cash on Delivery)'
  };
  
  document.getElementById('confirm-payment-method').innerHTML = `
    <p><strong>${paymentNames[selectedPaymentMethod]}</strong></p>
  `;
  
  // Product info
  document.getElementById('confirm-product-info').innerHTML = `
    <p><strong>${productData.name}</strong></p>
    <p>${productData.storage} • ${productData.condition}</p>
    <p style="color: #00ffff; font-size: 18px; font-weight: bold; margin-top: 10px;">
      Total: Rp ${formatPrice(orderData.total)}
    </p>
  `;
}

// ===== SUBMIT ORDER =====
function submitOrder() {
  // Validate terms agreement
  if (!document.getElementById('agree-terms').checked) {
    showNotification('error', 'Anda harus menyetujui syarat dan ketentuan!');
    return;
  }
  
  // Create order
  const orderId = 'ORD-' + Date.now();
  
  orderData = {
    ...orderData,
    orderId: orderId,
    product: productData,
    customer: customerInfo,
    paymentMethod: selectedPaymentMethod,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  console.log('📦 Order created:', orderData);
  
  // Save order
  saveOrder(orderData);
  
  // Process payment based on method
  processPayment();
}

// ===== SAVE ORDER =====
function saveOrder(order) {
  // Get existing orders
  let orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
  
  // Add new order
  orders.push(order);
  
  // Save
  localStorage.setItem('userOrders', JSON.stringify(orders));
  
  console.log('✅ Order saved to localStorage');
}

// ===== PROCESS PAYMENT =====
function processPayment() {
  const method = selectedPaymentMethod;
  
  // Show loading
  showNotification('info', 'Memproses pembayaran...');
  
  setTimeout(() => {
    if (method === 'qris') {
      showQRISPayment();
    } else if (['bca', 'bri', 'bni', 'mandiri'].includes(method)) {
      showVirtualAccountPayment(method);
    } else if (['gopay', 'ovo', 'dana', 'shopeepay'].includes(method)) {
      showEWalletPayment(method);
    } else if (method === 'credit-card') {
      showCreditCardPayment();
    } else if (method === 'cod') {
      showCODConfirmation();
    }
  }, 1000);
}

// ===== SHOW QRIS PAYMENT =====
function showQRISPayment() {
  const modalBody = document.getElementById('payment-modal-body');
  
  const qrisImage = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`QRIS:${orderData.orderId}:${orderData.total}`)}`;
  
  modalBody.innerHTML = `
    <div class="qris-display">
      <h3>Scan QRIS untuk Membayar</h3>
      <p>Gunakan aplikasi e-wallet atau mobile banking Anda</p>
      
      <div class="qris-code">
        <img src="${qrisImage}" alt="QRIS Code">
      </div>
      
      <div class="payment-amount">Rp ${formatPrice(orderData.total)}</div>
      
      <div class="payment-instructions">
        <h4>Cara Pembayaran:</h4>
        <ol>
          <li>Buka aplikasi e-wallet atau mobile banking Anda</li>
          <li>Pilih menu Scan QR / QRIS</li>
          <li>Scan kode QR di atas</li>
          <li>Konfirmasi pembayaran</li>
          <li>Simpan bukti pembayaran</li>
        </ol>
      </div>
      
      <button class="btn-next" onclick="confirmPaymentSuccess()" style="margin-top: 20px; width: 100%;">
        Saya Sudah Membayar
      </button>
    </div>
  `;
  
  openPaymentModal();
}

// ===== SHOW VIRTUAL ACCOUNT PAYMENT =====
function showVirtualAccountPayment(bank) {
  const modalBody = document.getElementById('payment-modal-body');
  
  const bankNames = {
    'bca': 'BCA',
    'bri': 'BRI',
    'bni': 'BNI',
    'mandiri': 'Mandiri'
  };
  
  const vaNumber = generateVANumber(bank);
  
  modalBody.innerHTML = `
    <div class="va-display">
      <h3 style="color: #fff;">Transfer ke Virtual Account ${bankNames[bank]}</h3>
      <p style="color: #fff;">Silakan transfer ke nomor rekening berikut:</p>
      
      <div class="va-number">
        <div class="va-label">Nomor Virtual Account</div>
        <div class="va-code">${vaNumber}</div>
        <button class="copy-button" onclick="copyToClipboard('${vaNumber}')">
          <i class="bi bi-clipboard"></i> Salin Nomor
        </button>
      </div>
      
      <div class="payment-amount">Rp ${formatPrice(orderData.total)}</div>
      
      <div class="payment-instructions">
        <h4>Cara Pembayaran:</h4>
        <ol>
          <li>Login ke internet banking / mobile banking ${bankNames[bank]}</li>
          <li>Pilih menu Transfer / Pembayaran</li>
          <li>Pilih Virtual Account / Transfer ke ${bankNames[bank]}</li>
          <li>Masukkan nomor Virtual Account di atas</li>
          <li>Masukkan nominal: <strong>Rp ${formatPrice(orderData.total)}</strong></li>
          <li>Konfirmasi dan selesaikan pembayaran</li>
        </ol>
        <p style="color: #ff6b6b; margin-top: 15px;">
          <i class="bi bi-exclamation-triangle"></i> 
          Virtual Account berlaku selama 24 jam
        </p>
      </div>
      
      <button class="btn-next" onclick="confirmPaymentSuccess()" style="margin-top: 20px; width: 100%;">
        Saya Sudah Transfer
      </button>
    </div>
  `;
  
  openPaymentModal();
}

// ===== GENERATE VA NUMBER =====
function generateVANumber(bank) {
  const bankCodes = {
    'bca': '7',
    'bri': '8',
    'bni': '9',
    'mandiri': '8'
  };
  
  const code = bankCodes[bank];
  const randomNumber = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
  
  return code + randomNumber;
}

// ===== SHOW E-WALLET PAYMENT =====
function showEWalletPayment(wallet) {
  const modalBody = document.getElementById('payment-modal-body');
  
  const walletNames = {
    'gopay': 'GoPay',
    'ovo': 'OVO',
    'dana': 'DANA',
    'shopeepay': 'ShopeePay'
  };
  
  modalBody.innerHTML = `
    <div class="va-display">
      <h3 style="color: #fff;">Pembayaran ${walletNames[wallet]}</h3>
      <p>Anda akan diarahkan ke aplikasi ${walletNames[wallet]}</p>
      
      <div class="payment-amount">Rp ${formatPrice(orderData.total)}</div>
      
      <div class="payment-instructions">
        <h4>Cara Pembayaran:</h4>
        <ol>
          <li>Klik tombol "Bayar dengan ${walletNames[wallet]}" di bawah</li>
          <li>Anda akan diarahkan ke aplikasi ${walletNames[wallet]}</li>
          <li>Konfirmasi pembayaran di aplikasi</li>
          <li>Tunggu notifikasi pembayaran berhasil</li>
        </ol>
      </div>
      
      <button class="btn-next" onclick="redirectToEWallet('${wallet}')" style="margin-top: 20px; width: 100%;">
        <i class="bi bi-wallet2"></i> Bayar dengan ${walletNames[wallet]}
      </button>
    </div>
  `;
  
  openPaymentModal();
}

// ===== REDIRECT TO E-WALLET =====
function redirectToEWallet(wallet) {
  showNotification('info', `Membuka aplikasi ${wallet.toUpperCase()}...`);
  
  setTimeout(() => {
    confirmPaymentSuccess();
  }, 2000);
}

// ===== SHOW CREDIT CARD PAYMENT =====
function showCreditCardPayment() {
  const modalBody = document.getElementById('payment-modal-body');
  
  modalBody.innerHTML = `
    <div class="va-display">
      <h3 style="color: #fff;">Pembayaran Kartu Kredit/Debit</h3>
      <p>Masukkan detail kartu Anda</p>
      
      <div class="payment-instructions" style="text-align: left;">
        <div class="form-group" style="margin-bottom: 20px;">
          <label style="color: #fff; display: block; margin-bottom: 8px;">Nomor Kartu</label>
          <input type="text" placeholder="1234 5678 9012 3456" maxlength="19" 
                 style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;">
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
          <div class="form-group">
            <label style="color: #fff; display: block; margin-bottom: 8px;">Berlaku Hingga</label>
            <input type="text" placeholder="MM/YY" maxlength="5"
                   style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;">
          </div>
          <div class="form-group">
            <label style="color: #fff; display: block; margin-bottom: 8px;">CVV</label>
            <input type="text" placeholder="123" maxlength="3"
                   style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;">
          </div>
        </div>
        
        <div class="form-group" style="margin-bottom: 20px;">
          <label style="color: #fff; display: block; margin-bottom: 8px;">Nama Pemegang Kartu</label>
          <input type="text" placeholder="NAMA SESUAI KARTU"
                 style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;">
        </div>
        
        <div class="payment-amount" style="margin: 20px 0;">Rp ${formatPrice(orderData.total)}</div>
      </div>
      
      <button class="btn-next" onclick="processCreditCard()" style="margin-top: 20px; width: 100%;">
        <i class="bi bi-credit-card"></i> Bayar Sekarang
      </button>
    </div>
  `;
  
  openPaymentModal();
}

// ===== PROCESS CREDIT CARD =====
function processCreditCard() {
  showNotification('info', 'Memproses pembayaran...');
  
  setTimeout(() => {
    confirmPaymentSuccess();
  }, 2000);
}

// ===== SHOW COD CONFIRMATION =====
function showCODConfirmation() {
  const modalBody = document.getElementById('payment-modal-body');
  
  modalBody.innerHTML = `
    <div class="va-display">
      <h3 style="color: #fff;">Pembayaran di Tempat (COD)</h3>
      <p>Anda memilih metode Cash on Delivery</p>
      
      <div style="background: rgba(0, 191, 255, 0.1); border: 2px solid rgba(0, 191, 255, 0.3); border-radius: 12px; padding: 20px; margin: 20px 0;">
        <i class="bi bi-info-circle" style="font-size: 32px; color: #00bfff;"></i>
        <p style="color: #ddd; margin-top: 15px; line-height: 1.8;">
          Pesanan Anda akan diproses dan dikirim. Pembayaran dilakukan saat barang tiba di alamat Anda.
        </p>
      </div>
      
      <div class="payment-amount">Rp ${formatPrice(orderData.total)}</div>
      
      <div class="payment-instructions">
        <h4>Catatan Penting:</h4>
        <ul style="text-align: left; color: #ddd; line-height: 2;">
          <li>Siapkan uang pas untuk memudahkan transaksi</li>
          <li>Periksa kondisi barang sebelum membayar</li>
          <li>Minta bukti pembayaran dari kurir</li>
          <li>Konfirmasi penerimaan barang di aplikasi</li>
        </ul>
      </div>
      
      <button class="btn-next" onclick="confirmCOD()" style="margin-top: 20px; width: 100%;">
        <i class="bi bi-check-circle"></i> Konfirmasi Pesanan COD
      </button>
    </div>
  `;
  
  openPaymentModal();
}

// ===== CONFIRM COD =====
function confirmCOD() {
  // Update order status
  orderData.status = 'processing';
  orderData.paidAt = null; // COD belum dibayar
  saveOrder(orderData);
  
  // ===== CRITICAL FIX: Add notification using persistent system =====
  if (window.SessionManager && window.SessionManager.isLoggedIn()) {
    const currentUser = window.SessionManager.getCurrentUser();
    
    if (currentUser) {
      // Add notification using persistent system
      NotificationSystem.addNotification(currentUser.username, {
        type: 'order_cod',
        title: 'Pesanan COD Berhasil! 📦',
        message: `Pesanan ${productData.name} dengan Order ID: ${orderData.orderId} telah dikonfirmasi. Pembayaran dilakukan saat barang tiba (COD). Pengiriman akan dilakukan dalam 1-2 hari kerja. Pastikan Anda berada di lokasi saat kurir tiba. Terima kasih telah berbelanja di Klik Second!`,
        productId: productData.id,
        orderId: orderData.orderId
      });
      
      console.log('✅ COD notification added for user:', currentUser.username);
    }
  }
  
  closePaymentModal();
  showSuccessModal();
}

// ===== COPY TO CLIPBOARD =====
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('success', 'Nomor berhasil disalin!');
  }).catch(() => {
    showNotification('error', 'Gagal menyalin nomor');
  });
}

// ===== CONFIRM PAYMENT SUCCESS =====
function confirmPaymentSuccess() {
  // Update order status
  orderData.status = 'paid';
  orderData.paidAt = new Date().toISOString();
  saveOrder(orderData);
  
  // ===== CRITICAL FIX: Add notification using persistent system =====
  if (window.SessionManager && window.SessionManager.isLoggedIn()) {
    const currentUser = window.SessionManager.getCurrentUser();
    
    if (currentUser) {
      // Add notification using persistent system
      const notificationAdded = NotificationSystem.addNotification(currentUser.username, {
        type: 'order_success',
        title: 'Pesanan Berhasil Dibayar! 🎉',
        message: `Pesanan ${productData.name} dengan Order ID: ${orderData.orderId} telah berhasil dibayar. Pengiriman akan dilakukan dalam 1-2 hari kerja. Kami akan mengirimkan nomor resi melalui email dan notifikasi. Terima kasih telah berbelanja di Klik Second!`,
        productId: productData.id,
        orderId: orderData.orderId
      });
      
      if (notificationAdded) {
        console.log('✅ Payment success notification added for user:', currentUser.username);
      } else {
        console.error('❌ Failed to add notification');
      }
    }
  }
  
  // Close payment modal
  closePaymentModal();
  
  // Show success modal
  showSuccessModal();
  
  console.log('✅ Payment confirmed successfully');
}

// ===== OPEN/CLOSE PAYMENT MODAL =====
function openPaymentModal() {
  document.getElementById('payment-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
  document.getElementById('payment-modal').classList.remove('active');
  document.body.style.overflow = '';
}

// ===== SHOW SUCCESS MODAL =====
function showSuccessModal() {
  const modal = document.getElementById('success-modal');
  document.getElementById('display-order-id').textContent = orderData.orderId;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Send email confirmation (in real app)
  console.log('📧 Sending confirmation email to:', customerInfo.email);
  
  // ===== CRITICAL FIX: Redirect with delay to ensure notification is saved =====
  // Auto redirect after 3 seconds
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 3000);
}

// ===== APPLY PROMO CODE =====
function applyPromo() {
  const promoInput = document.getElementById('promo-input');
  const code = promoInput.value.trim().toUpperCase();
  
  if (!code) {
    showNotification('error', 'Masukkan kode promo!');
    return;
  }
  
  const promo = promoCodes[code];
  
  if (!promo) {
    showNotification('error', 'Kode promo tidak valid!');
    promoInput.value = '';
    return;
  }
  
  // Calculate discount
  let discountAmount;
  if (promo.discount < 1) {
    // Percentage discount
    discountAmount = Math.floor(productData.price * promo.discount);
  } else {
    // Fixed amount discount
    discountAmount = promo.discount;
  }
  
  // Update price breakdown
  updatePriceBreakdown(discountAmount);
  
  showNotification('success', `Promo ${promo.description} berhasil diterapkan!`);
  
  // Disable promo input
  promoInput.disabled = true;
  promoInput.style.opacity = '0.5';
  
  console.log('🎉 Promo applied:', code, 'Discount:', discountAmount);
}

// ===== SHOW NOTIFICATION =====
function showNotification(type, message) {
  // Remove existing notification
  const existing = document.querySelector('.checkout-notification');
  if (existing) {
    existing.remove();
  }
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = `checkout-notification ${type}`;
  
  const icons = {
    'success': 'bi-check-circle-fill',
    'error': 'bi-x-circle-fill',
    'info': 'bi-info-circle-fill'
  };
  
  const colors = {
    'success': 'linear-gradient(135deg, #00ff7f, #00cc66)',
    'error': 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
    'info': 'linear-gradient(135deg, #00bfff, #0099cc)'
  };
  
  notification.innerHTML = `
    <i class="bi ${icons[type]}"></i>
    <span>${message}</span>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 30px;
    background: ${colors[type]};
    color: #000;
    padding: 15px 25px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: bold;
    z-index: 10000;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== ADD ANIMATION STYLES =====
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

// ===== EXPOSE FUNCTIONS TO GLOBAL SCOPE =====
window.goToStep = goToStep;
window.proceedToConfirmation = proceedToConfirmation;
window.submitOrder = submitOrder;
window.applyPromo = applyPromo;
window.copyToClipboard = copyToClipboard;
window.confirmPaymentSuccess = confirmPaymentSuccess;
window.closePaymentModal = closePaymentModal;
window.redirectToEWallet = redirectToEWallet;
window.processCreditCard = processCreditCard;
window.confirmCOD = confirmCOD;

console.log('✅ Checkout system ready!');