// ===== NAVBAR CART MANAGER (FIXED - NO AUTO CLOSE BUG) =====
console.log('🛒 Navbar Cart Manager Loading...');

class NavbarCartManager {
  constructor() {
    this.cart = [];
    this.isDropdownOpen = false;
    this.init();
  }

  init() {
    this.loadCartFromStorage();
    this.createNavbarCart();
    this.createCartDropdown();
    this.updateNavbarCart();
    this.setupEventListeners();
    console.log('✅ Navbar Cart initialized');
  }

  // ===== LOAD CART FROM LOCALSTORAGE =====
  loadCartFromStorage() {
    try {
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        this.cart = JSON.parse(cartData);
        console.log('📦 Cart loaded:', this.cart.length, 'items');
      }
    } catch (e) {
      console.error('❌ Error loading cart:', e);
      this.cart = [];
    }
  }

  // ===== SAVE CART TO LOCALSTORAGE =====
  saveCartToStorage() {
    try {
      localStorage.setItem('cart', JSON.stringify(this.cart));
      console.log('💾 Cart saved');
    } catch (e) {
      console.error('❌ Error saving cart:', e);
    }
  }

  // ===== CREATE NAVBAR CART BUTTON =====
  createNavbarCart() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) {
      console.error('❌ Navbar not found');
      return;
    }

    let cartSection = document.querySelector('.navbar-cart-section');
    
    if (!cartSection) {
      cartSection = document.createElement('div');
      cartSection.className = 'navbar-cart-section';
      cartSection.innerHTML = `
        <button class="navbar-cart-btn" id="navbar-cart-btn">
          <i class="bi bi-cart-fill"></i>
          <span class="navbar-cart-badge">0</span>
        </button>
      `;

      const authButtons = navbar.querySelector('.auth-buttons');
      const userProfile = navbar.querySelector('.user-profile-section');
      const insertBefore = authButtons || userProfile;

      if (insertBefore) {
        navbar.insertBefore(cartSection, insertBefore);
      } else {
        navbar.appendChild(cartSection);
      }
    }
  }

  // ===== CREATE CART DROPDOWN =====
  createCartDropdown() {
    const existing = document.getElementById('navbar-cart-dropdown');
    if (existing) existing.remove();

    const cartSection = document.querySelector('.navbar-cart-section');
    if (!cartSection) return;

    const dropdown = document.createElement('div');
    dropdown.id = 'navbar-cart-dropdown';
    dropdown.className = 'navbar-cart-dropdown';
    dropdown.innerHTML = `
      <div class="cart-dropdown-header">
        <h3>
          <i class="bi bi-cart-fill"></i>
          Keranjang Belanja
        </h3>
        <span class="cart-dropdown-count">0 Item</span>
      </div>
      <div class="cart-dropdown-items" id="cart-dropdown-items">
        <!-- Items will be rendered here -->
      </div>
      <div class="cart-dropdown-footer">
        <div class="cart-dropdown-subtotal">
          <span class="cart-dropdown-subtotal-label">Subtotal:</span>
          <span class="cart-dropdown-subtotal-value">Rp 0</span>
        </div>
        <div class="cart-dropdown-actions">
          <button class="btn-view-full-cart">
            <i class="bi bi-cart"></i> Lihat Keranjang
          </button>
          <button class="btn-checkout-now">
            <i class="bi bi-lightning-charge-fill"></i> Checkout
          </button>
        </div>
      </div>
    `;

    cartSection.style.position = 'relative';
    cartSection.appendChild(dropdown);
  }

  // ===== SETUP EVENT LISTENERS (FIXED) =====
  setupEventListeners() {
    // Toggle dropdown on cart button click
    const cartBtn = document.getElementById('navbar-cart-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDropdown();
      });
    }

    // ===== FIXED: Close dropdown when clicking outside =====
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('navbar-cart-dropdown');
      const cartBtn = document.getElementById('navbar-cart-btn');
      
      if (!dropdown || !cartBtn) return;
      
      // ✅ FIX: Check if click is inside dropdown OR on interactive elements
      const isClickInsideDropdown = dropdown.contains(e.target);
      const isClickOnCartBtn = cartBtn.contains(e.target);
      const isQuantityBtn = e.target.closest('.quantity-btn-cart');
      const isRemoveBtn = e.target.closest('.cart-dropdown-item-remove');
      
      // Only close if click is truly outside and not on interactive buttons
      if (!isClickInsideDropdown && !isClickOnCartBtn && !isQuantityBtn && !isRemoveBtn) {
        this.closeDropdown();
      }
    });

    // View cart button
    const viewCartBtn = document.querySelector('.btn-view-full-cart');
    if (viewCartBtn) {
      viewCartBtn.addEventListener('click', () => {
        window.location.href = 'cart.html';
      });
    }

    // Checkout button
    const checkoutBtn = document.querySelector('.btn-checkout-now');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (this.cart.length === 0) {
          this.showToast('Keranjang Anda masih kosong!', 'warning');
          return;
        }
        window.location.href = 'checkout.html';
      });
    }
  }

  // ===== ADD ITEM TO CART =====
  addItem(product) {
    const existingIndex = this.cart.findIndex(item => item.id === product.id);

    if (existingIndex >= 0) {
      this.cart[existingIndex].quantity += 1;
      console.log('📦 Updated quantity:', this.cart[existingIndex].name);
      this.showToast(`${product.name} jumlahnya ditambahkan!`, 'success');
    } else {
      this.cart.push({
        ...product,
        quantity: 1,
        addedAt: new Date().toISOString()
      });
      console.log('✅ Added to cart:', product.name);
      this.showToast(`${product.name} ditambahkan ke keranjang!`, 'success');
    }

    this.saveCartToStorage();
    this.updateNavbarCart();
    this.updateCartDropdown();
    this.shakeCartIcon();
    
    // Auto open dropdown briefly
    this.openDropdown();
    setTimeout(() => {
      if (this.isDropdownOpen) {
        this.closeDropdown();
      }
    }, 3000);
  }

  // ===== UPDATE ITEM QUANTITY (FIXED) =====
  updateQuantity(productId, change) {
    const itemIndex = this.cart.findIndex(item => item.id === productId);
    
    if (itemIndex >= 0) {
      this.cart[itemIndex].quantity += change;
      
      // Remove if quantity is 0
      if (this.cart[itemIndex].quantity <= 0) {
        this.removeItem(productId);
        return;
      }
      
      this.saveCartToStorage();
      this.updateNavbarCart();
      this.updateCartDropdown();
      
      // ✅ CRITICAL FIX: Keep dropdown open after quantity change
      console.log('✅ Quantity updated, dropdown stays open');
    }
  }

  // ===== REMOVE ITEM FROM CART =====
  removeItem(productId) {
    const item = this.cart.find(item => item.id === productId);
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCartToStorage();
    this.updateNavbarCart();
    this.updateCartDropdown();
    
    if (item) {
      this.showToast(`${item.name} dihapus dari keranjang`, 'info');
    }
    
    console.log('🗑️ Removed from cart:', productId);
  }

  // ===== UPDATE NAVBAR CART DISPLAY =====
  updateNavbarCart() {
    const badge = document.querySelector('.navbar-cart-badge');
    const countLabel = document.querySelector('.cart-dropdown-count');
    
    const totalItems = this.getTotalItems();

    if (badge) {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    if (countLabel) {
      countLabel.textContent = `${totalItems} Item`;
    }
  }

  // ===== UPDATE CART DROPDOWN (FIXED) =====
  updateCartDropdown() {
    const itemsContainer = document.getElementById('cart-dropdown-items');
    const subtotalValue = document.querySelector('.cart-dropdown-subtotal-value');
    
    if (!itemsContainer) return;

    if (this.cart.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-dropdown-empty">
          <i class="bi bi-cart-x"></i>
          <h4>Keranjang Kosong</h4>
          <p>Belum ada produk yang ditambahkan</p>
          <a href="index.html" class="btn-start-shopping">
            <i class="bi bi-shop"></i> Mulai Belanja
          </a>
        </div>
      `;
      
      if (subtotalValue) {
        subtotalValue.textContent = 'Rp 0';
      }
      return;
    }

    // ✅ FIXED: Use event delegation to prevent auto-close
    itemsContainer.innerHTML = this.cart.map(item => `
      <div class="cart-dropdown-item" data-product-id="${item.id}">
        <img src="${item.image || item.images[0]}" alt="${item.name}" class="cart-dropdown-item-image">
        <div class="cart-dropdown-item-info">
          <h4 class="cart-dropdown-item-name">${item.name}</h4>
          <div class="cart-dropdown-item-details">
            <span><i class="bi bi-star-fill"></i> Grade ${item.grade}</span>
            <span><i class="bi bi-battery-charging"></i> ${item.battery}</span>
          </div>
          <div class="cart-dropdown-item-price">Rp ${this.formatPrice(item.price)}</div>
          <div class="cart-dropdown-item-quantity">
            <div class="quantity-control">
              <button class="quantity-btn-cart" data-action="decrease" data-product-id="${item.id}">
                <i class="bi bi-dash"></i>
              </button>
              <span class="quantity-value-cart">${item.quantity}</span>
              <button class="quantity-btn-cart" data-action="increase" data-product-id="${item.id}">
                <i class="bi bi-plus"></i>
              </button>
            </div>
          </div>
        </div>
        <button class="cart-dropdown-item-remove" data-product-id="${item.id}">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `).join('');

    // ✅ FIXED: Add event delegation for quantity buttons
    this.setupQuantityButtons();

    // Update subtotal
    if (subtotalValue) {
      subtotalValue.textContent = `Rp ${this.formatPrice(this.getTotalPrice())}`;
    }
  }

  // ===== NEW: Setup Quantity Buttons with Event Delegation =====
  setupQuantityButtons() {
    const itemsContainer = document.getElementById('cart-dropdown-items');
    if (!itemsContainer) return;

    // Remove old listeners
    const oldContainer = itemsContainer.cloneNode(false);
    itemsContainer.parentNode.replaceChild(oldContainer, itemsContainer);
    oldContainer.innerHTML = itemsContainer.innerHTML;

    // Add new event delegation
    oldContainer.addEventListener('click', (e) => {
      e.stopPropagation(); // ✅ CRITICAL: Stop event bubbling

      const quantityBtn = e.target.closest('.quantity-btn-cart');
      const removeBtn = e.target.closest('.cart-dropdown-item-remove');

      if (quantityBtn) {
        const productId = quantityBtn.dataset.productId;
        const action = quantityBtn.dataset.action;
        const change = action === 'increase' ? 1 : -1;
        
        this.updateQuantity(productId, change);
      } else if (removeBtn) {
        const productId = removeBtn.dataset.productId;
        this.removeItem(productId);
      }
    });
  }

  // ===== TOGGLE DROPDOWN =====
  toggleDropdown() {
    if (this.isDropdownOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  // ===== OPEN DROPDOWN =====
  openDropdown() {
    const dropdown = document.getElementById('navbar-cart-dropdown');
    if (!dropdown) return;

    dropdown.classList.add('show');
    this.isDropdownOpen = true;
    this.updateCartDropdown();
  }

  // ===== CLOSE DROPDOWN =====
  closeDropdown() {
    const dropdown = document.getElementById('navbar-cart-dropdown');
    if (!dropdown) return;

    dropdown.classList.remove('show');
    this.isDropdownOpen = false;
  }

  // ===== SHAKE CART ICON =====
  shakeCartIcon() {
    const cartBtn = document.getElementById('navbar-cart-btn');
    if (!cartBtn) return;

    cartBtn.classList.add('shake');
    setTimeout(() => {
      cartBtn.classList.remove('shake');
    }, 500);
  }

  // ===== SHOW TOAST NOTIFICATION =====
  showToast(message, type = 'success') {
    const existing = document.querySelector('.cart-toast');
    if (existing) existing.remove();

    const icons = {
      'success': 'bi-check-circle-fill',
      'warning': 'bi-exclamation-circle-fill',
      'info': 'bi-info-circle-fill'
    };

    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = `
      <i class="bi ${icons[type] || icons.success}"></i>
      <span>${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }

  // ===== GET TOTAL ITEMS =====
  getTotalItems() {
    return this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  // ===== GET TOTAL PRICE =====
  getTotalPrice() {
    return this.cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  }

  // ===== FORMAT PRICE =====
  formatPrice(price) {
    return new Intl.NumberFormat('id-ID').format(price);
  }

  // ===== GET CART =====
  getCart() {
    return this.cart;
  }

  // ===== CLEAR CART =====
  clearCart() {
    this.cart = [];
    this.saveCartToStorage();
    this.updateNavbarCart();
    this.updateCartDropdown();
    console.log('🗑️ Cart cleared');
  }
}

// ===== INITIALIZE =====
let navbarCartManager = null;

function initNavbarCart() {
  if (!navbarCartManager) {
    navbarCartManager = new NavbarCartManager();
    window.navbarCartManager = navbarCartManager;
    console.log('✅ Navbar Cart Manager initialized');
  }
}

// ===== AUTO INITIALIZE =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavbarCart);
} else {
  initNavbarCart();
}

// ===== OVERRIDE ADD TO CART FUNCTION =====
window.addToCart = function() {
  if (!window.currentProduct) {
    alert('Produk tidak ditemukan!');
    return;
  }

  if (window.navbarCartManager) {
    window.navbarCartManager.addItem(window.currentProduct);
  } else {
    console.error('❌ Navbar Cart Manager not initialized');
  }
};

console.log('✅ Navbar Cart script loaded');