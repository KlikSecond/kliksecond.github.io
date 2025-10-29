// ===== PROFILE WALLET/DEPOSIT HANDLER =====
// File: profile-wallet-handler.js
// Handler untuk mengelola deposit/wallet di halaman profile

console.log('💰 Profile Wallet Handler loading...');

class ProfileWalletHandler {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  init() {
    if (!this.isProfilePage()) {
      console.log('⏭️ Not on profile page, skipping Wallet Handler init');
      return;
    }

    this.waitForDependencies().then(() => {
      if (window.SessionManager && window.SessionManager.isLoggedIn()) {
        this.currentUser = window.SessionManager.getCurrentUser();
        this.setupWalletTab();
        this.loadWalletData();
      }
    });
  }

  isProfilePage() {
    return window.location.pathname.includes('profile.html');
  }

  waitForDependencies() {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (window.SessionManager && window.DepositSystem && window.BankAccountManager) {
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

  // ===== SETUP WALLET TAB =====
  setupWalletTab() {
    // Create withdraw modal
    this.createWithdrawModal();
    this.createTopUpModal();
  }

  // ===== LOAD WALLET DATA =====
  loadWalletData() {
    if (!window.DepositSystem) return;

    // Load balance
    const balance = window.DepositSystem.getUserDeposit(this.currentUser.username);
    this.updateElement('wallet-balance', this.formatRupiah(balance));

    // Load held deposits
    this.loadHeldDeposits();

    // Load deposit history
    this.loadDepositHistory();
  }

  // ===== LOAD HELD DEPOSITS =====
  loadHeldDeposits() {
    const heldDepositsList = document.getElementById('held-deposits-list');
    if (!heldDepositsList) return;

    const heldDeposits = window.DepositSystem.getHeldDeposits(this.currentUser.username);

    if (heldDeposits.length === 0) {
      heldDepositsList.innerHTML = `
        <div style="text-align: center; padding: 30px; color: #aaa;">
          <i class="bi bi-inbox" style="font-size: 48px; margin-bottom: 15px; display: block; opacity: 0.3;"></i>
          <p>Tidak ada deposit yang ditahan</p>
        </div>
      `;
      return;
    }

    heldDepositsList.innerHTML = heldDeposits.map(held => `
      <div class="held-deposit-item" style="background: rgba(255, 193, 7, 0.1); border: 1px solid rgba(255, 193, 7, 0.3); border-radius: 12px; padding: 15px; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
          <div style="flex: 1;">
            <h4 style="color: #fff; font-size: 15px; margin-bottom: 5px;">
              <i class="bi bi-lock-fill" style="color: #ffc107;"></i>
              ${held.productName}
            </h4>
            <p style="color: #aaa; font-size: 12px; margin: 0;">
              ${held.date}
            </p>
          </div>
          <span style="background: rgba(255, 193, 7, 0.2); color: #ffc107; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase;">
            Ditahan
          </span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
          <div>
            <div style="color: #aaa; font-size: 11px; margin-bottom: 3px;">Jumlah Bid:</div>
            <div style="color: #fff; font-size: 14px; font-weight: 600;">${this.formatRupiah(held.bidAmount)}</div>
          </div>
          <div>
            <div style="color: #aaa; font-size: 11px; margin-bottom: 3px;">Deposit Ditahan:</div>
            <div style="color: #ffc107; font-size: 14px; font-weight: 600;">${this.formatRupiah(held.heldAmount)}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ===== LOAD DEPOSIT HISTORY =====
  loadDepositHistory() {
    const historyList = document.getElementById('deposit-history-list');
    if (!historyList) return;

    const history = window.DepositSystem.getDepositHistory(this.currentUser.username);

    if (history.length === 0) {
      historyList.innerHTML = `
        <div style="text-align: center; padding: 30px; color: #aaa;">
          <i class="bi bi-clock-history" style="font-size: 48px; margin-bottom: 15px; display: block; opacity: 0.3;"></i>
          <p>Belum ada riwayat transaksi</p>
        </div>
      `;
      return;
    }

    historyList.innerHTML = history.slice(0, 10).map(item => {
      const isPositive = item.amount > 0;
      const typeConfig = this.getHistoryTypeConfig(item.type);
      
      return `
        <div class="history-item" style="background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 15px; margin-bottom: 10px; transition: 0.3s;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                <div style="width: 36px; height: 36px; border-radius: 50%; background: ${typeConfig.bg}; border: 2px solid ${typeConfig.border}; display: flex; align-items: center; justify-content: center;">
                  <i class="bi bi-${typeConfig.icon}" style="color: ${typeConfig.color}; font-size: 16px;"></i>
                </div>
                <div>
                  <h4 style="color: #fff; font-size: 14px; margin: 0; font-weight: 600;">${typeConfig.title}</h4>
                  <p style="color: #aaa; font-size: 11px; margin: 3px 0 0 0;">${item.date}</p>
                </div>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 16px; font-weight: bold; color: ${isPositive ? '#2ed573' : '#ff6b6b'};">
                ${isPositive ? '+' : ''}${this.formatRupiah(item.amount)}
              </div>
              <div style="font-size: 11px; color: ${typeConfig.statusColor}; margin-top: 3px;">
                ${this.getStatusLabel(item.status)}
              </div>
            </div>
          </div>
          <div style="padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
            <p style="color: #aaa; font-size: 12px; margin: 0;">${item.description}</p>
            ${item.method ? `<p style="color: #00ffff; font-size: 11px; margin: 5px 0 0 0;"><i class="bi bi-credit-card"></i> ${item.method}</p>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  // ===== GET HISTORY TYPE CONFIG =====
  getHistoryTypeConfig(type) {
    const configs = {
      'topup': {
        icon: 'arrow-down-circle-fill',
        title: 'Top-Up Deposit',
        color: '#2ed573',
        bg: 'rgba(46, 213, 115, 0.1)',
        border: 'rgba(46, 213, 115, 0.3)',
        statusColor: '#2ed573'
      },
      'withdraw': {
        icon: 'arrow-up-circle-fill',
        title: 'Penarikan',
        color: '#ffc107',
        bg: 'rgba(255, 193, 7, 0.1)',
        border: 'rgba(255, 193, 7, 0.3)',
        statusColor: '#ffc107'
      },
      'hold': {
        icon: 'lock-fill',
        title: 'Deposit Ditahan',
        color: '#ffc107',
        bg: 'rgba(255, 193, 7, 0.1)',
        border: 'rgba(255, 193, 7, 0.3)',
        statusColor: '#ffc107'
      },
      'release': {
        icon: 'unlock-fill',
        title: 'Deposit Dikembalikan',
        color: '#00bfff',
        bg: 'rgba(0, 191, 255, 0.1)',
        border: 'rgba(0, 191, 255, 0.3)',
        statusColor: '#00bfff'
      }
    };

    return configs[type] || configs['topup'];
  }

  // ===== GET STATUS LABEL =====
  getStatusLabel(status) {
    const labels = {
      'success': '✓ Berhasil',
      'processing': '⏳ Diproses',
      'held': '🔒 Ditahan',
      'failed': '✗ Gagal'
    };

    return labels[status] || status;
  }

  // ===== CREATE WITHDRAW MODAL =====
  createWithdrawModal() {
    const modalHTML = `
      <div id="withdraw-modal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header" style="background: linear-gradient(135deg, #ffc107, #ffed4e);">
            <h3 style="color: #000;"><i class="bi bi-cash-coin"></i> Tarik Saldo Deposit</h3>
            <button class="modal-close" id="close-withdraw-modal" style="color: #000;">
              <i class="bi bi-x"></i>
            </button>
          </div>
          <form id="withdraw-form">
            <!-- Balance Info -->
            <div class="form-group-modal" style="background: rgba(0, 255, 255, 0.1); border: 2px solid rgba(0, 255, 255, 0.3); border-radius: 12px; padding: 15px;">
              <div style="text-align: center;">
                <div style="color: #aaa; font-size: 13px; margin-bottom: 5px;">Saldo Deposit Tersedia:</div>
                <div id="withdraw-available-balance" style="color: #00ffff; font-size: 28px; font-weight: bold;">Rp 0</div>
              </div>
            </div>

            <!-- Withdraw Amount -->
            <div class="form-group-modal">
              <label for="withdraw-amount-input">
                <i class="bi bi-cash-stack"></i> Jumlah Penarikan
              </label>
              <div style="position: relative;">
                <span style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); font-size: 16px; color: #00ffff; font-weight: bold;">Rp</span>
                <input type="text" id="withdraw-amount-input" placeholder="0" style="padding-left: 50px;" required>
              </div>
              <small style="color: #aaa; font-size: 12px; margin-top: 5px; display: block;">
                Minimum penarikan: Rp 50.000
              </small>
            </div>

            <!-- Quick Amount Buttons -->
            <div class="form-group-modal">
              <label>Nominal Cepat:</label>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                <button type="button" class="quick-withdraw-btn" data-amount="100000">Rp 100K</button>
                <button type="button" class="quick-withdraw-btn" data-amount="500000">Rp 500K</button>
                <button type="button" class="quick-withdraw-btn" data-amount="1000000">Rp 1JT</button>
                <button type="button" class="quick-withdraw-btn" data-amount="2000000">Rp 2JT</button>
                <button type="button" class="quick-withdraw-btn" data-amount="5000000">Rp 5JT</button>
                <button type="button" class="quick-withdraw-btn" id="withdraw-all-btn">Semua</button>
              </div>
            </div>

            <!-- Bank Account Info -->
            <div class="form-group-modal" id="withdraw-bank-info" style="background: rgba(255, 193, 7, 0.1); border: 2px solid rgba(255, 193, 7, 0.3); border-radius: 12px; padding: 15px;">
              <h4 style="color: #ffc107; font-size: 14px; margin-bottom: 10px;">
                <i class="bi bi-bank"></i> Ditransfer ke:
              </h4>
              <div id="withdraw-bank-details"></div>
            </div>

            <!-- Warning -->
            <div style="background: rgba(0, 191, 255, 0.1); border: 1px solid rgba(0, 191, 255, 0.3); border-radius: 10px; padding: 15px; margin-bottom: 20px;">
              <h4 style="color: #00bfff; font-size: 13px; margin-bottom: 8px;">
                <i class="bi bi-info-circle"></i> Informasi Penting:
              </h4>
              <ul style="color: #aaa; font-size: 12px; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Penarikan akan diproses dalam 1-3 hari kerja</li>
                <li>Pastikan data rekening Anda sudah benar</li>
                <li>Minimum penarikan Rp 50.000</li>
                <li>Tidak ada biaya admin untuk penarikan</li>
              </ul>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel" id="cancel-withdraw">Batal</button>
              <button type="submit" class="btn-save" style="background: linear-gradient(135deg, #ffc107, #ffed4e);">
                <i class="bi bi-check-circle"></i> Proses Penarikan
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    const existingModal = document.getElementById('withdraw-modal');
    if (!existingModal) {
      document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    this.setupWithdrawModalEvents();
  }

  // ===== CREATE TOP-UP MODAL =====
  createTopUpModal() {
    // Modal top-up sudah ada di deposit-modal.css dan deposit-system.js
    // Kita hanya perlu setup event listener untuk button
    console.log('Top-up modal already exists in deposit system');
  }

  // ===== SETUP WITHDRAW MODAL EVENTS =====
  setupWithdrawModalEvents() {
    const modal = document.getElementById('withdraw-modal');
    const closeBtn = document.getElementById('close-withdraw-modal');
    const cancelBtn = document.getElementById('cancel-withdraw');
    const form = document.getElementById('withdraw-form');
    const amountInput = document.getElementById('withdraw-amount-input');
    const quickBtns = document.querySelectorAll('.quick-withdraw-btn');
    const withdrawAllBtn = document.getElementById('withdraw-all-btn');

    if (closeBtn) closeBtn.onclick = () => this.closeWithdrawModal();
    if (cancelBtn) cancelBtn.onclick = () => this.closeWithdrawModal();
    if (modal) modal.onclick = (e) => { if (e.target === modal) this.closeWithdrawModal(); };
    if (form) form.onsubmit = (e) => { e.preventDefault(); this.processWithdraw(); };

    // Format input
    if (amountInput) {
      amountInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value) {
          e.target.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
      });
    }

    // Quick amount buttons
    quickBtns.forEach(btn => {
      if (btn.id !== 'withdraw-all-btn') {
        btn.onclick = () => {
          const amount = parseInt(btn.getAttribute('data-amount'));
          amountInput.value = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        };
      }
    });

    // Withdraw all button
    if (withdrawAllBtn) {
      withdrawAllBtn.onclick = () => {
        const balance = window.DepositSystem.getUserDeposit(this.currentUser.username);
        amountInput.value = balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      };
    }
  }

  // ===== OPEN WITHDRAW MODAL =====
  openWithdrawModal() {
    // Check if user has bank account
    if (!window.BankAccountManager.hasBankAccount(this.currentUser.username)) {
      this.showNotification('Anda belum menambahkan rekening bank! Silakan tambahkan rekening terlebih dahulu.', 'error');
      
      // Redirect to bank tab
      setTimeout(() => {
        const bankTab = document.querySelector('[data-tab="bank"]');
        if (bankTab) bankTab.click();
      }, 2000);
      
      return;
    }

    const modal = document.getElementById('withdraw-modal');
    const balance = window.DepositSystem.getUserDeposit(this.currentUser.username);
    const bankAccount = window.BankAccountManager.getBankAccount(this.currentUser.username);

    // Update balance display
    this.updateElement('withdraw-available-balance', this.formatRupiah(balance));

    // Update bank details
    const bankDetails = document.getElementById('withdraw-bank-details');
    if (bankDetails && bankAccount) {
      bankDetails.innerHTML = `
        <div style="display: grid; grid-template-columns: 120px 1fr; gap: 8px; font-size: 13px;">
          <div style="color: #aaa;">Bank:</div>
          <div style="color: #fff; font-weight: 600;">${bankAccount.bankName}</div>
          <div style="color: #aaa;">No. Rekening:</div>
          <div style="color: #fff; font-weight: 600;">${bankAccount.accountNumber}</div>
          <div style="color: #aaa;">Atas Nama:</div>
          <div style="color: #fff; font-weight: 600;">${bankAccount.accountName}</div>
        </div>
      `;
    }

    if (modal) modal.classList.add('active');
  }

  // ===== CLOSE WITHDRAW MODAL =====
  closeWithdrawModal() {
    const modal = document.getElementById('withdraw-modal');
    const form = document.getElementById('withdraw-form');

    if (modal) modal.classList.remove('active');
    if (form) form.reset();
  }

  // ===== PROCESS WITHDRAW =====
  async processWithdraw() {
    const amountInput = document.getElementById('withdraw-amount-input').value;
    const amount = parseInt(amountInput.replace(/[^0-9]/g, ''));

    if (!amount || amount < 50000) {
      this.showNotification('Minimum penarikan adalah Rp 50.000!', 'error');
      return;
    }

    const balance = window.DepositSystem.getUserDeposit(this.currentUser.username);
    
    if (amount > balance) {
      this.showNotification('Saldo tidak mencukupi!', 'error');
      return;
    }

    // Show loading
    this.showNotification('Memproses penarikan...', 'info');

    try {
      const result = window.BankAccountManager.withdrawToBank(this.currentUser.username, amount);

      if (result.success) {
        // Close modal
        this.closeWithdrawModal();

        // Reload wallet data
        setTimeout(() => {
          this.loadWalletData();
        }, 500);

        // Show success
        this.showNotification(result.message, 'success');

        // Update notification badge
        if (window.notificationHandler) {
          window.notificationHandler.updateNotificationBadge();
        }
      } else {
        this.showNotification(result.message, 'error');
      }
    } catch (error) {
      console.error('❌ Error processing withdraw:', error);
      this.showNotification('Terjadi kesalahan. Coba lagi.', 'error');
    }
  }

  // ===== OPEN WALLET TOP-UP MODAL =====
  openWalletTopUpModal() {
    // Gunakan modal yang sudah ada dari deposit-system.js
    if (typeof openDepositModal === 'function') {
      // Set context bahwa ini dari wallet, bukan dari bid
      window.walletTopUpMode = true;
      openDepositModal();
    } else {
      this.showNotification('Sistem top-up sedang dimuat...', 'info');
    }
  }

  // ===== HELPER FUNCTIONS =====
  updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  formatRupiah(amount) {
    return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
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

// ===== GLOBAL FUNCTIONS (for onclick in HTML) =====
window.openWithdrawModal = function() {
  if (window.profileWalletHandler) {
    window.profileWalletHandler.openWithdrawModal();
  }
};

window.openWalletTopUpModal = function() {
  if (window.profileWalletHandler) {
    window.profileWalletHandler.openWalletTopUpModal();
  }
};

// ===== AUTO-INITIALIZE =====
let profileWalletHandler;

function initProfileWalletHandler() {
  if (!window.location.pathname.includes('profile.html')) {
    return;
  }

  profileWalletHandler = new ProfileWalletHandler();
  console.log('✅ Profile Wallet Handler initialized');
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProfileWalletHandler);
} else {
  initProfileWalletHandler();
}

// Export
window.ProfileWalletHandler = ProfileWalletHandler;
window.profileWalletHandler = profileWalletHandler;

console.log('✅ Profile Wallet Handler loaded successfully');