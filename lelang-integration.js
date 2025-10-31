// ===== AUCTION BIDDING SYSTEM WITH DEPOSIT INTEGRATION (FIXED) =====
console.log('🔄 Auction-Deposit integration loading...');

// Variable untuk menyimpan data bid saat ini
let currentAuctionId = '';
let currentProductName = '';
let currentBidPrice = 0;
const BID_INCREMENT = 100000;

// ===== UTILITY FUNCTIONS =====
function formatRupiah(angka) {
  return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function parseRupiah(rupiah) {
  return parseInt(rupiah.replace(/[^0-9]/g, ''));
}

// ===== BID MODAL FUNCTIONS =====
function openBidModal(productName, currentBid, auctionId) {
  // Check if user is logged in
  if (!window.SessionManager || !window.SessionManager.isLoggedIn()) {
    showAuctionNotification('error', 'Silakan login terlebih dahulu untuk melakukan bid!');
    
    setTimeout(() => {
      const loginBtn = document.querySelector('.btn-login');
      if (loginBtn) loginBtn.click();
    }, 1500);
    return;
  }
  
  // Check if deposit system is loaded
  if (!window.DepositSystem) {
    showAuctionNotification('error', 'Sistem deposit sedang dimuat. Coba lagi sebentar...');
    return;
  }
  
  const currentUser = window.SessionManager.getCurrentUser();
  const modal = document.getElementById('bid-modal');
  const modalProductName = document.getElementById('modal-product-name');
  const modalCurrentBid = document.getElementById('modal-current-bid');
  const modalMinBid = document.getElementById('modal-min-bid');
  const bidAmountInput = document.getElementById('bid-amount');
  
  if (!modal || !modalProductName || !modalCurrentBid || !modalMinBid || !bidAmountInput) {
    console.error('❌ Modal elements not found');
    return;
  }
  
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
  
  // Show deposit info
  const depositInfo = document.getElementById('deposit-info-section');
  const currentDepositEl = document.getElementById('current-deposit-amount');
  const requiredDepositEl = document.getElementById('required-deposit-amount');
  const depositShortageEl = document.getElementById('deposit-shortage');
  const shortageAmountEl = document.getElementById('shortage-amount-display');
  
  if (depositInfo && currentDepositEl && requiredDepositEl && depositShortageEl && shortageAmountEl) {
    const currentDeposit = window.DepositSystem.getUserDeposit(currentUser.username);
    const requiredDeposit = window.DepositSystem.calculateRequiredDeposit(minBid);
    
    currentDepositEl.textContent = formatRupiah(currentDeposit);
    requiredDepositEl.textContent = formatRupiah(requiredDeposit);
    
    if (currentDeposit < requiredDeposit) {
      const shortage = requiredDeposit - currentDeposit;
      shortageAmountEl.textContent = formatRupiah(shortage);
      depositShortageEl.style.display = 'flex';
    } else {
      depositShortageEl.style.display = 'none';
    }
    
    depositInfo.style.display = 'block';
  }
  
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  generateBidHistory(currentBid);
}

function closeBidModal() {
  const modal = document.getElementById('bid-modal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    const checkbox = document.getElementById('agree-terms');
    if (checkbox) checkbox.checked = false;
  }
}

// ===== DEPOSIT MODAL FUNCTIONS =====
function openDepositModal() {
  if (!window.SessionManager || !window.SessionManager.isLoggedIn()) {
    showAuctionNotification('error', 'Silakan login terlebih dahulu!');
    return;
  }
  
  const currentUser = window.SessionManager.getCurrentUser();
  const depositModal = document.getElementById('deposit-modal');
  const currentDepositDisplay = document.getElementById('modal-current-deposit');
  const requiredDepositDisplay = document.getElementById('modal-required-deposit');
  const shortageDisplay = document.getElementById('modal-shortage-amount');
  
  if (!depositModal || !currentDepositDisplay || !requiredDepositDisplay || !shortageDisplay) {
    console.error('❌ Deposit modal elements not found');
    return;
  }
  
  const currentDeposit = window.DepositSystem.getUserDeposit(currentUser.username);
  const bidAmount = parseRupiah(document.getElementById('bid-amount').value) || (currentBidPrice + BID_INCREMENT);
  const requiredDeposit = window.DepositSystem.calculateRequiredDeposit(bidAmount);
  const shortage = Math.max(0, requiredDeposit - currentDeposit);
  
  currentDepositDisplay.textContent = formatRupiah(currentDeposit);
  requiredDepositDisplay.textContent = formatRupiah(requiredDeposit);
  shortageDisplay.textContent = formatRupiah(shortage);
  
  const shortageSection = document.getElementById('modal-shortage-section');
  if (shortageSection) {
    if (shortage > 0) {
      shortageSection.style.display = 'block';
      const suggestedTopup = Math.ceil(shortage / 100000) * 100000;
      const topupInput = document.getElementById('topup-amount');
      if (topupInput) {
        topupInput.value = suggestedTopup.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }
    } else {
      shortageSection.style.display = 'none';
    }
  }
  
  closeBidModal();
  depositModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeDepositModal() {
  const depositModal = document.getElementById('deposit-modal');
  if (depositModal) {
    depositModal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    const successMsg = document.getElementById('deposit-success-message');
    if (successMsg) successMsg.classList.remove('show');
    
    const topupInput = document.getElementById('topup-amount');
    if (topupInput) topupInput.value = '';
    
    document.querySelectorAll('.quick-amount-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.payment-method-btn').forEach(btn => btn.classList.remove('selected'));
  }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
  const bidModal = document.getElementById('bid-modal');
  const depositModal = document.getElementById('deposit-modal');
  
  if (event.target === bidModal) {
    closeBidModal();
  }
  
  if (event.target === depositModal) {
    closeDepositModal();
  }
});

// ===== QUICK BID FUNCTIONS =====
function quickBid(amount) {
  const bidAmountInput = document.getElementById('bid-amount');
  if (!bidAmountInput) return;
  
  let currentValue = parseRupiah(bidAmountInput.value) || (currentBidPrice + BID_INCREMENT);
  currentValue += amount;
  
  bidAmountInput.value = currentValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  updateDepositRequirement(currentValue);
}

function updateDepositRequirement(bidAmount) {
  if (!window.DepositSystem) return;
  
  const currentUser = window.SessionManager.getCurrentUser();
  if (!currentUser) return;
  
  const requiredDepositEl = document.getElementById('required-deposit-amount');
  const depositShortageEl = document.getElementById('deposit-shortage');
  const shortageAmountEl = document.getElementById('shortage-amount-display');
  
  if (!requiredDepositEl || !depositShortageEl || !shortageAmountEl) return;
  
  const currentDeposit = window.DepositSystem.getUserDeposit(currentUser.username);
  const requiredDeposit = window.DepositSystem.calculateRequiredDeposit(bidAmount);
  
  requiredDepositEl.textContent = formatRupiah(requiredDeposit);
  
  if (currentDeposit < requiredDeposit) {
    const shortage = requiredDeposit - currentDeposit;
    shortageAmountEl.textContent = formatRupiah(shortage);
    depositShortageEl.style.display = 'flex';
  } else {
    depositShortageEl.style.display = 'none';
  }
}

// ===== TOP-UP FUNCTIONS =====
let selectedQuickAmount = 0;
let selectedPaymentMethod = '';

function selectQuickAmount(amount) {
  const topupInput = document.getElementById('topup-amount');
  if (topupInput) {
    topupInput.value = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    selectedQuickAmount = amount;
    
    document.querySelectorAll('.quick-amount-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    if (event && event.target) {
      event.target.classList.add('active');
    }
  }
}

function selectPaymentMethod(method) {
  selectedPaymentMethod = method;
  
  document.querySelectorAll('.payment-method-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  
  if (event && event.target) {
    const btn = event.target.closest('.payment-method-btn');
    if (btn) btn.classList.add('selected');
  }
}

function processTopUp() {
  const topupInput = document.getElementById('topup-amount');
  if (!topupInput) return;
  
  const amount = parseRupiah(topupInput.value);
  
  if (!amount || amount < 100000) {
    showAuctionNotification('error', 'Minimum top-up adalah Rp 100.000!');
    return;
  }
  
  if (!selectedPaymentMethod) {
    showAuctionNotification('error', 'Pilih metode pembayaran terlebih dahulu!');
    return;
  }
  
  const currentUser = window.SessionManager.getCurrentUser();
  
  showAuctionNotification('info', 'Memproses top-up deposit...');
  
  setTimeout(() => {
    const success = window.DepositSystem.addDeposit(currentUser.username, amount, selectedPaymentMethod);
    
    if (success) {
      const successMsg = document.getElementById('deposit-success-message');
      if (successMsg) successMsg.classList.add('show');
      
      if (window.notificationHandler) {
        window.notificationHandler.updateNotificationBadge();
      }
      
      showAuctionNotification('success', `Top-up sebesar ${formatRupiah(amount)} berhasil!`);
      
      setTimeout(() => {
        closeDepositModal();
        openBidModal(currentProductName, currentBidPrice, currentAuctionId);
      }, 2000);
    } else {
      showAuctionNotification('error', 'Gagal melakukan top-up. Coba lagi.');
    }
  }, 2000);
}

// ===== BID SUBMISSION =====
function submitBid() {
  const bidAmountInput = document.getElementById('bid-amount');
  const agreeTerms = document.getElementById('agree-terms');
  const minBid = currentBidPrice + BID_INCREMENT;
  
  if (!window.SessionManager || !window.SessionManager.isLoggedIn()) {
    showAuctionNotification('error', 'Silakan login terlebih dahulu!');
    return;
  }
  
  const currentUser = window.SessionManager.getCurrentUser();
  
  if (!agreeTerms || !agreeTerms.checked) {
    showAuctionNotification('error', 'Anda harus menyetujui syarat dan ketentuan!');
    return;
  }
  
  if (!bidAmountInput || !bidAmountInput.value) {
    showAuctionNotification('error', 'Masukkan jumlah bid Anda!');
    return;
  }
  
  const bidAmount = parseRupiah(bidAmountInput.value);
  
  if (bidAmount < minBid) {
    showAuctionNotification('error', `Bid minimum adalah ${formatRupiah(minBid)}`);
    return;
  }
  
  if (!window.DepositSystem) {
    showAuctionNotification('error', 'Sistem deposit belum dimuat!');
    return;
  }
  
  const depositCheck = window.DepositSystem.checkDepositSufficiency(currentUser.username, bidAmount);
  
  if (!depositCheck.hasEnough) {
    showAuctionNotification('error', `Deposit tidak mencukupi! Anda memerlukan ${formatRupiah(depositCheck.shortage)} lagi.`);
    
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
  
  showAuctionNotification('info', 'Memproses bid Anda...');
  
  setTimeout(() => {
    const holdSuccess = window.DepositSystem.holdDeposit(
      currentUser.username,
      bidAmount,
      currentAuctionId,
      currentProductName
    );
    
    if (!holdSuccess) {
      showAuctionNotification('error', 'Gagal menahan deposit. Coba lagi.');
      return;
    }
    
    updateAuctionCard(currentAuctionId, bidAmount);
    addBidToHistory(bidAmount);
    
    if (window.notificationHandler) {
      window.notificationHandler.updateNotificationBadge();
    }
    
    showAuctionNotification('success', `Bid Anda sebesar ${formatRupiah(bidAmount)} berhasil dipasang!`);
    
    setTimeout(() => {
      closeBidModal();
    }, 1000);
  }, 1500);
}

function updateAuctionCard(auctionId, newBid) {
  const allItems = document.querySelectorAll('.auction-item');
  
  allItems.forEach((item, index) => {
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
  
  currentBidPrice = newBid;
}

// ===== BID HISTORY =====
function generateBidHistory(currentBid) {
  const historyList = document.getElementById('bid-history-list');
  if (!historyList) return;
  
  const bidHistory = [];
  let tempBid = currentBid;
  const bidders = ['User****23', 'User****15', 'User****89', 'User****42', 'User****67', 'User****91'];
  const timeAgo = [2, 8, 15, 23, 30, 45];
  
  for (let i = 0; i < 4; i++) {
    bidHistory.push({
      bidder: bidders[Math.floor(Math.random() * bidders.length)],
      amount: tempBid,
      time: `${timeAgo[i]} menit lalu`
    });
    tempBid -= (BID_INCREMENT * (i + 1));
  }
  
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

function addBidToHistory(bidAmount) {
  const historyList = document.getElementById('bid-history-list');
  if (!historyList) return;
  
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

// ===== NOTIFICATION =====
function showAuctionNotification(type, message) {
  const existing = document.querySelector('.auction-notification-toast');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = `auction-notification-toast ${type}`;
  
  const icons = {
    'info': 'bi-info-circle-fill',
    'success': 'bi-check-circle-fill',
    'error': 'bi-x-circle-fill'
  };
  
  const colors = {
    'info': '#00bfff',
    'success': '#00ff7f',
    'error': '#ff6b6b'
  };
  
  notification.innerHTML = `
    <i class="bi ${icons[type]}"></i>
    <span>${message}</span>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 30px;
    background: rgba(0, 0, 0, 0.95);
    border: 2px solid ${colors[type]};
    border-radius: 12px;
    padding: 18px 25px;
    display: flex;
    align-items: center;
    gap: 15px;
    z-index: 10000;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
    animation: slideInRight 0.3s ease;
    max-width: 400px;
    color: ${colors[type]};
    font-weight: 600;
  `;
  
  const icon = notification.querySelector('i');
  if (icon) {
    icon.style.cssText = `font-size: 32px; color: ${colors[type]}; flex-shrink: 0;`;
  }
  
  document.body.appendChild(notification);
  
  if (type !== 'info') {
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  } else {
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }
}

// ===== INPUT FORMAT HANDLERS =====
document.addEventListener('DOMContentLoaded', function() {
  const bidAmountInput = document.getElementById('bid-amount');
  
  if (bidAmountInput) {
    bidAmountInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/[^0-9]/g, '');
      if (value) {
        e.target.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        updateDepositRequirement(parseInt(value));
      }
    });
  }
  
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

// ===== FILTER & SORT =====
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
  
  const activeCount = document.getElementById('active-count');
  if (activeCount) {
    activeCount.textContent = visibleCount;
  }
}

function sortAuctions(sortType) {
  const container = document.querySelector('.lelang-container');
  if (!container) return;
  
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
  
  items.forEach(item => container.appendChild(item));
}

// ===== CSS ANIMATIONS (UNIQUE) =====
if (!document.getElementById('auction-animations-style')) {
  const auctionStyle = document.createElement('style');
  auctionStyle.id = 'auction-animations-style';
  auctionStyle.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(400px); opacity: 0; }
    }
    
    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(auctionStyle);
}

// ===== EXPORT GLOBAL FUNCTIONS =====
window.openBidModal = openBidModal;
window.closeBidModal = closeBidModal;
window.openDepositModal = openDepositModal;
window.closeDepositModal = closeDepositModal;
window.quickBid = quickBid;
window.selectQuickAmount = selectQuickAmount;
window.selectPaymentMethod = selectPaymentMethod;
window.processTopUp = processTopUp;
window.submitBid = submitBid;

console.log('✅ Auction-Deposit integration loaded successfully!');
console.log('📊 Deposit requirement: 50% of bid amount');
console.log('🔒 Deposit akan ditahan saat bid berhasil');