// ===== MAIN SCRIPT FILE =====
// File: script.js
// Purpose: Main initialization and particles configuration

console.log('🎯 Main script.js loaded');

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

console.log('✅ Particles.js initialized');

// ===== HELPER FUNCTIONS =====

/**
 * Get all products from all categories (INCLUDING BANNER)
 * @returns {Array} Array of all products
 */
function getAllProducts() {
  if (window.productsData) {
    // ⭐ CRITICAL FIX: Include banner products
    return [
      ...(window.productsData.banner || []),
      ...(window.productsData.tablets || []),
      ...(window.productsData.android || []),
      ...(window.productsData.iphone || [])
    ];
  }
  return [];
}

/**
 * Get product by ID (searches in ALL categories including banner)
 * @param {string} productId - The product ID to search for
 * @returns {Object|null} Product object or null if not found
 */
function getProductById(productId) {
  console.log('🔍 Searching for product:', productId);
  const allProducts = getAllProducts();
  
  console.log('📦 Total products to search:', allProducts.length);
  
  const product = allProducts.find(product => product.id === productId);
  
  if (product) {
    console.log('✅ Product found:', product.name);
  } else {
    console.error('❌ Product not found with ID:', productId);
    console.log('Available product IDs:', allProducts.map(p => p.id).join(', '));
  }
  
  return product;
}

/**
 * Format price to Indonesian Rupiah format
 * @param {number} price - Price to format
 * @returns {string} Formatted price string
 */
function formatPrice(price) {
  return new Intl.NumberFormat('id-ID').format(price);
}

/**
 * Render star rating
 * @param {number} rating - Rating value (0-5)
 * @returns {string} HTML string with star icons
 */
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

// ===== SMOOTH SCROLL =====
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') return;
      
      e.preventDefault();
      
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  console.log('✅ Smooth scroll initialized');
}

// ===== SCROLL TO TOP BUTTON =====
function initializeScrollToTop() {
  let scrollToTopBtn = document.querySelector('.scroll-to-top');
  
  // Create button if it doesn't exist
  if (!scrollToTopBtn) {
    scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="bi bi-arrow-up-circle-fill"></i>';
    scrollToTopBtn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #00ffff, #00cccc);
      color: #000;
      border: none;
      font-size: 24px;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 999;
      box-shadow: 0 4px 15px rgba(0, 255, 255, 0.4);
    `;
    document.body.appendChild(scrollToTopBtn);
  }
  
  // Show/hide button on scroll
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.style.opacity = '1';
      scrollToTopBtn.style.visibility = 'visible';
    } else {
      scrollToTopBtn.style.opacity = '0';
      scrollToTopBtn.style.visibility = 'hidden';
    }
  });
  
  // Scroll to top on click
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  console.log('✅ Scroll to top button initialized');
}

// ===== LAZY LOAD IMAGES =====
function initializeLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
  
  console.log(`✅ Lazy loading initialized for ${images.length} images`);
}

// ===== GLOBAL ERROR HANDLER =====
window.addEventListener('error', (e) => {
  console.error('❌ Global error:', e.message);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('❌ Unhandled promise rejection:', e.reason);
});

// ===== DEBUG: VERIFY PRODUCTS DATA =====
function verifyProductsData() {
  console.log('🔍 Verifying products data...');
  
  if (window.productsData) {
    console.log('✅ Products data available');
    console.log('📊 Data structure:', {
      banner: window.productsData.banner?.length || 0,
      tablets: window.productsData.tablets?.length || 0,
      android: window.productsData.android?.length || 0,
      iphone: window.productsData.iphone?.length || 0
    });
    
    // List all product IDs
    const allProducts = getAllProducts();
    console.log('📦 Total products:', allProducts.length);
    console.log('🆔 All product IDs:', allProducts.map(p => p.id).join(', '));
  } else {
    console.warn('⚠️ Products data not yet loaded');
  }
}

// ===== MAIN INITIALIZATION =====
function initializeMainScript() {
  console.log('🚀 Initializing main script...');
  
  // Initialize smooth scroll
  initializeSmoothScroll();
  
  // Initialize scroll to top button
  initializeScrollToTop();
  
  // Initialize lazy loading
  initializeLazyLoading();
  
  // Verify products data after a delay
  setTimeout(() => {
    verifyProductsData();
  }, 1000);
  
  console.log('✅ Main script initialized successfully');
}

// ===== START INITIALIZATION =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeMainScript);
} else {
  initializeMainScript();
}

// ===== EXPOSE HELPER FUNCTIONS GLOBALLY =====
window.getAllProducts = getAllProducts;
window.getProductById = getProductById;
window.formatPrice = formatPrice;
window.renderStars = renderStars;

console.log('✅ script.js fully loaded');