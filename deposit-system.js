// ===== DEPOSIT SYSTEM FOR AUCTION =====
// Sistem deposit 50% untuk jaminan bid

console.log('💰 Deposit system loading...');

const DepositSystem = {
  
  // Minimum deposit percentage required
  DEPOSIT_PERCENTAGE: 0.5, // 50%
  
  /**
   * Get user's current deposit balance
   * @param {string} username - Username
   * @returns {number} Current deposit balance
   */
  getUserDeposit(username) {
    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) return 0;
      
      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.username === username);
      
      if (!user) return 0;
      
      // Initialize deposit if not exists
      if (typeof user.deposit === 'undefined') {
        user.deposit = 0;
        localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
      }
      
      return user.deposit || 0;
    } catch (e) {
      console.error('❌ Error getting user deposit:', e);
      return 0;
    }
  },
  
  /**
   * Calculate required deposit for a bid amount
   * @param {number} bidAmount - Bid amount
   * @returns {number} Required deposit (50% of bid)
   */
  calculateRequiredDeposit(bidAmount) {
    return Math.ceil(bidAmount * this.DEPOSIT_PERCENTAGE);
  },
  
  /**
   * Check if user has enough deposit for bid
   * @param {string} username - Username
   * @param {number} bidAmount - Bid amount
   * @returns {object} { hasEnough: boolean, current: number, required: number, shortage: number }
   */
  checkDepositSufficiency(username, bidAmount) {
    const currentDeposit = this.getUserDeposit(username);
    const requiredDeposit = this.calculateRequiredDeposit(bidAmount);
    const shortage = Math.max(0, requiredDeposit - currentDeposit);
    
    return {
      hasEnough: currentDeposit >= requiredDeposit,
      current: currentDeposit,
      required: requiredDeposit,
      shortage: shortage
    };
  },
  
  /**
   * Add deposit to user account (Top-up)
   * @param {string} username - Username
   * @param {number} amount - Amount to add
   * @param {string} method - Payment method
   * @returns {boolean} Success status
   */
  addDeposit(username, amount, method = 'Bank Transfer') {
    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) return false;
      
      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.username === username);
      
      if (!user) return false;
      
      // Initialize deposit if not exists
      if (typeof user.deposit === 'undefined') {
        user.deposit = 0;
      }
      
      // Initialize deposit history if not exists
      if (!user.depositHistory) {
        user.depositHistory = [];
      }
      
      // Add deposit
      user.deposit += amount;
      
      // Add to history
      const historyEntry = {
        id: `dep-${Date.now()}`,
        type: 'topup',
        amount: amount,
        method: method,
        date: new Date().toLocaleString('id-ID'),
        status: 'success',
        description: `Top-up deposit via ${method}`
      };
      
      user.depositHistory.unshift(historyEntry);
      
      // Add notification
      if (!user.notifications) {
        user.notifications = [];
      }
      
      user.notifications.unshift({
        id: `notif-${Date.now()}`,
        type: 'order_success',
        title: 'Deposit Berhasil! 💰',
        message: `Deposit sebesar ${this.formatRupiah(amount)} telah ditambahkan ke akun Anda melalui ${method}.`,
        date: new Date().toLocaleString('id-ID'),
        read: false
      });
      
      // Save to localStorage
      localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
      
      // Update window.usersData if exists
      if (window.usersData) {
        const windowUser = window.usersData.users.find(u => u.username === username);
        if (windowUser) {
          windowUser.deposit = user.deposit;
          windowUser.depositHistory = user.depositHistory;
          windowUser.notifications = user.notifications;
        }
      }
      
      console.log('✅ Deposit added successfully');
      return true;
    } catch (e) {
      console.error('❌ Error adding deposit:', e);
      return false;
    }
  },
  
  /**
   * Hold deposit when user places a bid
   * @param {string} username - Username
   * @param {number} bidAmount - Bid amount
   * @param {string} auctionId - Auction ID
   * @param {string} productName - Product name
   * @returns {boolean} Success status
   */
  holdDeposit(username, bidAmount, auctionId, productName) {
    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) return false;
      
      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.username === username);
      
      if (!user) return false;
      
      const requiredDeposit = this.calculateRequiredDeposit(bidAmount);
      
      // Check if enough deposit
      if (user.deposit < requiredDeposit) {
        return false;
      }
      
      // Initialize held deposits if not exists
      if (!user.heldDeposits) {
        user.heldDeposits = [];
      }
      
      // Hold the deposit
      const holdEntry = {
        id: `hold-${Date.now()}`,
        auctionId: auctionId,
        productName: productName,
        bidAmount: bidAmount,
        heldAmount: requiredDeposit,
        date: new Date().toLocaleString('id-ID'),
        status: 'held'
      };
      
      user.heldDeposits.push(holdEntry);
      
      // Deduct from available deposit
      user.deposit -= requiredDeposit;
      
      // Add to history
      if (!user.depositHistory) {
        user.depositHistory = [];
      }
      
      user.depositHistory.unshift({
        id: `dep-${Date.now()}`,
        type: 'hold',
        amount: -requiredDeposit,
        method: 'Bid Deposit',
        date: new Date().toLocaleString('id-ID'),
        status: 'held',
        description: `Deposit ditahan untuk bid ${productName}`
      });
      
      // Add notification
      if (!user.notifications) {
        user.notifications = [];
      }
      
      user.notifications.unshift({
        id: `notif-${Date.now()}`,
        type: 'bid_received',
        title: 'Deposit Ditahan 🔒',
        message: `Deposit sebesar ${this.formatRupiah(requiredDeposit)} ditahan untuk bid Anda pada ${productName}.`,
        date: new Date().toLocaleString('id-ID'),
        read: false
      });
      
      // Save to localStorage
      localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
      
      // Update window.usersData if exists
      if (window.usersData) {
        const windowUser = window.usersData.users.find(u => u.username === username);
        if (windowUser) {
          windowUser.deposit = user.deposit;
          windowUser.heldDeposits = user.heldDeposits;
          windowUser.depositHistory = user.depositHistory;
          windowUser.notifications = user.notifications;
        }
      }
      
      console.log('✅ Deposit held successfully');
      return true;
    } catch (e) {
      console.error('❌ Error holding deposit:', e);
      return false;
    }
  },
  
  /**
   * Release held deposit (when user loses auction or cancels bid)
   * @param {string} username - Username
   * @param {string} holdId - Hold ID
   * @returns {boolean} Success status
   */
  releaseDeposit(username, holdId) {
    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) return false;
      
      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.username === username);
      
      if (!user || !user.heldDeposits) return false;
      
      // Find held deposit
      const holdIndex = user.heldDeposits.findIndex(h => h.id === holdId);
      if (holdIndex === -1) return false;
      
      const hold = user.heldDeposits[holdIndex];
      
      // Return deposit to user
      user.deposit += hold.heldAmount;
      
      // Remove from held deposits
      user.heldDeposits.splice(holdIndex, 1);
      
      // Add to history
      if (!user.depositHistory) {
        user.depositHistory = [];
      }
      
      user.depositHistory.unshift({
        id: `dep-${Date.now()}`,
        type: 'release',
        amount: hold.heldAmount,
        method: 'Deposit Release',
        date: new Date().toLocaleString('id-ID'),
        status: 'success',
        description: `Deposit dikembalikan dari bid ${hold.productName}`
      });
      
      // Save to localStorage
      localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
      
      console.log('✅ Deposit released successfully');
      return true;
    } catch (e) {
      console.error('❌ Error releasing deposit:', e);
      return false;
    }
  },
  
  /**
   * Get user's deposit history
   * @param {string} username - Username
   * @returns {array} Deposit history
   */
  getDepositHistory(username) {
    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) return [];
      
      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.username === username);
      
      if (!user || !user.depositHistory) return [];
      
      return user.depositHistory;
    } catch (e) {
      console.error('❌ Error getting deposit history:', e);
      return [];
    }
  },
  
  /**
   * Get user's held deposits
   * @param {string} username - Username
   * @returns {array} Held deposits
   */
  getHeldDeposits(username) {
    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) return [];
      
      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.username === username);
      
      if (!user || !user.heldDeposits) return [];
      
      return user.heldDeposits;
    } catch (e) {
      console.error('❌ Error getting held deposits:', e);
      return [];
    }
  },
  
  /**
   * Format number to Rupiah
   * @param {number} amount - Amount
   * @returns {string} Formatted Rupiah
   */
  formatRupiah(amount) {
    return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
};

// Export to window
window.DepositSystem = DepositSystem;

console.log('✅ Deposit system loaded successfully');d