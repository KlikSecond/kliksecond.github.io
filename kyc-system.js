// ===== KYC (KNOW YOUR CUSTOMER) SYSTEM =====
// File: kyc-system.js
// Sistem verifikasi identitas pengguna

console.log('🔐 KYC System loading...');

const KYCSystem = {
  
  /**
   * Get user's KYC status
   * @param {string} username - Username
   * @returns {object|null} KYC data or null
   */
  getKYCStatus(username) {
    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) return null;
      
      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.username === username);
      
      if (!user) return null;
      
      return user.kyc || {
        verified: false,
        status: 'unverified', // unverified, pending, verified, rejected
        submittedDate: null,
        verifiedDate: null,
        documents: null
      };
    } catch (e) {
      console.error('❌ Error getting KYC status:', e);
      return null;
    }
  },
  
  /**
   * Submit KYC documents
   * @param {string} username - Username
   * @param {object} kycData - KYC documents and info
   * @returns {object} { success: boolean, message: string }
   */
  submitKYC(username, kycData) {
    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) {
        return { success: false, message: 'Data users tidak ditemukan' };
      }
      
      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.username === username);
      
      if (!user) {
        return { success: false, message: 'User tidak ditemukan' };
      }
      
      // Validasi data KYC
      if (!kycData.idType || !kycData.idNumber || !kycData.fullName) {
        return { success: false, message: 'Data KYC tidak lengkap!' };
      }
      
      if (!kycData.idCardPhoto || !kycData.selfiePhoto) {
        return { success: false, message: 'Foto dokumen dan selfie harus diupload!' };
      }
      
      // Save KYC data
      user.kyc = {
        verified: false,
        status: 'pending',
        submittedDate: new Date().toISOString(),
        verifiedDate: null,
        rejectedReason: null,
        documents: {
          idType: kycData.idType,
          idNumber: kycData.idNumber,
          fullName: kycData.fullName,
          dateOfBirth: kycData.dateOfBirth,
          address: kycData.address,
          idCardPhoto: kycData.idCardPhoto,
          selfiePhoto: kycData.selfiePhoto,
          uploadedAt: new Date().toISOString()
        }
      };
      
      localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
      
      // Update window.usersData
      if (window.usersData) {
        const windowUser = window.usersData.users.find(u => u.username === username);
        if (windowUser) {
          windowUser.kyc = user.kyc;
        }
      }
      
      // Add notification
      if (!user.notifications) user.notifications = [];
      
      user.notifications.unshift({
        id: `notif-${Date.now()}`,
        type: 'info',
        title: 'Dokumen KYC Diterima ✅',
        message: 'Dokumen verifikasi Anda telah diterima dan sedang dalam proses verifikasi. Kami akan memberi tahu Anda dalam 1-3 hari kerja.',
        date: new Date().toLocaleString('id-ID'),
        read: false
      });
      
      localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
      
      // Update notification badge
      if (window.notificationHandler) {
        window.notificationHandler.updateNotificationBadge();
      }
      
      console.log('✅ KYC submitted successfully');
      
      return {
        success: true,
        message: 'Dokumen KYC berhasil disubmit! Tunggu verifikasi dalam 1-3 hari kerja.'
      };
    } catch (e) {
      console.error('❌ Error submitting KYC:', e);
      return {
        success: false,
        message: 'Terjadi kesalahan saat submit KYC!'
      };
    }
  },
  
  /**
   * Verify user KYC (admin function - for demo purposes, auto-verify after 5 seconds)
   * @param {string} username - Username
   * @returns {boolean} Success status
   */
  verifyKYC(username) {
    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) return false;
      
      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.username === username);
      
      if (!user || !user.kyc) return false;
      
      user.kyc.verified = true;
      user.kyc.status = 'verified';
      user.kyc.verifiedDate = new Date().toISOString();
      
      localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
      
      // Update window.usersData
      if (window.usersData) {
        const windowUser = window.usersData.users.find(u => u.username === username);
        if (windowUser) {
          windowUser.kyc = user.kyc;
        }
      }
      
      // Add notification
      if (!user.notifications) user.notifications = [];
      
      user.notifications.unshift({
        id: `notif-${Date.now()}`,
        type: 'order_completed',
        title: 'Verifikasi KYC Berhasil! 🎉',
        message: 'Selamat! Akun Anda telah terverifikasi. Anda sekarang dapat mengakses semua fitur premium dan mendapatkan badge verifikasi.',
        date: new Date().toLocaleString('id-ID'),
        read: false
      });
      
      localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
      
      // Update notification badge
      if (window.notificationHandler) {
        window.notificationHandler.updateNotificationBadge();
      }
      
      console.log('✅ KYC verified successfully');
      return true;
    } catch (e) {
      console.error('❌ Error verifying KYC:', e);
      return false;
    }
  },
  
  /**
   * Reject user KYC
   * @param {string} username - Username
   * @param {string} reason - Rejection reason
   * @returns {boolean} Success status
   */
  rejectKYC(username, reason) {
    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) return false;
      
      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.username === username);
      
      if (!user || !user.kyc) return false;
      
      user.kyc.verified = false;
      user.kyc.status = 'rejected';
      user.kyc.rejectedReason = reason;
      
      localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
      
      // Update window.usersData
      if (window.usersData) {
        const windowUser = window.usersData.users.find(u => u.username === username);
        if (windowUser) {
          windowUser.kyc = user.kyc;
        }
      }
      
      // Add notification
      if (!user.notifications) user.notifications = [];
      
      user.notifications.unshift({
        id: `notif-${Date.now()}`,
        type: 'order_cancelled',
        title: 'Verifikasi KYC Ditolak ❌',
        message: `Mohon maaf, dokumen KYC Anda ditolak. Alasan: ${reason}. Silakan submit ulang dengan dokumen yang valid.`,
        date: new Date().toLocaleString('id-ID'),
        read: false
      });
      
      localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
      
      // Update notification badge
      if (window.notificationHandler) {
        window.notificationHandler.updateNotificationBadge();
      }
      
      console.log('✅ KYC rejected');
      return true;
    } catch (e) {
      console.error('❌ Error rejecting KYC:', e);
      return false;
    }
  },
  
  /**
   * Check if user is verified
   * @param {string} username - Username
   * @returns {boolean} Verified status
   */
  isVerified(username) {
    const kyc = this.getKYCStatus(username);
    return kyc && kyc.verified === true && kyc.status === 'verified';
  },
  
  /**
   * Get verification badge HTML
   * @param {string} username - Username
   * @returns {string} Badge HTML
   */
  getVerificationBadge(username) {
    const kyc = this.getKYCStatus(username);
    
    if (!kyc || kyc.status === 'unverified') {
      return '';
    }
    
    const badges = {
      'pending': '<span class="verification-badge pending" title="Verifikasi sedang diproses"><i class="bi bi-clock-fill"></i> Pending</span>',
      'verified': '<span class="verification-badge verified" title="Akun terverifikasi"><i class="bi bi-patch-check-fill"></i> Verified</span>',
      'rejected': '<span class="verification-badge rejected" title="Verifikasi ditolak"><i class="bi bi-x-circle-fill"></i> Rejected</span>'
    };
    
    return badges[kyc.status] || '';
  },
  
  /**
   * Get KYC status text
   * @param {string} status - KYC status
   * @returns {string} Status text
   */
  getStatusText(status) {
    const texts = {
      'unverified': 'Belum Verifikasi',
      'pending': 'Menunggu Verifikasi',
      'verified': 'Terverifikasi',
      'rejected': 'Ditolak'
    };
    
    return texts[status] || 'Unknown';
  },
  
  /**
   * Get KYC status color
   * @param {string} status - KYC status
   * @returns {string} Color code
   */
  getStatusColor(status) {
    const colors = {
      'unverified': '#aaa',
      'pending': '#ffc107',
      'verified': '#2ed573',
      'rejected': '#ff6b6b'
    };
    
    return colors[status] || '#aaa';
  },
  
  /**
   * Format date
   * @param {string} dateString - Date string
   * @returns {string} Formatted date
   */
  formatDate(dateString) {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return date.toLocaleDateString('id-ID', options);
  },
  
  /**
   * Demo: Auto-verify after delay (for testing purposes)
   * @param {string} username - Username
   * @param {number} delay - Delay in milliseconds (default 5000)
   */
  demoAutoVerify(username, delay = 5000) {
    console.log(`🔄 Demo: Auto-verifying ${username} in ${delay/1000} seconds...`);
    
    setTimeout(() => {
      this.verifyKYC(username);
      console.log('✅ Demo: Auto-verification completed!');
      
      // Reload KYC data if on profile page
      if (window.location.pathname.includes('profile.html') && window.profileKYCHandler) {
        window.profileKYCHandler.loadKYCData();
      }
    }, delay);
  }
};

// Export
window.KYCSystem = KYCSystem;

console.log('✅ KYC System loaded successfully');