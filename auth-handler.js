// ===== AUTHENTICATION HANDLER =====
// Debug mode
console.log('🔧 Auth Handler loaded');

// Wait for DOM and authSystem to be ready
function initAuthSystem() {
  console.log('🚀 Initializing Auth System...');
  
  // Check if authSystem is available
  if (typeof window.authSystem === 'undefined') {
    console.error('❌ authSystem not found! Make sure users.js is loaded first.');
    setTimeout(initAuthSystem, 100); // Retry after 100ms
    return;
  }
  
  console.log('✅ authSystem found:', window.authSystem);
  
  // Get elements
  const loginBtn = document.querySelector('.btn-login');
  const registerBtn = document.querySelector('.btn-register');
  const authModal = document.getElementById('auth-modal');
  const authModalClose = document.querySelector('.auth-modal-close');
  const authTabs = document.querySelectorAll('.auth-tab');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  console.log('📋 Elements found:', {
    loginBtn: !!loginBtn,
    registerBtn: !!registerBtn,
    authModal: !!authModal,
    loginForm: !!loginForm,
    registerForm: !!registerForm
  });
  
  // Check if user is logged in
  updateUIBasedOnAuth();

  // Login button click
  if (loginBtn) {
    console.log('✅ Login button found, attaching event...');
    loginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('🔐 Login button clicked!');
      openAuthModal('login');
    });
  } else {
    console.error('❌ Login button NOT found!');
  }

  // Register button click
  if (registerBtn) {
    console.log('✅ Register button found, attaching event...');
    registerBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('📝 Register button clicked!');
      openAuthModal('register');
    });
  } else {
    console.error('❌ Register button NOT found!');
  }

  // Close modal
  if (authModalClose) {
    authModalClose.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('❌ Close button clicked');
      closeAuthModal();
    });
  }

  // Click outside modal to close
  if (authModal) {
    authModal.addEventListener('click', function(e) {
      if (e.target === authModal) {
        console.log('🖱️ Clicked outside modal');
        closeAuthModal();
      }
    });
  }

  // Tab switching
  authTabs.forEach(tab => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      const tabType = this.getAttribute('data-tab');
      console.log('🔄 Switching to tab:', tabType);
      switchTab(tabType);
    });
  });

  // Login form submission
  if (loginForm) {
    const form = loginForm.querySelector('form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('📤 Login form submitted');
        handleLogin(e);
      });
    }
  }

  // Register form submission
  if (registerForm) {
    const form = registerForm.querySelector('form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('📤 Register form submitted');
        handleRegister(e);
      });
    }
  }

  // Password toggle
  document.querySelectorAll('.password-toggle-icon').forEach(icon => {
    icon.addEventListener('click', function() {
      const input = this.previousElementSibling;
      if (input && input.tagName === 'INPUT') {
        if (input.type === 'password') {
          input.type = 'text';
          this.classList.remove('bi-eye-slash');
          this.classList.add('bi-eye');
        } else {
          input.type = 'password';
          this.classList.remove('bi-eye');
          this.classList.add('bi-eye-slash');
        }
      }
    });
  });

  // User profile dropdown
  const profileTrigger = document.querySelector('.user-profile-trigger');
  const userDropdown = document.querySelector('.user-dropdown');
  
  if (profileTrigger && userDropdown) {
    profileTrigger.addEventListener('click', function(e) {
      e.stopPropagation();
      profileTrigger.classList.toggle('active');
      userDropdown.classList.toggle('active');
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (userDropdown && profileTrigger && !e.target.closest('.user-profile-section')) {
      profileTrigger.classList.remove('active');
      userDropdown.classList.remove('active');
    }
  });

  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('Apakah Anda yakin ingin keluar?')) {
        authSystem.logout();
      }
    });
  }

  // Notification button
  const notificationBtn = document.querySelector('.notification-btn');
  if (notificationBtn) {
    notificationBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('🔔 Notification button clicked');
      if (typeof toggleNotificationPanel === 'function') {
        toggleNotificationPanel();
      }
    });
  }
  
  console.log('✅ Auth System initialized successfully!');
}

function openAuthModal(tab = 'login') {
  console.log('🔓 Opening auth modal, tab:', tab);
  const authModal = document.getElementById('auth-modal');
  if (authModal) {
    authModal.classList.add('active');
    switchTab(tab);
    document.body.style.overflow = 'hidden';
    console.log('✅ Modal opened');
  } else {
    console.error('❌ Auth modal element not found!');
  }
}

function closeAuthModal() {
  console.log('🔒 Closing auth modal');
  const authModal = document.getElementById('auth-modal');
  if (authModal) {
    authModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clear forms
    const loginFormElement = document.querySelector('#login-form form');
    const registerFormElement = document.querySelector('#register-form form');
    
    if (loginFormElement) loginFormElement.reset();
    if (registerFormElement) registerFormElement.reset();
    
    // Clear messages
    document.querySelectorAll('.error-message, .success-message').forEach(msg => {
      msg.classList.remove('show');
    });
    
    console.log('✅ Modal closed');
  }
}

function switchTab(tabType) {
  console.log('🔄 Switching to tab:', tabType);
  
  // Update tabs
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  const activeTab = document.querySelector(`[data-tab="${tabType}"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }
  
  // Update forms
  document.querySelectorAll('.auth-form').forEach(form => {
    form.classList.remove('active');
  });
  const activeForm = document.getElementById(`${tabType}-form`);
  if (activeForm) {
    activeForm.classList.add('active');
  }
  
  console.log('✅ Tab switched to:', tabType);
}

function handleLogin(e) {
  console.log('🔐 Handling login...');
  
  const username = document.getElementById('login-username')?.value;
  const password = document.getElementById('login-password')?.value;
  const errorMsg = document.getElementById('login-error');
  
  console.log('📝 Login attempt:', { username, password: '***' });
  
  if (!username || !password) {
    console.error('❌ Username or password empty');
    if (errorMsg) {
      errorMsg.textContent = 'Username dan password harus diisi!';
      errorMsg.classList.add('show');
    }
    return;
  }
  
  // Clear previous errors
  if (errorMsg) {
    errorMsg.classList.remove('show');
  }
  
  // Attempt login
  const result = authSystem.login(username, password);
  console.log('📊 Login result:', result);
  
  if (result.success) {
    console.log('✅ Login successful!');
    // Show success and close modal
    closeAuthModal();
    updateUIBasedOnAuth();
    
    // Show success notification
    showNotification('Login Berhasil!', 'Selamat datang kembali, ' + result.user.fullName, 'success');
    
    // Reload page to update content
    setTimeout(() => {
      location.reload();
    }, 1000);
  } else {
    console.error('❌ Login failed:', result.message);
    // Show error
    if (errorMsg) {
      errorMsg.textContent = result.message;
      errorMsg.classList.add('show');
    }
  }
}

function handleRegister(e) {
  console.log('📝 Handling registration...');
  
  const fullName = document.getElementById('register-fullname')?.value;
  const email = document.getElementById('register-email')?.value;
  const phone = document.getElementById('register-phone')?.value;
  const username = document.getElementById('register-username')?.value;
  const password = document.getElementById('register-password')?.value;
  const confirmPassword = document.getElementById('register-confirm-password')?.value;
  const errorMsg = document.getElementById('register-error');
  const successMsg = document.getElementById('register-success');
  
  console.log('📝 Register data:', { fullName, email, username });
  
  // Clear previous messages
  if (errorMsg) errorMsg.classList.remove('show');
  if (successMsg) successMsg.classList.remove('show');
  
  // Validate password match
  if (password !== confirmPassword) {
    if (errorMsg) {
      errorMsg.textContent = 'Password tidak cocok!';
      errorMsg.classList.add('show');
    }
    return;
  }
  
  // Validate password length
  if (password.length < 6) {
    if (errorMsg) {
      errorMsg.textContent = 'Password minimal 6 karakter!';
      errorMsg.classList.add('show');
    }
    return;
  }
  
  // Attempt registration
  const result = authSystem.register({
    fullName: fullName,
    email: email,
    phone: phone,
    username: username,
    password: password,
    address: ''
  });
  
  console.log('📊 Register result:', result);
  
  if (result.success) {
    console.log('✅ Registration successful!');
    // Show success
    if (successMsg) {
      successMsg.textContent = result.message;
      successMsg.classList.add('show');
    }
    
    // Switch to login tab after 2 seconds
    setTimeout(() => {
      switchTab('login');
      const loginUsername = document.getElementById('login-username');
      if (loginUsername) {
        loginUsername.value = username;
      }
    }, 2000);
  } else {
    console.error('❌ Registration failed:', result.message);
    // Show error
    if (errorMsg) {
      errorMsg.textContent = result.message;
      errorMsg.classList.add('show');
    }
  }
}

function updateUIBasedOnAuth() {
  console.log('🔄 Updating UI based on auth status...');
  
  const authButtons = document.querySelector('.auth-buttons');
  const userProfileSection = document.querySelector('.user-profile-section');
  const floatingUploadBtn = document.querySelector('.floating-upload-btn');
  
  if (authSystem.isAuthenticated()) {
    const user = authSystem.getCurrentUser();
    console.log('👤 User is logged in:', user.username);
    
    // Hide auth buttons, show profile
    if (authButtons) authButtons.style.display = 'none';
    if (userProfileSection) userProfileSection.classList.add('active');
    
    // Update user info
    const userAvatar = document.querySelector('.user-avatar');
    const userName = document.querySelector('.user-name');
    const userRole = document.querySelector('.user-role');
    
    if (userAvatar) userAvatar.setAttribute('src', user.profilePicture);
    if (userName) userName.textContent = user.fullName;
    if (userRole) userRole.textContent = user.role === 'admin' ? 'Admin' : 'Seller';
    
    // Update notification badge
    updateNotificationBadge();
    
    // Show upload button
    if (floatingUploadBtn) {
      floatingUploadBtn.classList.remove('hidden');
    }
  } else {
    console.log('👤 User is NOT logged in');
    // Show auth buttons, hide profile
    if (authButtons) authButtons.style.display = 'flex';
    if (userProfileSection) userProfileSection.classList.remove('active');
    
    // Hide upload button
    if (floatingUploadBtn) {
      floatingUploadBtn.classList.add('hidden');
    }
  }
}

function updateNotificationBadge() {
  const badge = document.querySelector('.notification-badge');
  const unreadCount = authSystem.getUnreadCount();
  
  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
      badge.style.display = 'block';
    } else {
      badge.style.display = 'none';
    }
  }
}

function showNotification(title, message, type = 'info') {
  console.log('📢 Showing notification:', { title, message, type });
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `toast-notification ${type}`;
  notification.innerHTML = `
    <div class="toast-icon">
      <i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'info-circle-fill'}"></i>
    </div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Toast notification styles
const style = document.createElement('style');
style.textContent = `
.toast-notification {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 15px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(0, 255, 255, 0.3);
  z-index: 10000;
  min-width: 300px;
  opacity: 0;
  transition: all 0.3s ease;
}

.toast-notification.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

.toast-notification.success {
  border-color: rgba(0, 255, 127, 0.5);
}

.toast-icon {
  font-size: 24px;
  color: #00ffff;
}

.toast-notification.success .toast-icon {
  color: #00ff7f;
}

.toast-content {
  flex: 1;
}

.toast-title {
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 3px;
}

.toast-message {
  color: #aaa;
  font-size: 12px;
}
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuthSystem);
} else {
  // DOM already loaded
  initAuthSystem();
}

console.log('✅ Auth Handler script executed');