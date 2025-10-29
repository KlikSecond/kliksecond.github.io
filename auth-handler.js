// ===== AUTH MODAL HANDLER - FIXED VERSION =====
// File: auth-modal-handler-fixed.js
// Perbaikan untuk container overflow dan body scroll lock

console.log('🔐 Auth Modal Handler (Fixed) loading...');

// ===== MODAL CONTROL WITH BODY SCROLL LOCK =====
const authModal = document.getElementById('auth-modal');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authTabs = document.querySelectorAll('.auth-tab');
const closeModal = document.querySelector('.auth-modal-close');
const btnLogin = document.querySelector('.btn-login');
const btnRegister = document.querySelector('.btn-register');

// Open modal with body scroll lock
function openAuthModal(tab = 'login') {
  authModal.style.display = 'flex';
  // CRITICAL FIX: Lock body scroll
  document.body.classList.add('modal-open');
  document.body.style.overflow = 'hidden';
  
  switchTab(tab);
  
  // CRITICAL FIX: Focus management
  setTimeout(() => {
    const firstInput = authModal.querySelector('input');
    if (firstInput) firstInput.focus();
  }, 100);
}

// Close modal with body scroll unlock
function closeAuthModal() {
  authModal.style.display = 'none';
  // CRITICAL FIX: Unlock body scroll
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  
  clearForms();
}

// Switch between login and register tabs
function switchTab(tab) {
  authTabs.forEach(t => t.classList.remove('active'));
  
  if (tab === 'login') {
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    authTabs[0].classList.add('active');
  } else {
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
    authTabs[1].classList.add('active');
  }
  
  // CRITICAL FIX: Reset scroll position to top
  const modalContent = document.querySelector('.auth-modal-content');
  if (modalContent) {
    modalContent.scrollTop = 0;
  }
}

// Clear forms
function clearForms() {
  document.querySelectorAll('.auth-form input').forEach(input => {
    input.value = '';
  });
  document.getElementById('login-error').textContent = '';
  document.getElementById('register-error').textContent = '';
  document.getElementById('register-success').textContent = '';
  
  // Hide error/success messages
  document.getElementById('login-error').style.display = 'none';
  document.getElementById('register-error').style.display = 'none';
  document.getElementById('register-success').style.display = 'none';
}

// ===== EVENT LISTENERS =====

// Open modal buttons
if (btnLogin) {
  btnLogin.addEventListener('click', () => openAuthModal('login'));
}

if (btnRegister) {
  btnRegister.addEventListener('click', () => openAuthModal('register'));
}

// Close modal
if (closeModal) {
  closeModal.addEventListener('click', closeAuthModal);
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === authModal) {
    closeAuthModal();
  }
});

// CRITICAL FIX: Prevent clicks inside modal content from closing modal
const modalContent = document.querySelector('.auth-modal-content');
if (modalContent) {
  modalContent.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && authModal.style.display === 'flex') {
    closeAuthModal();
  }
});

// Tab switching
authTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.getAttribute('data-tab');
    switchTab(tabName);
  });
});

// Password toggle
document.querySelectorAll('.password-toggle-icon').forEach(icon => {
  icon.addEventListener('click', function() {
    const input = this.previousElementSibling;
    
    if (input.type === 'password') {
      input.type = 'text';
      this.classList.remove('bi-eye-slash');
      this.classList.add('bi-eye');
    } else {
      input.type = 'password';
      this.classList.remove('bi-eye');
      this.classList.add('bi-eye-slash');
    }
  });
});

// ===== LOGIN HANDLER (FIXED) =====
document.querySelector('#login-form form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errorDiv = document.getElementById('login-error');
  
  // Reset error display
  errorDiv.style.display = 'none';
  errorDiv.textContent = '';
  
  // Validasi input
  if (!username || !password) {
    errorDiv.textContent = 'Username dan password harus diisi!';
    errorDiv.style.display = 'block';
    // CRITICAL FIX: Scroll to error message
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }
  
  console.log('🔑 Attempting login for:', username);
  
  // Show loading
  const submitBtn = this.querySelector('.auth-submit-btn');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="bi bi-arrow-repeat" style="animation: spin 1s linear infinite;"></i> Logging in...';
  
  // ===== CRITICAL FIX: Cek localStorage langsung =====
  try {
    const storedData = localStorage.getItem('klikSecondUsers');
    if (!storedData) {
      errorDiv.textContent = 'System error: User database not loaded!';
      errorDiv.style.display = 'block';
      errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      console.error('❌ klikSecondUsers not found in localStorage!');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      return;
    }
    
    const usersData = JSON.parse(storedData);
    
    // Cari user
    const user = usersData.users.find(u => 
      (u.username === username || u.email === username) && u.password === password
    );
    
    if (user) {
      console.log('✅ User found:', user.username);
      
      // ===== FIX: Simpan session menggunakan SessionManager =====
      const sessionSaved = window.SessionManager.saveSession({
        username: user.username,
        fullname: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profilePicture
      });
      
      if (sessionSaved) {
        errorDiv.style.display = 'none';
        
        // Tampilkan success message
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = '✓ Login berhasil! Selamat datang, ' + user.fullName;
        successMsg.style.display = 'block';
        errorDiv.parentNode.insertBefore(successMsg, errorDiv);
        
        // Scroll to success message
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // ===== CRITICAL FIX: Update UI tanpa reload =====
        setTimeout(() => {
          closeAuthModal();
          
          // Update UI secara manual
          window.SessionManager.updateUIForAuth();
          
          // Update notification badge
          if (window.notificationHandler) {
            window.notificationHandler.updateNotificationBadge();
          }
          
          console.log('✅ Login successful, UI updated');
        }, 1000);
      } else {
        errorDiv.textContent = 'Gagal menyimpan session. Coba lagi.';
        errorDiv.style.display = 'block';
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    } else {
      console.log('❌ Invalid credentials');
      errorDiv.textContent = 'Username atau password salah!';
      errorDiv.style.display = 'block';
      errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    errorDiv.textContent = 'Terjadi kesalahan sistem!';
    errorDiv.style.display = 'block';
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
});

// ===== REGISTER HANDLER (FIXED) =====
document.querySelector('#register-form form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const fullname = document.getElementById('register-fullname').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const phone = document.getElementById('register-phone').value.trim();
  const username = document.getElementById('register-username').value.trim();
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;
  
  const errorDiv = document.getElementById('register-error');
  const successDiv = document.getElementById('register-success');
  
  // Reset messages
  errorDiv.style.display = 'none';
  successDiv.style.display = 'none';
  errorDiv.textContent = '';
  successDiv.textContent = '';
  
  // Show loading
  const submitBtn = this.querySelector('.auth-submit-btn');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="bi bi-arrow-repeat" style="animation: spin 1s linear infinite;"></i> Processing...';
  
  // Validasi
  if (!fullname || !email || !phone || !username || !password) {
    errorDiv.textContent = 'Semua field harus diisi!';
    errorDiv.style.display = 'block';
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    return;
  }
  
  if (password.length < 6) {
    errorDiv.textContent = 'Password minimal 6 karakter!';
    errorDiv.style.display = 'block';
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    return;
  }
  
  if (password !== confirmPassword) {
    errorDiv.textContent = 'Password tidak cocok!';
    errorDiv.style.display = 'block';
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    return;
  }
  
  // Validasi email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorDiv.textContent = 'Format email tidak valid!';
    errorDiv.style.display = 'block';
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    return;
  }
  
  console.log('📝 Attempting registration for:', username);
  
  try {
    const storedData = localStorage.getItem('klikSecondUsers');
    if (!storedData) {
      errorDiv.textContent = 'System error: Database not found!';
      errorDiv.style.display = 'block';
      errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      return;
    }
    
    const usersData = JSON.parse(storedData);
    
    // Cek username/email sudah ada
    const existingUser = usersData.users.find(u => 
      u.username === username || u.email === email
    );
    
    if (existingUser) {
      errorDiv.textContent = 'Username atau email sudah terdaftar!';
      errorDiv.style.display = 'block';
      errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      return;
    }
    
    // Buat user baru
    const newUser = {
      id: `user-${Date.now()}`,
      username: username,
      password: password,
      email: email,
      fullName: fullname,
      phone: phone,
      address: '',
      profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullname)}&background=00ffff&color=000`,
      role: 'seller',
      joinDate: new Date().toISOString().split('T')[0],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          type: 'welcome',
          title: 'Selamat Datang! 🎉',
          message: `Halo ${fullname}! Terima kasih telah bergabung dengan Klik Second. Mulai jual atau beli gadget favoritmu sekarang!`,
          date: new Date().toLocaleString('id-ID'),
          read: false
        }
      ]
    };
    
    // Tambahkan ke database
    usersData.users.push(newUser);
    localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
    
    // Update window.usersData if exists
    if (window.usersData) {
      window.usersData.users.push(newUser);
    }
    
    console.log('✅ New user registered:', newUser.username);
    
    // Tampilkan success
    successDiv.textContent = '✓ Registrasi berhasil! Silakan login.';
    successDiv.style.display = 'block';
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Clear form
    this.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    
    // Auto switch ke login setelah 2 detik
    setTimeout(() => {
      switchTab('login');
      successDiv.style.display = 'none';
    }, 2000);
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    errorDiv.textContent = 'Terjadi kesalahan sistem!';
    errorDiv.style.display = 'block';
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
});

// ===== CRITICAL FIX: Prevent form submission on Enter in other fields =====
document.querySelectorAll('.auth-form input').forEach(input => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = input.closest('form');
      if (form) {
        const submitBtn = form.querySelector('.auth-submit-btn');
        if (submitBtn) submitBtn.click();
      }
    }
  });
});

// ===== CRITICAL FIX: Handle window resize =====
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (authModal.style.display === 'flex') {
      const modalContent = document.querySelector('.auth-modal-content');
      if (modalContent) {
        // Adjust modal height on resize
        const maxHeight = window.innerHeight - 60;
        modalContent.style.maxHeight = `${maxHeight}px`;
      }
    }
  }, 250);
});

// ===== CRITICAL FIX: Cleanup on page unload =====
window.addEventListener('beforeunload', () => {
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
});

// ===== Animation for spin icon =====
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

console.log('✅ Auth Modal Handler (Fixed) initialized');