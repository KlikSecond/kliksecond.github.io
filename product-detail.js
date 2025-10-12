// ===== PRODUCT DETAIL PAGE - FIXED VERSION =====
console.log('🛍️ Product Detail page loaded');

// ===== PARTICLES.JS CONFIGURATION =====
particlesJS("particles-js", {
  particles: {
    number: { value: 80 },
    color: { value: "#00ffff" },
    shape: { type: "circle" },
    opacity: { value: 0.5 },
    size: { value: 3 },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#00ffff",
      opacity: 0.4,
      width: 1
    },
    move: { enable: true, speed: 2 }
  },
  interactivity: {
    events: {
      onhover: { enable: true, mode: "grab" },
      resize: true
    },
    modes: {
      grab: { distance: 140, line_linked: { opacity: 1 } }
    }
  },
  retina_detect: true
});

// ===== GLOBAL VARIABLES =====
let currentProduct = null;

// ===== GET ALL PRODUCTS =====
function getAllProducts() {
  // Get products from products-loader.js
  if (window.productsData) {
    console.log('✅ Products data found');
    return [
      ...window.productsData.tablets,
      ...window.productsData.android,
      ...window.productsData.iphone
    ];
  }
  console.warn('⚠️ Products data not found');
  return [];
}

// ===== GET PRODUCT BY ID =====
function getProductById(productId) {
  console.log('🔍 Looking for product:', productId);
  const allProducts = getAllProducts();
  const product = allProducts.find(product => product.id === productId);
  
  if (product) {
    console.log('✅ Product found:', product.name);
  } else {
    console.error('❌ Product not found with ID:', productId);
  }
  
  return product;
}

// ===== FORMAT PRICE =====
function formatPrice(price) {
  return new Intl.NumberFormat('id-ID').format(price);
}

// ===== RENDER STARS =====
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let starsHtml = '';
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="bi bi-star-fill"></i>';
  }
  
  // Half star
  if (hasHalfStar) {
    starsHtml += '<i class="bi bi-star-half"></i>';
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="bi bi-star"></i>';
  }
  
  return starsHtml;
}

// ===== UPDATE MAIN IMAGE =====
function updateMainImage(imageSrc) {
  const mainImage = document.getElementById('product-image');
  if (mainImage) {
    mainImage.src = imageSrc;
    
    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.image-thumbnails img');
    thumbnails.forEach(thumb => {
      if (thumb.src === imageSrc) {
        thumb.classList.add('active');
      } else {
        thumb.classList.remove('active');
      }
    });
  }
}

// ===== LOAD PRODUCT DETAILS =====
function loadProductDetails() {
  console.log('📱 Loading product details...');
  
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  console.log('🆔 Product ID from URL:', productId);
  
  if (!productId) {
    console.error('❌ No product ID in URL');
    alert('Produk tidak ditemukan! ID produk tidak ada di URL.');
    window.location.href = 'index.html';
    return;
  }
  
  // Get product data
  const product = getProductById(productId);
  
  if (!product) {
    console.error('❌ Product not found in database');
    alert('Data produk tidak ditemukan di database!');
    window.location.href = 'index.html';
    return;
  }
  
  // Store globally
  currentProduct = product;
  window.currentProduct = product;
  
  console.log('✅ Product loaded successfully:', product);
  
  // Update page title
  document.title = `${product.name} - Klik Second`;
  
  // Update breadcrumb
  const categoryEl = document.getElementById('product-category');
  const breadcrumbEl = document.getElementById('product-name-breadcrumb');
  
  if (categoryEl) categoryEl.textContent = product.category;
  if (breadcrumbEl) breadcrumbEl.textContent = product.name;
  
  // Update product name
  const nameEl = document.getElementById('product-name');
  if (nameEl) nameEl.textContent = product.name;
  
  // Update rating
  const ratingEl = document.getElementById('product-rating');
  const ratingValueEl = document.getElementById('rating-value');
  const reviewsCountEl = document.getElementById('reviews-count');
  
  if (ratingEl) ratingEl.innerHTML = renderStars(product.rating);
  if (ratingValueEl) ratingValueEl.textContent = product.rating;
  if (reviewsCountEl) reviewsCountEl.textContent = product.reviews;
  
  // Update price
  const priceEl = document.querySelector('#product-price span');
  if (priceEl) priceEl.textContent = formatPrice(product.price);
  
  // Update specs
  const conditionEl = document.getElementById('product-condition');
  const batteryEl = document.getElementById('product-battery');
  const storageEl = document.getElementById('product-storage');
  const usageEl = document.getElementById('product-usage');
  const gradeEl = document.getElementById('product-grade');
  
  if (conditionEl) conditionEl.textContent = product.condition;
  if (batteryEl) batteryEl.textContent = product.battery;
  if (storageEl) storageEl.textContent = product.storage;
  if (usageEl) usageEl.textContent = product.usage;
  if (gradeEl) gradeEl.textContent = `Grade ${product.grade}`;
  
  // Update seller info
  const sellerNameEl = document.getElementById('seller-name');
  const sellerRatingEl = document.getElementById('seller-rating');
  
  if (sellerNameEl) sellerNameEl.textContent = product.seller;
  if (sellerRatingEl) sellerRatingEl.textContent = product.rating;
  
  // Update shipping info
  const shippingEl = document.getElementById('product-shipping');
  const locationEl = document.getElementById('product-location');
  
  if (shippingEl) shippingEl.textContent = product.shipping;
  if (locationEl) locationEl.textContent = product.city;
  
  // Update description
  const descriptionContent = `
    <p><strong>${product.name}</strong> adalah gadget berkualitas tinggi yang tersedia di Klik Second dengan kondisi ${product.condition.toLowerCase()}.</p>
    
    <p><strong>Detail Produk:</strong></p>
    <ul>
      <li>Kategori: ${product.category}</li>
      <li>Kondisi: ${product.condition}</li>
      <li>Grade: ${product.grade}</li>
      <li>Kapasitas Penyimpanan: ${product.storage}</li>
      <li>Health Battery: ${product.battery}</li>
      <li>Lama Pemakaian: ${product.usage}</li>
    </ul>
    
    <p><strong>Keunggulan Produk:</strong></p>
    <ul>
      <li>✅ Produk Original & Bergaransi</li>
      <li>✅ Sudah Dicek Quality Control</li>
      <li>✅ Free Ongkir untuk wilayah tertentu</li>
      <li>✅ Kemasan Aman & Rapi</li>
      <li>✅ Bisa COD & Cicilan 0%</li>
    </ul>
    
    <p><strong>Yang Didapatkan:</strong></p>
    <ul>
      <li>📦 Unit ${product.name}</li>
      <li>📦 Charger Original</li>
      <li>📦 Kabel Data</li>
      <li>📦 Box Original</li>
      <li>📦 Manual Book & Kartu Garansi</li>
    </ul>
    
    <p><em>Catatan: Pastikan untuk memeriksa produk saat diterima. Jika ada kendala, segera hubungi kami untuk pengembalian atau penggantian.</em></p>
  `;
  
  const descriptionEl = document.getElementById('product-description');
  if (descriptionEl) descriptionEl.innerHTML = descriptionContent;
  
  // Load images
  loadProductImages(product);
  
  console.log('✅ All product details loaded');
}

// ===== LOAD PRODUCT IMAGES =====
function loadProductImages(product) {
  const mainImage = document.getElementById('product-image');
  const thumbnailsContainer = document.getElementById('thumbnails-container');
  
  if (!mainImage || !thumbnailsContainer) {
    console.warn('⚠️ Image elements not found');
    return;
  }
  
  if (product.images && product.images.length > 0) {
    // Set main image
    mainImage.src = product.images[0];
    mainImage.alt = product.name;
    
    console.log('✅ Main image loaded:', product.images[0]);
    
    // Clear and add thumbnails
    thumbnailsContainer.innerHTML = '';
    product.images.forEach((image, index) => {
      const thumbnail = document.createElement('img');
      thumbnail.src = image;
      thumbnail.alt = `${product.name} - Image ${index + 1}`;
      thumbnail.onclick = () => updateMainImage(image);
      
      // Mark first thumbnail as active
      if (index === 0) {
        thumbnail.classList.add('active');
      }
      
      thumbnailsContainer.appendChild(thumbnail);
    });
    
    console.log('✅ Thumbnails loaded:', product.images.length);
  } else {
    console.warn('⚠️ No images found for product');
  }
}

// ===== ADD TO CART FUNCTIONALITY =====
function addToCart() {
  if (!currentProduct) {
    console.error('❌ No product loaded');
    alert('Produk tidak ditemukan!');
    return;
  }
  
  console.log('🛒 Adding to cart:', currentProduct.name);
  
  // Get existing cart from localStorage
  let cart = [];
  try {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      cart = JSON.parse(cartData);
    }
  } catch (e) {
    console.error('Error reading cart:', e);
    cart = [];
  }
  
  // Check if product already in cart
  const existingIndex = cart.findIndex(item => item.id === currentProduct.id);
  
  if (existingIndex >= 0) {
    // Update quantity
    cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    console.log('📦 Updated quantity in cart');
  } else {
    // Add new item
    cart.push({
      ...currentProduct,
      quantity: 1,
      addedAt: new Date().toISOString()
    });
    console.log('✅ Added new item to cart');
  }
  
  // Save to localStorage
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('💾 Cart saved to localStorage');
  } catch (e) {
    console.error('Error saving cart:', e);
  }
  
  // Show success notification
  showNotification('success', `${currentProduct.name} berhasil ditambahkan ke keranjang!`);
  
  // Update cart badge if exists
  updateCartBadge();
}

// ===== BUY NOW FUNCTIONALITY =====
function buyNow() {
  if (!currentProduct) {
    console.error('❌ No product loaded');
    alert('Produk tidak ditemukan!');
    return;
  }
  
  console.log('💳 Redirecting to checkout for:', currentProduct.name);
  
  // Redirect to checkout page with product ID
  window.location.href = `checkout.html?id=${currentProduct.id}`;
}

// ===== UPDATE CART BADGE =====
function updateCartBadge() {
  const cartBadge = document.querySelector('.cart-badge');
  
  if (cartBadge) {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      
      cartBadge.textContent = totalItems;
      cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
      
      console.log('🔢 Cart badge updated:', totalItems);
    } catch (e) {
      console.error('Error updating cart badge:', e);
    }
  }
}

// ===== SHOW NOTIFICATION =====
function showNotification(type, message) {
  // Remove existing notification
  const existing = document.querySelector('.product-notification');
  if (existing) {
    existing.remove();
  }
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = `product-notification notification-${type}`;
  
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
    font-size: 14px;
    z-index: 10000;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  console.log(`📢 Notification: ${type} - ${message}`);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== ADD CSS ANIMATIONS =====
function addNotificationStyles() {
  if (document.getElementById('notification-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'notification-styles';
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
    
    .product-notification {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    @media (max-width: 768px) {
      .product-notification {
        top: 80px;
        right: 15px;
        left: 15px;
        padding: 12px 20px;
        font-size: 13px;
      }
    }
  `;
  
  document.head.appendChild(style);
}

// ===== WAIT FOR DEPENDENCIES =====
function waitForProductsData() {
  return new Promise((resolve) => {
    const maxAttempts = 50; // 5 seconds max
    let attempts = 0;
    
    const checkInterval = setInterval(() => {
      attempts++;
      
      if (window.productsData) {
        clearInterval(checkInterval);
        console.log('✅ Products data ready');
        resolve(true);
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        console.error('❌ Timeout waiting for products data');
        resolve(false);
      }
    }, 100);
  });
}

// ===== INITIALIZE =====
async function initialize() {
  console.log('🚀 Initializing product detail page...');
  
  // Add notification styles
  addNotificationStyles();
  
  // Wait for products data to load
  const dataReady = await waitForProductsData();
  
  if (!dataReady) {
    alert('Error: Data produk tidak dapat dimuat. Silakan refresh halaman.');
    return;
  }
  
  // Load product details
  loadProductDetails();
  
  // Update cart badge
  updateCartBadge();
  
  console.log('✅ Product detail page initialized');
}

// ===== START INITIALIZATION =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// ===== EXPOSE FUNCTIONS TO GLOBAL SCOPE =====
window.addToCart = addToCart;
window.buyNow = buyNow;
window.updateMainImage = updateMainImage;

console.log('✅ Product detail script loaded');