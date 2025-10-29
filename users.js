// ===== USER DATA & AUTHENTICATION SYSTEM (WITH KYC DATA) =====
// File ini menyimpan data users ke localStorage untuk persistence

console.log('🔧 Users.js loading...');

// Default users data (will be loaded to localStorage on first run)
const defaultUsersData = {
  users: [
    {
      id: "user-001",
      username: "Hasbi",
      password: "kelvin12345",  
      email: "admin@kliksecond.com",
      fullName: "Hasbi Maulana",
      phone: "08123456789",
      address: "Jl. Sudirman No. 123, Jakarta Pusat",
      profilePicture: "https://ui-avatars.com/api/?name=Hasbi+Maulana&background=00ffff&color=000",
      role: "seller",
      joinDate: "2024-01-01",
      // ===== KYC DATA (VERIFIED) =====
      kyc: {
        verified: true,
        status: 'verified', // unverified, pending, verified, rejected
        submittedDate: "2024-01-15T10:30:00.000Z",
        verifiedDate: "2024-01-16T14:20:00.000Z",
        rejectedReason: null,
        documents: {
          idType: "KTP",
          idNumber: "3174012301850001",
          fullName: "Hasbi Maulana",
          dateOfBirth: "1985-01-23",
          address: "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10110",
          idCardPhoto: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect fill='%23e8f4f8' width='400' height='250'/%3E%3Crect fill='%2300bfff' width='400' height='60'/%3E%3Ctext x='20' y='40' font-family='Arial' font-size='24' font-weight='bold' fill='white'%3EREPUBLIK INDONESIA%3C/text%3E%3Ctext x='20' y='90' font-family='Arial' font-size='12' fill='%23333'%3EPROVINSI: DKI JAKARTA%3C/text%3E%3Ctext x='20' y='110' font-family='Arial' font-size='12' fill='%23333'%3EKABUPATEN/KOTA: JAKARTA SELATAN%3C/text%3E%3Ctext x='20' y='140' font-family='Arial' font-size='14' font-weight='bold' fill='%23333'%3ENIK: 3174012301850001%3C/text%3E%3Ctext x='20' y='160' font-family='Arial' font-size='12' fill='%23333'%3ENama: HASBI MAULANA%3C/text%3E%3Ctext x='20' y='180' font-family='Arial' font-size='12' fill='%23333'%3ETempat/Tgl Lahir: JAKARTA, 23-01-1985%3C/text%3E%3Ctext x='20' y='200' font-family='Arial' font-size='12' fill='%23333'%3EJenis Kelamin: LAKI-LAKI%3C/text%3E%3Crect x='280' y='90' width='100' height='130' fill='%23ddd' stroke='%23999'/%3E%3Ctext x='300' y='160' font-family='Arial' font-size='10' fill='%23666' text-anchor='middle'%3EFOTO%3C/text%3E%3C/svg%3E",
          selfiePhoto: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect fill='%23f0f0f0' width='400' height='500'/%3E%3Ccircle cx='200' cy='150' r='60' fill='%23ffdbac'/%3E%3Cellipse cx='185' cy='140' rx='8' ry='12' fill='%23333'/%3E%3Cellipse cx='215' cy='140' rx='8' ry='12' fill='%23333'/%3E%3Cpath d='M 180 165 Q 200 175 220 165' stroke='%23333' stroke-width='2' fill='none'/%3E%3Crect x='140' y='200' width='120' height='160' fill='%2300bfff' rx='5'/%3E%3Crect x='120' y='350' width='80' height='120' fill='%23333' rx='5'/%3E%3Crect x='200' y='350' width='80' height='120' fill='%23333' rx='5'/%3E%3Crect x='80' y='380' width='240' height='80' fill='%23e8f4f8' stroke='%2300bfff' stroke-width='3'/%3E%3Ctext x='200' y='410' font-family='Arial' font-size='12' fill='%23333' text-anchor='middle'%3EKTP%3C/text%3E%3Ctext x='200' y='430' font-family='Arial' font-size='10' fill='%23666' text-anchor='middle'%3E3174012301850001%3C/text%3E%3C/svg%3E",
          uploadedAt: "2024-01-15T10:30:00.000Z"
        }
      },
      notifications: [
        {
          id: "notif-kyc-verified",
          type: "order_completed",
          title: "Verifikasi KYC Berhasil! 🎉",
          message: "Selamat! Akun Anda telah terverifikasi. Anda sekarang dapat mengakses semua fitur premium dan mendapatkan badge verifikasi.",
          date: "16/01/2024, 14:20",
          read: false
        },
        {
          id: "notif-001",
          type: "auction_sold",
          title: "Lelang Berhasil",
          message: "POCO C75 Anda telah terjual dengan harga Rp 2.240.000",
          date: "02/10/2025, 10:24",
          read: false,
          productId: "android-001"
        }
      ]
    },
    {
      id: "user-002",
      username: "rivenkrist",
      password: "riven12345",
      email: "riven@example.com",
      fullName: "Riven Kristian",
      phone: "08198765432",
      address: "Jl. Braga No. 45, Bandung",
      profilePicture: "https://ui-avatars.com/api/?name=Riven+Kristian&background=4169e1&color=fff",
      role: "seller",
      joinDate: "2024-03-15",
      // ===== KYC DATA (PENDING) =====
      kyc: {
        verified: false,
        status: 'pending',
        submittedDate: "2025-10-28T09:15:00.000Z",
        verifiedDate: null,
        rejectedReason: null,
        documents: {
          idType: "KTP",
          idNumber: "3273021505900002",
          fullName: "Riven Kristian",
          dateOfBirth: "1990-05-15",
          address: "Jl. Braga No. 45, Bandung, Jawa Barat 40111",
          idCardPhoto: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect fill='%23e8f4f8' width='400' height='250'/%3E%3Crect fill='%234169e1' width='400' height='60'/%3E%3Ctext x='20' y='40' font-family='Arial' font-size='24' font-weight='bold' fill='white'%3EREPUBLIK INDONESIA%3C/text%3E%3Ctext x='20' y='90' font-family='Arial' font-size='12' fill='%23333'%3EPROVINSI: JAWA BARAT%3C/text%3E%3Ctext x='20' y='110' font-family='Arial' font-size='12' fill='%23333'%3EKABUPATEN/KOTA: BANDUNG%3C/text%3E%3Ctext x='20' y='140' font-family='Arial' font-size='14' font-weight='bold' fill='%23333'%3ENIK: 3273021505900002%3C/text%3E%3Ctext x='20' y='160' font-family='Arial' font-size='12' fill='%23333'%3ENama: RIVEN KRISTIAN%3C/text%3E%3Ctext x='20' y='180' font-family='Arial' font-size='12' fill='%23333'%3ETempat/Tgl Lahir: BANDUNG, 15-05-1990%3C/text%3E%3Ctext x='20' y='200' font-family='Arial' font-size='12' fill='%23333'%3EJenis Kelamin: LAKI-LAKI%3C/text%3E%3Crect x='280' y='90' width='100' height='130' fill='%23ddd' stroke='%23999'/%3E%3Ctext x='300' y='160' font-family='Arial' font-size='10' fill='%23666' text-anchor='middle'%3EFOTO%3C/text%3E%3C/svg%3E",
          selfiePhoto: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect fill='%23f5f5f5' width='400' height='500'/%3E%3Ccircle cx='200' cy='150' r='60' fill='%23ffd4a3'/%3E%3Cellipse cx='185' cy='140' rx='8' ry='12' fill='%23333'/%3E%3Cellipse cx='215' cy='140' rx='8' ry='12' fill='%23333'/%3E%3Cpath d='M 180 165 Q 200 175 220 165' stroke='%23333' stroke-width='2' fill='none'/%3E%3Crect x='140' y='200' width='120' height='160' fill='%234169e1' rx='5'/%3E%3Crect x='120' y='350' width='80' height='120' fill='%23333' rx='5'/%3E%3Crect x='200' y='350' width='80' height='120' fill='%23333' rx='5'/%3E%3Crect x='80' y='380' width='240' height='80' fill='%23e8f4f8' stroke='%234169e1' stroke-width='3'/%3E%3Ctext x='200' y='410' font-family='Arial' font-size='12' fill='%23333' text-anchor='middle'%3EKTP%3C/text%3E%3Ctext x='200' y='430' font-family='Arial' font-size='10' fill='%23666' text-anchor='middle'%3E3273021505900002%3C/text%3E%3C/svg%3E",
          uploadedAt: "2025-10-28T09:15:00.000Z"
        }
      },
      notifications: [
        {
          id: "notif-kyc-pending",
          type: "info",
          title: "Dokumen KYC Diterima ✅",
          message: "Dokumen verifikasi Anda telah diterima dan sedang dalam proses verifikasi. Kami akan memberi tahu Anda dalam 1-3 hari kerja.",
          date: "28/10/2025, 09:15",
          read: false
        },
        {
          id: "notif-003",
          type: "bid_received",
          title: "HP Anda Dihargai Seharga Rp 6.175.000",
          message: "Jika Anda Berminat HP Bisa Diantar Langsung ke Store",
          date: "03/10/2025, 16:45",
          read: false,
          productId: "iphone-002"
        }
      ]
    },
    {
      id: "user-003",
      username: "nicho12",
      password: "nicho12345",
      email: "nicho@example.com",
      fullName: "Nicholas Yang",
      phone: "08123123123",
      address: "Jl. Pemuda No. 88, Surabaya",
      profilePicture: "https://ui-avatars.com/api/?name=Nicholas+Yang&background=ff6b6b&color=fff",
      role: "seller",
      joinDate: "2024-05-20",
      // ===== KYC DATA (VERIFIED) =====
      kyc: {
        verified: true,
        status: 'verified',
        submittedDate: "2024-06-01T11:00:00.000Z",
        verifiedDate: "2024-06-02T16:30:00.000Z",
        rejectedReason: null,
        documents: {
          idType: "KTP",
          idNumber: "3578031008920003",
          fullName: "Nicholas Yang",
          dateOfBirth: "1992-08-10",
          address: "Jl. Pemuda No. 88, Surabaya, Jawa Timur 60271",
          idCardPhoto: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect fill='%23ffe8e8' width='400' height='250'/%3E%3Crect fill='%23ff6b6b' width='400' height='60'/%3E%3Ctext x='20' y='40' font-family='Arial' font-size='24' font-weight='bold' fill='white'%3EREPUBLIK INDONESIA%3C/text%3E%3Ctext x='20' y='90' font-family='Arial' font-size='12' fill='%23333'%3EPROVINSI: JAWA TIMUR%3C/text%3E%3Ctext x='20' y='110' font-family='Arial' font-size='12' fill='%23333'%3EKABUPATEN/KOTA: SURABAYA%3C/text%3E%3Ctext x='20' y='140' font-family='Arial' font-size='14' font-weight='bold' fill='%23333'%3ENIK: 3578031008920003%3C/text%3E%3Ctext x='20' y='160' font-family='Arial' font-size='12' fill='%23333'%3ENama: NICHOLAS YANG%3C/text%3E%3Ctext x='20' y='180' font-family='Arial' font-size='12' fill='%23333'%3ETempat/Tgl Lahir: SURABAYA, 10-08-1992%3C/text%3E%3Ctext x='20' y='200' font-family='Arial' font-size='12' fill='%23333'%3EJenis Kelamin: LAKI-LAKI%3C/text%3E%3Crect x='280' y='90' width='100' height='130' fill='%23ddd' stroke='%23999'/%3E%3Ctext x='300' y='160' font-family='Arial' font-size='10' fill='%23666' text-anchor='middle'%3EFOTO%3C/text%3E%3C/svg%3E",
          selfiePhoto: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect fill='%23fff0f0' width='400' height='500'/%3E%3Ccircle cx='200' cy='150' r='60' fill='%23ffcba4'/%3E%3Cellipse cx='185' cy='140' rx='8' ry='12' fill='%23333'/%3E%3Cellipse cx='215' cy='140' rx='8' ry='12' fill='%23333'/%3E%3Cpath d='M 180 165 Q 200 175 220 165' stroke='%23333' stroke-width='2' fill='none'/%3E%3Crect x='140' y='200' width='120' height='160' fill='%23ff6b6b' rx='5'/%3E%3Crect x='120' y='350' width='80' height='120' fill='%23333' rx='5'/%3E%3Crect x='200' y='350' width='80' height='120' fill='%23333' rx='5'/%3E%3Crect x='80' y='380' width='240' height='80' fill='%23ffe8e8' stroke='%23ff6b6b' stroke-width='3'/%3E%3Ctext x='200' y='410' font-family='Arial' font-size='12' fill='%23333' text-anchor='middle'%3EKTP%3C/text%3E%3Ctext x='200' y='430' font-family='Arial' font-size='10' fill='%23666' text-anchor='middle'%3E3578031008920003%3C/text%3E%3C/svg%3E",
          uploadedAt: "2024-06-01T11:00:00.000Z"
        }
      },
      notifications: [
        {
          id: "notif-kyc-verified-2",
          type: "order_completed",
          title: "Verifikasi KYC Berhasil! 🎉",
          message: "Selamat! Akun Anda telah terverifikasi. Anda sekarang dapat mengakses semua fitur premium dan mendapatkan badge verifikasi.",
          date: "02/06/2024, 16:30",
          read: true
        },
        {
          id: "notif-001",
          type: "auction_sold",
          title: "Produk Anda Telah Terjual",
          message: "Samsung Galaxy S23 Anda Terjual Seharga Rp 9.800.000",
          date: "10/10/2025, 10:15",
          read: false,
          productId: "android-001"
        }
      ]
    },
    {
      id: "user-004",
      username: "demouser",
      password: "demo12345",
      email: "demo@example.com",
      fullName: "Demo User",
      phone: "08111222333",
      address: "Jl. Demo No. 1, Jakarta",
      profilePicture: "https://ui-avatars.com/api/?name=Demo+User&background=9333ea&color=fff",
      role: "seller",
      joinDate: "2025-10-01",
      // ===== KYC DATA (UNVERIFIED - Belum Submit) =====
      kyc: null,
      notifications: [
        {
          id: "notif-welcome",
          type: "welcome",
          title: "Selamat Datang! 🎉",
          message: "Halo Demo User! Terima kasih telah bergabung dengan Klik Second. Jangan lupa verifikasi KYC untuk fitur lengkap!",
          date: "01/10/2025, 08:00",
          read: false
        }
      ]
    }
  ]
};

// ===== INITIALIZE USERS DATA IN LOCALSTORAGE =====
function initializeUsersData() {
  try {
    const storedData = localStorage.getItem('klikSecondUsers');
    
    if (!storedData) {
      // First time - save default data to localStorage
      localStorage.setItem('klikSecondUsers', JSON.stringify(defaultUsersData));
      console.log('✅ Users data initialized in localStorage');
      return defaultUsersData;
    } else {
      // Load from localStorage
      const parsedData = JSON.parse(storedData);
      console.log('✅ Users data loaded from localStorage');
      return parsedData;
    }
  } catch (e) {
    console.error('❌ Error initializing users data:', e);
    return defaultUsersData;
  }
}

// Load users data
const usersData = initializeUsersData();

// Authentication Functions (kept for backward compatibility)
class AuthSystem {
  constructor() {
    this.currentUser = this.getCurrentUser();
  }

  // Login Function
  login(username, password) {
    // Read fresh data from localStorage
    const storedData = localStorage.getItem('klikSecondUsers');
    const usersData = storedData ? JSON.parse(storedData) : { users: [] };
    
    const user = usersData.users.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      // Store user session (without password)
      const userSession = {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        address: user.address,
        profilePicture: user.profilePicture,
        role: user.role,
        joinDate: user.joinDate
      };
      
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      localStorage.setItem('isLoggedIn', 'true');
      this.currentUser = userSession;
      
      return {
        success: true,
        message: "Login berhasil!",
        user: userSession
      };
    } else {
      return {
        success: false,
        message: "Username atau password salah!"
      };
    }
  }

  // Register Function
  register(userData) {
    // Read fresh data from localStorage
    const storedData = localStorage.getItem('klikSecondUsers');
    const usersData = storedData ? JSON.parse(storedData) : { users: [] };
    
    // Check if username already exists
    const existingUser = usersData.users.find(
      u => u.username === userData.username || u.email === userData.email
    );

    if (existingUser) {
      return {
        success: false,
        message: "Username atau email sudah terdaftar!"
      };
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      username: userData.username,
      password: userData.password,
      email: userData.email,
      fullName: userData.fullName,
      phone: userData.phone,
      address: userData.address || '',
      profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=00ffff&color=000`,
      role: "seller",
      joinDate: new Date().toISOString().split('T')[0],
      kyc: null, // Belum ada KYC
      notifications: [
        {
          id: `notif-${Date.now()}`,
          type: "welcome",
          title: "Selamat Datang! 🎉",
          message: `Halo ${userData.fullName}! Terima kasih telah bergabung dengan Klik Second. Jangan lupa verifikasi KYC untuk akses penuh!`,
          date: new Date().toLocaleString('id-ID'),
          read: false
        }
      ]
    };

    // Add to users array
    usersData.users.push(newUser);
    
    // Save back to localStorage
    localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
    
    console.log('✅ New user registered:', newUser.username);

    return {
      success: true,
      message: "Registrasi berhasil! Silakan login.",
      user: newUser
    };
  }

  // Logout Function
  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    this.currentUser = null;
    window.location.href = 'index.html';
  }

  // Get Current User
  getCurrentUser() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  // Check if user is logged in
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Get User Notifications
  getUserNotifications() {
    if (!this.currentUser) return [];
    
    // Read from localStorage
    const storedData = localStorage.getItem('klikSecondUsers');
    if (!storedData) return [];
    
    const usersData = JSON.parse(storedData);
    const fullUser = usersData.users.find(u => u.id === this.currentUser.id);
    return fullUser ? fullUser.notifications : [];
  }

  // Get Unread Notification Count
  getUnreadCount() {
    const notifications = this.getUserNotifications();
    return notifications.filter(n => !n.read).length;
  }

  // Mark Notification as Read
  markAsRead(notificationId) {
    if (!this.currentUser) return;
    
    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) return;
      
      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.id === this.currentUser.id);
      
      if (user) {
        const notification = user.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.read = true;
          localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
        }
      }
    } catch (e) {
      console.error('Error marking notification as read:', e);
    }
  }

  // Mark All Notifications as Read
  markAllAsRead() {
    if (!this.currentUser) return;
    
    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) return;
      
      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.id === this.currentUser.id);
      
      if (user) {
        user.notifications.forEach(n => n.read = true);
        localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
      }
    } catch (e) {
      console.error('Error marking all as read:', e);
    }
  }

  // Add Notification
  addNotification(type, title, message, productId = null) {
    if (!this.currentUser) return;
    
    try {
      const storedData = localStorage.getItem('klikSecondUsers');
      if (!storedData) return;
      
      const usersData = JSON.parse(storedData);
      const user = usersData.users.find(u => u.id === this.currentUser.id);
      
      if (user) {
        const newNotification = {
          id: `notif-${Date.now()}`,
          type: type,
          title: title,
          message: message,
          date: new Date().toLocaleString('id-ID'),
          read: false,
          productId: productId
        };
        
        user.notifications.unshift(newNotification);
        localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
      }
    } catch (e) {
      console.error('Error adding notification:', e);
    }
  }
}

// Initialize Auth System
const authSystem = new AuthSystem();

// Export for global use
if (typeof window !== 'undefined') {
  window.authSystem = authSystem;
  window.usersData = usersData;
  console.log('✅ AuthSystem exported to window');
  console.log('✅ Users data loaded:', usersData.users.length, 'users');
  console.log('📦 Users data stored in localStorage key: klikSecondUsers');
  console.log('🛡️ KYC data included for demo users');
}

// ===== SYNC LOCALSTORAGE WITH WINDOW.USERSDATA =====
// This ensures window.usersData always reflects localStorage
setInterval(() => {
  try {
    const storedData = localStorage.getItem('klikSecondUsers');
    if (storedData && window.usersData) {
      const parsedData = JSON.parse(storedData);
      window.usersData.users = parsedData.users;
    }
  } catch (e) {
    // Ignore sync errors
  }
}, 1000); // Sync every 1 second

console.log('✅ Users.js loaded successfully');