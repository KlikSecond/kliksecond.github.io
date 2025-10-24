// ===== SEARCH ENGINE - KLIK SECOND =====
// Advanced search with autocomplete, filters, and history

console.log('🔍 Search Engine loading...');

// ===== SEARCH STATE =====
const SearchEngine = {
  allProducts: [],
  filteredProducts: [],
  currentQuery: '',
  currentFilters: {
    categories: [],
    priceMin: 0,
    priceMax: 30000000,
    grades: [],
    batteries: [],
    locations: [],
    shipping: []
  },
  currentSort: 'relevant',
  currentPage: 1,
  itemsPerPage: 12,
  searchHistory: [],
  
  // Initialize
  init() {
    console.log('🚀 Initializing Search Engine...');
    this.loadProducts();
    this.loadSearchHistory();
    this.initEventListeners();
    this.initNavbarSearch();
    this.updateProductCounts();
    
    // Check if there's a query parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
      this.performSearch(query);
      document.getElementById('main-search-input').value = query;
    } else {
      this.displayAllProducts();
    }
  },
  
  // Load products from products-loader.js
  loadProducts() {
    if (window.productsData) {
      this.allProducts = [
        ...window.productsData.tablets,
        ...window.productsData.android,
        ...window.productsData.iphone
      ];
      console.log('✅ Loaded', this.allProducts.length, 'products');
    } else {
      console.error('❌ Products data not found');
    }
  },
  
  // Load search history from localStorage
  loadSearchHistory() {
    try {
      const history = localStorage.getItem('searchHistory');
      if (history) {
        this.searchHistory = JSON.parse(history);
        this.displaySearchHistory();
      }
    } catch (e) {
      console.error('Error loading search history:', e);
    }
  },
  
  // Save search to history
  saveToHistory(query) {
    if (!query || query.length < 2) return;
    
    // Remove duplicates and add to front
    this.searchHistory = this.searchHistory.filter(q => q !== query);
    this.searchHistory.unshift(query);
    
    // Keep only last 10
    if (this.searchHistory.length > 10) {
      this.searchHistory = this.searchHistory.slice(0, 10);
    }
    
    // Save to localStorage
    try {
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
      this.displaySearchHistory();
    } catch (e) {
      console.error('Error saving search history:', e);
    }
  },
  
  // Display search history
  displaySearchHistory() {
    const section = document.getElementById('search-history-section');
    const container = document.getElementById('history-tags');
    
    if (!section || !container) return;
    
    if (this.searchHistory.length > 0) {
      section.style.display = 'block';
      container.innerHTML = this.searchHistory.map(query => 
        `<span class="tag" onclick="SearchEngine.performSearch('${query}')">${query}</span>`
      ).join('');
    } else {
      section.style.display = 'none';
    }
  },
  
  // Clear search history
  clearHistory() {
    this.searchHistory = [];
    localStorage.removeItem('searchHistory');
    this.displaySearchHistory();
  },
  
  // Init event listeners
  initEventListeners() {
    // Main search button
    const btnMainSearch = document.getElementById('btn-main-search');
    const mainInput = document.getElementById('main-search-input');
    
    if (btnMainSearch) {
      btnMainSearch.addEventListener('click', () => {
        const query = mainInput.value.trim();
        this.performSearch(query);
      });
    }
    
    if (mainInput) {
      mainInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const query = mainInput.value.trim();
          this.performSearch(query);
        }
      });
    }
    
    // Popular tags
    document.querySelectorAll('.popular-tags .tag').forEach(tag => {
      tag.addEventListener('click', function() {
        const query = this.getAttribute('data-query');
        SearchEngine.performSearch(query);
      });
    });
    
    // Clear history button
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', () => this.clearHistory());
    }
    
    // Category filters
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => this.applyFilters());
    });
    
    // Grade filters
    document.querySelectorAll('input[name="grade"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => this.applyFilters());
    });
    
    // Battery filters
    document.querySelectorAll('input[name="battery"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => this.applyFilters());
    });
    
    // Location filters
    document.querySelectorAll('input[name="location"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => this.applyFilters());
    });
    
    // Shipping filters
    document.querySelectorAll('input[name="shipping"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => this.applyFilters());
    });
    
    // Price inputs
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    
    if (minPrice) {
      minPrice.addEventListener('change', () => this.applyFilters());
    }
    if (maxPrice) {
      maxPrice.addEventListener('change', () => this.applyFilters());
    }
    
    // Price slider
    const priceSlider = document.getElementById('price-slider');
    if (priceSlider) {
      priceSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        document.getElementById('max-price-label').textContent = 
          value >= 30000000 ? 'Rp 30jt+' : 'Rp ' + this.formatPrice(value);
      });
      priceSlider.addEventListener('change', () => this.applyFilters());
    }
    
    // Quick price filters
    document.querySelectorAll('.quick-price').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.quick-price').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const min = this.getAttribute('data-min') || 0;
        const max = this.getAttribute('data-max') || 30000000;
        
        document.getElementById('min-price').value = min;
        document.getElementById('max-price').value = max;
        
        SearchEngine.applyFilters();
      });
    });
    
    // Sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.sortAndDisplay();
      });
    }
    
    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const view = this.getAttribute('data-view');
        const grid = document.getElementById('results-grid');
        
        if (view === 'list') {
          grid.classList.add('list-view');
        } else {
          grid.classList.remove('list-view');
        }
      });
    });
    
    // Reset filters
    const resetBtn = document.getElementById('reset-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetFilters());
    }
    
    const resetSearchBtn = document.getElementById('btn-reset-search');
    if (resetSearchBtn) {
      resetSearchBtn.addEventListener('click', () => {
        this.currentQuery = '';
        document.getElementById('main-search-input').value = '';
        this.resetFilters();
        this.displayAllProducts();
      });
    }
    
    // Mobile filter toggle
    const mobileFilterToggle = document.getElementById('mobile-filter-toggle');
    const mobileFilterOverlay = document.getElementById('mobile-filter-overlay');
    const closeMobileFilter = document.getElementById('close-mobile-filter');
    
    if (mobileFilterToggle && mobileFilterOverlay) {
      mobileFilterToggle.addEventListener('click', () => {
        mobileFilterOverlay.classList.add('active');
        // Clone sidebar content to mobile overlay
        const sidebarContent = document.querySelector('.search-sidebar').cloneNode(true);
        document.querySelector('.mobile-filter-content').innerHTML = '';
        document.querySelector('.mobile-filter-content').appendChild(sidebarContent);
      });
    }
    
    if (closeMobileFilter) {
      closeMobileFilter.addEventListener('click', () => {
        mobileFilterOverlay.classList.remove('active');
      });
    }
    
    // Apply filters button (mobile)
    const applyFiltersMobile = document.getElementById('btn-apply-filters-mobile');
    if (applyFiltersMobile) {
      applyFiltersMobile.addEventListener('click', () => {
        this.applyFilters();
        if (mobileFilterOverlay) {
          mobileFilterOverlay.classList.remove('active');
        }
      });
    }
  },
  
  // Init navbar search with autocomplete
  initNavbarSearch() {
    const input = document.getElementById('navbar-search-input');
    const clearBtn = document.getElementById('navbar-clear-btn');
    const autocomplete = document.getElementById('navbar-autocomplete');
    
    if (!input || !autocomplete) return;
    
    // Show clear button when typing
    input.addEventListener('input', (e) => {
      const value = e.target.value;
      
      if (value.length > 0) {
        clearBtn.style.display = 'block';
        this.showAutocomplete(value);
      } else {
        clearBtn.style.display = 'none';
        autocomplete.classList.remove('active');
      }
    });
    
    // Clear button
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.style.display = 'none';
        autocomplete.classList.remove('active');
      });
    }
    
    // Enter key to search
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = input.value.trim();
        if (query) {
          window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
      }
    });
    
    // Close autocomplete when clicking outside
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !autocomplete.contains(e.target)) {
        autocomplete.classList.remove('active');
      }
    });
  },
  
  // Show autocomplete suggestions
  showAutocomplete(query) {
    const autocomplete = document.getElementById('navbar-autocomplete');
    if (!autocomplete) return;
    
    const lowerQuery = query.toLowerCase();
    
    // Filter products
    const matches = this.allProducts.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.city.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);
    
    if (matches.length === 0) {
      autocomplete.classList.remove('active');
      return;
    }
    
    // Build autocomplete HTML
    let html = '';
    
    // Products section
    if (matches.length > 0) {
      html += `
        <div class="autocomplete-section">
          <div class="autocomplete-header">
            <i class="bi bi-phone"></i> Produk
          </div>
      `;
      
      matches.forEach(product => {
        html += `
          <div class="autocomplete-item" onclick="window.location.href='product-detail.html?id=${product.id}'">
            <i class="bi bi-search"></i>
            <div class="autocomplete-item-content">
              <div class="autocomplete-item-title">${product.name}</div>
              <div class="autocomplete-item-subtitle">${product.category} • ${product.city}</div>
            </div>
            <div class="autocomplete-item-price">Rp ${this.formatPrice(product.price)}</div>
          </div>
        `;
      });
      
      html += '</div>';
    }
    
    // View all results
    html += `
      <div class="autocomplete-footer">
        <a href="search.html?q=${encodeURIComponent(query)}">
          Lihat semua hasil untuk "${query}"
          <i class="bi bi-arrow-right"></i>
        </a>
      </div>
    `;
    
    autocomplete.innerHTML = html;
    autocomplete.classList.add('active');
  },
  
  // Perform search
  performSearch(query) {
    this.currentQuery = query;
    this.currentPage = 1;
    
    // Save to history
    if (query) {
      this.saveToHistory(query);
      
      // Update input fields
      const mainInput = document.getElementById('main-search-input');
      if (mainInput) mainInput.value = query;
    }
    
    // Apply filters and search
    this.applyFilters();
    
    // Update URL
    if (window.history && query) {
      const url = new URL(window.location);
      url.searchParams.set('q', query);
      window.history.pushState({}, '', url);
    }
  },
  
  // Apply all filters
  applyFilters() {
    let products = [...this.allProducts];
    
    // Text search filter
    if (this.currentQuery) {
      const lowerQuery = this.currentQuery.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.city.toLowerCase().includes(lowerQuery) ||
        p.seller.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Category filter
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
      .map(cb => cb.value)
      .filter(v => v !== 'all');
    
    if (selectedCategories.length > 0) {
      products = products.filter(p => selectedCategories.includes(p.category));
    }
    
    // Price filter
    const minPrice = parseInt(document.getElementById('min-price')?.value || 0);
    const maxPrice = parseInt(document.getElementById('max-price')?.value || 30000000);
    
    products = products.filter(p => p.price >= minPrice && p.price <= maxPrice);
    
    // Grade filter
    const selectedGrades = Array.from(document.querySelectorAll('input[name="grade"]:checked'))
      .map(cb => cb.value);
    
    if (selectedGrades.length > 0) {
      products = products.filter(p => selectedGrades.includes(p.grade));
    }
    
    // Battery filter
    const selectedBatteries = Array.from(document.querySelectorAll('input[name="battery"]:checked'))
      .map(cb => cb.value);
    
    if (selectedBatteries.length > 0) {
      products = products.filter(p => {
        const battery = parseInt(p.battery);
        return selectedBatteries.some(range => {
          if (range === '90') return battery >= 90;
          if (range === '80') return battery >= 80 && battery < 90;
          if (range === '70') return battery < 80;
          return false;
        });
      });
    }
    
    // Location filter
    const selectedLocations = Array.from(document.querySelectorAll('input[name="location"]:checked'))
      .map(cb => cb.value);
    
    if (selectedLocations.length > 0) {
      products = products.filter(p => selectedLocations.includes(p.city));
    }
    
    // Shipping filter
    const selectedShipping = Array.from(document.querySelectorAll('input[name="shipping"]:checked'))
      .map(cb => cb.value);
    
    if (selectedShipping.length > 0) {
      if (selectedShipping.includes('free')) {
        products = products.filter(p => p.shipping && p.shipping.toLowerCase().includes('gratis'));
      }
    }
    
    this.filteredProducts = products;
    this.sortAndDisplay();
    this.updateActiveFilters();
  },
  
  // Sort and display products
  sortAndDisplay() {
    let products = [...this.filteredProducts];
    
    switch (this.currentSort) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popular':
        products.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
      case 'newest':
        // Assuming newer products have higher IDs
        products.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default: // relevant
        // Keep current order (already filtered by relevance)
        break;
    }
    
    this.displayProducts(products);
  },
  
  // Display all products (no filters)
  displayAllProducts() {
    this.filteredProducts = [...this.allProducts];
    this.sortAndDisplay();
  },
  
  // Display products with pagination
  displayProducts(products) {
    const grid = document.getElementById('results-grid');
    const emptyState = document.getElementById('empty-state');
    const resultsTitle = document.getElementById('results-title');
    const resultsCount = document.getElementById('results-count');
    
    if (!grid) return;
    
    // Update title and count
    if (resultsTitle) {
      resultsTitle.textContent = this.currentQuery 
        ? `Hasil pencarian "${this.currentQuery}"`
        : 'Semua Produk';
    }
    
    if (resultsCount) {
      resultsCount.textContent = `Menampilkan ${products.length} produk`;
    }
    
    // Show empty state if no results
    if (products.length === 0) {
      grid.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }
    
    grid.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';
    
    // Pagination
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const paginatedProducts = products.slice(start, end);
    
    // Render products
    grid.innerHTML = paginatedProducts.map(product => this.renderProductCard(product)).join('');
    
    // Update pagination
    this.updatePagination(products.length);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  
  // Render product card
  renderProductCard(product) {
    const gradeClass = product.grade === 'A' ? 'badge-grade-a' : 'badge-grade-b';
    
    return `
      <a href="product-detail.html?id=${product.id}" class="product-card-search">
        <div class="product-image-wrapper">
          <img src="${product.images[0]}" alt="${product.name}">
          <span class="product-badge ${gradeClass}">Grade ${product.grade}</span>
        </div>
        <div class="product-info-search">
          <h3 class="product-title-search">${product.name}</h3>
          <div class="product-specs">
            <span class="spec-item">
              <i class="bi bi-hdd"></i>
              ${product.storage}
            </span>
            <span class="spec-item">
              <i class="bi bi-battery-charging"></i>
              ${product.battery}
            </span>
          </div>
          <div class="product-price-search">Rp ${this.formatPrice(product.price)}</div>
          <div class="product-location">
            <i class="bi bi-geo-alt-fill"></i>
            ${product.city}
          </div>
          ${product.rating ? `
            <div class="product-rating">
              <span class="stars">${this.renderStars(product.rating)}</span>
              <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
            </div>
          ` : ''}
        </div>
      </a>
    `;
  },
  
  // Render stars
  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="bi bi-star-fill"></i>';
    }
    if (hasHalf) {
      stars += '<i class="bi bi-star-half"></i>';
    }
    const remaining = 5 - fullStars - (hasHalf ? 1 : 0);
    for (let i = 0; i < remaining; i++) {
      stars += '<i class="bi bi-star"></i>';
    }
    
    return stars;
  },
  
  // Update pagination
  updatePagination(totalItems) {
    const pagination = document.getElementById('pagination');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageNumbers = document.getElementById('page-numbers');
    
    if (!pagination) return;
    
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    
    if (totalPages <= 1) {
      pagination.style.display = 'none';
      return;
    }
    
    pagination.style.display = 'flex';
    
    // Update prev/next buttons
    if (prevBtn) {
      prevBtn.disabled = this.currentPage === 1;
      prevBtn.onclick = () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.sortAndDisplay();
        }
      };
    }
    
    if (nextBtn) {
      nextBtn.disabled = this.currentPage === totalPages;
      nextBtn.onclick = () => {
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.sortAndDisplay();
        }
      };
    }
    
    // Update page numbers
    if (pageNumbers) {
      let html = '';
      const maxVisible = 5;
      let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let endPage = Math.min(totalPages, startPage + maxVisible - 1);
      
      if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === this.currentPage ? 'active' : '';
        html += `
          <div class="page-number ${activeClass}" onclick="SearchEngine.goToPage(${i})">
            ${i}
          </div>
        `;
      }
      
      pageNumbers.innerHTML = html;
    }
  },
  
  // Go to specific page
  goToPage(page) {
    this.currentPage = page;
    this.sortAndDisplay();
  },
  
  // Update active filters display
  updateActiveFilters() {
    const container = document.getElementById('active-filters');
    const chipsContainer = document.getElementById('filter-chips');
    
    if (!container || !chipsContainer) return;
    
    const activeFilters = [];
    
    // Check categories
    const categories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
      .map(cb => cb.value)
      .filter(v => v !== 'all');
    categories.forEach(cat => activeFilters.push({ type: 'category', value: cat, label: cat }));
    
    // Check grades
    const grades = Array.from(document.querySelectorAll('input[name="grade"]:checked'))
      .map(cb => cb.value);
    grades.forEach(grade => activeFilters.push({ type: 'grade', value: grade, label: `Grade ${grade}` }));
    
    // Check locations
    const locations = Array.from(document.querySelectorAll('input[name="location"]:checked'))
      .map(cb => cb.value);
    locations.forEach(loc => activeFilters.push({ type: 'location', value: loc, label: loc }));
    
    if (activeFilters.length > 0) {
      container.style.display = 'flex';
      chipsContainer.innerHTML = activeFilters.map(filter => `
        <div class="filter-chip" onclick="SearchEngine.removeFilter('${filter.type}', '${filter.value}')">
          ${filter.label}
          <i class="bi bi-x"></i>
        </div>
      `).join('');
    } else {
      container.style.display = 'none';
    }
  },
  
  // Remove specific filter
  removeFilter(type, value) {
    const checkbox = document.querySelector(`input[name="${type}"][value="${value}"]`);
    if (checkbox) {
      checkbox.checked = false;
      this.applyFilters();
    }
  },
  
  // Reset all filters
  resetFilters() {
    // Uncheck all checkboxes
    document.querySelectorAll('.filter-checkbox input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
    });
    
    // Check "all" category
    const allCategoryCheckbox = document.querySelector('input[name="category"][value="all"]');
    if (allCategoryCheckbox) allCategoryCheckbox.checked = true;
    
    // Reset price inputs
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    
    // Reset quick price filters
    document.querySelectorAll('.quick-price').forEach(btn => btn.classList.remove('active'));
    
    this.currentFilters = {
      categories: [],
      priceMin: 0,
      priceMax: 30000000,
      grades: [],
      batteries: [],
      locations: [],
      shipping: []
    };
    
    this.applyFilters();
  },
  
  // Update product counts
  updateProductCounts() {
    const counts = {
      all: this.allProducts.length,
      iPhone: this.allProducts.filter(p => p.category === 'iPhone').length,
      Android: this.allProducts.filter(p => p.category === 'Android').length,
      Tablet: this.allProducts.filter(p => p.category === 'Tablet').length
    };
    
    document.getElementById('count-all').textContent = counts.all;
    document.getElementById('count-iphone').textContent = counts.iPhone;
    document.getElementById('count-android').textContent = counts.Android;
    document.getElementById('count-tablet').textContent = counts.Tablet;
  },
  
  // Format price
  formatPrice(price) {
    return new Intl.NumberFormat('id-ID').format(price);
  }
};

// ===== INITIALIZE ON DOM READY =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      SearchEngine.init();
    }, 100);
  });
} else {
  setTimeout(() => {
    SearchEngine.init();
  }, 100);
}

// Export to window
window.SearchEngine = SearchEngine;

console.log('✅ Search Engine loaded successfully');