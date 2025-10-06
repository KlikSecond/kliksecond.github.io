// ===== SESSION MANAGER =====
// File ini harus di-load pertama kali di semua halaman

const SessionManager = {
  // Key untuk localStorage
  SESSION_KEY: 'klikSecondSession',
  
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
    
    // CRITICAL: Dalam production, gunakan sessionStorage atau backend session
    // localStorage hanya untuk demo purposes
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
      console.log('✅ Session saved:', sessionData);
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
        const parsed = JSON.parse(sessionData);
        console.log('📋 Session retrieved:', parsed);
        return parsed;
      }
    } catch (e) {
      console.error('❌ Failed to get session:', e);
    }
    return null;
  },
  
  // Check if user is logged in
  isLoggedIn() {
    const session = this.getSession();
    return session && session.isLoggedIn === true;
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
  
  // Update UI based on login status
  updateUIForAuth() {
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
  },
  
  // Update notification badge count
  updateNotificationBadge() {
    const notificationBadge = document.querySelector('.notification-badge');
    if (!notificationBadge) return;
    
    const user = this.getCurrentUser();
    if (!user) return;
    
    // Get user's notifications from usersData
    if (window.usersData && window.usersData.users) {
      const fullUser = window.usersData.users.find(u => u.username === user.username);
      if (fullUser && fullUser.notifications) {
        const unreadCount = fullUser.notifications.filter(n => !n.read).length;
        notificationBadge.textContent = unreadCount;
        
        // Show badge only if there are unread notifications
        if (unreadCount > 0) {
          notificationBadge.style.display = 'flex';
        } else {
          notificationBadge.style.display = 'none';
        }
        
        console.log('📬 Notification badge updated:', unreadCount, 'unread');
      }
    }
  }
};

// ===== AUTO-INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔄 Checking session...');
  SessionManager.updateUIForAuth();
  
  // Setup logout button if exists
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (confirm('Apakah Anda yakin ingin keluar?')) {
        SessionManager.clearSession();
        alert('Anda telah logout. Sampai jumpa lagi!');
        window.location.href = 'index.html';
      }
    });
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
  }
});

// Export for use in other files
window.SessionManager = SessionManager;