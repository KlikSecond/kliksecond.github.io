// ===== UPLOAD PRODUCT HANDLER =====

let productImages = [];
let barcodeImage = null;

document.addEventListener('DOMContentLoaded', function() {
  initUploadSystem();
});

function initUploadSystem() {
  const floatingBtn = document.querySelector('.floating-upload-btn');
  const uploadModal = document.getElementById('upload-modal');
  const uploadModalClose = document.querySelector('.upload-modal-close');
  const uploadForm = document.getElementById('upload-product-form');
  const cancelBtn = document.querySelector('.btn-cancel');
  
  // Floating button click
  if (floatingBtn) {
    floatingBtn.addEventListener('click', function() {
      if (authSystem.isAuthenticated()) {
        openUploadModal();
      } else {
        showNotification('Login Diperlukan', 'Silakan login terlebih dahulu untuk mengunggah produk', 'info');
        openAuthModal('login');
      }
    });
  }
  
  // Close modal
  if (uploadModalClose) {
    uploadModalClose.addEventListener('click', closeUploadModal);
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeUploadModal);
  }
  
  // Click outside to close
  if (uploadModal) {
    uploadModal.addEventListener('click', function(e) {
      if (e.target === uploadModal) {
        closeUploadModal();
      }
    });
  }
  
  // Form submission
  if (uploadForm) {
    uploadForm.addEventListener('submit', handleProductUpload);
  }
  
  // Image upload
  initImageUpload();
  
  // Barcode upload
  initBarcodeUpload();
  
  // Auto-fill price format
  const priceInput = document.getElementById('product-price');
  if (priceInput) {
    priceInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      e.target.value = value;
    });
  }
}

function openUploadModal() {
  const uploadModal = document.getElementById('upload-modal');
  uploadModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeUploadModal() {
  const uploadModal = document.getElementById('upload-modal');
  uploadModal.classList.remove('active');
  document.body.style.overflow = '';
  
  // Reset form
  document.getElementById('upload-product-form')?.reset();
  productImages = [];
  barcodeImage = null;
  
  // Clear previews
  document.getElementById('image-preview-container').innerHTML = '';
  document.querySelector('.barcode-preview')?.classList.remove('active');
}

function initImageUpload() {
  const uploadArea = document.getElementById('image-upload-area');
  const fileInput = document.getElementById('product-images');
  const previewContainer = document.getElementById('image-preview-container');
  
  // Click to upload
  uploadArea.addEventListener('click', function() {
    fileInput.click();
  });
  
  // File input change
  fileInput.addEventListener('change', function(e) {
    handleImageFiles(e.target.files);
  });
  
  // Drag and drop
  uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });
  
  uploadArea.addEventListener('dragleave', function() {
    uploadArea.classList.remove('dragover');
  });
  
  uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    handleImageFiles(e.dataTransfer.files);
  });
}

function handleImageFiles(files) {
  const maxFiles = 5;
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (productImages.length + files.length > maxFiles) {
    showNotification('Peringatan', `Maksimal ${maxFiles} gambar`, 'info');
    return;
  }
  
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) {
      showNotification('Error', 'File harus berupa gambar', 'info');
      return;
    }
    
    if (file.size > maxSize) {
      showNotification('Error', 'Ukuran file maksimal 5MB', 'info');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      productImages.push({
        file: file,
        dataUrl: e.target.result
      });
      displayImagePreviews();
    };
    reader.readAsDataURL(file);
  });
}

function displayImagePreviews() {
  const container = document.getElementById('image-preview-container');
  container.innerHTML = productImages.map((img, index) => `
    <div class="image-preview-item">
      <img src="${img.dataUrl}" alt="Preview ${index + 1}">
      <button type="button" class="remove-image" onclick="removeImage(${index})">
        <i class="bi bi-x"></i>
      </button>
    </div>
  `).join('');
}

function removeImage(index) {
  productImages.splice(index, 1);
  displayImagePreviews();
}

function initBarcodeUpload() {
  const uploadArea = document.getElementById('barcode-upload-area');
  const fileInput = document.getElementById('barcode-image');
  
  // Click to upload
  uploadArea.addEventListener('click', function() {
    fileInput.click();
  });
  
  // File input change
  fileInput.addEventListener('change', function(e) {
    handleBarcodeFile(e.target.files[0]);
  });
}

function handleBarcodeFile(file) {
  if (!file) return;
  
  const maxSize = 3 * 1024 * 1024; // 3MB
  
  if (!file.type.startsWith('image/')) {
    showNotification('Error', 'File harus berupa gambar', 'info');
    return;
  }
  
  if (file.size > maxSize) {
    showNotification('Error', 'Ukuran file maksimal 3MB', 'info');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    barcodeImage = {
      file: file,
      dataUrl: e.target.result
    };
    displayBarcodePreview();
  };
  reader.readAsDataURL(file);
}

function displayBarcodePreview() {
  const preview = document.querySelector('.barcode-preview');
  preview.classList.add('active');
  preview.innerHTML = `
    <img src="${barcodeImage.dataUrl}" alt="Barcode Preview">
    <div class="barcode-preview-info">
      <span class="barcode-filename">
        <i class="bi bi-file-earmark-image"></i>
        ${barcodeImage.file.name}
      </span>
      <button type="button" class="remove-barcode" onclick="removeBarcode()">
        <i class="bi bi-trash"></i> Hapus
      </button>
    </div>
  `;
}

function removeBarcode() {
  barcodeImage = null;
  document.querySelector('.barcode-preview').classList.remove('active');
  document.getElementById('barcode-image').value = '';
}

function handleProductUpload(e) {
  e.preventDefault();
  
  // Validate login
  if (!authSystem.isAuthenticated()) {
    showNotification('Error', 'Anda harus login terlebih dahulu', 'info');
    closeUploadModal();
    openAuthModal('login');
    return;
  }
  
  // Validate images
  if (productImages.length === 0) {
    showNotification('Peringatan', 'Minimal upload 1 gambar produk', 'info');
    return;
  }
  
  // Validate barcode
  if (!barcodeImage) {
    showNotification('Peringatan', 'Barcode wajib diupload untuk verifikasi', 'info');
    return;
  }
  
  // Get form data
  const formData = {
    id: `product-${Date.now()}`,
    name: document.getElementById('product-name').value,
    category: document.getElementById('product-category').value,
    price: parseInt(document.getElementById('product-price').value),
    grade: document.getElementById('product-grade').value,
    battery: document.getElementById('product-battery').value,
    storage: document.getElementById('product-storage').value,
    condition: document.getElementById('product-condition').value,
    usage: document.getElementById('product-usage').value,
    city: document.getElementById('product-city').value,
    description: document.getElementById('product-description').value,
    images: productImages.map(img => img.dataUrl),
    barcode: barcodeImage.dataUrl,
    seller: authSystem.getCurrentUser().fullName,
    sellerId: authSystem.getCurrentUser().id,
    uploadDate: new Date().toISOString(),
    status: 'pending', // Will be verified by admin
    rating: 0,
    reviews: 0,
    shipping: 'Gratis Ongkir'
  };
  
  // Save to products data (in real app, this would be sent to backend)
  saveProduct(formData);
  
  // Close upload modal
  closeUploadModal();
  
  // Show success modal
  showSuccessModal();
  
  // Add notification
  authSystem.addNotification(
    'product_uploaded',
    'Produk Berhasil Diupload',
    `${formData.name} sedang dalam proses verifikasi. Kami akan mengirim notifikasi setelah produk disetujui.`,
    formData.id
  );
  
  // Update notification badge
  updateNotificationBadge();
}

function saveProduct(productData) {
  // Get existing products from storage
  let userProducts = JSON.parse(localStorage.getItem('userProducts') || '[]');
  
  // Add new product
  userProducts.push(productData);
  
  // Save back to storage
  localStorage.setItem('userProducts', JSON.stringify(userProducts));
  
  console.log('Product saved:', productData);
}

function showSuccessModal() {
  const successModal = document.getElementById('success-upload-modal');
  successModal.classList.add('active');
  
  const okBtn = document.querySelector('.btn-success-ok');
  okBtn.addEventListener('click', function() {
    successModal.classList.remove('active');
    
    // Optionally redirect to my products page
    // window.location.href = 'my-products.html';
  });
}

// Format currency input
function formatCurrency(input) {
  let value = input.value.replace(/\D/g, '');
  
  if (value) {
    value = parseInt(value).toLocaleString('id-ID');
    input.value = value;
  }
}

// Validate battery percentage
document.getElementById('product-battery')?.addEventListener('input', function(e) {
  let value = parseInt(e.target.value);
  if (value > 100) e.target.value = 100;
  if (value < 0) e.target.value = 0;
});