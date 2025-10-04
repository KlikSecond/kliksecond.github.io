// ===== AUCTION TIMER SYSTEM =====
// Timer yang dimulai saat pengunjung membuka website (12 jam)

// Fungsi untuk mendapatkan atau membuat waktu akhir lelang
function getAuctionEndTime() {
  let endTime = sessionStorage.getItem('auctionEndTime');
  
  if (!endTime) {
    // Buat waktu akhir baru (12 jam dari sekarang)
    const now = new Date().getTime();
    const twelveHours = 12 * 60 * 60 * 1000; // 12 jam dalam milidetik
    endTime = now + twelveHours;
    sessionStorage.setItem('auctionEndTime', endTime);
  }
  
  return parseInt(endTime);
}

// Fungsi untuk format angka dengan leading zero
function padZero(num) {
  return num < 10 ? '0' + num : num;
}

// Fungsi untuk update countdown timer
function updateCountdown() {
  const endTime = getAuctionEndTime();
  const now = new Date().getTime();
  const distance = endTime - now;
  
  if (distance < 0) {
    // Lelang berakhir
    displayExpired();
    return;
  }
  
  // Hitung jam, menit, detik
  const hours = Math.floor(distance / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
  // Update homepage timer (jika ada)
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  
  if (hoursEl) hoursEl.textContent = padZero(hours);
  if (minutesEl) minutesEl.textContent = padZero(minutes);
  if (secondsEl) secondsEl.textContent = padZero(seconds);
  
  // Update lelang page timer (jika ada)
  const heroHoursEl = document.getElementById('hero-hours');
  const heroMinutesEl = document.getElementById('hero-minutes');
  const heroSecondsEl = document.getElementById('hero-seconds');
  
  if (heroHoursEl) heroHoursEl.textContent = padZero(hours);
  if (heroMinutesEl) heroMinutesEl.textContent = padZero(minutes);
  if (heroSecondsEl) heroSecondsEl.textContent = padZero(seconds);
}

// Fungsi untuk menampilkan status lelang berakhir
function displayExpired() {
  const timers = document.querySelectorAll('.time-value');
  timers.forEach(timer => {
    timer.textContent = '00';
  });
  
  // Tampilkan pesan lelang berakhir
  const auctionBanner = document.querySelector('.auction-banner');
  if (auctionBanner) {
    auctionBanner.innerHTML = `
      <div class="auction-container" style="text-align: center;">
        <i class="bi bi-clock-history" style="font-size: 60px; color: #ff6b6b; margin-bottom: 20px;"></i>
        <h2 style="color: #fff; margin-bottom: 15px;">Sesi Lelang Telah Berakhir</h2>
        <p style="color: #aaa;">Terima kasih atas partisipasi Anda. Nantikan sesi lelang berikutnya!</p>
      </div>
    `;
  }
  
  // Disable semua tombol bid
  const bidButtons = document.querySelectorAll('.btn-bid');
  bidButtons.forEach(btn => {
    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.style.cursor = 'not-allowed';
    btn.innerHTML = '<i class="bi bi-x-circle-fill"></i> Lelang Berakhir';
  });
}

// Jalankan countdown setiap detik
setInterval(updateCountdown, 1000);

// Update pertama kali saat halaman dimuat
updateCountdown();

// Update timer untuk setiap item lelang individual
function updateItemTimers() {
  const itemTimers = document.querySelectorAll('.auction-timer');
  
  itemTimers.forEach(timer => {
    const endHours = parseFloat(timer.getAttribute('data-end-time'));
    const timeRemaining = timer.querySelector('.time-remaining');
    
    if (timeRemaining && endHours) {
      const hours = Math.floor(endHours);
      const minutes = Math.floor((endHours - hours) * 60);
      
      if (hours > 0) {
        timeRemaining.textContent = `Berakhir dalam ${hours} jam ${minutes} menit`;
      } else if (minutes > 0) {
        timeRemaining.textContent = `Berakhir dalam ${minutes} menit`;
      } else {
        timeRemaining.textContent = 'Berakhir segera!';
        timeRemaining.style.color = '#ff6b6b';
        timeRemaining.style.fontWeight = 'bold';
      }
    }
  });
}

// Update item timers saat halaman dimuat
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateItemTimers);
} else {
  updateItemTimers();
}