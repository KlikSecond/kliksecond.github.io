// ===== SESSION MANAGER (FIXED - NO LOOP) =====
// File ini harus di-load pertama kali di semua halaman

console.log('📦 Session Manager loading...');

const SessionManager = {
  // Key untuk localStorage
  SESSION_KEY: 'klikSecondSession',
  
  // Flag untuk prevent infinite loop
  _isUpdating: false,
  
  // Save session after login
  saveSession(userData) {
    const sessionData = {
      isLoggedIn: true,
      user: {
        username: userData.username,
        fullname: userData.fullname || userData.fullName, // Support both
        email: userData.email,
        phone: userData.phone,
        role: userData.role || 'buyer',
        avatar: userData.avatar || userData.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullname || userData.fullName)}&background=00ffff&color=000`,
        loginTime: new Date().toISOString()
      }
    };
    
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
      console.log('✅ Session saved:', sessionData.user.username);
      return true;
    } catch (e) {
      console.error('❌ Failed to save session:', e);
      return false;
    }
  },
  
  // Get current session
  getSession() {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (sessionData) {
        return JSON.parse(sessionData);
      }
    } catch (e) {
      console.error('❌ Failed to get session:', e);
    }
    return null;
  },
  
  // Check if user is logged in
  isLoggedIn() {
    const session = this.getSession();
    const isLogged = session && session.isLoggedIn === true;
    console.log('🔒 Is logged in:', isLogged);
    return isLogged;
  },
  
  // Get current user data
  getCurrentUser() {
    const session = this.getSession();
    return session ? session.user : null;
  },
  
  // Clear session (logout)
  clearSession() {
    try {
      localStorage.removeItem(this.SESSION_KEY);
      console.log('✅ Session cleared');
      return true;
    } catch (e) {
      console.error('❌ Failed to clear session:', e);
      return false;
    }
  },
  
  // ===== CRITICAL FIX: Update UI dengan flag anti-loop =====
  updateUIForAuth() {
    // Prevent multiple simultaneous updates
    if (this._isUpdating) {
      console.log('⏸️ Update already in progress, skipping...');
      return;
    }
    
    this._isUpdating = true;
    
    try {
      const authButtons = document.querySelector('.auth-buttons');
      const userProfileSection = document.querySelector('.user-profile-section');
      const floatingUploadBtn = document.querySelector('.floating-upload-btn');
      
      if (this.isLoggedIn()) {
        const user = this.getCurrentUser();
        
        // Hide auth buttons, show profile
        if (authButtons) authButtons.style.display = 'none';
        if (userProfileSection) userProfileSection.style.display = 'flex';
        
        // Update user info in navbar
        const userName = document.querySelector('.user-name');
        const userRole = document.querySelector('.user-role');
        const userAvatar = document.querySelector('.user-avatar');
        
        if (userName) userName.textContent = user.fullname;
        if (userRole) userRole.textContent = user.role === 'seller' ? 'Seller' : 'Buyer';
        if (userAvatar) userAvatar.src = user.avatar;
        
        // Update notification badge
        this.updateNotificationBadge();
        
        // Show floating upload button for sellers
        if (floatingUploadBtn && user.role === 'seller') {
          floatingUploadBtn.classList.remove('hidden');
        }
        
        console.log('✅ UI updated for logged in user:', user.fullname);
      } else {
        // Show auth buttons, hide profile
        if (authButtons) authButtons.style.display = 'flex';
        if (userProfileSection) userProfileSection.style.display = 'none';
        if (floatingUploadBtn) floatingUploadBtn.classList.add('hidden');
        
        console.log('👤 UI updated for guest user');
      }
    } catch (error) {
      console.error('❌ Error updating UI:', error);
    } finally {
      // Reset flag after a small delay
      setTimeout(() => {
        this._isUpdating = false;
      }, 100);
    }
  },
  
  // Update notification badge count
  updateNotificationBadge() {
    if (!this.isLoggedIn()) return;
    
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;
    
    const badge = document.querySelector('.notification-badge');
    if (!badge) return;
    
    try {
      // Read from localStorage
      const storedData = localStorage.getItem('klikSecondUsers');
      let usersData;
      
      if (storedData) {
        usersData = JSON.parse(storedData);
      } else if (window.usersData) {
        usersData = window.usersData;
      } else {
        return;
      }
      
      // Find user and count unread notifications
      const fullUser = usersData.users.find(u => u.username === currentUser.username);
      if (fullUser && fullUser.notifications) {
        const count = fullUser.notifications.filter(n => !n.read).length;
        badge.textContent = count;
        
        if (count > 0) {
          badge.style.display = 'flex';
        } else {
          badge.style.display = 'none';
        }
        
        console.log('🔢 Badge updated:', count, 'unread notifications');
      }
    } catch (e) {
      console.error('❌ Error updating badge:', e);
    }
  }
};

// ===== AUTO-INITIALIZE ON PAGE LOAD (FIXED) =====
function initializeSessionManager() {
  console.log('🔄 Initializing session manager...');
  
  // Check session ONCE
  SessionManager.updateUIForAuth();
  
  // Setup logout button if exists
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    // Remove existing listeners to prevent duplicates
    const newLogoutBtn = logoutBtn.cloneNode(true);
    logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
    
    newLogoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (confirm('Apakah Anda yakin ingin keluar?')) {
        SessionManager.clearSession();
        
        // Update UI immediately
        const authButtons = document.querySelector('.auth-buttons');
        const userProfileSection = document.querySelector('.user-profile-section');
        
        if (authButtons) authButtons.style.display = 'flex';
        if (userProfileSection) userProfileSection.style.display = 'none';
        
        // Show alert and redirect
        alert('Anda telah logout. Sampai jumpa lagi!');
        window.location.href = 'index.html';
      }
    });
    console.log('✅ Logout button initialized');
  }
  
  // Setup user dropdown toggle
  const userProfileTrigger = document.querySelector('.user-profile-trigger');
  const userDropdown = document.querySelector('.user-dropdown');
  
  if (userProfileTrigger && userDropdown) {
    userProfileTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!userProfileTrigger.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.remove('show');
      }
    });
    console.log('✅ User dropdown initialized');
  }
  
  console.log('✅ Session manager initialized');
}

// ===== SAFE INITIALIZATION =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSessionManager);
} else {
  // DOM already loaded, init immediately
  initializeSessionManager();
}

// Export for use in other files
window.SessionManager = SessionManager;

console.log('✅ Session Manager loaded successfully');