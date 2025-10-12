// ===== PEGADAIAN SYSTEM =====
console.log('🔧 Pegadaian script loaded');

let gadgetImages = [];
let imeiImage = null;
let currentStep = 1;
let estimasiData = {};

// ===== INITIALIZE YEAR OPTIONS =====
function initYearOptions() {
  const yearSelect = document.getElementById('gadget-year');
  const currentYear = new Date().getFullYear();
  
  for (let year = currentYear; year >= currentYear - 10; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
}

// ===== MODAL FUNCTIONS =====
function openPegadaianModal() {
  // Check if user is logged in
  if (!window.SessionManager || !window.SessionManager.isLoggedIn()) {
    showNotification('Login Diperlukan', 'Silakan login terlebih dahulu untuk mengajukan pegadaian', 'warning');
    
    // Open login modal
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
      authModal.style.display = 'flex';
      // Switch to login tab
      const loginTab = document.querySelector('[data-tab="login"]');
      if (loginTab) loginTab.click();
    }
    return;
  }
  
  const modal = document.getElementById('pegadaian-modal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Reset to step 1
  goToStep(1);
}

function closePegadaianModal() {
  const modal = document.getElementById('pegadaian-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  
  // Reset form
  document.getElementById('pegadaian-form').reset();
  gadgetImages = [];
  imeiImage = null;
  currentStep = 1;
  estimasiData = {};
  
  // Clear previews
  document.getElementById('gadget-preview-grid').innerHTML = '';
  document.getElementById('imei-preview').classList.remove('active');
}

// ===== STEP NAVIGATION =====
function goToStep(step) {
  currentStep = step;
  
  // Update progress steps
  document.querySelectorAll('.progress-step').forEach((stepEl, index) => {
    if (index + 1 <= step) {
      stepEl.classList.add('active');
    } else {
      stepEl.classList.remove('active');
    }
  });
  
  // Update form steps
  document.querySelectorAll('.form-step').forEach((formStep, index) => {
    if (index + 1 === step) {
      formStep.classList.add('active');
    } else {
      formStep.classList.remove('active');
    }
  });
}

function nextStep(step) {
  // Validate current step before proceeding
  if (!validateStep(currentStep)) {
    return;
  }
  
  // If moving to step 3, calculate estimation
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
    const name = document.getElementById('gadget-name').value;
    const category = document.getElementById('gadget-category').value;
    const year = document.getElementById('gadget-year').value;
    const storage = document.getElementById('gadget-storage').value;
    const condition = document.getElementById('gadget-condition').value;
    const battery = document.getElementById('gadget-battery').value;
    
    if (!name || !category || !year || !storage || !condition || !battery) {
      showNotification('Form Tidak Lengkap', 'Mohon lengkapi semua field yang wajib diisi', 'warning');
      return false;
    }
    
    return true;
  }
  
  if (step === 2) {
    if (gadgetImages.length < 4) {
      showNotification('Foto Kurang', 'Minimal upload 4 foto gadget (Depan, Belakang, Samping, On Screen)', 'warning');
      return false;
    }
    
    if (!imeiImage) {
      showNotification('IMEI Diperlukan', 'Mohon upload foto IMEI/Serial Number untuk verifikasi', 'warning');
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
  
  uploadArea.addEventListener('click', () => {
    fileInput.click();
  });
  
  fileInput.addEventListener('change', (e) => {
    handleGadgetImages(e.target.files);
  });
  
  // Drag and drop
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
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (gadgetImages.length + files.length > maxFiles) {
    showNotification('Batas Maksimal', `Maksimal ${maxFiles} foto`, 'warning');
    return;
  }
  
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) {
      showNotification('Format Salah', 'File harus berupa gambar', 'warning');
      return;
    }
    
    if (file.size > maxSize) {
      showNotification('File Terlalu Besar', 'Ukuran maksimal 5MB per foto', 'warning');
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
  
  uploadArea.addEventListener('click', () => {
    fileInput.click();
  });
  
  fileInput.addEventListener('change', (e) => {
    handleImeiImage(e.target.files[0]);
  });
}

function handleImeiImage(file) {
  if (!file) return;
  
  const maxSize = 3 * 1024 * 1024; // 3MB
  
  if (!file.type.startsWith('image/')) {
    showNotification('Format Salah', 'File harus berupa gambar', 'warning');
    return;
  }
  
  if (file.size > maxSize) {
    showNotification('File Terlalu Besar', 'Ukuran maksimal 3MB', 'warning');
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
  document.getElementById('imei-preview').classList.remove('active');
  document.getElementById('imei-image').value = '';
}

// ===== CALCULATE ESTIMATION =====
function calculateEstimation() {
  const name = document.getElementById('gadget-name').value;
  const category = document.getElementById('gadget-category').value;
  const year = parseInt(document.getElementById('gadget-year').value);
  const storage = document.getElementById('gadget-storage').value;
  const condition = document.getElementById('gadget-condition').value;
  const battery = parseInt(document.getElementById('gadget-battery').value);
  
  // Base prices by category (ini bisa disesuaikan dengan database harga pasar)
  const basePrices = {
    'iPhone': 15000000,
    'Android': 8000000,
    'Tablet': 6000000,
    'Laptop': 10000000,
    'Smartwatch': 3000000
  };
  
  let basePrice = basePrices[category] || 5000000;
  
  // Adjust by year (depreciation)
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  const depreciationRate = 0.15; // 15% per tahun
  basePrice = basePrice * Math.pow(1 - depreciationRate, age);
  
  // Adjust by condition
  const conditionMultipliers = {
    'Baru': 1.0,
    'Baik': 0.85,
    'Normal': 0.70,
    'Kurang Baik': 0.50
  };
  basePrice *= conditionMultipliers[condition] || 0.70;
  
  // Adjust by battery
  if (battery >= 90) {
    basePrice *= 1.0;
  } else if (battery >= 80) {
    basePrice *= 0.95;
  } else if (battery >= 70) {
    basePrice *= 0.85;
  } else {
    basePrice *= 0.70;
  }
  
  // Adjust by storage (simple estimation)
  if (storage.includes('512') || storage.includes('1TB')) {
    basePrice *= 1.2;
  } else if (storage.includes('256')) {
    basePrice *= 1.1;
  }
  
  // Calculate pawn range (70-80% of estimated value)
  const minPawn = Math.floor(basePrice * 0.70);
  const maxPawn = Math.floor(basePrice * 0.80);
  
  // Store estimation data
  estimasiData = {
    gadgetName: name,
    category: category,
    year: year,
    storage: storage,
    condition: condition,
    battery: battery,
    estimatedValue: basePrice,
    minPawn: minPawn,
    maxPawn: maxPawn
  };
  
  // Display estimation
  displayEstimation();
}

function displayEstimation() {
  document.getElementById('est-name').textContent = estimasiData.gadgetName;
  document.getElementById('est-category').textContent = estimasiData.category;
  document.getElementById('est-condition').textContent = estimasiData.condition;
  document.getElementById('est-battery').textContent = `${estimasiData.battery}%`;
  document.getElementById('est-min').textContent = formatRupiah(estimasiData.minPawn);
  document.getElementById('est-max').textContent = formatRupiah(estimasiData.maxPawn);
}

// ===== FORMAT RUPIAH =====
function formatRupiah(amount) {
  return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ===== FORM SUBMISSION =====
function handlePegadaianSubmission(e) {
  e.preventDefault();
  
  // Check terms agreement
  const agreeTerms = document.getElementById('agree-terms');
  if (!agreeTerms.checked) {
    showNotification('Persetujuan Diperlukan', 'Anda harus menyetujui syarat dan ketentuan', 'warning');
    return;
  }
  
  // Get selected tenor
  const selectedTenor = document.querySelector('input[name="tenor"]:checked').value;
  
  // Get accessories
  const accessories = Array.from(document.querySelectorAll('input[name="accessories"]:checked'))
    .map(cb => cb.value);
  
  // Get current user
  const currentUser = window.SessionManager.getCurrentUser();
  
  // Create pegadaian data
  const pegadaianData = {
    id: `pawn-${Date.now()}`,
    userId: currentUser.username,
    userName: currentUser.fullname,
    gadgetName: estimasiData.gadgetName,
    category: estimasiData.category,
    year: estimasiData.year,
    storage: document.getElementById('gadget-storage').value,
    condition: estimasiData.condition,
    battery: estimasiData.battery,
    accessories: accessories,
    description: document.getElementById('gadget-description').value,
    images: gadgetImages.map(img => img.dataUrl),
    imeiImage: imeiImage.dataUrl,
    estimatedMin: estimasiData.minPawn,
    estimatedMax: estimasiData.maxPawn,
    tenor: parseInt(selectedTenor),
    status: 'pending', // pending, approved, rejected
    submittedDate: new Date().toISOString(),
    verifiedDate: null,
    verifiedBy: null,
    finalValue: null
  };
  
  // Save pegadaian data
  savePegadaianData(pegadaianData);
  
  // Add notification to user
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
      
      // Update notification badge
      if (window.notificationHandler) {
        window.notificationHandler.updateNotificationBadge();
      }
    }
  }
  
  // Close modal
  closePegadaianModal();
  
  // Show success modal
  showSuccessModal();
  
  console.log('✅ Pegadaian submitted:', pegadaianData);
}

function savePegadaianData(data) {
  // In real app, this would be sent to backend
  // For now, store in localStorage
  let pegadaianList = JSON.parse(localStorage.getItem('pegadaianData') || '[]');
  pegadaianList.push(data);
  localStorage.setItem('pegadaianData', JSON.stringify(pegadaianList));
}

// ===== SUCCESS MODAL =====
function showSuccessModal() {
  const modal = document.getElementById('success-gadai-modal');
  modal.classList.add('active');
}

function closeSuccessModal() {
  const modal = document.getElementById('success-gadai-modal');
  modal.classList.remove('active');
  
  // Optionally redirect to my pegadaian page
  // window.location.href = 'my-pegadaian.html';
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(title, message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification-toast ${type}`;
  
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
  icon.style.cssText = `
    font-size: 32px;
    color: ${colors[type]};
    flex-shrink: 0;
  `;
  
  const textDiv = notification.querySelector('div');
  textDiv.style.cssText = `
    flex: 1;
  `;
  
  const strong = notification.querySelector('strong');
  strong.style.cssText = `
    display: block;
    color: #fff;
    font-size: 15px;
    margin-bottom: 5px;
  `;
  
  const p = notification.querySelector('p');
  p.style.cssText = `
    color: #aaa;
    font-size: 13px;
    line-height: 1.4;
    margin: 0;
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Add CSS animations
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
`;
document.head.appendChild(style);

// ===== INITIALIZE ON LOAD =====
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Initializing Pegadaian system...');
  
  // Initialize year options
  initYearOptions();
  
  // Initialize image uploads
  initImageUpload();
  initImeiUpload();
  
  // Form submission
  const form = document.getElementById('pegadaian-form');
  if (form) {
    form.addEventListener('submit', handlePegadaianSubmission);
  }
  
  // Close modal on outside click
  const modal = document.getElementById('pegadaian-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closePegadaianModal();
      }
    });
  }
  
  console.log('✅ Pegadaian system initialized');
});

// Export functions for global use
window.pegadaianSystem = {
  openPegadaianModal,
  closePegadaianModal,
  nextStep,
  previousStep,
  removeGadgetImage,
  removeImeiImage,
  closeSuccessModal
};