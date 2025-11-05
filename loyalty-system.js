// ===== MEMBER LOYALTY & REFERRAL SYSTEM =====
console.log('💎 Loyalty System loading...');

const LoyaltySystem = {
  
  // Tier requirements based on transaction amount
  tiers: {
    silver: {
      name: 'Silver',
      minTransaction: 0,
      maxTransaction: 10000000,
      icon: '🥈',
      color: '#C0C0C0',
      benefits: [
        { icon: 'percent', title: 'Diskon 5%', description: 'Untuk semua produk' },
        { icon: 'gift', title: 'Bonus Poin', description: '1x untuk setiap transaksi' },
        { icon: 'clock', title: 'Support 24/7', description: 'Customer service standar' },
        { icon: 'box', title: 'Free Shipping', description: 'Min. pembelian Rp 500K' }
      ]
    },
    gold: {
      name: 'Gold',
      minTransaction: 10000001,
      maxTransaction: 50000000,
      icon: '🥇',
      color: '#FFD700',
      benefits: [
        { icon: 'percent', title: 'Diskon 10%', description: 'Untuk semua produk' },
        { icon: 'gift', title: 'Bonus Poin', description: '2x untuk setiap transaksi' },
        { icon: 'lightning', title: 'Priority Support', description: 'Fast response 24/7' },
        { icon: 'box', title: 'Free Shipping', description: 'Tanpa minimum pembelian' },
        { icon: 'star', title: 'Early Access', description: 'Akses awal produk baru' },
        { icon: 'calendar', title: 'Extended Warranty', description: '+3 bulan garansi' }
      ]
    },
    platinum: {
      name: 'Platinum',
      minTransaction: 50000001,
      maxTransaction: 100000000,
      icon: '💎',
      color: '#E5E4E2',
      benefits: [
        { icon: 'percent', title: 'Diskon 15%', description: 'Untuk semua produk' },
        { icon: 'gift', title: 'Bonus Poin', description: '3x untuk setiap transaksi' },
        { icon: 'headset', title: 'Dedicated Support', description: 'Personal assistant' },
        { icon: 'truck', title: 'Free Express', description: 'Pengiriman same day' },
        { icon: 'star-fill', title: 'VIP Access', description: 'Event & promo eksklusif' },
        { icon: 'calendar-check', title: 'Extended Warranty', description: '+6 bulan garansi' },
        { icon: 'cash-coin', title: 'Cashback 2%', description: 'Setiap transaksi' },
        { icon: 'tools', title: 'Free Service', description: '2x servis gratis/tahun' }
      ]
    },
    diamond: {
      name: 'Diamond',
      minTransaction: 100000001,
      maxTransaction: Infinity,
      icon: '💠',
      color: '#00D4FF',
      benefits: [
        { icon: 'percent', title: 'Diskon 20%', description: 'Untuk semua produk' },
        { icon: 'gift', title: 'Bonus Poin', description: '5x untuk setiap transaksi' },
        { icon: 'crown', title: 'Concierge Service', description: 'Layanan premium 24/7' },
        { icon: 'lightning-charge', title: 'Free Express', description: 'Same day delivery' },
        { icon: 'gem', title: 'Exclusive Access', description: 'Limited edition products' },
        { icon: 'calendar-heart', title: 'Lifetime Warranty', description: 'Garansi seumur hidup' },
        { icon: 'cash-stack', title: 'Cashback 5%', description: 'Setiap transaksi' },
        { icon: 'wrench', title: 'Unlimited Service', description: 'Servis gratis tanpa batas' }
      ]
    }
  },

  // Referral rewards
  referralReward: {
    referrer: 50000,  // Bonus untuk yang mengajak
    referee: 25000    // Bonus untuk yang diajak
  },

  /**
   * Get user's loyalty data
   * @param {string} username - Username
   * @returns {object} Loyalty data
   */
  getUserLoyalty(username) {
    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) return this.getDefaultLoyalty();
      
      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.username === username);
      
      if (!user) return this.getDefaultLoyalty();
      
      // Initialize loyalty if not exists
      if (!user.loyalty) {
        user.loyalty = this.getDefaultLoyalty();
        localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
      }
      
      return user.loyalty;
    } catch (e) {
      console.error('❌ Error getting loyalty:', e);
      return this.getDefaultLoyalty();
    }
  },

  /**
   * Get default loyalty structure
   */
  getDefaultLoyalty() {
    const referralCode = this.generateReferralCode();
    return {
      tier: 'silver',
      totalTransactions: 0,
      transactionAmount: 0,
      points: 0,
      referralCode: referralCode,
      referredBy: null,
      referrals: [],
      history: [],
      lastUpdated: new Date().toISOString()
    };
  },

  /**
   * Generate unique referral code
   */
  generateReferralCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'KS';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  },

  /**
   * Calculate tier based on transaction amount
   * @param {number} amount - Total transaction amount
   * @returns {string} Tier name
   */
  calculateTier(amount) {
    if (amount >= this.tiers.diamond.minTransaction) return 'diamond';
    if (amount >= this.tiers.platinum.minTransaction) return 'platinum';
    if (amount >= this.tiers.gold.minTransaction) return 'gold';
    return 'silver';
  },

  /**
   * Add transaction to loyalty
   * @param {string} username - Username
   * @param {number} amount - Transaction amount
   * @param {string} productName - Product name
   */
  addTransaction(username, amount, productName) {
    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) return false;
      
      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.username === username);
      
      if (!user) return false;
      
      // Initialize loyalty if not exists
      if (!user.loyalty) {
        user.loyalty = this.getDefaultLoyalty();
      }
      
      // Update loyalty data
      user.loyalty.totalTransactions += 1;
      user.loyalty.transactionAmount += amount;
      
      // Calculate new tier
      const oldTier = user.loyalty.tier;
      const newTier = this.calculateTier(user.loyalty.transactionAmount);
      user.loyalty.tier = newTier;
      
      // Add points based on tier multiplier
      const tierMultipliers = { silver: 1, gold: 2, platinum: 3, diamond: 5 };
      const pointsEarned = Math.floor(amount / 10000) * tierMultipliers[newTier];
      user.loyalty.points += pointsEarned;
      
      // Add to history
      user.loyalty.history.unshift({
        date: new Date().toISOString(),
        type: 'transaction',
        amount: amount,
        product: productName,
        pointsEarned: pointsEarned,
        tierAtTime: newTier
      });
      
      user.loyalty.lastUpdated = new Date().toISOString();
      
      // Save
      localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
      
      // Check if tier upgraded
      if (oldTier !== newTier) {
        this.addTierUpgradeNotification(user, newTier);
      }
      
      console.log('✅ Transaction added to loyalty:', amount);
      return true;
    } catch (e) {
      console.error('❌ Error adding transaction:', e);
      return false;
    }
  },

  /**
   * Add tier upgrade notification
   */
  addTierUpgradeNotification(user, newTier) {
    if (!user.notifications) user.notifications = [];
    
    const tierInfo = this.tiers[newTier];
    
    user.notifications.unshift({
      id: `notif-tier-${Date.now()}`,
      type: 'order_completed',
      title: `Selamat! Naik ke ${tierInfo.name} ${tierInfo.icon}`,
      message: `Anda telah naik ke tier ${tierInfo.name}! Nikmati benefit eksklusif dan diskon lebih besar.`,
      date: new Date().toLocaleString('id-ID'),
      read: false
    });
  },

  /**
   * Apply referral code
   * @param {string} username - Username yang menggunakan kode
   * @param {string} referralCode - Kode referral
   */
  applyReferralCode(username, referralCode) {
    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) return { success: false, message: 'Data tidak ditemukan' };
      
      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.username === username);
      
      if (!user) return { success: false, message: 'User tidak ditemukan' };
      
      // Initialize loyalty if not exists
      if (!user.loyalty) {
        user.loyalty = this.getDefaultLoyalty();
      }
      
      // Check if already used referral
      if (user.loyalty.referredBy) {
        return { success: false, message: 'Anda sudah menggunakan kode referral!' };
      }
      
      // Find referrer
      const referrer = usersData.users.find(u => u.loyalty && u.loyalty.referralCode === referralCode);
      
      if (!referrer) {
        return { success: false, message: 'Kode referral tidak valid!' };
      }
      
      if (referrer.username === username) {
        return { success: false, message: 'Tidak bisa menggunakan kode referral sendiri!' };
      }
      
      // Initialize referrer loyalty if not exists
      if (!referrer.loyalty) {
        referrer.loyalty = this.getDefaultLoyalty();
      }
      
      // Apply referral
      user.loyalty.referredBy = referrer.username;
      user.loyalty.points += this.referralReward.referee;
      
      // Add to referrer's referrals
      if (!referrer.loyalty.referrals) referrer.loyalty.referrals = [];
      referrer.loyalty.referrals.push({
        username: username,
        date: new Date().toISOString(),
        rewardGiven: this.referralReward.referrer
      });
      referrer.loyalty.points += this.referralReward.referrer;
      
      // Add history
      user.loyalty.history.unshift({
        date: new Date().toISOString(),
        type: 'referral_used',
        pointsEarned: this.referralReward.referee,
        referrer: referrer.username
      });
      
      referrer.loyalty.history.unshift({
        date: new Date().toISOString(),
        type: 'referral_given',
        pointsEarned: this.referralReward.referrer,
        referee: username
      });
      
      // Add notifications
      if (!user.notifications) user.notifications = [];
      if (!referrer.notifications) referrer.notifications = [];
      
      user.notifications.unshift({
        id: `notif-ref-${Date.now()}`,
        type: 'order_completed',
        title: 'Kode Referral Berhasil! 🎉',
        message: `Anda mendapat ${this.formatRupiah(this.referralReward.referee)} bonus dari kode referral ${referralCode}!`,
        date: new Date().toLocaleString('id-ID'),
        read: false
      });
      
      referrer.notifications.unshift({
        id: `notif-ref-${Date.now()}`,
        type: 'order_completed',
        title: 'Referral Berhasil! 💰',
        message: `${username} menggunakan kode referral Anda! Anda mendapat bonus ${this.formatRupiah(this.referralReward.referrer)}!`,
        date: new Date().toLocaleString('id-ID'),
        read: false
      });
      
      // Save
      localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
      
      return {
        success: true,
        message: `Kode referral berhasil diterapkan! Anda mendapat ${this.formatRupiah(this.referralReward.referee)} bonus!`
      };
    } catch (e) {
      console.error('❌ Error applying referral:', e);
      return { success: false, message: 'Terjadi kesalahan' };
    }
  },

  /**
   * Get progress to next tier
   * @param {number} currentAmount - Current transaction amount
   * @param {string} currentTier - Current tier
   * @returns {object} Progress data
   */
  getProgressToNextTier(currentAmount, currentTier) {
    const tiers = ['silver', 'gold', 'platinum', 'diamond'];
    const currentIndex = tiers.indexOf(currentTier);
    
    if (currentIndex === tiers.length - 1) {
      // Already at max tier
      return {
        nextTier: null,
        progress: 100,
        remaining: 0,
        nextTierAmount: 0
      };
    }
    
    const nextTier = tiers[currentIndex + 1];
    const nextTierAmount = this.tiers[nextTier].minTransaction;
    const currentTierAmount = this.tiers[currentTier].minTransaction;
    const tierRange = nextTierAmount - currentTierAmount;
    const progress = Math.min(100, ((currentAmount - currentTierAmount) / tierRange) * 100);
    const remaining = Math.max(0, nextTierAmount - currentAmount);
    
    return {
      nextTier: nextTier,
      progress: Math.round(progress),
      remaining: remaining,
      nextTierAmount: nextTierAmount
    };
  },

  /**
   * Format rupiah
   */
  formatRupiah(amount) {
    return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  },

  /**
   * Get referral link
   */
  getReferralLink(referralCode) {
    const baseUrl = window.location.origin;
    return `${baseUrl}/index.html?ref=${referralCode}`;
  }
};

// Export
window.LoyaltySystem = LoyaltySystem;

console.log('✅ Loyalty System loaded successfully');