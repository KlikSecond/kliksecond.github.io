// ===== ADVANCED PRODUCT MANAGEMENT SYSTEM =====
// Professional E-commerce Product Manager for Profile Page

console.log('📦 Product Management System Loading...');

class ProductManagement {
  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.currentView = 'grid'; // 'grid' or 'list'
    this.sortBy = 'date-desc'; // 'date-desc', 'date-asc', 'price-desc', 'price-asc', 'name'
    this.filterStatus = 'all'; // 'all', 'active', 'sold', 'pending'
    this.searchQuery = '';
    this.currentPage = 1;
    this.itemsPerPage = 9;
  }

  // ===== INITIALIZE =====
  init() {
    this.loadProducts();
    this.setupEventListeners();
    this.renderToolbar();
    this.renderProducts();
    console.log('✅ Product Management Initialized');
  }

  // ===== LOAD PRODUCTS =====
  loadProducts() {
    // Check if using sample data
    const showSample = localStorage.getItem('showSampleData') !== 'false';
    
    if (showSample && window.profileDataGenerator) {
      this.products = window.profileDataGenerator.sampleUserProducts || [];
    } else {
      this.products = this.loadUserProducts();
    }

    this.filteredProducts = [...this.products];
    this.applyFilters();
  }

  loadUserProducts() {
    // Load real user products from localStorage or API
    const currentUser = window.SessionManager?.getCurrentUser();
    if (!currentUser) return [];

    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) return [];

      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.username === currentUser.username);
      
      return user?.products || [];
    } catch (error) {
      console.error('Error loading user products:', error);
      return [];
    }
  }

  // ===== RENDER TOOLBAR =====
  renderToolbar() {
    const container = document.getElementById('products-list');
    if (!container) return;

    const toolbar = document.createElement('div');
    toolbar.className = 'products-toolbar';
    toolbar.innerHTML = `
      <div class="toolbar-left">
        <div class="product-count">
          <i class="bi bi-box-seam"></i>
          <span>${this.filteredProducts.length} Produk</span>
        </div>
        
        <div class="profile-search">
          <input type="text" id="product-search" placeholder="Cari produk..." value="${this.searchQuery}">
          <i class="bi bi-search"></i>
        </div>
      </div>

      <div class="toolbar-right">
        <select id="product-sort" class="sort-select">
          <option value="date-desc">Terbaru</option>
          <option value="date-asc">Terlama</option>
          <option value="price-desc">Harga Tertinggi</option>
          <option value="price-asc">Harga Terendah</option>
          <option value="name">Nama A-Z</option>
        </select>

        <div class="filter-dropdown">
          <button class="filter-dropdown-btn">
            <i class="bi bi-funnel"></i>
            Filter
          </button>
          <div class="filter-dropdown-menu">
            <label class="filter-option">
              <input type="radio" name="status-filter" value="all" ${this.filterStatus === 'all' ? 'checked' : ''}>
              <span>Semua Status</span>
            </label>
            <label class="filter-option">
              <input type="radio" name="status-filter" value="active" ${this.filterStatus === 'active' ? 'checked' : ''}>
              <span>Aktif</span>
            </label>
            <label class="filter-option">
              <input type="radio" name="status-filter" value="sold" ${this.filterStatus === 'sold' ? 'checked' : ''}>
              <span>Terjual</span>
            </label>
            <label class="filter-option">
              <input type="radio" name="status-filter" value="pending" ${this.filterStatus === 'pending' ? 'checked' : ''}>
              <span>Pending</span>
            </label>
          </div>
        </div>

        <div class="view-toggle">
          <button class="view-toggle-btn ${this.currentView === 'grid' ? 'active' : ''}" data-view="grid">
            <i class="bi bi-grid-3x3-gap"></i>
          </button>
          <button class="view-toggle-btn ${this.currentView === 'list' ? 'active' : ''}" data-view="list">
            <i class="bi bi-list-ul"></i>
          </button>
        </div>
      </div>
    `;

    container.innerHTML = '';
    container.appendChild(toolbar);
  }

  // ===== SETUP EVENT LISTENERS =====
  setupEventListeners() {
    // Delegated event listeners
    document.addEventListener('click', (e) => {
      // View toggle
      if (e.target.closest('.view-toggle-btn')) {
        const btn = e.target.closest('.view-toggle-btn');
        this.currentView = btn.dataset.view;
        this.renderProducts();
      }

      // Filter dropdown
      if (e.target.closest('.filter-dropdown-btn')) {
        const dropdown = e.target.closest('.filter-dropdown');
        dropdown.classList.toggle('active');
      }

      // Close dropdown when clicking outside
      if (!e.target.closest('.filter-dropdown')) {
        document.querySelectorAll('.filter-dropdown').forEach(d => d.classList.remove('active'));
      }

      // Product actions
      if (e.target.closest('.btn-view-product')) {
        const productId = e.target.closest('.product-card').dataset.productId;
        this.viewProduct(productId);
      }

      if (e.target.closest('.btn-edit-product')) {
        const productId = e.target.closest('.product-card').dataset.productId;
        this.editProduct(productId);
      }

      if (e.target.closest('.btn-delete-product')) {
        const productId = e.target.closest('.product-card').dataset.productId;
        this.deleteProduct(productId);
      }

      // Pagination
      if (e.target.closest('.pagination-btn')) {
        const btn = e.target.closest('.pagination-btn');
        if (btn.dataset.page) {
          this.currentPage = parseInt(btn.dataset.page);
          this.renderProducts();
        }
      }
    });

    // Search input
    document.addEventListener('input', (e) => {
      if (e.target.id === 'product-search') {
        this.searchQuery = e.target.value;
        this.currentPage = 1;
        this.applyFilters();
        this.renderProducts();
      }
    });

    // Sort select
    document.addEventListener('change', (e) => {
      if (e.target.id === 'product-sort') {
        this.sortBy = e.target.value;
        this.applyFilters();
        this.renderProducts();
      }

      // Status filter
      if (e.target.name === 'status-filter') {
        this.filterStatus = e.target.value;
        this.currentPage = 1;
        this.applyFilters();
        this.renderProducts();
      }
    });
  }

  // ===== APPLY FILTERS =====
  applyFilters() {
    let filtered = [...this.products];

    // Status filter
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === this.filterStatus);
    }

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.grade.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch(this.sortBy) {
        case 'date-desc':
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        case 'date-asc':
          return new Date(a.dateAdded) - new Date(b.dateAdded);
        case 'price-desc':
          return b.price - a.price;
        case 'price-asc':
          return a.price - b.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    this.filteredProducts = filtered;
    this.renderToolbar(); // Update count
  }

  // ===== RENDER PRODUCTS =====
  renderProducts() {
    const container = document.getElementById('products-list');
    if (!container) return;

    // Keep toolbar
    const toolbar = container.querySelector('.products-toolbar');

    // Calculate pagination
    const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);

    // Render products
    const productsHTML = this.currentView === 'grid' 
      ? this.renderGridView(paginatedProducts)
      : this.renderListView(paginatedProducts);

    // Render pagination
    const paginationHTML = this.renderPagination(totalPages);

    container.innerHTML = '';
    if (toolbar) container.appendChild(toolbar);
    
    const productsContainer = document.createElement('div');
    productsContainer.innerHTML = productsHTML + paginationHTML;
    container.appendChild(productsContainer);

    // Animate entrance
    this.animateProducts();
  }

  // ===== RENDER GRID VIEW =====
  renderGridView(products) {
    if (products.length === 0) {
      return this.renderEmptyState();
    }

    return `
      <div class="products-grid">
        ${products.map(product => `
          <div class="product-card-grid" data-product-id="${product.id}">
            <div class="product-card-image">
              <img src="${product.image}" alt="${product.name}">
              <span class="product-card-status ${product.status}">${this.getStatusLabel(product.status)}</span>
              <div class="product-card-overlay">
                <button class="action-icon view btn-view-product" data-tooltip="Lihat Detail">
                  <i class="bi bi-eye"></i>
                </button>
                <button class="action-icon edit btn-edit-product" data-tooltip="Edit">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="action-icon delete btn-delete-product" data-tooltip="Hapus">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
            <div class="product-card-body">
              <h4 class="product-card-title">${product.name}</h4>
              <div class="product-card-meta">
                <span class="badge primary">Grade ${product.grade}</span>
                <span class="badge info">${product.battery}</span>
              </div>
              <div class="product-card-price">Rp ${this.formatPrice(product.price)}</div>
              <div class="product-card-stats">
                <span><i class="bi bi-eye"></i> ${product.views || 0} views</span>
                <span><i class="bi bi-calendar"></i> ${this.formatDate(product.dateAdded)}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ===== RENDER LIST VIEW =====
  renderListView(products) {
    if (products.length === 0) {
      return this.renderEmptyState();
    }

    return `
      <div class="products-list-view">
        ${products.map(product => `
          <div class="product-card" data-product-id="${product.id}">
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
                      <i class="bi bi-eye"></i> ${product.views || 0} views
                    </span>
                  </div>
                </div>
                <span class="product-status ${product.status}">${this.getStatusLabel(product.status)}</span>
              </div>
              <div class="product-price">Rp ${this.formatPrice(product.price)}</div>
              <div class="product-actions">
                <button class="btn-product-action btn-view btn-view-product">
                  <i class="bi bi-eye"></i> Lihat
                </button>
                <button class="btn-product-action btn-edit btn-edit-product">
                  <i class="bi bi-pencil"></i> Edit
                </button>
                <button class="btn-product-action btn-delete btn-delete-product">
                  <i class="bi bi-trash"></i> Hapus
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ===== RENDER PAGINATION =====
  renderPagination(totalPages) {
    if (totalPages <= 1) return '';

    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // Previous button
    const prevDisabled = this.currentPage === 1 ? 'disabled' : '';
    pages.push(`
      <button class="pagination-btn" data-page="${this.currentPage - 1}" ${prevDisabled}>
        <i class="bi bi-chevron-left"></i>
      </button>
    `);

    // First page
    if (startPage > 1) {
      pages.push(`<button class="pagination-btn" data-page="1">1</button>`);
      if (startPage > 2) {
        pages.push(`<span class="pagination-ellipsis">...</span>`);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      const active = i === this.currentPage ? 'active' : '';
      pages.push(`<button class="pagination-btn ${active}" data-page="${i}">${i}</button>`);
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(`<span class="pagination-ellipsis">...</span>`);
      }
      pages.push(`<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`);
    }

    // Next button
    const nextDisabled = this.currentPage === totalPages ? 'disabled' : '';
    pages.push(`
      <button class="pagination-btn" data-page="${this.currentPage + 1}" ${nextDisabled}>
        <i class="bi bi-chevron-right"></i>
      </button>
    `);

    return `<div class="pagination">${pages.join('')}</div>`;
  }

  // ===== RENDER EMPTY STATE =====
  renderEmptyState() {
    const message = this.searchQuery 
      ? `Tidak ada produk yang cocok dengan "${this.searchQuery}"`
      : this.filterStatus !== 'all'
        ? `Tidak ada produk dengan status "${this.getStatusLabel(this.filterStatus)}"`
        : 'Belum ada produk';

    return `
      <div class="empty-state">
        <i class="bi bi-inbox"></i>
        <h3>Tidak Ada Produk</h3>
        <p>${message}</p>
        ${!this.searchQuery && this.filterStatus === 'all' ? `
          <button class="btn-add-product" onclick="window.location.href='index.html'">
            <i class="bi bi-plus-circle"></i>
            Upload Produk
          </button>
        ` : `
          <button class="btn-add-product" onclick="window.productManagement.clearFilters()">
            <i class="bi bi-x-circle"></i>
            Hapus Filter
          </button>
        `}
      </div>
    `;
  }

  // ===== ANIMATE PRODUCTS =====
  animateProducts() {
    const cards = document.querySelectorAll('.product-card-grid, .product-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 50);
    });
  }

  // ===== PRODUCT ACTIONS =====
  viewProduct(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    // Redirect to product detail page
    window.location.href = `product-detail.html?id=${productId}`;
  }

  editProduct(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    // Open edit modal
    this.openEditModal(product);
  }

  deleteProduct(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    // Show confirmation dialog
    this.showConfirmation(
      'warning',
      'Hapus Produk?',
      `Apakah Anda yakin ingin menghapus "${product.name}"? Tindakan ini tidak dapat dibatalkan.`,
      () => {
        this.performDelete(productId);
      }
    );
  }

  performDelete(productId) {
    // Remove from array
    this.products = this.products.filter(p => p.id !== productId);
    
    // Save to localStorage if using real data
    if (localStorage.getItem('showSampleData') === 'false') {
      this.saveUserProducts();
    }

    // Update view
    this.applyFilters();
    this.renderProducts();

    // Show success message
    this.showNotification('Produk berhasil dihapus', 'success');
  }

  // ===== EDIT MODAL =====
  openEditModal(product) {
    // Create modal if not exists
    let modal = document.getElementById('edit-product-modal');
    if (!modal) {
      modal = this.createEditModal();
      document.body.appendChild(modal);
    }

    // Fill form
    document.getElementById('edit-product-id').value = product.id;
    document.getElementById('edit-product-name').value = product.name;
    document.getElementById('edit-product-price').value = product.price;
    document.getElementById('edit-product-grade').value = product.grade;
    document.getElementById('edit-product-battery').value = product.battery;
    document.getElementById('edit-product-storage').value = product.storage;

    modal.classList.add('active');
  }

  createEditModal() {
    const modal = document.createElement('div');
    modal.id = 'edit-product-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3><i class="bi bi-pencil-square"></i> Edit Produk</h3>
          <button class="modal-close" onclick="this.closest('.modal-overlay').classList.remove('active')">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <form id="edit-product-form">
          <input type="hidden" id="edit-product-id">
          <div class="form-group-modal">
            <label>Nama Produk</label>
            <input type="text" id="edit-product-name" required>
          </div>
          <div class="form-row">
            <div class="form-group-modal">
              <label>Harga</label>
              <input type="number" id="edit-product-price" required>
            </div>
            <div class="form-group-modal">
              <label>Grade</label>
              <select id="edit-product-grade" required>
                <option value="A">Grade A</option>
                <option value="B+">Grade B+</option>
                <option value="B">Grade B</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group-modal">
              <label>Battery Health</label>
              <input type="text" id="edit-product-battery" placeholder="90%" required>
            </div>
            <div class="form-group-modal">
              <label>Storage</label>
              <input type="text" id="edit-product-storage" placeholder="8GB + 256GB" required>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" onclick="this.closest('.modal-overlay').classList.remove('active')">
              Batal
            </button>
            <button type="submit" class="btn-save">
              <i class="bi bi-check-circle"></i> Simpan
            </button>
          </div>
        </form>
      </div>
    `;

    // Handle form submit
    modal.querySelector('#edit-product-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveProductEdit();
    });

    return modal;
  }

  saveProductEdit() {
    const productId = document.getElementById('edit-product-id').value;
    const name = document.getElementById('edit-product-name').value;
    const price = parseInt(document.getElementById('edit-product-price').value);
    const grade = document.getElementById('edit-product-grade').value;
    const battery = document.getElementById('edit-product-battery').value;
    const storage = document.getElementById('edit-product-storage').value;

    // Find and update product
    const product = this.products.find(p => p.id === productId);
    if (product) {
      product.name = name;
      product.price = price;
      product.grade = grade;
      product.battery = battery;
      product.storage = storage;

      // Save to localStorage if using real data
      if (localStorage.getItem('showSampleData') === 'false') {
        this.saveUserProducts();
      }

      // Close modal
      document.getElementById('edit-product-modal').classList.remove('active');

      // Update view
      this.applyFilters();
      this.renderProducts();

      // Show success message
      this.showNotification('Produk berhasil diperbarui', 'success');
    }
  }

  // ===== SAVE USER PRODUCTS =====
  saveUserProducts() {
    const currentUser = window.SessionManager?.getCurrentUser();
    if (!currentUser) return;

    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) return;

      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.username === currentUser.username);
      
      if (user) {
        user.products = this.products;
        localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
      }
    } catch (error) {
      console.error('Error saving products:', error);
    }
  }

  // ===== CLEAR FILTERS =====
  clearFilters() {
    this.searchQuery = '';
    this.filterStatus = 'all';
    this.currentPage = 1;
    this.applyFilters();
    this.renderProducts();
  }

  // ===== HELPER FUNCTIONS =====
  formatPrice(price) {
    return new Intl.NumberFormat('id-ID').format(price);
  }

  formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  }

  getStatusLabel(status) {
    const labels = {
      'active': 'Aktif',
      'sold': 'Terjual',
      'pending': 'Pending'
    };
    return labels[status] || status;
  }

  // ===== CONFIRMATION DIALOG =====
  showConfirmation(type, title, message, onConfirm) {
    let overlay = document.querySelector('.confirmation-overlay');
    
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'confirmation-overlay';
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="confirmation-dialog">
        <div class="confirmation-icon ${type}">
          <i class="bi bi-${type === 'warning' ? 'exclamation-triangle' : 'x-circle'}"></i>
        </div>
        <h3 class="confirmation-title">${title}</h3>
        <p class="confirmation-message">${message}</p>
        <div class="confirmation-actions">
          <button class="btn-cancel-confirm">Batal</button>
          <button class="btn-confirm">Ya, Lanjutkan</button>
        </div>
      </div>
    `;

    overlay.classList.add('show');

    // Event listeners
    overlay.querySelector('.btn-cancel-confirm').onclick = () => {
      overlay.classList.remove('show');
    };

    overlay.querySelector('.btn-confirm').onclick = () => {
      overlay.classList.remove('show');
      if (onConfirm) onConfirm();
    };

    overlay.onclick = (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('show');
      }
    };
  }

  // ===== NOTIFICATION =====
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `profile-notification ${type}`;
    notification.innerHTML = `
      <i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'info-circle-fill'}"></i>
      <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// ===== INITIALIZE =====
window.productManagement = null;

function initProductManagement() {
  const productsList = document.getElementById('products-list');
  if (productsList && window.location.pathname.includes('profile.html')) {
    window.productManagement = new ProductManagement();
    window.productManagement.init();
    console.log('✅ Product Management System Initialized');
  }
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductManagement);
} else {
  setTimeout(initProductManagement, 500);
}

console.log('✅ Product Management System Loaded');