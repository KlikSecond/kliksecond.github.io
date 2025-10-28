// ===== BANK ACCOUNT MANAGEMENT SYSTEM =====
console.log('🏦 Bank Account Manager loading...');

const BankAccountManager = {
  
  /**
   * Get user's bank account info
   * @param {string} username - Username
   * @returns {object|null} Bank account data or null
   */
  getBankAccount(username) {
    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) return null;
      
      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.username === username);
      
      if (!user) return null;
      
      return user.bankAccount || null;
    } catch (e) {
      console.error('❌ Error getting bank account:', e);
      return null;
    }
  },
  
  /**
   * Save or update bank account
   * @param {string} username - Username
   * @param {object} bankData - { bankName, accountNumber, accountName }
   * @returns {boolean} Success status
   */
  saveBankAccount(username, bankData) {
    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) return false;
      
      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.username === username);
      
      if (!user) return false;
      
      // Validasi
      if (!bankData.bankName || !bankData.accountNumber || !bankData.accountName) {
        console.error('❌ Invalid bank data');
        return false;
      }
      
      // Save bank account
      user.bankAccount = {
        bankName: bankData.bankName,
        accountNumber: bankData.accountNumber,
        accountName: bankData.accountName,
        verifiedDate: new Date().toISOString(),
        status: 'verified' // unverified, pending, verified
      };
      
      localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
      
      // Update window.usersData if exists
      if (window.usersData) {
        const windowUser = window.usersData.users.find(u => u.username === username);
        if (windowUser) {
          windowUser.bankAccount = user.bankAccount;
        }
      }
      
      console.log('✅ Bank account saved successfully');
      return true;
    } catch (e) {
      console.error('❌ Error saving bank account:', e);
      return false;
    }
  },
  
  /**
   * Check if user has bank account
   * @param {string} username - Username
   * @returns {boolean} Has bank account or not
   */
  hasBankAccount(username) {
    const bankAccount = this.getBankAccount(username);
    return bankAccount !== null && bankAccount.accountNumber !== undefined;
  },
  
  /**
   * Withdraw deposit to bank account
   * @param {string} username - Username
   * @param {number} amount - Amount to withdraw
   * @returns {object} { success: boolean, message: string }
   */
  withdrawToBank(username, amount) {
    try {
      // Check bank account
      if (!this.hasBankAccount(username)) {
        return {
          success: false,
          message: 'Anda belum menambahkan rekening bank!'
        };
      }
      
      // Check deposit balance
      if (!window.DepositSystem) {
        return {
          success: false,
          message: 'Sistem deposit belum dimuat!'
        };
      }
      
      const currentDeposit = window.DepositSystem.getUserDeposit(username);
      
      if (amount > currentDeposit) {
        return {
          success: false,
          message: 'Saldo deposit tidak mencukupi!'
        };
      }
      
      if (amount < 50000) {
        return {
          success: false,
          message: 'Minimum penarikan adalah Rp 50.000!'
        };
      }
      
      // Process withdrawal
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) return { success: false, message: 'User data not found' };
      
      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.username === username);
      
      if (!user) return { success: false, message: 'User not found' };
      
      // Deduct from deposit
      user.deposit = (user.deposit || 0) - amount;
      
      // Add to deposit history
      if (!user.depositHistory) user.depositHistory = [];
      
      user.depositHistory.unshift({
        id: `dep-${Date.now()}`,
        type: 'withdraw',
        amount: -amount,
        method: 'Bank Transfer',
        date: new Date().toLocaleString('id-ID'),
        status: 'processing',
        description: `Penarikan ke ${user.bankAccount.bankName} - ${user.bankAccount.accountNumber}`,
        bankAccount: user.bankAccount
      });
      
      // Add notification
      if (!user.notifications) user.notifications = [];
      
      user.notifications.unshift({
        id: `notif-${Date.now()}`,
        type: 'order_shipped',
        title: 'Penarikan Diproses 💸',
        message: `Penarikan sebesar ${this.formatRupiah(amount)} sedang diproses ke rekening ${user.bankAccount.bankName} Anda. Estimasi 1-3 hari kerja.`,
        date: new Date().toLocaleString('id-ID'),
        read: false
      });
      
      localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
      
      // Update window.usersData
      if (window.usersData) {
        const windowUser = window.usersData.users.find(u => u.username === username);
        if (windowUser) {
          windowUser.deposit = user.deposit;
          windowUser.depositHistory = user.depositHistory;
          windowUser.notifications = user.notifications;
        }
      }
      
      // Update notification badge
      if (window.notificationHandler) {
        window.notificationHandler.updateNotificationBadge();
      }
      
      console.log('✅ Withdrawal processed successfully');
      
      return {
        success: true,
        message: `Penarikan sebesar ${this.formatRupiah(amount)} berhasil diproses!`
      };
    } catch (e) {
      console.error('❌ Error processing withdrawal:', e);
      return {
        success: false,
        message: 'Terjadi kesalahan saat memproses penarikan!'
      };
    }
  },
  
  /**
   * Format number to Rupiah
   */
  formatRupiah(amount) {
    return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  },
  
  /**
   * Get list of Indonesian banks
   */
  getBankList() {
    return [
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
      'BTPN (Bank Tabungan Pensiunan Nasional)',
      'Bank Jago',
      'Jenius (BTPN)',
      'Blu (BCA Digital)',
      'SeaBank',
      'Neobank',
      'Others'
    ];
  }
};

// Export
window.BankAccountManager = BankAccountManager;

console.log('✅ Bank Account Manager loaded successfully');