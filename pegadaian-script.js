// ===== PEGADAIAN SYSTEM (FIXED VERSION) =====
console.log('🔧 Pegadaian script loading...');

let gadgetImages = [];
let imeiImage = null;
let currentStep = 1;
let estimasiData = {};

// ===== INITIALIZE YEAR OPTIONS =====
function initYearOptions() {
  const yearSelect = document.getElementById('gadget-year');
  if (!yearSelect) return;
  
  const currentYear = new Date().getFullYear();
  yearSelect.innerHTML = '<option value="">Pilih Tahun</option>';
  
  for (let year = currentYear; year >= currentYear - 10; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
}

// ===== MODAL FUNCTIONS =====
function openPegadaianModal() {
  console.log('🎯 Opening pegadaian modal');
  
  if (!window.SessionManager || !window.SessionManager.isLoggedIn()) {
    showPegadaianNotification('Login Diperlukan', 'Silakan login terlebih dahulu untuk mengajukan pegadaian', 'warning');
    
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
      authModal.style.display = 'flex';
      const loginTab = document.querySelector('[data-tab="login"]');
      if (loginTab) loginTab.click();
    }
    return;
  }
  
  const modal = document.getElementById('pegadaian-modal');
  if (!modal) {
    console.error('❌ Pegadaian modal not found!');
    return;
  }
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  goToStep(1);
  
  console.log('✅ Pegadaian modal opened');
}

function closePegadaianModal() {
  const modal = document.getElementById('pegadaian-modal');
  if (!modal) return;
  
  modal.classList.remove('active');
  document.body.style.overflow = '';
  
  const form = document.getElementById('pegadaian-form');
  if (form) form.reset();
  
  gadgetImages = [];
  imeiImage = null;
  currentStep = 1;
  estimasiData = {};
  
  const gadgetPreview = document.getElementById('gadget-preview-grid');
  const imeiPreview = document.getElementById('imei-preview');
  
  if (gadgetPreview) gadgetPreview.innerHTML = '';
  if (imeiPreview) imeiPreview.classList.remove('active');
  
  console.log('🔴 Pegadaian modal closed');
}

// ===== STEP NAVIGATION =====
function goToStep(step) {
  currentStep = step;
  
  document.querySelectorAll('.progress-step').forEach((stepEl, index) => {
    if (index + 1 <= step) {
      stepEl.classList.add('active');
    } else {
      stepEl.classList.remove('active');
    }
  });
  
  document.querySelectorAll('.form-step').forEach((formStep, index) => {
    if (index + 1 === step) {
      formStep.classList.add('active');
    } else {
      formStep.classList.remove('active');
    }
  });
  
  console.log(`📍 Step ${step} activated`);
}

function nextStep(step) {
  if (!validateStep(currentStep)) {
    return;
  }
  
  if (step === 3) {
    calculateEstimation();
  }
  
  goToStep(step);
}

function previousStep(step) {
  goToStep(step);
}

// ===== VALIDATION =====
function validateStep(step) {
  if (step === 1) {
    const name = document.getElementById('gadget-name');
    const category = document.getElementById('gadget-category');
    const year = document.getElementById('gadget-year');
    const storage = document.getElementById('gadget-storage');
    const condition = document.getElementById('gadget-condition');
    const battery = document.getElementById('gadget-battery');
    
    if (!name || !name.value || !category || !category.value || 
        !year || !year.value || !storage || !storage.value || 
        !condition || !condition.value || !battery || !battery.value) {
      showPegadaianNotification('Form Tidak Lengkap', 'Mohon lengkapi semua field yang wajib diisi', 'warning');
      return false;
    }
    
    return true;
  }
  
  if (step === 2) {
    if (gadgetImages.length < 4) {
      showPegadaianNotification('Foto Kurang', 'Minimal upload 4 foto gadget (Depan, Belakang, Samping, On Screen)', 'warning');
      return false;
    }
    
    if (!imeiImage) {
      showPegadaianNotification('IMEI Diperlukan', 'Mohon upload foto IMEI/Serial Number untuk verifikasi', 'warning');
      return false;
    }
    
    return true;
  }
  
  return true;
}

// ===== IMAGE UPLOAD HANDLING =====
function initImageUpload() {
  const uploadArea = document.getElementById('gadget-upload-area');
  const fileInput = document.getElementById('gadget-images');
  
  if (!uploadArea || !fileInput) return;
  
  uploadArea.addEventListener('click', () => {
    fileInput.click();
  });
  
  fileInput.addEventListener('change', (e) => {
    handleGadgetImages(e.target.files);
  });
  
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ffd700';
    uploadArea.style.background = 'rgba(255, 215, 0, 0.15)';
  });
  
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '';
    uploadArea.style.background = '';
  });
  
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '';
    uploadArea.style.background = '';
    handleGadgetImages(e.dataTransfer.files);
  });
}

function handleGadgetImages(files) {
  const maxFiles = 6;
  const maxSize = 5 * 1024 * 1024;
  
  if (gadgetImages.length + files.length > maxFiles) {
    showPegadaianNotification('Batas Maksimal', `Maksimal ${maxFiles} foto`, 'warning');
    return;
  }
  
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) {
      showPegadaianNotification('Format Salah', 'File harus berupa gambar', 'warning');
      return;
    }
    
    if (file.size > maxSize) {
      showPegadaianNotification('File Terlalu Besar', 'Ukuran maksimal 5MB per foto', 'warning');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      gadgetImages.push({
        file: file,
        dataUrl: e.target.result
      });
      displayGadgetPreviews();
    };
    reader.readAsDataURL(file);
  });
}

function displayGadgetPreviews() {
  const container = document.getElementById('gadget-preview-grid');
  if (!container) return;
  
  container.innerHTML = gadgetImages.map((img, index) => `
    <div class="preview-item">
      <img src="${img.dataUrl}" alt="Gadget ${index + 1}">
      <button type="button" class="remove-preview" onclick="removeGadgetImage(${index})">
        <i class="bi bi-x"></i>
      </button>
    </div>
  `).join('');
}

function removeGadgetImage(index) {
  gadgetImages.splice(index, 1);
  displayGadgetPreviews();
}

// ===== IMEI UPLOAD HANDLING =====
function initImeiUpload() {
  const uploadArea = document.getElementById('imei-upload-area');
  const fileInput = document.getElementById('imei-image');
  
  if (!uploadArea || !fileInput) return;
  
  uploadArea.addEventListener('click', () => {
    fileInput.click();
  });
  
  fileInput.addEventListener('change', (e) => {
    handleImeiImage(e.target.files[0]);
  });
}

function handleImeiImage(file) {
  if (!file) return;
  
  const maxSize = 3 * 1024 * 1024;
  
  if (!file.type.startsWith('image/')) {
    showPegadaianNotification('Format Salah', 'File harus berupa gambar', 'warning');
    return;
  }
  
  if (file.size > maxSize) {
    showPegadaianNotification('File Terlalu Besar', 'Ukuran maksimal 3MB', 'warning');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    imeiImage = {
      file: file,
      dataUrl: e.target.result
    };
    displayImeiPreview();
  };
  reader.readAsDataURL(file);
}

function displayImeiPreview() {
  const preview = document.getElementById('imei-preview');
  if (!preview || !imeiImage) return;
  
  preview.classList.add('active');
  preview.innerHTML = `
    <img src="${imeiImage.dataUrl}" alt="IMEI">
    <div class="imei-info">
      <span class="imei-filename">
        <i class="bi bi-file-earmark-image"></i>
        ${imeiImage.file.name}
      </span>
      <button type="button" class="remove-imei" onclick="removeImeiImage()">
        <i class="bi bi-trash"></i> Hapus
      </button>
    </div>
  `;
}

function removeImeiImage() {
  imeiImage = null;
  const preview = document.getElementById('imei-preview');
  const fileInput = document.getElementById('imei-image');
  
  if (preview) preview.classList.remove('active');
  if (fileInput) fileInput.value = '';
}

// ===== CALCULATE ESTIMATION =====
function calculateEstimation() {
  const name = document.getElementById('gadget-name');
  const category = document.getElementById('gadget-category');
  const year = document.getElementById('gadget-year');
  const storage = document.getElementById('gadget-storage');
  const condition = document.getElementById('gadget-condition');
  const battery = document.getElementById('gadget-battery');
  
  if (!name || !category || !year || !storage || !condition || !battery) {
    console.error('❌ Form elements not found');
    return;
  }
  
  const basePrices = {
    'iPhone': 15000000,
    'Android': 8000000,
    'Tablet': 6000000,
    'Laptop': 10000000,
    'Smartwatch': 3000000
  };
  
  let basePrice = basePrices[category.value] || 5000000;
  
  const currentYear = new Date().getFullYear();
  const age = currentYear - parseInt(year.value);
  const depreciationRate = 0.15;
  basePrice = basePrice * Math.pow(1 - depreciationRate, age);
  
  const conditionMultipliers = {
    'Baru': 1.0,
    'Baik': 0.85,
    'Normal': 0.70,
    'Kurang Baik': 0.50
  };
  basePrice *= conditionMultipliers[condition.value] || 0.70;
  
  const batteryValue = parseInt(battery.value);
  if (batteryValue >= 90) {
    basePrice *= 1.0;
  } else if (batteryValue >= 80) {
    basePrice *= 0.95;
  } else if (batteryValue >= 70) {
    basePrice *= 0.85;
  } else {
    basePrice *= 0.70;
  }
  
  const storageValue = storage.value;
  if (storageValue.includes('512') || storageValue.includes('1TB')) {
    basePrice *= 1.2;
  } else if (storageValue.includes('256')) {
    basePrice *= 1.1;
  }
  
  const minPawn = Math.floor(basePrice * 0.70);
  const maxPawn = Math.floor(basePrice * 0.80);
  
  estimasiData = {
    gadgetName: name.value,
    category: category.value,
    year: parseInt(year.value),
    storage: storageValue,
    condition: condition.value,
    battery: batteryValue,
    estimatedValue: basePrice,
    minPawn: minPawn,
    maxPawn: maxPawn
  };
  
  displayEstimation();
  
  console.log('📊 Estimation calculated:', estimasiData);
}

function displayEstimation() {
  const estName = document.getElementById('est-name');
  const estCategory = document.getElementById('est-category');
  const estCondition = document.getElementById('est-condition');
  const estBattery = document.getElementById('est-battery');
  const estMin = document.getElementById('est-min');
  const estMax = document.getElementById('est-max');
  
  if (estName) estName.textContent = estimasiData.gadgetName;
  if (estCategory) estCategory.textContent = estimasiData.category;
  if (estCondition) estCondition.textContent = estimasiData.condition;
  if (estBattery) estBattery.textContent = `${estimasiData.battery}%`;
  if (estMin) estMin.textContent = formatRupiah(estimasiData.minPawn);
  if (estMax) estMax.textContent = formatRupiah(estimasiData.maxPawn);
}

// ===== FORMAT RUPIAH =====
function formatRupiah(amount) {
  return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ===== FORM SUBMISSION =====
function handlePegadaianSubmission(e) {
  e.preventDefault();
  
  console.log('📤 Submitting pegadaian...');
  
  const agreeTerms = document.getElementById('agree-terms');
  if (!agreeTerms || !agreeTerms.checked) {
    showPegadaianNotification('Persetujuan Diperlukan', 'Anda harus menyetujui syarat dan ketentuan', 'warning');
    return;
  }
  
  const selectedTenorInput = document.querySelector('input[name="tenor"]:checked');
  if (!selectedTenorInput) {
    showPegadaianNotification('Tenor Diperlukan', 'Pilih tenor cicilan', 'warning');
    return;
  }
  const selectedTenor = selectedTenorInput.value;
  
  const accessories = Array.from(document.querySelectorAll('input[name="accessories"]:checked'))
    .map(cb => cb.value);
  
  if (!window.SessionManager || !window.SessionManager.isLoggedIn()) {
    showPegadaianNotification('Login Diperlukan', 'Silakan login terlebih dahulu', 'error');
    return;
  }
  
  const currentUser = window.SessionManager.getCurrentUser();
  const description = document.getElementById('gadget-description');
  
  const pegadaianData = {
    id: `pawn-${Date.now()}`,
    userId: currentUser.username,
    userName: currentUser.fullname,
    gadgetName: estimasiData.gadgetName,
    category: estimasiData.category,
    year: estimasiData.year,
    storage: estimasiData.storage,
    condition: estimasiData.condition,
    battery: estimasiData.battery,
    accessories: accessories,
    description: description ? description.value : '',
    images: gadgetImages.map(img => img.dataUrl),
    imeiImage: imeiImage ? imeiImage.dataUrl : '',
    estimatedMin: estimasiData.minPawn,
    estimatedMax: estimasiData.maxPawn,
    tenor: parseInt(selectedTenor),
    status: 'pending',
    submittedDate: new Date().toISOString(),
    verifiedDate: null,
    verifiedBy: null,
    finalValue: null
  };
  
  savePegadaianData(pegadaianData);
  
  if (window.usersData && window.usersData.users) {
    const user = window.usersData.users.find(u => u.username === currentUser.username);
    if (user) {
      const notification = {
        id: `notif-${Date.now()}`,
        type: 'pegadaian_submitted',
        title: 'Pengajuan Pegadaian Diterima',
        message: `Pengajuan pegadaian ${pegadaianData.gadgetName} Anda sedang dalam proses verifikasi. Estimasi nilai: ${formatRupiah(estimasiData.minPawn)} - ${formatRupiah(estimasiData.maxPawn)}`,
        date: new Date().toLocaleString('id-ID'),
        read: false,
        relatedId: pegadaianData.id
      };
      
      user.notifications.unshift(notification);
      
      if (window.notificationHandler) {
        window.notificationHandler.updateNotificationBadge();
      }
    }
  }
  
  closePegadaianModal();
  showSuccessModal();
  
  console.log('✅ Pegadaian submitted:', pegadaianData.id);
}

function savePegadaianData(data) {
  try {
    if (window.PegadaianDataManager) {
      window.PegadaianDataManager.addPegadaian(data);
    } else {
      let pegadaianList = JSON.parse(localStorage.getItem('pegadaianData') || '[]');
      pegadaianList.push(data);
      localStorage.setItem('pegadaianData', JSON.stringify(pegadaianList));
    }
    console.log('💾 Pegadaian data saved');
  } catch (e) {
    console.error('❌ Error saving pegadaian:', e);
  }
}

// ===== SUCCESS MODAL =====
function showSuccessModal() {
  const modal = document.getElementById('success-gadai-modal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeSuccessModal() {
  const modal = document.getElementById('success-gadai-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// ===== NOTIFICATION SYSTEM =====
function showPegadaianNotification(title, message, type = 'info') {
  const existing = document.querySelector('.pegadaian-notification-toast');
  if (existing) {
    existing.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `pegadaian-notification-toast ${type}`;
  
  const icons = {
    'info': 'bi-info-circle-fill',
    'success': 'bi-check-circle-fill',
    'warning': 'bi-exclamation-triangle-fill',
    'error': 'bi-x-circle-fill'
  };
  
  const colors = {
    'info': '#00bfff',
    'success': '#00ff7f',
    'warning': '#ffd700',
    'error': '#ff6b6b'
  };
  
  notification.innerHTML = `
    <i class="bi ${icons[type]}"></i>
    <div>
      <strong>${title}</strong>
      <p>${message}</p>
    </div>
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
  `;
  
  const icon = notification.querySelector('i');
  if (icon) {
    icon.style.cssText = `
      font-size: 32px;
      color: ${colors[type]};
      flex-shrink: 0;
    `;
  }
  
  const textDiv = notification.querySelector('div');
  if (textDiv) {
    textDiv.style.cssText = 'flex: 1;';
  }
  
  const strong = notification.querySelector('strong');
  if (strong) {
    strong.style.cssText = `
      display: block;
      color: #fff;
      font-size: 15px;
      margin-bottom: 5px;
    `;
  }
  
  const p = notification.querySelector('p');
  if (p) {
    p.style.cssText = `
      color: #aaa;
      font-size: 13px;
      line-height: 1.4;
      margin: 0;
    `;
  }
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Add CSS animations (unique)
if (!document.getElementById('pegadaian-animations-style')) {
  const pegadaianStyle = document.createElement('style');
  pegadaianStyle.id = 'pegadaian-animations-style';
  pegadaianStyle.textContent = `
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
  `;
  document.head.appendChild(pegadaianStyle);
}

// ===== INITIALIZE ON LOAD =====
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Initializing Pegadaian system...');
  
  initYearOptions();
  initImageUpload();
  initImeiUpload();
  
  const form = document.getElementById('pegadaian-form');
  if (form) {
    form.addEventListener('submit', handlePegadaianSubmission);
  }
  
  const modal = document.getElementById('pegadaian-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closePegadaianModal();
      }
    });
  }
  
  const successModal = document.getElementById('success-gadai-modal');
  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        closeSuccessModal();
      }
    });
  }
  
  console.log('✅ Pegadaian system initialized');
});

// Export functions for global use
window.openPegadaianModal = openPegadaianModal;
window.closePegadaianModal = closePegadaianModal;
window.nextStep = nextStep;
window.previousStep = previousStep;
window.removeGadgetImage = removeGadgetImage;
window.removeImeiImage = removeImeiImage;
window.closeSuccessModal = closeSuccessModal;

console.log('✅ Pegadaian script loaded successfully!');