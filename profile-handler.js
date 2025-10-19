// ===== ENHANCED PROFILE PAGE HANDLER =====
// Professional E-commerce Profile Management System

console.log('🎯 Enhanced Profile Handler Loading...');

class ProfileManager {
  constructor() {
    this.currentUser = null;
    this.activeTab = 'profile';
    this.init();
  }

  // ===== INITIALIZATION =====
  async init() {
    if (!this.checkAuthentication()) return;
    
    this.currentUser = window.SessionManager.getCurrentUser();
    this.setupEventListeners();
    await this.loadProfileData();
    this.initTabs();
    this.initModals();
    
    console.log('✅ Profile Manager Initialized');
  }

  // ===== AUTHENTICATION CHECK =====
  checkAuthentication() {
    if (!window.SessionManager || !window.SessionManager.isLoggedIn()) {
      this.showError('Anda harus login terlebih dahulu!');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
      return false;
    }
    return true;
  }

  // ===== LOAD PROFILE DATA =====
  async loadProfileData() {
    try {
      const fullUser = this.getFullUserData();
      if (!fullUser) {
        this.showError('Data user tidak ditemukan');
        return;
      }

      // Update sidebar profile
      this.updateElement('profile-avatar', fullUser.profilePicture, 'src');
      this.updateElement('profile-name', fullUser.fullName);
      this.updateElement('profile-role', fullUser.role === 'seller' ? 'Seller' : 'Buyer');

      // Update profile info
      this.updateElement('info-fullname', fullUser.fullName);
      this.updateElement('info-email', fullUser.email);
      this.updateElement('info-phone', fullUser.phone);
      this.updateElement('info-joindate', this.formatDate(fullUser.joinDate));
      this.updateElement('info-address', fullUser.address || 'Belum diisi');

      // Update stats
      await this.updateProfileStats();

      console.log('✅ Profile data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading profile:', error);
      this.showError('Gagal memuat data profil');
    }
  }

  // ===== UPDATE PROFILE STATS =====
  async updateProfileStats() {
    const stats = await this.calculateUserStats();
    
    // Sidebar stats
    this.updateElement('stat-products', stats.totalProducts);
    this.updateElement('stat-orders', stats.totalOrders);
    this.updateElement('stat-rating', stats.avgRating.toFixed(1));

    // Detailed stats
    this.updateElement('stats-total-products', stats.totalProducts);
    this.updateElement('stats-sold-products', stats.soldProducts);
    this.updateElement('stats-pending-products', stats.pendingProducts);
    this.updateElement('stats-avg-rating', stats.avgRating.toFixed(1));
  }

  // ===== CALCULATE USER STATS =====
  async calculateUserStats() {
    // Check if sample data is enabled
    const showSample = localStorage.getItem('showSampleData') !== 'false';
    
    if (showSample && window.profileDataGenerator) {
      // Use sample data
      const sampleProducts = window.profileDataGenerator.sampleUserProducts || [];
      const sampleOrders = window.profileDataGenerator.sampleUserOrders || [];
      
      return {
        totalProducts: sampleProducts.length,
        soldProducts: sampleProducts.filter(p => p.status === 'sold').length,
        pendingProducts: sampleProducts.filter(p => p.status === 'pending').length,
        totalOrders: sampleOrders.length,
        avgRating: 4.8
      };
    }

    // Real data (would come from backend API)
    return {
      totalProducts: 0,
      soldProducts: 0,
      pendingProducts: 0,
      totalOrders: 0,
      avgRating: 0.0
    };
  }

  // ===== TAB MANAGEMENT =====
  initTabs() {
    const menuItems = document.querySelectorAll('.menu-item');
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get('tab') || 'profile';

    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = item.getAttribute('data-tab');
        this.switchTab(tabName);
        this.updateURL(tabName);
      });
    });

    this.switchTab(initialTab);
  }

  switchTab(tabName) {
    this.activeTab = tabName;

    // Update menu items
    document.querySelectorAll('.menu-item').forEach(item => {
      if (item.getAttribute('data-tab') === tabName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
      if (content.id === tabName + '-tab') {
        content.classList.add('active');
        this.loadTabContent(tabName);
      } else {
        content.classList.remove('active');
      }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateURL(tabName) {
    const url = new URL(window.location);
    url.searchParams.set('tab', tabName);
    window.history.pushState({}, '', url);
  }

  // ===== LOAD TAB CONTENT =====
  async loadTabContent(tabName) {
    switch(tabName) {
      case 'products':
        await this.loadProducts();
        break;
      case 'orders':
        await this.loadOrders();
        break;
      case 'auctions':
        await this.loadAuctions();
        break;
      case 'pawnshop':
        await this.loadPawnshop();
        break;
      default:
        break;
    }
  }

  // ===== LOAD PRODUCTS =====
  async loadProducts() {
    const productsList = document.getElementById('products-list');
    if (!productsList) return;

    productsList.innerHTML = '<div class="loading-spinner"><i class="bi bi-arrow-repeat"></i> Loading...</div>';

    try {
      if (window.profileDataGenerator) {
        window.profileDataGenerator.loadProductsWithSample();
      } else {
        productsList.innerHTML = this.renderEmptyState(
          'box-seam',
          'Belum Ada Produk',
          'Anda belum memiliki produk yang dijual. Mulai upload produk pertama Anda!',
          'Upload Produk',
          'index.html'
        );
      }
    } catch (error) {
      console.error('Error loading products:', error);
      productsList.innerHTML = this.renderErrorState('Gagal memuat produk');
    }
  }

  // ===== LOAD ORDERS =====
  async loadOrders(filterStatus = 'all') {
    const ordersList = document.getElementById('orders-list');
    if (!ordersList) return;

    // Setup filter buttons
    this.setupOrderFilters(filterStatus);

    ordersList.innerHTML = '<div class="loading-spinner"><i class="bi bi-arrow-repeat"></i> Loading...</div>';

    try {
      if (window.profileDataGenerator) {
        window.profileDataGenerator.loadOrdersWithSample(filterStatus);
      } else {
        ordersList.innerHTML = this.renderEmptyState(
          'bag-x',
          'Belum Ada Pesanan',
          'Anda belum memiliki pesanan. Mulai belanja gadget favoritmu sekarang!',
          'Mulai Belanja',
          'index.html'
        );
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      ordersList.innerHTML = this.renderErrorState('Gagal memuat pesanan');
    }
  }

  setupOrderFilters(activeStatus) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      const status = btn.getAttribute('data-status');
      
      if (status === activeStatus) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }

      btn.onclick = () => {
        this.loadOrders(status);
      };
    });
  }

  // ===== LOAD AUCTIONS =====
  async loadAuctions() {
    const auctionsList = document.getElementById('auctions-list');
    if (!auctionsList) return;

    auctionsList.innerHTML = '<div class="loading-spinner"><i class="bi bi-arrow-repeat"></i> Loading...</div>';

    try {
      if (window.profileDataGenerator) {
        window.profileDataGenerator.loadAuctionsWithSample();
      } else {
        auctionsList.innerHTML = this.renderEmptyState(
          'gavel',
          'Belum Ada Lelang',
          'Anda belum mengikuti lelang apapun. Ikuti lelang untuk mendapatkan gadget dengan harga terbaik!',
          'Lihat Lelang',
          'lelang.html'
        );
      }
    } catch (error) {
      console.error('Error loading auctions:', error);
      auctionsList.innerHTML = this.renderErrorState('Gagal memuat lelang');
    }
  }

  // ===== LOAD PAWNSHOP =====
  async loadPawnshop() {
    const pawnshopList = document.getElementById('pawnshop-list');
    if (!pawnshopList) return;

    pawnshopList.innerHTML = '<div class="loading-spinner"><i class="bi bi-arrow-repeat"></i> Loading...</div>';

    try {
      if (window.profileDataGenerator) {
        window.profileDataGenerator.loadPawnshopWithSample();
      } else {
        pawnshopList.innerHTML = this.renderEmptyState(
          'gem',
          'Belum Ada Gadget yang Digadaikan',
          'Anda belum menggadaikan gadget apapun. Butuh dana cepat? Gadaikan gadgetmu sekarang!',
          'Gadaikan Sekarang',
          'pegadaian.html'
        );
      }
    } catch (error) {
      console.error('Error loading pawnshop:', error);
      pawnshopList.innerHTML = this.renderErrorState('Gagal memuat data pegadaian');
    }
  }

  // ===== MODAL MANAGEMENT =====
  initModals() {
    this.initEditProfileModal();
    this.initChangePasswordModal();
    this.initDeleteAccountModal();
    this.initChangeAvatarModal();
  }

  // ===== EDIT PROFILE MODAL =====
  initEditProfileModal() {
    const btnEdit = document.getElementById('btn-edit-profile');
    const modal = document.getElementById('edit-profile-modal');
    const closeBtn = document.getElementById('close-edit-modal');
    const cancelBtn = document.getElementById('cancel-edit');
    const form = document.getElementById('edit-profile-form');

    if (btnEdit) {
      btnEdit.onclick = () => this.openEditModal();
    }

    if (closeBtn) {
      closeBtn.onclick = () => this.closeModal(modal);
    }

    if (cancelBtn) {
      cancelBtn.onclick = () => this.closeModal(modal);
    }

    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) this.closeModal(modal);
      };
    }

    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        this.saveProfileChanges();
      };
    }
  }

  openEditModal() {
    const modal = document.getElementById('edit-profile-modal');
    const userData = this.getFullUserData();

    if (userData) {
      document.getElementById('edit-fullname').value = userData.fullName || '';
      document.getElementById('edit-email').value = userData.email || '';
      document.getElementById('edit-phone').value = userData.phone || '';
      document.getElementById('edit-address').value = userData.address || '';
    }

    modal.classList.add('active');
  }

  async saveProfileChanges() {
    const fullname = document.getElementById('edit-fullname').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    const address = document.getElementById('edit-address').value.trim();

    if (!fullname || !email || !phone) {
      this.showError('Nama, email, dan telepon harus diisi!');
      return;
    }

    if (!this.validateEmail(email)) {
      this.showError('Format email tidak valid!');
      return;
    }

    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) throw new Error('Data users tidak ditemukan');

      const usersData = JSON.parse(storedData);
      const userIndex = usersData.users.findIndex(u => u.username === this.currentUser.username);

      if (userIndex !== -1) {
        // Update user data
        usersData.users[userIndex].fullName = fullname;
        usersData.users[userIndex].email = email;
        usersData.users[userIndex].phone = phone;
        usersData.users[userIndex].address = address;

        // Save to localStorage
        localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));

        // Update session
        window.SessionManager.saveSession({
          username: this.currentUser.username,
          fullname: fullname,
          email: email,
          phone: phone,
          role: this.currentUser.role,
          avatar: this.currentUser.avatar
        });

        // Reload profile data
        await this.loadProfileData();

        // Close modal
        this.closeModal(document.getElementById('edit-profile-modal'));

        this.showSuccess('Profil berhasil diperbarui!');
      }
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      this.showError('Gagal menyimpan perubahan');
    }
  }

  // ===== CHANGE PASSWORD MODAL =====
  initChangePasswordModal() {
    const btnChange = document.getElementById('btn-change-password');
    const modal = document.getElementById('change-password-modal');
    const closeBtn = document.getElementById('close-password-modal');
    const cancelBtn = document.getElementById('cancel-password');
    const form = document.getElementById('change-password-form');

    if (btnChange) {
      btnChange.onclick = () => modal.classList.add('active');
    }

    if (closeBtn) {
      closeBtn.onclick = () => this.closeModal(modal, form);
    }

    if (cancelBtn) {
      cancelBtn.onclick = () => this.closeModal(modal, form);
    }

    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) this.closeModal(modal, form);
      };
    }

    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        this.changePassword();
      };
    }
  }

  async changePassword() {
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!oldPassword || !newPassword || !confirmPassword) {
      this.showError('Semua field harus diisi!');
      return;
    }

    if (newPassword.length < 6) {
      this.showError('Password baru minimal 6 karakter!');
      return;
    }

    if (newPassword !== confirmPassword) {
      this.showError('Password baru tidak cocok!');
      return;
    }

    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) throw new Error('Data users tidak ditemukan');

      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.username === this.currentUser.username);

      if (!user) {
        this.showError('User tidak ditemukan!');
        return;
      }

      if (user.password !== oldPassword) {
        this.showError('Password lama salah!');
        return;
      }

      user.password = newPassword;
      localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));

      const modal = document.getElementById('change-password-modal');
      const form = document.getElementById('change-password-form');
      this.closeModal(modal, form);

      this.showSuccess('Password berhasil diubah!');
    } catch (error) {
      console.error('❌ Error changing password:', error);
      this.showError('Gagal mengubah password');
    }
  }

  // ===== DELETE ACCOUNT =====
  initDeleteAccountModal() {
    const btnDelete = document.getElementById('btn-delete-account');
    
    if (btnDelete) {
      btnDelete.onclick = () => this.confirmDeleteAccount();
    }
  }

  confirmDeleteAccount() {
    const confirmation = confirm(
      '⚠️ PERINGATAN!\n\n' +
      'Apakah Anda yakin ingin menghapus akun?\n\n' +
      'Semua data Anda akan dihapus secara permanen dan tidak dapat dikembalikan.'
    );

    if (confirmation) {
      const finalConfirm = prompt('Ketik "HAPUS AKUN" untuk mengonfirmasi:');
      
      if (finalConfirm === 'HAPUS AKUN') {
        this.deleteUserAccount();
      } else {
        this.showInfo('Penghapusan akun dibatalkan.');
      }
    }
  }

  async deleteUserAccount() {
    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) throw new Error('Data users tidak ditemukan');

      const usersData = JSON.parse(storedData);
      usersData.users = usersData.users.filter(u => u.username !== this.currentUser.username);
      
      localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
      window.SessionManager.clearSession();
      
      this.showSuccess('Akun Anda telah dihapus. Terima kasih telah menggunakan Klik Second.');
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    } catch (error) {
      console.error('❌ Error deleting account:', error);
      this.showError('Gagal menghapus akun');
    }
  }

  // ===== CHANGE AVATAR =====
  initChangeAvatarModal() {
    const btnChangeAvatar = document.getElementById('change-avatar-btn');
    
    if (btnChangeAvatar) {
      btnChangeAvatar.onclick = () => this.changeAvatar();
    }
  }

  changeAvatar() {
    const colors = ['00ffff', '4169e1', 'ff6b6b', '2ed573', 'ffa500', '9333ea', 'e056fd', '48dbfb'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.currentUser.fullname)}&background=${randomColor}&color=fff&size=200`;
    
    this.updateUserAvatar(newAvatar);
  }

  async updateUserAvatar(avatarUrl) {
    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) throw new Error('Data users tidak ditemukan');

      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.username === this.currentUser.username);

      if (user) {
        user.profilePicture = avatarUrl;
        localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));

        window.SessionManager.saveSession({
          username: this.currentUser.username,
          fullname: this.currentUser.fullname,
          email: this.currentUser.email,
          phone: this.currentUser.phone,
          role: this.currentUser.role,
          avatar: avatarUrl
        });

        document.getElementById('profile-avatar').src = avatarUrl;
        const userAvatar = document.querySelector('.user-avatar');
        if (userAvatar) userAvatar.src = avatarUrl;

        this.showSuccess('Avatar berhasil diperbarui!');
      }
    } catch (error) {
      console.error('❌ Error updating avatar:', error);
      this.showError('Gagal mengubah avatar');
    }
  }

  // ===== HELPER FUNCTIONS =====
  getFullUserData() {
    const storedData = localStorage.getItem('klikSecondUsers');
    if (!storedData) return null;

    const usersData = JSON.parse(storedData);
    return usersData.users.find(u => u.username === this.currentUser.username);
  }

  updateElement(id, value, attribute = 'textContent') {
    const element = document.getElementById(id);
    if (element) {
      if (attribute === 'src' || attribute === 'href') {
        element[attribute] = value;
      } else {
        element.textContent = value;
      }
    }
  }

  formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  }

  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  closeModal(modal, form = null) {
    modal.classList.remove('active');
    if (form) form.reset();
  }

  // ===== RENDER HELPERS =====
  renderEmptyState(icon, title, message, btnText, btnLink) {
    return `
      <div class="empty-state">
        <i class="bi bi-${icon}"></i>
        <h3>${title}</h3>
        <p>${message}</p>
        <button class="btn-add-product" onclick="window.location.href='${btnLink}'">
          <i class="bi bi-plus-circle"></i>
          ${btnText}
        </button>
      </div>
    `;
  }

  renderErrorState(message) {
    return `
      <div class="empty-state">
        <i class="bi bi-exclamation-triangle" style="color: #ff6b6b;"></i>
        <h3>Oops!</h3>
        <p>${message}</p>
        <button class="btn-add-product" onclick="location.reload()">
          <i class="bi bi-arrow-clockwise"></i>
          Coba Lagi
        </button>
      </div>
    `;
  }

  // ===== NOTIFICATIONS =====
  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showInfo(message) {
    this.showNotification(message, 'info');
  }

  showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.profile-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `profile-notification ${type}`;
    notification.innerHTML = `
      <i class="bi bi-${type === 'success' ? 'check-circle-fill' : type === 'error' ? 'x-circle-fill' : 'info-circle-fill'}"></i>
      <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // ===== EVENT LISTENERS =====
  setupEventListeners() {
    // Settings toggles
    this.initSettingsToggles();

    // Browser back/forward buttons
    window.addEventListener('popstate', () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get('tab') || 'profile';
      this.switchTab(tab);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'e') {
          e.preventDefault();
          this.openEditModal();
        }
      }
    });
  }

  initSettingsToggles() {
    const toggles = document.querySelectorAll('.toggle-switch input');
    
    toggles.forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        const setting = e.target.id;
        const isEnabled = e.target.checked;
        
        this.saveUserSettings(setting, isEnabled);
        this.showSuccess(`Pengaturan ${setting} telah diperbarui`);
      });
    });

    this.loadUserSettings();
  }

  saveUserSettings(setting, value) {
    try {
      const settingsKey = `userSettings_${this.currentUser.username}`;
      let settings = JSON.parse(localStorage.getItem(settingsKey) || '{}');
      
      settings[setting] = value;
      localStorage.setItem(settingsKey, JSON.stringify(settings));
    } catch (error) {
      console.error('❌ Error saving settings:', error);
    }
  }

  loadUserSettings() {
    try {
      const settingsKey = `userSettings_${this.currentUser.username}`;
      const settings = JSON.parse(localStorage.getItem(settingsKey) || '{}');
      
      Object.keys(settings).forEach(key => {
        const toggle = document.getElementById(key);
        if (toggle) toggle.checked = settings[key];
      });
    } catch (error) {
      console.error('❌ Error loading settings:', error);
    }
  }
}

// ===== AUTO-INITIALIZE =====
let profileManager;

async function initProfilePage() {
  console.log('📄 Initializing Enhanced Profile Page...');
  
  // Wait for dependencies
  await waitForDependencies();
  
  // Initialize Profile Manager
  profileManager = new ProfileManager();
  
  console.log('✅ Enhanced Profile Page Initialized');
}

function waitForDependencies() {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if (window.SessionManager) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 50);
    
    setTimeout(() => {
      clearInterval(checkInterval);
      resolve();
    }, 5000);
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProfilePage);
} else {
  initProfilePage();
}

// Export for global use
window.ProfileManager = ProfileManager;
window.profileManager = profileManager;

console.log('✅ Enhanced Profile Handler loaded successfully');