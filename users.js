// ===== USER DATA & AUTHENTICATION SYSTEM (FIXED VERSION) =====
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
      fullName: "Hasbi",
      phone: "08123456789",
      address: "Jakarta Pusat",
      profilePicture: "https://ui-avatars.com/api/?name=Hasbi&background=00ffff&color=000",
      role: "seller",
      joinDate: "2024-01-01",
      notifications: [
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
      email: "john@example.com",
      fullName: "Riven Kristian",
      phone: "08198765432",
      address: "Bandung",
      profilePicture: "https://ui-avatars.com/api/?name=Riven+Kristian&background=4169e1&color=fff",
      role: "seller",
      joinDate: "2024-03-15",
      notifications: [
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
      email: "seller@example.com",
      fullName: "Nicholas Yang",
      phone: "08123123123",
      address: "Surabaya",
      profilePicture: "https://ui-avatars.com/api/?name=Nicholas+Yang&background=ff6b6b&color=fff",
      role: "seller",
      joinDate: "2024-05-20",
      notifications: [
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
      notifications: [
        {
          id: `notif-${Date.now()}`,
          type: "welcome",
          title: "Selamat Datang! 🎉",
          message: `Halo ${userData.fullName}! Terima kasih telah bergabung dengan Klik Second. Mulai jual atau beli gadget favoritmu sekarang!`,
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