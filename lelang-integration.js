// ===== AUCTION BIDDING SYSTEM WITH DEPOSIT INTEGRATION =====
// File: lelang-integration.js
// Menggabungkan sistem lelang dengan sistem deposit 50%

console.log('🔄 Auction-Deposit integration loading...');

// Variable untuk menyimpan data bid saat ini
let currentAuctionId = '';
let currentProductName = '';
let currentBidPrice = 0;
const BID_INCREMENT = 100000; // Minimum increment bid: Rp 100.000

// ===== UTILITY FUNCTIONS =====

/**
 * Format angka ke format rupiah
 */
function formatRupiah(angka) {
  return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Parse rupiah ke angka
 */
function parseRupiah(rupiah) {
  return parseInt(rupiah.replace(/[^0-9]/g, ''));
}

// ===== BID MODAL FUNCTIONS =====

/**
 * Membuka modal bid dengan integrasi deposit check
 */
function openBidModal(productName, currentBid, auctionId) {
  // Check if user is logged in
  if (!window.SessionManager || !window.SessionManager.isLoggedIn()) {
    showNotification('error', 'Silakan login terlebih dahulu untuk melakukan bid!');
    
    // Open login modal
    setTimeout(() => {
      const loginBtn = document.querySelector('.btn-login');
      if (loginBtn) {
        loginBtn.click();
      }
    }, 1500);
    return;
  }
  
  // Check if deposit system is loaded
  if (!window.DepositSystem) {
    showNotification('error', 'Sistem deposit sedang dimuat. Coba lagi sebentar...');
    return;
  }
  
  const currentUser = window.SessionManager.getCurrentUser();
  const modal = document.getElementById('bid-modal');
  const modalProductName = document.getElementById('modal-product-name');
  const modalCurrentBid = document.getElementById('modal-current-bid');
  const modalMinBid = document.getElementById('modal-min-bid');
  const bidAmountInput = document.getElementById('bid-amount');
  
  // Set data
  currentAuctionId = auctionId;
  currentProductName = productName;
  currentBidPrice = currentBid;
  
  const minBid = currentBid + BID_INCREMENT;
  
  // Update modal content
  modalProductName.textContent = productName;
  modalCurrentBid.textContent = formatRupiah(currentBid);
  modalMinBid.textContent = formatRupiah(minBid);
  bidAmountInput.value = '';
  bidAmountInput.placeholder = minBid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  // ===== SHOW DEPOSIT INFO =====
  const depositInfo = document.getElementById('deposit-info-section');
  const currentDepositEl = document.getElementById('current-deposit-amount');
  const requiredDepositEl = document.getElementById('required-deposit-amount');
  const depositShortageEl = document.getElementById('deposit-shortage');
  const shortageAmountEl = document.getElementById('shortage-amount-display');
  
  if (depositInfo) {
    const currentDeposit = window.DepositSystem.getUserDeposit(currentUser.username);
    const requiredDeposit = window.DepositSystem.calculateRequiredDeposit(minBid);
    
    currentDepositEl.textContent = formatRupiah(currentDeposit);
    requiredDepositEl.textContent = formatRupiah(requiredDeposit);
    
    // Show shortage if insufficient
    if (currentDeposit < requiredDeposit) {
      const shortage = requiredDeposit - currentDeposit;
      shortageAmountEl.textContent = formatRupiah(shortage);
      depositShortageEl.style.display = 'flex';
    } else {
      depositShortageEl.style.display = 'none';
    }
    
    depositInfo.style.display = 'block';
  }
  
  // Tampilkan modal
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  // Generate bid history (simulasi)
  generateBidHistory(currentBid);
}

/**
 * Menutup modal bid
 */
function closeBidModal() {
  const modal = document.getElementById('bid-modal');
  modal.classList.remove('show');
  document.body.style.overflow = 'auto';
  
  // Reset checkbox
  document.getElementById('agree-terms').checked = false;
}

// ===== DEPOSIT MODAL FUNCTIONS =====

/**
 * Membuka modal deposit untuk top-up
 */
function openDepositModal() {
  if (!window.SessionManager || !window.SessionManager.isLoggedIn()) {
    showNotification('error', 'Silakan login terlebih dahulu!');
    return;
  }
  
  const currentUser = window.SessionManager.getCurrentUser();
  const depositModal = document.getElementById('deposit-modal');
  const currentDepositDisplay = document.getElementById('modal-current-deposit');
  const requiredDepositDisplay = document.getElementById('modal-required-deposit');
  const shortageDisplay = document.getElementById('modal-shortage-amount');
  
  // Get deposit info
  const currentDeposit = window.DepositSystem.getUserDeposit(currentUser.username);
  const bidAmount = parseRupiah(document.getElementById('bid-amount').value) || (currentBidPrice + BID_INCREMENT);
  const requiredDeposit = window.DepositSystem.calculateRequiredDeposit(bidAmount);
  const shortage = Math.max(0, requiredDeposit - currentDeposit);
  
  // Update display
  currentDepositDisplay.textContent = formatRupiah(currentDeposit);
  requiredDepositDisplay.textContent = formatRupiah(requiredDeposit);
  shortageDisplay.textContent = formatRupiah(shortage);
  
  // Show shortage section if needed
  const shortageSection = document.getElementById('modal-shortage-section');
  if (shortage > 0) {
    shortageSection.style.display = 'block';
    
    // Set default topup amount to shortage (rounded up to nearest 100k)
    const suggestedTopup = Math.ceil(shortage / 100000) * 100000;
    document.getElementById('topup-amount').value = suggestedTopup.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  } else {
    shortageSection.style.display = 'none';
  }
  
  // Close bid modal first
  closeBidModal();
  
  // Show deposit modal
  depositModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

/**
 * Menutup modal deposit
 */
function closeDepositModal() {
  const depositModal = document.getElementById('deposit-modal');
  depositModal.classList.remove('show');
  document.body.style.overflow = 'auto';
  
  // Hide success message
  const successMsg = document.getElementById('deposit-success-message');
  if (successMsg) {
    successMsg.classList.remove('show');
  }
  
  // Reset form
  document.getElementById('topup-amount').value = '';
  document.querySelectorAll('.quick-amount-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.payment-method-btn').forEach(btn => btn.classList.remove('selected'));
}

// Close modal ketika klik di luar modal
window.onclick = function(event) {
  const modal = document.getElementById('bid-modal');
  const depositModal = document.getElementById('deposit-modal');
  
  if (event.target === modal) {
    closeBidModal();
  }
  
  if (event.target === depositModal) {
    closeDepositModal();
  }
}

// ===== QUICK BID FUNCTIONS =====

/**
 * Quick bid - tambah nilai bid dengan cepat
 */
function quickBid(amount) {
  const bidAmountInput = document.getElementById('bid-amount');
  let currentValue = parseRupiah(bidAmountInput.value) || (currentBidPrice + BID_INCREMENT);
  
  currentValue += amount;
  
  // Format dengan titik pemisah ribuan
  bidAmountInput.value = currentValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  // Update required deposit display
  updateDepositRequirement(currentValue);
}

/**
 * Update deposit requirement saat user mengetik
 */
function updateDepositRequirement(bidAmount) {
  if (!window.DepositSystem) return;
  
  const currentUser = window.SessionManager.getCurrentUser();
  if (!currentUser) return;
  
  const requiredDepositEl = document.getElementById('required-deposit-amount');
  const depositShortageEl = document.getElementById('deposit-shortage');
  const shortageAmountEl = document.getElementById('shortage-amount-display');
  
  const currentDeposit = window.DepositSystem.getUserDeposit(currentUser.username);
  const requiredDeposit = window.DepositSystem.calculateRequiredDeposit(bidAmount);
  
  requiredDepositEl.textContent = formatRupiah(requiredDeposit);
  
  // Update shortage
  if (currentDeposit < requiredDeposit) {
    const shortage = requiredDeposit - currentDeposit;
    shortageAmountEl.textContent = formatRupiah(shortage);
    depositShortageEl.style.display = 'flex';
  } else {
    depositShortageEl.style.display = 'none';
  }
}

// ===== TOP-UP FUNCTIONS =====

/**
 * Quick amount selection untuk top-up
 */
let selectedQuickAmount = 0;

function selectQuickAmount(amount) {
  const topupInput = document.getElementById('topup-amount');
  topupInput.value = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  selectedQuickAmount = amount;
  
  // Update active state
  document.querySelectorAll('.quick-amount-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  event.target.classList.add('active');
}

/**
 * Select payment method
 */
let selectedPaymentMethod = '';

function selectPaymentMethod(method) {
  selectedPaymentMethod = method;
  
  // Update selected state
  document.querySelectorAll('.payment-method-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  
  event.target.closest('.payment-method-btn').classList.add('selected');
}

/**
 * Process top-up deposit
 */
function processTopUp() {
  const topupInput = document.getElementById('topup-amount');
  const amount = parseRupiah(topupInput.value);
  
  // Validation
  if (!amount || amount < 100000) {
    showNotification('error', 'Minimum top-up adalah Rp 100.000!');
    return;
  }
  
  if (!selectedPaymentMethod) {
    showNotification('error', 'Pilih metode pembayaran terlebih dahulu!');
    return;
  }
  
  const currentUser = window.SessionManager.getCurrentUser();
  
  // Show loading
  showNotification('loading', 'Memproses top-up deposit...');
  
  // Simulate payment processing
  setTimeout(() => {
    // Add deposit
    const success = window.DepositSystem.addDeposit(currentUser.username, amount, selectedPaymentMethod);
    
    if (success) {
      // Show success message
      const successMsg = document.getElementById('deposit-success-message');
      if (successMsg) {
        successMsg.classList.add('show');
      }
      
      // Update notification badge
      if (window.notificationHandler) {
        window.notificationHandler.updateNotificationBadge();
      }
      
      showNotification('success', `Top-up sebesar ${formatRupiah(amount)} berhasil!`);
      
      // Close modal and reopen bid modal after 2 seconds
      setTimeout(() => {
        closeDepositModal();
        openBidModal(currentProductName, currentBidPrice, currentAuctionId);
      }, 2000);
    } else {
      showNotification('error', 'Gagal melakukan top-up. Coba lagi.');
    }
  }, 2000);
}

// ===== BID SUBMISSION FUNCTIONS =====

/**
 * Submit bid dengan deposit check
 */
function submitBid() {
  const bidAmountInput = document.getElementById('bid-amount');
  const agreeTerms = document.getElementById('agree-terms');
  const minBid = currentBidPrice + BID_INCREMENT;
  
  // Check login
  if (!window.SessionManager || !window.SessionManager.isLoggedIn()) {
    showNotification('error', 'Silakan login terlebih dahulu!');
    return;
  }
  
  const currentUser = window.SessionManager.getCurrentUser();
  
  // Validasi checkbox
  if (!agreeTerms.checked) {
    showNotification('error', 'Anda harus menyetujui syarat dan ketentuan!');
    return;
  }
  
  // Validasi input
  if (!bidAmountInput.value) {
    showNotification('error', 'Masukkan jumlah bid Anda!');
    return;
  }
  
  const bidAmount = parseRupiah(bidAmountInput.value);
  
  // Validasi minimum bid
  if (bidAmount < minBid) {
    showNotification('error', `Bid minimum adalah ${formatRupiah(minBid)}`);
    return;
  }
  
  // ===== CHECK DEPOSIT (CRITICAL) =====
  if (!window.DepositSystem) {
    showNotification('error', 'Sistem deposit belum dimuat!');
    return;
  }
  
  const depositCheck = window.DepositSystem.checkDepositSufficiency(currentUser.username, bidAmount);
  
  if (!depositCheck.hasEnough) {
    showNotification('error', `Deposit tidak mencukupi! Anda memerlukan ${formatRupiah(depositCheck.shortage)} lagi.`);
    
    // Show prompt to top-up
    setTimeout(() => {
      const confirmTopup = confirm(
        `DEPOSIT TIDAK MENCUKUPI\n\n` +
        `Deposit saat ini: ${formatRupiah(depositCheck.current)}\n` +
        `Diperlukan (50% dari bid): ${formatRupiah(depositCheck.required)}\n` +
        `Kekurangan: ${formatRupiah(depositCheck.shortage)}\n\n` +
        `Apakah Anda ingin melakukan top-up sekarang?`
      );
      
      if (confirmTopup) {
        openDepositModal();
      }
    }, 500);
    
    return;
  }
  
  // Simulasi proses bid
  showNotification('loading', 'Memproses bid Anda...');
  
  setTimeout(() => {
    // Hold deposit
    const holdSuccess = window.DepositSystem.holdDeposit(
      currentUser.username,
      bidAmount,
      currentAuctionId,
      currentProductName
    );
    
    if (!holdSuccess) {
      showNotification('error', 'Gagal menahan deposit. Coba lagi.');
      return;
    }
    
    // Update harga bid di card
    updateAuctionCard(currentAuctionId, bidAmount);
    
    // Tambah bid ke history
    addBidToHistory(bidAmount);
    
    // Update notification badge
    if (window.notificationHandler) {
      window.notificationHandler.updateNotificationBadge();
    }
    
    // Tampilkan notifikasi sukses
    showNotification('success', `Bid Anda sebesar ${formatRupiah(bidAmount)} berhasil dipasang!`);
    
    // Tutup modal setelah 1 detik
    setTimeout(() => {
      closeBidModal();
    }, 1000);
  }, 1500);
}

/**
 * Update auction card setelah bid berhasil
 */
function updateAuctionCard(auctionId, newBid) {
  const allItems = document.querySelectorAll('.auction-item');
  
  allItems.forEach((item, index) => {
    // Update berdasarkan auction ID (untuk demo, update item pertama)
    if ((auctionId === 'auction-1' && index === 0) ||
        (auctionId === 'auction-2' && index === 1) ||
        (auctionId === 'auction-3' && index === 2)) {
      
      const currentPriceEl = item.querySelector('.current-price');
      const bidsEl = item.querySelector('.auction-stats-row .stat:first-child span');
      
      if (currentPriceEl) {
        currentPriceEl.textContent = formatRupiah(newBid);
      }
      
      if (bidsEl) {
        const currentBids = parseInt(bidsEl.textContent);
        bidsEl.textContent = `${currentBids + 1} Bids`;
      }
    }
  });
  
  // Update current bid price untuk modal berikutnya
  currentBidPrice = newBid;
}

// ===== BID HISTORY FUNCTIONS =====

/**
 * Generate bid history (simulasi)
 */
function generateBidHistory(currentBid) {
  const historyList = document.getElementById('bid-history-list');
  const bidHistory = [];
  
  // Generate 4 bid history secara random
  let tempBid = currentBid;
  const bidders = ['User****23', 'User****15', 'User****89', 'User****42', 'User****67', 'User****91'];
  
  for (let i = 0; i < 4; i++) {
    const timeAgo = [2, 8, 15, 23, 30, 45];
    bidHistory.push({
      bidder: bidders[Math.floor(Math.random() * bidders.length)],
      amount: tempBid,
      time: `${timeAgo[i]} menit lalu`
    });
    tempBid -= (BID_INCREMENT * (i + 1));
  }
  
  // Render history
  historyList.innerHTML = bidHistory.map(bid => `
    <div class="history-item">
      <div class="bidder-info">
        <i class="bi bi-person-circle"></i>
        <span class="bidder-name">${bid.bidder}</span>
      </div>
      <span class="bid-amount">${formatRupiah(bid.amount)}</span>
      <span class="bid-time">${bid.time}</span>
    </div>
  `).join('');
}

/**
 * Tambah bid baru ke history
 */
function addBidToHistory(bidAmount) {
  const historyList = document.getElementById('bid-history-list');
  
  const newBid = `
    <div class="history-item" style="animation: slideIn 0.3s ease;">
      <div class="bidder-info">
        <i class="bi bi-person-circle"></i>
        <span class="bidder-name">Anda</span>
      </div>
      <span class="bid-amount">${formatRupiah(bidAmount)}</span>
      <span class="bid-time">Baru saja</span>
    </div>
  `;
  
  historyList.insertAdjacentHTML('afterbegin', newBid);
}

// ===== NOTIFICATION FUNCTION =====

/**
 * Show notification dengan berbagai tipe
 */
function showNotification(type, message) {
  // Hapus notifikasi sebelumnya jika ada
  const existingNotif = document.querySelector('.notification');
  if (existingNotif) {
    existingNotif.remove();
  }
  
  // Buat notifikasi baru
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  let icon = '';
  let bgColor = '';
  
  if (type === 'success') {
    icon = '<i class="bi bi-check-circle-fill"></i>';
    bgColor = 'linear-gradient(135deg, #00ff88, #00cc66)';
  } else if (type === 'error') {
    icon = '<i class="bi bi-x-circle-fill"></i>';
    bgColor = 'linear-gradient(135deg, #ff6b6b, #ee5a6f)';
  } else if (type === 'loading') {
    icon = '<i class="bi bi-hourglass-split"></i>';
    bgColor = 'linear-gradient(135deg, #00ffff, #00ccff)';
  }
  
  notification.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 30px;
    background: ${bgColor};
    color: #000;
    padding: 15px 25px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: bold;
    z-index: 10000;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Hapus notifikasi setelah 3 detik (kecuali loading)
  if (type !== 'loading') {
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// ===== INPUT FORMAT HANDLERS =====

document.addEventListener('DOMContentLoaded', function() {
  // Format bid amount input
  const bidAmountInput = document.getElementById('bid-amount');
  
  if (bidAmountInput) {
    bidAmountInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/[^0-9]/g, '');
      if (value) {
        e.target.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        
        // Update deposit requirement
        updateDepositRequirement(parseInt(value));
      }
    });
  }
  
  // Format topup amount input
  const topupInput = document.getElementById('topup-amount');
  
  if (topupInput) {
    topupInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/[^0-9]/g, '');
      if (value) {
        e.target.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }
    });
  }
});

// ===== FILTER & SORT FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
  const categoryFilter = document.getElementById('category-filter');
  const sortFilter = document.getElementById('sort-filter');
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', function() {
      filterAuctions(this.value);
    });
  }
  
  if (sortFilter) {
    sortFilter.addEventListener('change', function() {
      sortAuctions(this.value);
    });
  }
});

/**
 * Filter auctions by category
 */
function filterAuctions(category) {
  const auctionItems = document.querySelectorAll('.auction-item');
  let visibleCount = 0;
  
  auctionItems.forEach(item => {
    const itemCategory = item.getAttribute('data-category');
    
    if (category === 'all' || itemCategory === category) {
      item.style.display = 'block';
      visibleCount++;
    } else {
      item.style.display = 'none';
    }
  });
  
  // Update active count
  const activeCount = document.getElementById('active-count');
  if (activeCount) {
    activeCount.textContent = visibleCount;
  }
}

/**
 * Sort auctions
 */
function sortAuctions(sortType) {
  const container = document.querySelector('.lelang-container');
  const items = Array.from(document.querySelectorAll('.auction-item'));
  
  items.sort((a, b) => {
    if (sortType === 'price-low') {
      const priceA = parseRupiah(a.querySelector('.current-price').textContent);
      const priceB = parseRupiah(b.querySelector('.current-price').textContent);
      return priceA - priceB;
    } else if (sortType === 'price-high') {
      const priceA = parseRupiah(a.querySelector('.current-price').textContent);
      const priceB = parseRupiah(b.querySelector('.current-price').textContent);
      return priceB - priceA;
    } else if (sortType === 'bids') {
      const bidsA = parseInt(a.querySelector('.auction-stats-row .stat:first-child span').textContent);
      const bidsB = parseInt(b.querySelector('.auction-stats-row .stat:first-child span').textContent);
      return bidsB - bidsA;
    } else if (sortType === 'ending') {
      const timeA = parseFloat(a.querySelector('.auction-timer').getAttribute('data-end-time'));
      const timeB = parseFloat(b.querySelector('.auction-timer').getAttribute('data-end-time'));
      return timeA - timeB;
    }
  });
  
  // Re-append items in sorted order
  items.forEach(item => container.appendChild(item));
}

// ===== CSS ANIMATIONS =====

const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
  
  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

console.log('✅ Auction-Deposit integration loaded successfully!');
console.log('📊 Deposit requirement: 50% of bid amount');
console.log('🔒 Deposit akan ditahan saat bid berhasil');