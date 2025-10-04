// ===== MOBILE FIXES & ENHANCEMENTS =====

// Detect mobile device
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Adjust slider height based on content
function adjustSliderHeight() {
  const slider = document.querySelector('.content-iklan');
  const activeSlide = document.querySelector('.slide.active');
  
  if (slider && activeSlide && window.innerWidth <= 768) {
    // Get actual content height
    const caption = activeSlide.querySelector('.caption');
    const coverWrapper = activeSlide.querySelector('.cover-wrapper');
    
    if (caption && coverWrapper) {
      const captionHeight = caption.offsetHeight;
      const coverHeight = coverWrapper.offsetHeight;
      const totalHeight = captionHeight + coverHeight + 100; // 100px for padding
      
      // Set minimum height dynamically
      slider.style.minHeight = Math.max(totalHeight, 500) + 'px';
    }
  } else if (slider && window.innerWidth > 768) {
    // Reset to default on desktop
    slider.style.minHeight = '400px';
  }
}

// Optimize images for mobile
function optimizeImages() {
  if (window.innerWidth <= 768) {
    const coverImages = document.querySelectorAll('.cover-img');
    
    coverImages.forEach(img => {
      // Ensure images are loaded properly
      if (img.complete) {
        img.style.opacity = '1';
      } else {
        img.addEventListener('load', function() {
          this.style.opacity = '1';
        });
        img.addEventListener('error', function() {
          console.error('Failed to load image:', this.src);
          // Set placeholder if image fails
          this.src = 'https://via.placeholder.com/280x350?text=Product+Image';
        });
      }
    });
  }
}

// Fix auction banner overflow
function fixAuctionBannerOverflow() {
  const auctionBanner = document.querySelector('.auction-banner');
  const auctionContainer = document.querySelector('.auction-container');
  
  if (auctionBanner && auctionContainer && window.innerWidth <= 768) {
    // Ensure no horizontal overflow
    auctionContainer.style.maxWidth = '100%';
    auctionContainer.style.overflowX = 'hidden';
    
    // Adjust countdown timer if it overflows
    const countdownTimer = document.querySelector('.countdown-timer');
    if (countdownTimer) {
      const timerWidth = countdownTimer.scrollWidth;
      const containerWidth = countdownTimer.offsetWidth;
      
      if (timerWidth > containerWidth) {
        countdownTimer.style.flexWrap = 'wrap';
        countdownTimer.style.gap = '8px';
      }
    }
  }
}

// Handle orientation change
function handleOrientationChange() {
  adjustSliderHeight();
  fixAuctionBannerOverflow();
  
  // Wait for orientation change to complete
  setTimeout(() => {
    adjustSliderHeight();
    fixAuctionBannerOverflow();
  }, 300);
}

// Smooth scroll behavior for mobile
function enableSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '#!') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// Prevent horizontal scroll on mobile
function preventHorizontalScroll() {
  if (isMobileDevice()) {
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
  }
}

// Add touch feedback for buttons
function addTouchFeedback() {
  if (isMobileDevice()) {
    const buttons = document.querySelectorAll('button, .btn-join-auction, .read-now, .lihat-semua');
    
    buttons.forEach(button => {
      button.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
      });
      
      button.addEventListener('touchend', function() {
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
      });
    });
  }
}

// Lazy load images for better performance
function lazyLoadImages() {
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
}

// Fix viewport height on mobile browsers
function fixViewportHeight() {
  // Fix for mobile browsers where 100vh includes address bar
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', setVH);
}

// Optimize performance on mobile
function optimizePerformance() {
  if (isMobileDevice()) {
    // Reduce animation complexity on low-end devices
    const isLowEnd = navigator.hardwareConcurrency < 4 || 
                     navigator.deviceMemory < 4;
    
    if (isLowEnd) {
      document.body.classList.add('reduced-motion');
      
      // Add CSS for reduced motion
      const style = document.createElement('style');
      style.textContent = `
        .reduced-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Initialize all mobile fixes
function initMobileFixes() {
  // Run on page load
  adjustSliderHeight();
  optimizeImages();
  fixAuctionBannerOverflow();
  preventHorizontalScroll();
  enableSmoothScroll();
  addTouchFeedback();
  lazyLoadImages();
  fixViewportHeight();
  optimizePerformance();
  
  // Add event listeners
  window.addEventListener('resize', () => {
    adjustSliderHeight();
    fixAuctionBannerOverflow();
  });
  
  window.addEventListener('orientationchange', handleOrientationChange);
  
  // Re-adjust when slider changes
  const slides = document.querySelectorAll('.slide');
  slides.forEach(slide => {
    slide.addEventListener('transitionend', adjustSliderHeight);
  });
  
  // Monitor DOM changes for dynamic content
  const observer = new MutationObserver(() => {
    adjustSliderHeight();
    optimizeImages();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileFixes);
} else {
  initMobileFixes();
}

// Export functions for use in other scripts
window.mobileFixes = {
  adjustSliderHeight,
  optimizeImages,
  fixAuctionBannerOverflow,
  isMobileDevice
};