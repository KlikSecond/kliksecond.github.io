// ===== PROFILE BANK ACCOUNT HANDLER =====
// File: profile-bank-handler.js
// Handler untuk mengelola rekening bank di halaman profile

console.log('🏦 Profile Bank Account Handler loading...');

class ProfileBankHandler {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  init() {
    if (!this.isProfilePage()) {
      console.log('⏭️ Not on profile page, skipping Bank Handler init');
      return;
    }

    this.waitForDependencies().then(() => {
      if (window.SessionManager && window.SessionManager.isLoggedIn()) {
        this.currentUser = window.SessionManager.getCurrentUser();
        this.setupBankAccountTab();
        this.loadBankAccountData();
      }
    });
  }

  isProfilePage() {
    return window.location.pathname.includes('profile.html');
  }

  waitForDependencies() {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (window.SessionManager && window.BankAccountManager) {
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

  // ===== SETUP BANK ACCOUNT TAB =====
  setupBankAccountTab() {
    // Add event listeners for bank account buttons
    const btnAddBank = document.getElementById('btn-add-bank');
    const btnEditBank = document.getElementById('btn-edit-bank');

    if (btnAddBank) {
      btnAddBank.onclick = () => this.openBankAccountModal();
    }

    if (btnEditBank) {
      btnEditBank.onclick = () => this.openBankAccountModal(true);
    }

    // Create and setup bank account modal
    this.createBankAccountModal();
  }

  // ===== LOAD BANK ACCOUNT DATA =====
  loadBankAccountData() {
    if (!window.BankAccountManager) return;

    const bankAccount = window.BankAccountManager.getBankAccount(this.currentUser.username);
    
    const noBankAccount = document.getElementById('no-bank-account');
    const bankAccountDisplay = document.getElementById('bank-account-display');

    if (bankAccount && bankAccount.accountNumber) {
      // Show bank account info
      if (noBankAccount) noBankAccount.style.display = 'none';
      if (bankAccountDisplay) bankAccountDisplay.style.display = 'block';

      // Update display
      this.updateElement('bank-name-display', bankAccount.bankName);
      this.updateElement('bank-account-number-display', this.maskAccountNumber(bankAccount.accountNumber));
      this.updateElement('bank-account-name-display', bankAccount.accountName);
      this.updateElement('bank-verified-date-display', this.formatDate(bankAccount.verifiedDate));
    } else {
      // Show no bank account state
      if (noBankAccount) noBankAccount.style.display = 'block';
      if (bankAccountDisplay) bankAccountDisplay.style.display = 'none';
    }
  }

  // ===== CREATE BANK ACCOUNT MODAL =====
  createBankAccountModal() {
    const modalHTML = `
      <div id="bank-account-modal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3><i class="bi bi-bank"></i> <span id="bank-modal-title">Tambah Rekening Bank</span></h3>
            <button class="modal-close" id="close-bank-modal">
              <i class="bi bi-x"></i>
            </button>
          </div>
          <form id="bank-account-form">
            <div class="form-group-modal">
              <label for="bank-name-input">
                <i class="bi bi-bank"></i> Nama Bank
              </label>
              <select id="bank-name-input" required>
                <option value="">Pilih Bank</option>
                ${this.getBankOptions()}
              </select>
            </div>
            <div class="form-group-modal">
              <label for="bank-account-number-input">
                <i class="bi bi-credit-card"></i> Nomor Rekening
              </label>
              <input type="text" id="bank-account-number-input" placeholder="1234567890" required maxlength="20">
              <small style="color: #aaa; font-size: 12px; margin-top: 5px; display: block;">
                Masukkan nomor rekening tanpa spasi atau karakter khusus
              </small>
            </div>
            <div class="form-group-modal">
              <label for="bank-account-name-input">
                <i class="bi bi-person"></i> Nama Pemilik Rekening
              </label>
              <input type="text" id="bank-account-name-input" placeholder="Nama sesuai KTP" required>
              <small style="color: #aaa; font-size: 12px; margin-top: 5px; display: block;">
                Pastikan nama sesuai dengan KTP dan rekening bank
              </small>
            </div>

            <div style="background: rgba(0, 191, 255, 0.1); border: 1px solid rgba(0, 191, 255, 0.3); border-radius: 10px; padding: 15px; margin-bottom: 20px;">
              <h4 style="color: #00bfff; font-size: 14px; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                <i class="bi bi-info-circle"></i> Informasi Penting
              </h4>
              <ul style="color: #aaa; font-size: 12px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Rekening ini akan digunakan untuk penarikan deposit</li>
                <li>Pastikan data yang dimasukkan benar dan sesuai</li>
                <li>Rekening akan terverifikasi otomatis</li>
                <li>Anda dapat mengubah rekening kapan saja</li>
              </ul>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel" id="cancel-bank">Batal</button>
              <button type="submit" class="btn-save">
                <i class="bi bi-check-circle"></i> Simpan Rekening
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Insert modal to body
    const existingModal = document.getElementById('bank-account-modal');
    if (!existingModal) {
      document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Setup modal event listeners
    this.setupBankModalEvents();
  }

  // ===== GET BANK OPTIONS =====
  getBankOptions() {
    const banks = window.BankAccountManager ? window.BankAccountManager.getBankList() : [
      'BCA (Bank Central Asia)',
      'Mandiri',
      'BNI (Bank Negara Indonesia)',
      'BRI (Bank Rakyat Indonesia)',
      'CIMB Niaga',
      'Danamon',
      'Permata Bank',
      'BTN (Bank Tabungan Negara)',
      'Panin Bank',
      'OCBC NISP',
      'Bank Mega',
      'Maybank Indonesia',
      'BTPN',
      'Bank Jago',
      'Jenius (BTPN)',
      'Blu (BCA Digital)',
      'SeaBank',
      'Others'
    ];

    return banks.map(bank => `<option value="${bank}">${bank}</option>`).join('');
  }

  // ===== SETUP BANK MODAL EVENTS =====
  setupBankModalEvents() {
    const modal = document.getElementById('bank-account-modal');
    const closeBtn = document.getElementById('close-bank-modal');
    const cancelBtn = document.getElementById('cancel-bank');
    const form = document.getElementById('bank-account-form');
    const accountNumberInput = document.getElementById('bank-account-number-input');

    if (closeBtn) closeBtn.onclick = () => this.closeBankModal();
    if (cancelBtn) cancelBtn.onclick = () => this.closeBankModal();
    if (modal) modal.onclick = (e) => { if (e.target === modal) this.closeBankModal(); };
    if (form) form.onsubmit = (e) => { e.preventDefault(); this.saveBankAccount(); };

    // Format account number input (only numbers)
    if (accountNumberInput) {
      accountNumberInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
      });
    }
  }

  // ===== OPEN BANK ACCOUNT MODAL =====
  openBankAccountModal(isEdit = false) {
    const modal = document.getElementById('bank-account-modal');
    const modalTitle = document.getElementById('bank-modal-title');
    const form = document.getElementById('bank-account-form');

    if (!modal) return;

    if (isEdit) {
      // Load existing bank account data
      const bankAccount = window.BankAccountManager.getBankAccount(this.currentUser.username);
      
      if (bankAccount) {
        modalTitle.textContent = 'Edit Rekening Bank';
        document.getElementById('bank-name-input').value = bankAccount.bankName || '';
        document.getElementById('bank-account-number-input').value = bankAccount.accountNumber || '';
        document.getElementById('bank-account-name-input').value = bankAccount.accountName || '';
      }
    } else {
      modalTitle.textContent = 'Tambah Rekening Bank';
      if (form) form.reset();
    }

    modal.classList.add('active');
  }

  // ===== CLOSE BANK MODAL =====
  closeBankModal() {
    const modal = document.getElementById('bank-account-modal');
    const form = document.getElementById('bank-account-form');

    if (modal) modal.classList.remove('active');
    if (form) form.reset();
  }

  // ===== SAVE BANK ACCOUNT =====
  async saveBankAccount() {
    const bankName = document.getElementById('bank-name-input').value.trim();
    const accountNumber = document.getElementById('bank-account-number-input').value.trim();
    const accountName = document.getElementById('bank-account-name-input').value.trim();

    // Validation
    if (!bankName) {
      this.showNotification('Pilih nama bank terlebih dahulu!', 'error');
      return;
    }

    if (!accountNumber) {
      this.showNotification('Masukkan nomor rekening!', 'error');
      return;
    }

    if (accountNumber.length < 10) {
      this.showNotification('Nomor rekening minimal 10 digit!', 'error');
      return;
    }

    if (!accountName) {
      this.showNotification('Masukkan nama pemilik rekening!', 'error');
      return;
    }

    if (accountName.length < 3) {
      this.showNotification('Nama pemilik rekening terlalu pendek!', 'error');
      return;
    }

    // Show loading
    this.showNotification('Menyimpan rekening bank...', 'info');

    try {
      // Save bank account
      const success = window.BankAccountManager.saveBankAccount(
        this.currentUser.username,
        {
          bankName,
          accountNumber,
          accountName
        }
      );

      if (success) {
        // Close modal
        this.closeBankModal();

        // Reload bank account data
        this.loadBankAccountData();

        // Show success notification
        this.showNotification('Rekening bank berhasil disimpan!', 'success');

        // Update notification badge if available
        if (window.notificationHandler) {
          window.notificationHandler.updateNotificationBadge();
        }
      } else {
        this.showNotification('Gagal menyimpan rekening bank. Coba lagi.', 'error');
      }
    } catch (error) {
      console.error('❌ Error saving bank account:', error);
      this.showNotification('Terjadi kesalahan. Coba lagi.', 'error');
    }
  }

  // ===== HELPER FUNCTIONS =====
  updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  maskAccountNumber(accountNumber) {
    if (!accountNumber || accountNumber.length < 4) return accountNumber;
    
    const lastFour = accountNumber.slice(-4);
    const masked = '*'.repeat(accountNumber.length - 4) + lastFour;
    
    return masked;
  }

  formatDate(dateString) {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  }

  showNotification(message, type = 'info') {
    const existing = document.querySelector('.profile-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `profile-notification ${type}`;
    
    let icon = 'info-circle-fill';
    if (type === 'success') icon = 'check-circle-fill';
    if (type === 'error') icon = 'x-circle-fill';

    notification.innerHTML = `
      <i class="bi bi-${icon}"></i>
      <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);
    
    if (type !== 'info') {
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    } else {
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, 2000);
    }
  }
}

// ===== AUTO-INITIALIZE =====
let profileBankHandler;

function initProfileBankHandler() {
  if (!window.location.pathname.includes('profile.html')) {
    return;
  }

  profileBankHandler = new ProfileBankHandler();
  console.log('✅ Profile Bank Handler initialized');
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProfileBankHandler);
} else {
  initProfileBankHandler();
}

// Export
window.ProfileBankHandler = ProfileBankHandler;
window.profileBankHandler = profileBankHandler;

console.log('✅ Profile Bank Account Handler loaded successfully');