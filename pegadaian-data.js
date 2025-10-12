// ===== PEGADAIAN DATA MANAGEMENT SYSTEM =====
console.log('💾 Pegadaian data manager loaded');

const PegadaianDataManager = {
  // Storage key
  STORAGE_KEY: 'klikSecondPegadaian',
  
  // Get all pegadaian data
  getAllPegadaian() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading pegadaian data:', e);
      return [];
    }
  },
  
  // Get pegadaian by user
  getPegadaianByUser(username) {
    const allPegadaian = this.getAllPegadaian();
    return allPegadaian.filter(p => p.userId === username);
  },
  
  // Get pegadaian by ID
  getPegadaianById(id) {
    const allPegadaian = this.getAllPegadaian();
    return allPegadaian.find(p => p.id === id);
  },
  
  // Get pegadaian by status
  getPegadaianByStatus(status) {
    const allPegadaian = this.getAllPegadaian();
    return allPegadaian.filter(p => p.status === status);
  },
  
  // Add new pegadaian
  addPegadaian(pegadaianData) {
    try {
      const allPegadaian = this.getAllPegadaian();
      allPegadaian.push(pegadaianData);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allPegadaian));
      console.log('✅ Pegadaian added:', pegadaianData.id);
      return true;
    } catch (e) {
      console.error('Error saving pegadaian:', e);
      return false;
    }
  },
  
  // Update pegadaian status (admin function)
  updatePegadaianStatus(id, status, finalValue = null, verifiedBy = null) {
    try {
      const allPegadaian = this.getAllPegadaian();
      const index = allPegadaian.findIndex(p => p.id === id);
      
      if (index === -1) {
        console.error('Pegadaian not found:', id);
        return false;
      }
      
      allPegadaian[index].status = status;
      allPegadaian[index].verifiedDate = new Date().toISOString();
      
      if (finalValue) {
        allPegadaian[index].finalValue = finalValue;
      }
      
      if (verifiedBy) {
        allPegadaian[index].verifiedBy = verifiedBy;
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allPegadaian));
      console.log('✅ Pegadaian updated:', id, status);
      
      // Send notification to user
      this.sendNotificationToUser(allPegadaian[index]);
      
      return true;
    } catch (e) {
      console.error('Error updating pegadaian:', e);
      return false;
    }
  },
  
  // Send notification to user after verification
  sendNotificationToUser(pegadaianData) {
    if (!window.usersData || !window.usersData.users) return;
    
    const user = window.usersData.users.find(u => u.username === pegadaianData.userId);
    if (!user) return;
    
    let notificationData = {
      id: `notif-${Date.now()}`,
      type: '',
      title: '',
      message: '',
      date: new Date().toLocaleString('id-ID'),
      read: false,
      relatedId: pegadaianData.id
    };
    
    if (pegadaianData.status === 'approved') {
      notificationData.type = 'pegadaian_approved';
      notificationData.title = '✅ Pegadaian Disetujui!';
      notificationData.message = `Pengajuan pegadaian ${pegadaianData.gadgetName} telah disetujui dengan nilai Rp ${this.formatRupiah(pegadaianData.finalValue)}. Dana akan segera ditransfer.`;
    } else if (pegadaianData.status === 'rejected') {
      notificationData.type = 'pegadaian_rejected';
      notificationData.title = '❌ Pegadaian Ditolak';
      notificationData.message = `Mohon maaf, pengajuan pegadaian ${pegadaianData.gadgetName} tidak dapat diproses. Silakan hubungi CS untuk informasi lebih lanjut.`;
    }
    
    user.notifications.unshift(notificationData);
    
    // Update notification badge if user is currently logged in
    if (window.SessionManager && window.SessionManager.isLoggedIn()) {
      const currentUser = window.SessionManager.getCurrentUser();
      if (currentUser && currentUser.username === user.username) {
        if (window.notificationHandler) {
          window.notificationHandler.updateNotificationBadge();
        }
      }
    }
    
    console.log('📬 Notification sent to user:', user.username);
  },
  
  // Format rupiah
  formatRupiah(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  },
  
  // Get statistics
  getStatistics() {
    const allPegadaian = this.getAllPegadaian();
    
    return {
      total: allPegadaian.length,
      pending: allPegadaian.filter(p => p.status === 'pending').length,
      approved: allPegadaian.filter(p => p.status === 'approved').length,
      rejected: allPegadaian.filter(p => p.status === 'rejected').length,
      totalValue: allPegadaian
        .filter(p => p.status === 'approved')
        .reduce((sum, p) => sum + (p.finalValue || 0), 0)
    };
  },
  
  // Delete pegadaian (admin only)
  deletePegadaian(id) {
    try {
      const allPegadaian = this.getAllPegadaian();
      const filtered = allPegadaian.filter(p => p.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      console.log('🗑️ Pegadaian deleted:', id);
      return true;
    } catch (e) {
      console.error('Error deleting pegadaian:', e);
      return false;
    }
  },
  
  // Calculate monthly payment
  calculateMonthlyPayment(principal, tenor, interestRate) {
    // Simple interest calculation
    const monthlyInterest = (principal * interestRate / 100);
    const totalAmount = principal + (monthlyInterest * tenor);
    return Math.ceil(totalAmount / tenor);
  },
  
  // Get payment schedule
  getPaymentSchedule(pegadaianId) {
    const pegadaian = this.getPegadaianById(pegadaianId);
    if (!pegadaian || !pegadaian.finalValue) return [];
    
    const interestRates = {
      1: 1.5,
      3: 1.8,
      6: 2.0,
      12: 2.5
    };
    
    const interestRate = interestRates[pegadaian.tenor] || 2.0;
    const monthlyPayment = this.calculateMonthlyPayment(
      pegadaian.finalValue,
      pegadaian.tenor,
      interestRate
    );
    
    const schedule = [];
    const startDate = new Date(pegadaian.verifiedDate || pegadaian.submittedDate);
    
    for (let i = 1; i <= pegadaian.tenor; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);
      
      schedule.push({
        month: i,
        dueDate: dueDate.toLocaleDateString('id-ID'),
        amount: monthlyPayment,
        status: 'unpaid' // unpaid, paid, overdue
      });
    }
    
    return schedule;
  },
  
  // Export data to CSV (for admin)
  exportToCSV() {
    const allPegadaian = this.getAllPegadaian();
    
    const headers = [
      'ID', 'User', 'Gadget', 'Kategori', 'Kondisi', 'Battery', 
      'Estimasi Min', 'Estimasi Max', 'Nilai Final', 'Tenor', 
      'Status', 'Tanggal Pengajuan', 'Tanggal Verifikasi'
    ];
    
    const rows = allPegadaian.map(p => [
      p.id,
      p.userName,
      p.gadgetName,
      p.category,
      p.condition,
      `${p.battery}%`,
      p.estimatedMin,
      p.estimatedMax,
      p.finalValue || '-',
      `${p.tenor} bulan`,
      p.status,
      new Date(p.submittedDate).toLocaleDateString('id-ID'),
      p.verifiedDate ? new Date(p.verifiedDate).toLocaleDateString('id-ID') : '-'
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csv;
  }
};

// Sample data for demo (optional - dapat dihapus di production)
function initializeSamplePegadaian() {
  const existing = PegadaianDataManager.getAllPegadaian();
  if (existing.length > 0) {
    console.log('📦 Pegadaian data already exists');
    return;
  }
  
  console.log('🔧 Initializing sample pegadaian data...');
  
  // Add sample approved pegadaian
  const sampleApproved = {
    id: 'pawn-sample-001',
    userId: 'kelvingacor',
    userName: 'Kelvin Ganteng',
    gadgetName: 'iPhone 13 Pro Max',
    category: 'iPhone',
    year: 2023,
    storage: '256GB',
    condition: 'Baik',
    battery: 88,
    accessories: ['box', 'charger', 'cable'],
    description: 'iPhone 13 Pro Max dalam kondisi baik, minor scratches di bagian belakang',
    images: [
      'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400',
      'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400',
      'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400',
      'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400'
    ],
    imeiImage: 'https://via.placeholder.com/300x150?text=IMEI',
    estimatedMin: 12000000,
    estimatedMax: 14000000,
    tenor: 6,
    status: 'approved',
    submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    verifiedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    verifiedBy: 'Admin Klik Second',
    finalValue: 13500000
  };
  
  // Add sample pending pegadaian
  const samplePending = {
    id: 'pawn-sample-002',
    userId: 'rivenkrist',
    userName: 'Riven Kristian',
    gadgetName: 'Samsung Galaxy S23 Ultra',
    category: 'Android',
    year: 2024,
    storage: '512GB',
    condition: 'Baru',
    battery: 95,
    accessories: ['box', 'charger', 'cable', 'manual'],
    description: 'Samsung S23 Ultra seperti baru, baru dipakai 2 bulan',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400'
    ],
    imeiImage: 'https://via.placeholder.com/300x150?text=IMEI',
    estimatedMin: 14000000,
    estimatedMax: 16000000,
    tenor: 3,
    status: 'pending',
    submittedDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    verifiedDate: null,
    verifiedBy: null,
    finalValue: null
  };
  
  PegadaianDataManager.addPegadaian(sampleApproved);
  PegadaianDataManager.addPegadaian(samplePending);
  
  console.log('✅ Sample pegadaian data initialized');
}

// Initialize sample data on load (comment this out in production)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSamplePegadaian);
} else {
  initializeSamplePegadaian();
}

// Export for global use
window.PegadaianDataManager = PegadaianDataManager;

console.log('✅ Pegadaian data manager ready');