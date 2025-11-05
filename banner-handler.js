// ===== BANNER SLIDER HANDLER =====
// File: banner-handler.js
// Purpose: Handle banner slider interactions and product navigation

console.log('🎪 Banner Handler initialized');

// ===== CONFIGURATION =====
const BANNER_CONFIG = {
  autoSlideInterval: 10000, // 10 seconds
  transitionDuration: 600    // 0.6 seconds
};

// ===== STATE =====
let currentSlide = 0;
let autoSlideInterval = null;
let slides = [];
let nextBtn = null;
let prevBtn = null;

// ===== INITIALIZE BANNER SLIDER =====
function initializeBannerSlider() {
  console.log('🎬 Initializing banner slider...');
  
  // Get DOM elements
  slides = document.querySelectorAll('.slider .slide');
  nextBtn = document.querySelector('.next');
  prevBtn = document.querySelector('.prev');
  
  if (!slides.length) {
    console.warn('⚠️ No slides found');
    return;
  }
  
  console.log(`✅ Found ${slides.length} slides`);
  
  // Initialize event listeners
  initializeSliderControls();
  
  // Start auto-slide
  startAutoSlide();
  
  // Show first slide
  showSlide(currentSlide);
  
  console.log('✅ Banner slider initialized successfully');
}

// ===== INITIALIZE SLIDER CONTROLS =====
function initializeSliderControls() {
  // Next button
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const nextIndex = (currentSlide + 1) % slides.length;
      showSlide(nextIndex, 'next');
      resetAutoSlide();
      console.log('➡️ Next slide:', nextIndex);
    });
  }
  
  // Previous button
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prevIndex, 'prev');
      resetAutoSlide();
      console.log('⬅️ Previous slide:', prevIndex);
    });
  }
  
  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  
  const sliderContainer = document.querySelector('.slider');
  
  if (sliderContainer) {
    sliderContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    sliderContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
  }
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next slide
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex, 'next');
        resetAutoSlide();
      } else {
        // Swipe right - previous slide
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex, 'prev');
        resetAutoSlide();
      }
    }
  }
}

// ===== SHOW SLIDE =====
function showSlide(index, direction = null) {
  if (!slides.length) return;
  
  const outgoingSlide = slides[currentSlide];
  const incomingSlide = slides[index];
  
  // Remove all animation classes
  slides.forEach((slide) => {
    slide.classList.remove('active', 'exit-left', 'exit-right', 'enter-from-left', 'enter-from-right');
  });
  
  if (direction === 'next') {
    // Slide from right
    incomingSlide.classList.add('enter-from-right');
    setTimeout(() => {
      incomingSlide.classList.remove('enter-from-right');
      incomingSlide.classList.add('active');
      outgoingSlide.classList.add('exit-left');
    }, 20);
  } else if (direction === 'prev') {
    // Slide from left
    incomingSlide.classList.add('enter-from-left');
    setTimeout(() => {
      incomingSlide.classList.remove('enter-from-left');
      incomingSlide.classList.add('active');
      outgoingSlide.classList.add('exit-right');
    }, 20);
  } else {
    // Initial load
    incomingSlide.classList.add('active');
  }
  
  currentSlide = index;
}

// ===== AUTO SLIDE =====
function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex, 'next');
  }, BANNER_CONFIG.autoSlideInterval);
  
  console.log('▶️ Auto-slide started');
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
  console.log('🔄 Auto-slide reset');
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
  console.log('⏸️ Auto-slide stopped');
}

// ===== BANNER PRODUCT NAVIGATION =====
function initializeBannerProductNavigation() {
  console.log('🔗 Initializing banner product navigation...');
  
  const bannerBuyButtons = document.querySelectorAll('.banner-buy-btn');
  
  if (!bannerBuyButtons.length) {
    console.warn('⚠️ No banner buy buttons found');
    return;
  }
  
  bannerBuyButtons.forEach((button, index) => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const productId = this.getAttribute('data-product-id');
      
      if (!productId) {
        console.error('❌ Product ID not found on button');
        showBannerNotification('error', 'Terjadi kesalahan. Silakan coba lagi.');
        return;
      }
      
      console.log(`🛒 Navigating to product detail: ${productId}`);
      
      // Add loading animation
      this.innerHTML = '<i class="bi bi-hourglass-split"></i> Loading...';
      this.style.opacity = '0.7';
      this.style.pointerEvents = 'none';
      
      // Navigate to product detail page
      setTimeout(() => {
        window.location.href = `product-detail.html?id=${productId}`;
      }, 300);
    });
    
    console.log(`✅ Button ${index + 1} initialized with product ID: ${button.getAttribute('data-product-id')}`);
  });
  
  console.log(`✅ Initialized ${bannerBuyButtons.length} banner buy buttons`);
}

// ===== BANNER NOTIFICATION =====
function showBannerNotification(type, message) {
  // Remove existing notification
  const existing = document.querySelector('.banner-notification');
  if (existing) {
    existing.remove();
  }
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = `banner-notification notification-${type}`;
  
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
  
  // Auto remove
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== PAUSE ON HOVER =====
function initializePauseOnHover() {
  const sliderContainer = document.querySelector('.content-iklan');
  
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => {
      stopAutoSlide();
      console.log('🖱️ Mouse entered - auto-slide paused');
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
      startAutoSlide();
      console.log('🖱️ Mouse left - auto-slide resumed');
    });
  }
}

// ===== KEYBOARD NAVIGATION =====
function initializeKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prevIndex, 'prev');
      resetAutoSlide();
      console.log('⌨️ Keyboard: Previous slide');
    } else if (e.key === 'ArrowRight') {
      const nextIndex = (currentSlide + 1) % slides.length;
      showSlide(nextIndex, 'next');
      resetAutoSlide();
      console.log('⌨️ Keyboard: Next slide');
    }
  });
}

// ===== WAIT FOR PRODUCTS DATA =====
async function waitForProductsData() {
  return new Promise((resolve) => {
    const maxAttempts = 30;
    let attempts = 0;
    
    const checkInterval = setInterval(() => {
      attempts++;
      
      if (window.productsData && window.productsData.banner) {
        clearInterval(checkInterval);
        console.log('✅ Products data ready for banner');
        resolve(true);
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        console.warn('⚠️ Timeout waiting for products data');
        resolve(false);
      }
    }, 100);
  });
}

// ===== MAIN INITIALIZATION =====
async function initializeBanner() {
  console.log('🚀 Starting banner initialization...');
  
  // Wait for products data
  const dataReady = await waitForProductsData();
  
  if (!dataReady) {
    console.error('❌ Failed to load products data for banner');
    return;
  }
  
  // Initialize slider
  initializeBannerSlider();
  
  // Initialize product navigation
  initializeBannerProductNavigation();
  
  // Initialize pause on hover
  initializePauseOnHover();
  
  // Initialize keyboard navigation
  initializeKeyboardNavigation();
  
  console.log('✅ Banner fully initialized');
}

// ===== START INITIALIZATION =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeBanner);
} else {
  initializeBanner();
}

// ===== EXPOSE FUNCTIONS TO GLOBAL SCOPE =====
window.bannerHandler = {
  showSlide,
  startAutoSlide,
  stopAutoSlide,
  resetAutoSlide,
  getCurrentSlide: () => currentSlide
};

console.log('✅ banner-handler.js loaded');