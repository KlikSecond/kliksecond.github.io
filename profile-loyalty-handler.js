// ===== PROFILE LOYALTY & REFERRAL HANDLER =====
console.log('💎 Profile Loyalty Handler loading...');

class ProfileLoyaltyHandler {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  init() {
    if (!this.isProfilePage()) {
      console.log('⏭️ Not on profile page, skipping Loyalty Handler init');
      return;
    }

    this.waitForDependencies().then(() => {
      if (window.SessionManager && window.SessionManager.isLoggedIn()) {
        this.currentUser = window.SessionManager.getCurrentUser();
        this.setupLoyaltyTab();
        this.loadLoyaltyData();
      }
    });
  }

  isProfilePage() {
    return window.location.pathname.includes('profile.html');
  }

  waitForDependencies() {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (window.SessionManager && window.LoyaltySystem) {
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

  // ===== SETUP LOYALTY TAB =====
  setupLoyaltyTab() {
    console.log('🔧 Setting up loyalty tab...');
  }

  // ===== LOAD LOYALTY DATA =====
  loadLoyaltyData() {
    console.log('📊 Loading loyalty data...');
    
    if (!window.LoyaltySystem) {
      this.renderError('Sistem loyalty belum dimuat');
      return;
    }

    const loyaltyData = window.LoyaltySystem.getUserLoyalty(this.currentUser.username);
    console.log('Loyalty Data:', loyaltyData);

    const loyaltyTabContent = document.getElementById('loyalty-tab-content');
    if (!loyaltyTabContent) {
      console.error('❌ Loyalty tab content not found');
      return;
    }

    this.renderLoyaltyView(loyaltyTabContent, loyaltyData);
  }

  // ===== RENDER LOYALTY VIEW =====
  renderLoyaltyView(container, loyaltyData) {
    const tierInfo = window.LoyaltySystem.tiers[loyaltyData.tier];
    const progress = window.LoyaltySystem.getProgressToNextTier(
      loyaltyData.transactionAmount,
      loyaltyData.tier
    );

    container.innerHTML = `
      <div class="loyalty-container">
        
        <!-- Loyalty Status Card -->
        <div class="loyalty-status-card">
          <div class="tier-badge-container">
            <div class="tier-badge ${loyaltyData.tier}">
              ${tierInfo.icon}
            </div>
            <h2 class="tier-name ${loyaltyData.tier}">${tierInfo.name}</h2>
            <p class="tier-description">
              ${this.getTierDescription(loyaltyData.tier)}
            </p>
          </div>

          ${progress.nextTier ? `
            <div class="loyalty-progress-section">
              <div class="loyalty-progress-header">
                <span class="loyalty-progress-label">Progress ke ${window.LoyaltySystem.tiers[progress.nextTier].name}</span>
                <span class="loyalty-progress-value">${progress.progress}%</span>
              </div>
              <div class="loyalty-progress-bar">
                <div class="loyalty-progress-fill ${loyaltyData.tier}" style="width: ${progress.progress}%"></div>
              </div>
              <p class="loyalty-next-tier">
                Transaksi lagi ${window.LoyaltySystem.formatRupiah(progress.remaining)} untuk naik ke tier ${window.LoyaltySystem.tiers[progress.nextTier].name}
              </p>
            </div>
          ` : `
            <div class="loyalty-progress-section" style="text-align: center;">
              <div style="color: #00ffff; font-size: 18px; font-weight: bold; margin-top: 20px;">
                🏆 Anda sudah di tier tertinggi!
              </div>
              <p style="color: #aaa; font-size: 14px; margin-top: 10px;">
                Nikmati semua benefit eksklusif Diamond Member
              </p>
            </div>
          `}
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stats-card">
            <i class="bi bi-receipt"></i>
            <div>
              <h4>${loyaltyData.totalTransactions}</h4>
              <p>Total Transaksi</p>
            </div>
          </div>
          <div class="stats-card">
            <i class="bi bi-cash-stack"></i>
            <div>
              <h4>${window.LoyaltySystem.formatRupiah(loyaltyData.transactionAmount)}</h4>
              <p>Total Belanja</p>
            </div>
          </div>
          <div class="stats-card">
            <i class="bi bi-star-fill"></i>
            <div>
              <h4>${loyaltyData.points.toLocaleString()}</h4>
              <p>Poin Loyalty</p>
            </div>
          </div>
          <div class="stats-card">
            <i class="bi bi-people-fill"></i>
            <div>
              <h4>${loyaltyData.referrals ? loyaltyData.referrals.length : 0}</h4>
              <p>Referral Berhasil</p>
            </div>
          </div>
        </div>

        <!-- Benefits Section -->
        <div class="loyalty-benefits">
          <h3><i class="bi bi-gift-fill"></i> Benefit ${tierInfo.name} Member</h3>
          <div class="benefits-grid">
            ${tierInfo.benefits.map(benefit => `
              <div class="benefit-item">
                <div class="benefit-icon">
                  <i class="bi bi-${benefit.icon}"></i>
                </div>
                <div class="benefit-text">
                  <div class="benefit-title">${benefit.title}</div>
                  <div class="benefit-description">${benefit.description}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Referral Section -->
        <div class="referral-section">
          <div class="referral-header">
            <h3><i class="bi bi-megaphone-fill"></i> Program Referral</h3>
            <p>Ajak teman dan dapatkan bonus untuk setiap referral berhasil!</p>
          </div>

          <div class="referral-code-container">
            <div class="referral-code-label">Kode Referral Anda:</div>
            <div class="referral-code-display">
              <span class="referral-code" id="referral-code-text">${loyaltyData.referralCode}</span>
              <button class="btn-copy-code" onclick="profileLoyaltyHandler.copyReferralCode()">
                <i class="bi bi-clipboard"></i>
                <span>Copy</span>
              </button>
            </div>
          </div>

          <div class="referral-link-container">
            <input 
              type="text" 
              class="referral-link-input" 
              id="referral-link-input"
              value="${window.LoyaltySystem.getReferralLink(loyaltyData.referralCode)}"
              readonly
              onclick="this.select()"
            >
          </div>

          <div class="referral-stats">
            <div class="referral-stat-card">
              <div class="stat-value">${loyaltyData.referrals ? loyaltyData.referrals.length : 0}</div>
              <div class="stat-label">Total Referral</div>
            </div>
            <div class="referral-stat-card">
              <div class="stat-value">${window.LoyaltySystem.formatRupiah((loyaltyData.referrals ? loyaltyData.referrals.length : 0) * window.LoyaltySystem.referralReward.referrer)}</div>
              <div class="stat-label">Total Bonus</div>
            </div>
            <div class="referral-stat-card">
              <div class="stat-value">${loyaltyData.points.toLocaleString()}</div>
              <div class="stat-label">Poin Terkumpul</div>
            </div>
          </div>

          <div class="referral-rewards">
            <h4><i class="bi bi-trophy-fill"></i> Reward Referral</h4>
            <div class="rewards-list">
              <div class="reward-item">
                <div class="reward-icon">
                  <i class="bi bi-person-plus-fill"></i>
                </div>
                <div class="reward-text">
                  Anda mendapat <strong>${window.LoyaltySystem.formatRupiah(window.LoyaltySystem.referralReward.referrer)}</strong> untuk setiap teman yang mendaftar
                </div>
              </div>
              <div class="reward-item">
                <div class="reward-icon">
                  <i class="bi bi-gift-fill"></i>
                </div>
                <div class="reward-text">
                  Teman Anda mendapat <strong>${window.LoyaltySystem.formatRupiah(window.LoyaltySystem.referralReward.referee)}</strong> bonus sebagai welcome gift
                </div>
              </div>
              <div class="reward-item">
                <div class="reward-icon">
                  <i class="bi bi-infinity"></i>
                </div>
                <div class="reward-text">
                  Tidak ada batas! Semakin banyak referral, semakin banyak bonus yang didapat
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tier Comparison -->
        <div class="tier-comparison">
          <h3><i class="bi bi-bar-chart-fill"></i> Perbandingan Tier</h3>
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Benefit</th>
                <th>Silver 🥈</th>
                <th>Gold 🥇</th>
                <th>Platinum 💎</th>
                <th>Diamond 💠</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Min. Transaksi</td>
                <td>Rp 0</td>
                <td>Rp 10 Jt</td>
                <td>Rp 50 Jt</td>
                <td>Rp 100 Jt</td>
              </tr>
              <tr>
                <td>Diskon</td>
                <td>5%</td>
                <td>10%</td>
                <td>15%</td>
                <td>20%</td>
              </tr>
              <tr>
                <td>Poin Multiplier</td>
                <td>1x</td>
                <td>2x</td>
                <td>3x</td>
                <td>5x</td>
              </tr>
              <tr>
                <td>Free Shipping</td>
                <td>Min. Rp 500K</td>
                <td>✓ Semua</td>
                <td>✓ Express</td>
                <td>✓ Same Day</td>
              </tr>
              <tr>
                <td>Support</td>
                <td>Standard</td>
                <td>Priority</td>
                <td>Dedicated</td>
                <td>Concierge</td>
              </tr>
              <tr>
                <td>Garansi Tambahan</td>
                <td>-</td>
                <td>+3 bulan</td>
                <td>+6 bulan</td>
                <td>Lifetime</td>
              </tr>
              <tr>
                <td>Cashback</td>
                <td>-</td>
                <td>-</td>
                <td>2%</td>
                <td>5%</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    `;
  }

  // ===== GET TIER DESCRIPTION =====
  getTierDescription(tier) {
    const descriptions = {
      silver: 'Member baru dengan akses ke benefit dasar',
      gold: 'Member aktif dengan benefit premium',
      platinum: 'Member VIP dengan layanan eksklusif',
      diamond: 'Member elite dengan semua privilege tertinggi'
    };
    return descriptions[tier] || '';
  }

  // ===== COPY REFERRAL CODE =====
  copyReferralCode() {
    const codeText = document.getElementById('referral-code-text');
    const linkInput = document.getElementById('referral-link-input');
    
    if (linkInput) {
      linkInput.select();
      linkInput.setSelectionRange(0, 99999); // For mobile
      
      try {
        document.execCommand('copy');
        this.showNotification('Link referral berhasil dicopy!', 'success');
      } catch (err) {
        // Fallback
        navigator.clipboard.writeText(linkInput.value).then(() => {
          this.showNotification('Link referral berhasil dicopy!', 'success');
        }).catch(() => {
          this.showNotification('Gagal copy link referral', 'error');
        });
      }
    }
  }

  // ===== RENDER ERROR =====
  renderError(message) {
    const loyaltyTabContent = document.getElementById('loyalty-tab-content');
    if (!loyaltyTabContent) return;

    loyaltyTabContent.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <i class="bi bi-exclamation-triangle" style="font-size: 60px; color: #ff6b6b; margin-bottom: 20px;"></i>
        <h3 style="color: #fff; margin-bottom: 10px;">Error</h3>
        <p style="color: #aaa;">${message}</p>
        <button class="btn-submit-kyc" onclick="location.reload()" style="margin-top: 20px;">
          <i class="bi bi-arrow-clockwise"></i>
          Muat Ulang
        </button>
      </div>
    `;
  }

  // ===== SHOW NOTIFICATION =====
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
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// ===== AUTO-INITIALIZE =====
let profileLoyaltyHandler;

function initProfileLoyaltyHandler() {
  if (!window.location.pathname.includes('profile.html')) {
    return;
  }

  profileLoyaltyHandler = new ProfileLoyaltyHandler();
  console.log('✅ Profile Loyalty Handler initialized');
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProfileLoyaltyHandler);
} else {
  initProfileLoyaltyHandler();
}

// Export
window.ProfileLoyaltyHandler = ProfileLoyaltyHandler;
window.profileLoyaltyHandler = profileLoyaltyHandler;

console.log('✅ Profile Loyalty Handler loaded successfully');