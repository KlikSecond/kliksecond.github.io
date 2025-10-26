// ===== AUTHENTICATION HANDLER (FIXED - NO LOOP) =====
// File ini menangani login/register dan sinkron dengan SessionManager

console.log('🔐 Auth handler loaded');

// ===== MODAL CONTROL =====
const authModal = document.getElementById('auth-modal');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authTabs = document.querySelectorAll('.auth-tab');
const closeModal = document.querySelector('.auth-modal-close');
const btnLogin = document.querySelector('.btn-login');
const btnRegister = document.querySelector('.btn-register');

// Open modal
function openAuthModal(tab = 'login') {
  authModal.style.display = 'flex';
  switchTab(tab);
}

// Close modal
function closeAuthModal() {
  authModal.style.display = 'none';
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
}

// Clear forms
function clearForms() {
  document.querySelectorAll('.auth-form input').forEach(input => {
    input.value = '';
  });
  document.getElementById('login-error').textContent = '';
  document.getElementById('register-error').textContent = '';
  document.getElementById('register-success').textContent = '';
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
  
  // Validasi input
  if (!username || !password) {
    errorDiv.textContent = 'Username dan password harus diisi!';
    errorDiv.style.display = 'block';
    return;
  }
  
  console.log('🔑 Attempting login for:', username);
  
  // ===== CRITICAL FIX: Cek localStorage langsung =====
  try {
    const storedData = localStorage.getItem('klikSecondUsers');
    if (!storedData) {
      errorDiv.textContent = 'System error: User database not loaded!';
      errorDiv.style.display = 'block';
      console.error('❌ klikSecondUsers not found in localStorage!');
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
        
        // ===== CRITICAL FIX: Update UI tanpa reload =====
        setTimeout(() => {
          closeAuthModal();
          
          // Update UI secara manual
          window.SessionManager.updateUIForAuth();
          
          // Update notification badge
          if (window.notificationHandler) {
            window.notificationHandler.updateNotificationBadge();
          }
          
          // ===== REMOVED: window.location.reload() =====
          // Tidak perlu reload, cukup update UI
          
          console.log('✅ Login successful, UI updated');
        }, 1000);
      } else {
        errorDiv.textContent = 'Gagal menyimpan session. Coba lagi.';
        errorDiv.style.display = 'block';
      }
    } else {
      console.log('❌ Invalid credentials');
      errorDiv.textContent = 'Username atau password salah!';
      errorDiv.style.display = 'block';
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    errorDiv.textContent = 'Terjadi kesalahan sistem!';
    errorDiv.style.display = 'block';
  }
});

// ===== REGISTER HANDLER =====
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
  
  // Validasi
  if (!fullname || !email || !phone || !username || !password) {
    errorDiv.textContent = 'Semua field harus diisi!';
    errorDiv.style.display = 'block';
    return;
  }
  
  if (password.length < 6) {
    errorDiv.textContent = 'Password minimal 6 karakter!';
    errorDiv.style.display = 'block';
    return;
  }
  
  if (password !== confirmPassword) {
    errorDiv.textContent = 'Password tidak cocok!';
    errorDiv.style.display = 'block';
    return;
  }
  
  // Validasi email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorDiv.textContent = 'Format email tidak valid!';
    errorDiv.style.display = 'block';
    return;
  }
  
  console.log('📝 Attempting registration for:', username);
  
  try {
    const storedData = localStorage.getItem('klikSecondUsers');
    if (!storedData) {
      errorDiv.textContent = 'System error: Database not found!';
      errorDiv.style.display = 'block';
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
    
    // Clear form
    document.querySelector('#register-form form').reset();
    
    // Auto switch ke login setelah 2 detik
    setTimeout(() => {
      switchTab('login');
      successDiv.style.display = 'none';
    }, 2000);
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    errorDiv.textContent = 'Terjadi kesalahan sistem!';
    errorDiv.style.display = 'block';
  }
});

console.log('✅ Auth handler initialized');