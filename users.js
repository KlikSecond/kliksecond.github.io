// ===== USER DATA & AUTHENTICATION SYSTEM =====
console.log('🔧 Users.js loaded');

const usersData = {
  users: [
    {
      id: "user-001",
      username: "kelvingacor",
      password: "kelvin12345",
      email: "admin@kliksecond.com",
      fullName: "Kelvin Ganteng",
      phone: "08123456789",
      address: "Jakarta Pusat",
      profilePicture: "https://ui-avatars.com/api/?name=Kelvin+Ganteng&background=00ffff&color=000",
      role: "seller",
      joinDate: "2024-01-01",
      notifications: [
        {
          id: "notif-001",
          type: "auction_sold",
          title: "Lelang Berhasil",
          message: "POCO C75 Anda telah terjual dengan harga Rp 2.240.000",
          date: "2025-10-02 10:24",
          read: false,
          productId: "android-001"
        },
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
          id: "notif-001",
          type: "auction_sold",
          title: "Produk Anda Telah Terjual",
          message: "Samsung Galaxy S23 Rp 9.800.000",
          date: "2025-10-10 10:45",
          read: false,
          productId: "android-001"
        },
        {
          id: "notif-002",
          type: "product_approved",
          title: "Produk Disetujui",
          message: "Samsung Galaxy S23 Anda telah diverifikasi dan ditampilkan di katalog",
          date: "2025-10-02 10:15",
          read: false,
          productId: "android-001"
        }
      ]
    }
  ]
};

// Authentication Functions
class AuthSystem {
  constructor() {
    this.currentUser = this.getCurrentUser();
  }

  // Login Function
  login(username, password) {
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
      address: userData.address,
      profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=00ffff&color=000`,
      role: "seller",
      joinDate: new Date().toISOString().split('T')[0],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          type: "welcome",
          title: "Selamat Datang!",
          message: "Terima kasih telah bergabung dengan Klik Second",
          date: new Date().toLocaleString('id-ID'),
          read: false
        }
      ]
    };

    usersData.users.push(newUser);

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
    
    const user = usersData.users.find(u => u.id === this.currentUser.id);
    if (user) {
      const notification = user.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    }
  }

  // Mark All Notifications as Read
  markAllAsRead() {
    if (!this.currentUser) return;
    
    const user = usersData.users.find(u => u.id === this.currentUser.id);
    if (user) {
      user.notifications.forEach(n => n.read = true);
    }
  }

  // Add Notification
  addNotification(type, title, message, productId = null) {
    if (!this.currentUser) return;
    
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
    }
  }
}

// Initialize Auth System
const authSystem = new AuthSystem();

// Export for global use
if (typeof window !== 'undefined') {
  window.authSystem = authSystem;
  window.usersData = usersData;
  console.log('✅ AuthSystem exported to window:', window.authSystem);
  console.log('✅ Users data loaded:', usersData.users.length, 'users');
}