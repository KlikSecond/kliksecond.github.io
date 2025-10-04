// ===== AUCTION BIDDING SYSTEM =====

// Variable untuk menyimpan data bid saat ini
let currentAuctionId = '';
let currentProductName = '';
let currentBidPrice = 0;
const BID_INCREMENT = 100000; // Minimum increment bid: Rp 100.000

// Fungsi untuk format angka ke format rupiah
function formatRupiah(angka) {
  return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Fungsi untuk parse rupiah ke angka
function parseRupiah(rupiah) {
  return parseInt(rupiah.replace(/[^0-9]/g, ''));
}

// Fungsi untuk membuka modal bid
function openBidModal(productName, currentBid, auctionId) {
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
  
  // Tampilkan modal
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  // Generate bid history (simulasi)
  generateBidHistory(currentBid);
}

// Fungsi untuk menutup modal
function closeBidModal() {
  const modal = document.getElementById('bid-modal');
  modal.classList.remove('show');
  document.body.style.overflow = 'auto';
  
  // Reset checkbox
  document.getElementById('agree-terms').checked = false;
}

// Close modal ketika klik di luar modal
window.onclick = function(event) {
  const modal = document.getElementById('bid-modal');
  if (event.target === modal) {
    closeBidModal();
  }
}

// Fungsi untuk quick bid (tambah cepat)
function quickBid(amount) {
  const bidAmountInput = document.getElementById('bid-amount');
  let currentValue = parseRupiah(bidAmountInput.value) || (currentBidPrice + BID_INCREMENT);
  
  currentValue += amount;
  
  // Format dengan titik pemisah ribuan
  bidAmountInput.value = currentValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Fungsi untuk format input saat user mengetik
document.addEventListener('DOMContentLoaded', function() {
  const bidAmountInput = document.getElementById('bid-amount');
  
  if (bidAmountInput) {
    bidAmountInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/[^0-9]/g, '');
      if (value) {
        e.target.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }
    });
  }
});

// Fungsi untuk submit bid
function submitBid() {
  const bidAmountInput = document.getElementById('bid-amount');
  const agreeTerms = document.getElementById('agree-terms');
  const minBid = currentBidPrice + BID_INCREMENT;
  
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
  
  // Simulasi proses bid (dalam implementasi nyata, ini akan mengirim ke server)
  showNotification('loading', 'Memproses bid Anda...');
  
  setTimeout(() => {
    // Update harga bid di card
    updateAuctionCard(currentAuctionId, bidAmount);
    
    // Tambah bid ke history
    addBidToHistory(bidAmount);
    
    // Tampilkan notifikasi sukses
    showNotification('success', `Bid Anda sebesar ${formatRupiah(bidAmount)} berhasil dipasang!`);
    
    // Tutup modal setelah 1 detik
    setTimeout(() => {
      closeBidModal();
    }, 1000);
  }, 1500);
}

// Fungsi untuk update auction card setelah bid
function updateAuctionCard(auctionId, newBid) {
  const auctionItem = document.querySelector(`[data-category]`);
  const allItems = document.querySelectorAll('.auction-item');
  
  allItems.forEach((item, index) => {
    if (index === 0) { // Update item pertama sebagai contoh
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

// Fungsi untuk generate bid history (simulasi)
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

// Fungsi untuk menambah bid baru ke history
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

// Fungsi untuk menampilkan notifikasi
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

// CSS untuk animasi notifikasi
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

// ===== FILTER & SORT FUNCTIONALITY =====

// Filter berdasarkan kategori
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
  
  // Update active count
  const activeCount = document.getElementById('active-count');
  if (activeCount) {
    activeCount.textContent = visibleCount;
  }
}

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

// ===== SEARCH FUNCTIONALITY =====
const searchInput = document.querySelector('.search-input');
if (searchInput) {
  searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const auctionItems = document.querySelectorAll('.auction-item');
    
    auctionItems.forEach(item => {
      const productName = item.querySelector('h3').textContent.toLowerCase();
      
      if (productName.includes(searchTerm)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
}

// ===== AUTO-BID SIMULATION (Optional) =====
// Simulasi ada user lain yang bid (untuk demo)
function simulateOtherBids() {
  setInterval(() => {
    // Random chance untuk simulasi bid
    if (Math.random() > 0.7) {
      const items = document.querySelectorAll('.auction-item');
      const randomItem = items[Math.floor(Math.random() * items.length)];
      const currentPriceEl = randomItem.querySelector('.current-price');
      const bidsEl = randomItem.querySelector('.auction-stats-row .stat:first-child span');
      
      if (currentPriceEl && bidsEl) {
        const currentPrice = parseRupiah(currentPriceEl.textContent);
        const newPrice = currentPrice + BID_INCREMENT;
        
        currentPriceEl.textContent = formatRupiah(newPrice);
        
        const currentBids = parseInt(bidsEl.textContent);
        bidsEl.textContent = `${currentBids + 1} Bids`;
        
        // Tampilkan notifikasi kecil
        const productName = randomItem.querySelector('h3').textContent;
        showSmallNotification(`${productName} - Bid baru: ${formatRupiah(newPrice)}`);
      }
    }
  }, 30000); // Setiap 30 detik
}

function showSmallNotification(message) {
  const notif = document.createElement('div');
  notif.textContent = message;
  notif.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: rgba(0, 0, 0, 0.9);
    color: #00ffff;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 13px;
    z-index: 9999;
    border: 1px solid #00ffff;
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(notif);
  
  setTimeout(() => {
    notif.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notif.remove(), 300);
  }, 5000);
}

// Aktifkan simulasi auto-bid (uncomment jika ingin digunakan)
// simulateOtherBids();

console.log('Lelang system loaded successfully!');