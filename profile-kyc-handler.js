// ===== PROFILE KYC HANDLER (COMPLETE VERSION) =====
// File: profile-kyc-handler.js
// Handler untuk mengelola verifikasi KYC di halaman profile

console.log('🛡️ Profile KYC Handler loading...');

class ProfileKYCHandler {
  constructor() {
    this.currentUser = null;
    this.uploadedFiles = {
      idCard: null,
      selfie: null
    };
    this.init();
  }

  init() {
    if (!this.isProfilePage()) {
      console.log('⭐️ Not on profile page, skipping KYC Handler init');
      return;
    }

    this.waitForDependencies().then(() => {
      if (window.SessionManager && window.SessionManager.isLoggedIn()) {
        this.currentUser = window.SessionManager.getCurrentUser();
        this.setupKYCTab();
        this.loadKYCData();
      }
    });
  }

  isProfilePage() {
    return window.location.pathname.includes('profile.html');
  }

  waitForDependencies() {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (window.SessionManager && window.KYCSystem) {
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

  // ===== SETUP KYC TAB =====
  setupKYCTab() {
    console.log('🔧 Setting up KYC tab...');
    this.createLightbox();
  }

  // ===== LOAD KYC DATA =====
  loadKYCData() {
    console.log('📊 Loading KYC data...');
    
    if (!window.KYCSystem) {
      this.renderError('Sistem KYC belum dimuat');
      return;
    }

    const kycStatus = window.KYCSystem.getKYCStatus(this.currentUser.username);
    console.log('KYC Status:', kycStatus);

    const kycTabContent = document.getElementById('kyc-tab-content');
    if (!kycTabContent) {
      console.error('❌ KYC tab content not found');
      return;
    }

    // Render based on status
    if (!kycStatus || kycStatus.status === 'unverified') {
      this.renderUnverifiedView(kycTabContent);
    } else if (kycStatus.status === 'pending') {
      this.renderPendingView(kycTabContent, kycStatus);
    } else if (kycStatus.status === 'verified') {
      this.renderVerifiedView(kycTabContent, kycStatus);
    } else if (kycStatus.status === 'rejected') {
      this.renderRejectedView(kycTabContent, kycStatus);
    }
  }

  // ===== RENDER UNVERIFIED VIEW =====
  renderUnverifiedView(container) {
    container.innerHTML = `
      <div class="kyc-container">
        <!-- Status Card -->
        <div class="kyc-status-card">
          <div class="kyc-status-icon unverified">
            <i class="bi bi-shield-x"></i>
          </div>
          <h3 class="kyc-status-title unverified">Belum Terverifikasi</h3>
          <p class="kyc-status-description">
            Akun Anda belum terverifikasi. Verifikasi KYC diperlukan untuk keamanan dan kepercayaan dalam bertransaksi.
          </p>
          <button class="btn-submit-kyc" onclick="profileKYCHandler.showKYCForm()">
            <i class="bi bi-shield-check"></i>
            Mulai Verifikasi
          </button>
        </div>

        <!-- Info Banner -->
        <div class="kyc-info-banner">
          <h4><i class="bi bi-info-circle"></i> Manfaat Verifikasi KYC</h4>
          <ul>
            <li>Meningkatkan kepercayaan pembeli dan penjual</li>
            <li>Akses fitur premium dan batas transaksi lebih tinggi</li>
            <li>Badge verifikasi di profil Anda</li>
            <li>Prioritas dalam penyelesaian sengketa</li>
            <li>Proses klaim lebih cepat</li>
          </ul>
        </div>

        <!-- Requirements Info -->
        <div class="info-section">
          <h3><i class="bi bi-clipboard-check"></i> Yang Perlu Disiapkan</h3>
          <div class="info-grid">
            <div class="info-item">
              <label><i class="bi bi-card-heading"></i> Dokumen Identitas</label>
              <p>KTP / SIM / Paspor yang masih berlaku</p>
            </div>
            <div class="info-item">
              <label><i class="bi bi-camera"></i> Foto Selfie</label>
              <p>Foto diri Anda memegang dokumen identitas</p>
            </div>
            <div class="info-item full-width">
              <label><i class="bi bi-clock"></i> Waktu Verifikasi</label>
              <p>Proses verifikasi memakan waktu 1-3 hari kerja</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ===== SHOW KYC FORM =====
  showKYCForm() {
    const kycTabContent = document.getElementById('kyc-tab-content');
    if (!kycTabContent) return;

    kycTabContent.innerHTML = `
      <div class="kyc-container">
        <!-- Form Header -->
        <div class="kyc-info-banner">
          <h4><i class="bi bi-shield-check"></i> Formulir Verifikasi KYC</h4>
          <ul>
            <li>Pastikan semua data yang dimasukkan sesuai dengan dokumen identitas</li>
            <li>Foto harus jelas dan tidak buram</li>
            <li>Data yang salah akan memperlambat proses verifikasi</li>
          </ul>
        </div>

        <!-- Personal Info Form -->
        <div class="kyc-form-section">
          <h3><i class="bi bi-person-badge"></i> Data Pribadi</h3>
          <form id="kyc-form">
            <div class="kyc-form-grid">
              <div class="kyc-form-group">
                <label for="kyc-id-type">
                  <i class="bi bi-card-heading"></i> Jenis Identitas *
                </label>
                <select id="kyc-id-type" required>
                  <option value="">Pilih Jenis Identitas</option>
                  <option value="KTP">KTP</option>
                  <option value="SIM">SIM</option>
                  <option value="Paspor">Paspor</option>
                </select>
              </div>

              <div class="kyc-form-group">
                <label for="kyc-id-number">
                  <i class="bi bi-hash"></i> Nomor Identitas *
                </label>
                <input 
                  type="text" 
                  id="kyc-id-number" 
                  placeholder="Contoh: 3201234567890123"
                  maxlength="16"
                  required
                >
              </div>

              <div class="kyc-form-group full-width">
                <label for="kyc-fullname">
                  <i class="bi bi-person"></i> Nama Lengkap (sesuai KTP) *
                </label>
                <input 
                  type="text" 
                  id="kyc-fullname" 
                  placeholder="Masukkan nama lengkap sesuai KTP"
                  required
                >
              </div>

              <div class="kyc-form-group">
                <label for="kyc-dob">
                  <i class="bi bi-calendar"></i> Tanggal Lahir *
                </label>
                <input 
                  type="date" 
                  id="kyc-dob"
                  required
                >
              </div>

              <div class="kyc-form-group">
                <label for="kyc-phone">
                  <i class="bi bi-phone"></i> Nomor Telepon *
                </label>
                <input 
                  type="tel" 
                  id="kyc-phone" 
                  placeholder="08123456789"
                  required
                >
              </div>

              <div class="kyc-form-group full-width">
                <label for="kyc-address">
                  <i class="bi bi-geo-alt"></i> Alamat Lengkap *
                </label>
                <textarea 
                  id="kyc-address" 
                  placeholder="Masukkan alamat sesuai KTP"
                  rows="3"
                  required
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        <!-- Document Upload Section -->
        <div class="kyc-upload-section">
          <h3><i class="bi bi-cloud-upload"></i> Upload Dokumen</h3>
          <div class="kyc-upload-grid">
            <!-- ID Card Upload -->
            <div class="kyc-upload-item" id="upload-id-card" onclick="document.getElementById('kyc-id-card-input').click()">
              <i class="bi bi-card-image kyc-upload-icon"></i>
              <h4 class="kyc-upload-title">Foto KTP/SIM/Paspor</h4>
              <p class="kyc-upload-description">
                Upload foto identitas yang jelas<br>
                Format: JPG, PNG (Max 2MB)
              </p>
              <img id="id-card-preview" class="kyc-upload-preview" alt="ID Card Preview">
              <p class="kyc-upload-filename" id="id-card-filename"></p>
              <button type="button" class="kyc-remove-image" onclick="event.stopPropagation(); profileKYCHandler.removeImage('idCard')">
                <i class="bi bi-x"></i>
              </button>
            </div>
            <input 
              type="file" 
              id="kyc-id-card-input" 
              class="kyc-upload-input" 
              accept="image/*"
              onchange="profileKYCHandler.handleImageUpload(event, 'idCard')"
            >

            <!-- Selfie Upload -->
            <div class="kyc-upload-item" id="upload-selfie" onclick="document.getElementById('kyc-selfie-input').click()">
              <i class="bi bi-person-bounding-box kyc-upload-icon"></i>
              <h4 class="kyc-upload-title">Foto Selfie + KTP</h4>
              <p class="kyc-upload-description">
                Foto diri Anda memegang KTP/identitas<br>
                Pastikan wajah dan KTP terlihat jelas
              </p>
              <img id="selfie-preview" class="kyc-upload-preview" alt="Selfie Preview">
              <p class="kyc-upload-filename" id="selfie-filename"></p>
              <button type="button" class="kyc-remove-image" onclick="event.stopPropagation(); profileKYCHandler.removeImage('selfie')">
                <i class="bi bi-x"></i>
              </button>
            </div>
            <input 
              type="file" 
              id="kyc-selfie-input" 
              class="kyc-upload-input" 
              accept="image/*"
              onchange="profileKYCHandler.handleImageUpload(event, 'selfie')"
            >
          </div>
        </div>

        <!-- Submit Button -->
        <div class="kyc-submit-container">
          <button class="btn-submit-kyc-form" onclick="profileKYCHandler.submitKYC()">
            <i class="bi bi-send-check"></i>
            Submit Verifikasi KYC
          </button>
          <p style="color: #aaa; font-size: 12px; margin-top: 15px;">
            Dengan submit, Anda menyetujui bahwa data yang diberikan adalah benar dan dapat dipertanggungjawabkan.
          </p>
        </div>
      </div>
    `;

    // Auto-fill dengan data user yang sudah ada
    this.autoFillUserData();
  }

  // ===== AUTO FILL USER DATA =====
  autoFillUserData() {
    const fullUser = this.getFullUserData();
    if (!fullUser) return;

    const fullnameInput = document.getElementById('kyc-fullname');
    const phoneInput = document.getElementById('kyc-phone');
    const addressInput = document.getElementById('kyc-address');

    if (fullnameInput && fullUser.fullName) {
      fullnameInput.value = fullUser.fullName;
    }

    if (phoneInput && fullUser.phone) {
      phoneInput.value = fullUser.phone;
    }

    if (addressInput && fullUser.address) {
      addressInput.value = fullUser.address;
    }
  }

  // ===== HANDLE IMAGE UPLOAD =====
  handleImageUpload(event, type) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.showNotification('File harus berupa gambar!', 'error');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      this.showNotification('Ukuran file maksimal 2MB!', 'error');
      return;
    }

    // Read file
    const reader = new FileReader();
    reader.onload = (e) => {
      this.uploadedFiles[type] = e.target.result;
      this.updateImagePreview(type, e.target.result, file.name);
    };
    reader.readAsDataURL(file);
  }

  // ===== UPDATE IMAGE PREVIEW =====
  updateImagePreview(type, dataUrl, filename) {
    const container = document.getElementById(type === 'idCard' ? 'upload-id-card' : 'upload-selfie');
    const preview = document.getElementById(type === 'idCard' ? 'id-card-preview' : 'selfie-preview');
    const filenameEl = document.getElementById(type === 'idCard' ? 'id-card-filename' : 'selfie-filename');

    if (container) container.classList.add('has-image');
    if (preview) preview.src = dataUrl;
    if (filenameEl) filenameEl.textContent = filename;
  }

  // ===== REMOVE IMAGE =====
  removeImage(type) {
    this.uploadedFiles[type] = null;
    
    const container = document.getElementById(type === 'idCard' ? 'upload-id-card' : 'upload-selfie');
    const preview = document.getElementById(type === 'idCard' ? 'id-card-preview' : 'selfie-preview');
    const filenameEl = document.getElementById(type === 'idCard' ? 'id-card-filename' : 'selfie-filename');
    const input = document.getElementById(type === 'idCard' ? 'kyc-id-card-input' : 'kyc-selfie-input');

    if (container) container.classList.remove('has-image');
    if (preview) preview.src = '';
    if (filenameEl) filenameEl.textContent = '';
    if (input) input.value = '';
  }

  // ===== SUBMIT KYC =====
  async submitKYC() {
    // Validate form
    const idType = document.getElementById('kyc-id-type')?.value;
    const idNumber = document.getElementById('kyc-id-number')?.value;
    const fullName = document.getElementById('kyc-fullname')?.value;
    const dob = document.getElementById('kyc-dob')?.value;
    const phone = document.getElementById('kyc-phone')?.value;
    const address = document.getElementById('kyc-address')?.value;

    // Validation
    if (!idType || !idNumber || !fullName || !dob || !phone || !address) {
      this.showNotification('Semua field harus diisi!', 'error');
      return;
    }

    if (!this.uploadedFiles.idCard || !this.uploadedFiles.selfie) {
      this.showNotification('Kedua foto harus diupload!', 'error');
      return;
    }

    // ID number validation
    if (idType === 'KTP' && idNumber.length !== 16) {
      this.showNotification('Nomor KTP harus 16 digit!', 'error');
      return;
    }

    // Show loading
    this.showNotification('Mengirim data verifikasi...', 'info');

    try {
      const kycData = {
        idType,
        idNumber,
        fullName,
        dateOfBirth: dob,
        phone,
        address,
        idCardPhoto: this.uploadedFiles.idCard,
        selfiePhoto: this.uploadedFiles.selfie
      };

      const result = window.KYCSystem.submitKYC(this.currentUser.username, kycData);

      if (result.success) {
        this.showNotification(result.message, 'success');
        
        // Auto verify setelah 5 detik (untuk demo)
        window.KYCSystem.demoAutoVerify(this.currentUser.username, 5000);
        
        // Reload KYC data
        setTimeout(() => {
          this.loadKYCData();
        }, 1000);
      } else {
        this.showNotification(result.message, 'error');
      }
    } catch (error) {
      console.error('❌ Error submitting KYC:', error);
      this.showNotification('Terjadi kesalahan. Coba lagi.', 'error');
    }
  }

  // ===== RENDER PENDING VIEW =====
  renderPendingView(container, kycStatus) {
    container.innerHTML = `
      <div class="kyc-container">
        <!-- Status Card -->
        <div class="kyc-status-card">
          <div class="kyc-status-icon pending">
            <i class="bi bi-clock-history"></i>
          </div>
          <h3 class="kyc-status-title pending">Sedang Diverifikasi</h3>
          <p class="kyc-status-description">
            Dokumen KYC Anda sedang dalam proses verifikasi oleh tim kami. 
            Kami akan memberi tahu Anda dalam 1-3 hari kerja.
          </p>
          <div class="kyc-status-date">
            <i class="bi bi-calendar-check"></i>
            Disubmit: ${window.KYCSystem.formatDate(kycStatus.submittedDate)}
          </div>
        </div>

        <!-- Submitted Data Display -->
        ${this.renderSubmittedData(kycStatus)}

        <!-- Info -->
        <div class="kyc-info-banner">
          <h4><i class="bi bi-info-circle"></i> Apa yang terjadi selanjutnya?</h4>
          <ul>
            <li>Tim kami sedang memeriksa dokumen Anda</li>
            <li>Anda akan menerima notifikasi setelah verifikasi selesai</li>
            <li>Proses verifikasi biasanya memakan waktu 1-3 hari kerja</li>
            <li>Pastikan notifikasi Anda aktif</li>
          </ul>
        </div>
      </div>
    `;
  }

  // ===== RENDER VERIFIED VIEW =====
  renderVerifiedView(container, kycStatus) {
    container.innerHTML = `
      <div class="kyc-container">
        <!-- Status Card -->
        <div class="kyc-status-card">
          <div class="kyc-status-icon verified">
            <i class="bi bi-patch-check-fill"></i>
          </div>
          <h3 class="kyc-status-title verified">Terverifikasi ✓</h3>
          <p class="kyc-status-description">
            Selamat! Akun Anda telah terverifikasi. Anda sekarang dapat menikmati semua fitur premium 
            dan mendapatkan badge verifikasi di profil Anda.
          </p>
          <div class="kyc-status-date">
            <i class="bi bi-calendar-check"></i>
            Diverifikasi: ${window.KYCSystem.formatDate(kycStatus.verifiedDate)}
          </div>
        </div>

        <!-- Verified Data Display -->
        ${this.renderSubmittedData(kycStatus)}

        <!-- Benefits Info -->
        <div class="info-section" style="background: rgba(46, 213, 115, 0.1); border-color: rgba(46, 213, 115, 0.3);">
          <h3 style="color: #2ed573;"><i class="bi bi-star-fill"></i> Keuntungan Akun Terverifikasi</h3>
          <div class="info-grid">
            <div class="info-item">
              <label><i class="bi bi-patch-check"></i> Badge Verifikasi</label>
              <p>Profil Anda ditandai dengan badge terverifikasi</p>
            </div>
            <div class="info-item">
              <label><i class="bi bi-graph-up-arrow"></i> Batas Transaksi Lebih Tinggi</label>
              <p>Dapat bertransaksi dengan nominal lebih besar</p>
            </div>
            <div class="info-item">
              <label><i class="bi bi-shield-check"></i> Kepercayaan Lebih Tinggi</label>
              <p>Pembeli/penjual lebih percaya dengan akun terverifikasi</p>
            </div>
            <div class="info-item">
              <label><i class="bi bi-lightning"></i> Prioritas Support</label>
              <p>Mendapat prioritas dalam customer support</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ===== RENDER REJECTED VIEW =====
  renderRejectedView(container, kycStatus) {
    container.innerHTML = `
      <div class="kyc-container">
        <!-- Status Card -->
        <div class="kyc-status-card">
          <div class="kyc-status-icon rejected">
            <i class="bi bi-x-circle"></i>
          </div>
          <h3 class="kyc-status-title rejected">Verifikasi Ditolak</h3>
          <p class="kyc-status-description">
            Mohon maaf, dokumen KYC Anda ditolak. Silakan periksa alasan penolakan di bawah 
            dan submit ulang dengan dokumen yang valid.
          </p>
        </div>

        <!-- Rejection Reason -->
        <div class="rejection-reason">
          <h4><i class="bi bi-exclamation-triangle"></i> Alasan Penolakan:</h4>
          <p>${kycStatus.rejectedReason || 'Dokumen tidak memenuhi syarat'}</p>
        </div>

        <!-- Resubmit Button -->
        <div class="info-section" style="text-align: center;">
          <h3><i class="bi bi-arrow-repeat"></i> Submit Ulang Verifikasi</h3>
          <p style="color: #aaa; margin-bottom: 20px;">
            Pastikan dokumen yang Anda upload sudah sesuai dengan persyaratan
          </p>
          <button class="btn-resubmit-kyc" onclick="profileKYCHandler.showKYCForm()">
            <i class="bi bi-upload"></i>
            Submit Ulang Dokumen
          </button>
        </div>

        <!-- Requirements Info -->
        <div class="kyc-info-banner">
          <h4><i class="bi bi-clipboard-check"></i> Pastikan Dokumen Anda:</h4>
          <ul>
            <li>Foto jelas dan tidak buram</li>
            <li>Semua informasi dapat terbaca dengan jelas</li>
            <li>Dokumen identitas masih berlaku</li>
            <li>Foto selfie menunjukkan wajah dan KTP dengan jelas</li>
            <li>Format file JPG/PNG dengan ukuran maksimal 2MB</li>
          </ul>
        </div>
      </div>
    `;
  }

  // ===== RENDER SUBMITTED DATA =====
  renderSubmittedData(kycStatus) {
    if (!kycStatus.documents) return '';

    const docs = kycStatus.documents;

    return `
      <!-- Personal Data -->
      <div class="kyc-details-display">
        <h3><i class="bi bi-person-badge"></i> Data yang Disubmit</h3>
        <div class="kyc-details-grid">
          <div class="kyc-detail-item">
            <label><i class="bi bi-card-heading"></i> Jenis Identitas</label>
            <p>${docs.idType || '-'}</p>
          </div>
          <div class="kyc-detail-item">
            <label><i class="bi bi-hash"></i> Nomor Identitas</label>
            <p>${this.maskIdNumber(docs.idNumber) || '-'}</p>
          </div>
          <div class="kyc-detail-item full-width">
            <label><i class="bi bi-person"></i> Nama Lengkap</label>
            <p>${docs.fullName || '-'}</p>
          </div>
          <div class="kyc-detail-item">
            <label><i class="bi bi-calendar"></i> Tanggal Lahir</label>
            <p>${this.formatDate(docs.dateOfBirth) || '-'}</p>
          </div>
          <div class="kyc-detail-item">
            <label><i class="bi bi-calendar-check"></i> Tanggal Upload</label>
            <p>${window.KYCSystem.formatDate(docs.uploadedAt) || '-'}</p>
          </div>
          <div class="kyc-detail-item full-width">
            <label><i class="bi bi-geo-alt"></i> Alamat</label>
            <p>${docs.address || '-'}</p>
          </div>
        </div>
      </div>

      <!-- Documents -->
      <div class="kyc-documents-display">
        <h3><i class="bi bi-images"></i> Dokumen yang Diupload</h3>
        <div class="kyc-documents-grid">
          <div class="kyc-document-card">
            <img 
              src="${docs.idCardPhoto || ''}" 
              alt="ID Card" 
              class="kyc-document-image"
              onclick="profileKYCHandler.showLightbox('${docs.idCardPhoto}')"
            >
            <h4 class="kyc-document-title">Foto ${docs.idType || 'KTP'}</h4>
            <p class="kyc-document-date">${window.KYCSystem.formatDate(docs.uploadedAt)}</p>
          </div>
          <div class="kyc-document-card">
            <img 
              src="${docs.selfiePhoto || ''}" 
              alt="Selfie" 
              class="kyc-document-image"
              onclick="profileKYCHandler.showLightbox('${docs.selfiePhoto}')"
            >
            <h4 class="kyc-document-title">Foto Selfie + KTP</h4>
            <p class="kyc-document-date">${window.KYCSystem.formatDate(docs.uploadedAt)}</p>
          </div>
        </div>
      </div>
    `;
  }

  // ===== CREATE LIGHTBOX =====
  createLightbox() {
    const existingLightbox = document.getElementById('kyc-lightbox');
    if (existingLightbox) return;

    const lightboxHTML = `
      <div id="kyc-lightbox" class="kyc-lightbox">
        <div class="kyc-lightbox-content">
          <button class="kyc-lightbox-close" onclick="profileKYCHandler.closeLightbox()">
            <i class="bi bi-x"></i>
          </button>
          <img id="kyc-lightbox-image" class="kyc-lightbox-image" alt="Document">
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', lightboxHTML);

    // Close on background click
    const lightbox = document.getElementById('kyc-lightbox');
    if (lightbox) {
      lightbox.onclick = (e) => {
        if (e.target === lightbox) {
          this.closeLightbox();
        }
      };
    }
  }

  // ===== SHOW LIGHTBOX =====
  showLightbox(imageUrl) {
    const lightbox = document.getElementById('kyc-lightbox');
    const image = document.getElementById('kyc-lightbox-image');

    if (lightbox && image && imageUrl) {
      image.src = imageUrl;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  // ===== CLOSE LIGHTBOX =====
  closeLightbox() {
    const lightbox = document.getElementById('kyc-lightbox');
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // ===== RENDER ERROR =====
  renderError(message) {
    const kycTabContent = document.getElementById('kyc-tab-content');
    if (!kycTabContent) return;

    kycTabContent.innerHTML = `
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

  // ===== HELPER FUNCTIONS =====
  getFullUserData() {
    const storedData = localStorage.getItem('klikSecondUsers');
    if (!storedData) return null;

    const usersData = JSON.parse(storedData);
    return usersData.users.find(u => u.username === this.currentUser.username);
  }

  maskIdNumber(idNumber) {
    if (!idNumber || idNumber.length < 4) return idNumber;
    const lastFour = idNumber.slice(-4);
    const masked = '*'.repeat(idNumber.length - 4) + lastFour;
    return masked;
  }

  formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  }

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
    
    if (type !== 'info') {
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    } else {
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, 2000);
    }
  }
}

// ===== AUTO-INITIALIZE =====
let profileKYCHandler;

function initProfileKYCHandler() {
  if (!window.location.pathname.includes('profile.html')) {
    return;
  }

  profileKYCHandler = new ProfileKYCHandler();
  console.log('✅ Profile KYC Handler initialized');
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProfileKYCHandler);
} else {
  initProfileKYCHandler();
}

// Export
window.ProfileKYCHandler = ProfileKYCHandler;
window.profileKYCHandler = profileKYCHandler;

console.log('✅ Profile KYC Handler loaded successfully');