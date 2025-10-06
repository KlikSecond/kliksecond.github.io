// ===== NOTIFICATION PANEL HANDLER (FIXED) =====

function toggleNotificationPanel() {
  const panel = document.getElementById('notification-panel');
  
  if (panel.classList.contains('active')) {
    closeNotificationPanel();
  } else {
    openNotificationPanel();
  }
}

function openNotificationPanel() {
  const panel = document.getElementById('notification-panel');
  panel.classList.add('active');
  
  // Load notifications
  loadNotifications();
  
  // Close when clicking outside
  setTimeout(() => {
    document.addEventListener('click', closeNotificationOnClickOutside);
  }, 100);
}

function closeNotificationPanel() {
  const panel = document.getElementById('notification-panel');
  panel.classList.remove('active');
  document.removeEventListener('click', closeNotificationOnClickOutside);
}

function closeNotificationOnClickOutside(e) {
  const panel = document.getElementById('notification-panel');
  const notificationBtn = document.querySelector('.notification-btn');
  
  if (!panel.contains(e.target) && !notificationBtn.contains(e.target)) {
    closeNotificationPanel();
  }
}

function loadNotifications() {
  const notificationList = document.getElementById('notification-list');
  
  console.log('Loading notifications...');
  
  // ===== FIX: Gunakan SessionManager untuk cek login =====
  if (!window.SessionManager) {
    console.error('SessionManager not found!');
    notificationList.innerHTML = `
      <div class="notification-empty">
        <i class="bi bi-bell-slash"></i>
        <p>System error: SessionManager not loaded</p>
      </div>
    `;
    return;
  }
  
  // Cek apakah user sudah login
  const isLoggedIn = window.SessionManager.isLoggedIn();
  console.log('Is logged in:', isLoggedIn);
  
  if (!isLoggedIn) {
    notificationList.innerHTML = `
      <div class="notification-empty">
        <i class="bi bi-bell-slash"></i>
        <p>Silakan login untuk melihat notifikasi</p>
      </div>
    `;
    return;
  }
  
  // Ambil data user yang sedang login
  const currentUser = window.SessionManager.getCurrentUser();
  console.log('Current user:', currentUser);
  
  if (!currentUser) {
    notificationList.innerHTML = `
      <div class="notification-empty">
        <i class="bi bi-bell-slash"></i>
        <p>User data not found</p>
      </div>
    `;
    return;
  }
  
  // ===== FIX: Ambil notifikasi dari usersData berdasarkan username =====
  if (!window.usersData || !window.usersData.users) {
    console.error('usersData not found!');
    notificationList.innerHTML = `
      <div class="notification-empty">
        <i class="bi bi-bell-slash"></i>
        <p>Data users tidak ditemukan</p>
      </div>
    `;
    return;
  }
  
  // Cari user berdasarkan username
  const fullUser = window.usersData.users.find(u => u.username === currentUser.username);
  console.log('Full user data:', fullUser);
  
  if (!fullUser || !fullUser.notifications) {
    notificationList.innerHTML = `
      <div class="notification-empty">
        <i class="bi bi-bell-slash"></i>
        <p>Belum ada notifikasi</p>
      </div>
    `;
    return;
  }
  
  const notifications = fullUser.notifications;
  console.log('Notifications found:', notifications.length);
  
  if (notifications.length === 0) {
    notificationList.innerHTML = `
      <div class="notification-empty">
        <i class="bi bi-bell-slash"></i>
        <p>Belum ada notifikasi</p>
      </div>
    `;
    return;
  }
  
  // Sort by date (newest first)
  notifications.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });
  
  notificationList.innerHTML = notifications.map(notif => `
    <div class="notification-item ${notif.read ? '' : 'unread'}" onclick="handleNotificationClick('${notif.id}', '${currentUser.username}')">
      <div class="notification-icon ${notif.type}">
        <i class="bi bi-${getNotificationIcon(notif.type)}"></i>
      </div>
      <div class="notification-content">
        <div class="notification-title">${notif.title}</div>
        <div class="notification-message">${notif.message}</div>
        <div class="notification-date">
          <i class="bi bi-clock"></i>
          ${notif.date}
        </div>
      </div>
    </div>
  `).join('');
}

function getNotificationIcon(type) {
  const icons = {
    'auction_sold': 'trophy-fill',
    'product_approved': 'check-circle-fill',
    'bid_received': 'hammer',
    'welcome': 'hand-thumbs-up-fill',
    'product_rejected': 'x-circle-fill',
    'new_message': 'chat-dots-fill'
  };
  
  return icons[type] || 'bell-fill';
}

function handleNotificationClick(notificationId, username) {
  console.log('Notification clicked:', notificationId);
  
  if (!window.usersData) return;
  
  // Cari user dan mark notification as read
  const user = window.usersData.users.find(u => u.username === username);
  if (user) {
    const notification = user.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      console.log('Notification marked as read');
    }
  }
  
  // Update badge
  updateNotificationBadge();
  
  // Reload notifications
  loadNotifications();
}

function markAllNotificationsAsRead() {
  console.log('Mark all as read');
  
  if (!window.SessionManager || !window.SessionManager.isLoggedIn()) return;
  
  const currentUser = window.SessionManager.getCurrentUser();
  if (!currentUser) return;
  
  const user = window.usersData.users.find(u => u.username === currentUser.username);
  if (user && user.notifications) {
    user.notifications.forEach(n => n.read = true);
    console.log('All notifications marked as read');
  }
  
  updateNotificationBadge();
  loadNotifications();
}

function updateNotificationBadge() {
  if (!window.SessionManager || !window.SessionManager.isLoggedIn()) return;
  
  const currentUser = window.SessionManager.getCurrentUser();
  if (!currentUser) return;
  
  const badge = document.querySelector('.notification-badge');
  if (badge && window.usersData) {
    const user = window.usersData.users.find(u => u.username === currentUser.username);
    if (user && user.notifications) {
      const count = user.notifications.filter(n => !n.read).length;
      badge.textContent = count;
      
      if (count > 0) {
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
      
      console.log('Badge updated:', count, 'unread notifications');
    }
  }
}

// ===== INITIALIZE NOTIFICATION PANEL =====
function initializeNotificationPanel() {
  console.log('🔔 Initializing notification panel...');
  
  // Get elements
  const notificationBtn = document.querySelector('.notification-btn');
  const closeNotifBtn = document.querySelector('.close-notification');
  const markAllReadBtn = document.querySelector('.mark-all-read');
  
  // Attach click listener to notification button
  if (notificationBtn) {
    notificationBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      console.log('Notification button clicked!');
      toggleNotificationPanel();
    });
    console.log('✅ Notification button listener attached');
  } else {
    console.error('❌ Notification button not found!');
  }
  
  // Attach close button
  if (closeNotifBtn) {
    closeNotifBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      closeNotificationPanel();
    });
  }
  
  // Attach mark all read button
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      markAllNotificationsAsRead();
    });
  }
  
  // Update badge on init
  updateNotificationBadge();
  
  console.log('✅ Notification panel initialized');
}

// ===== FIX: Tunggu semua dependencies loaded =====
function waitForDependencies() {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if (window.SessionManager && window.usersData) {
        clearInterval(checkInterval);
        console.log('✅ All dependencies loaded');
        resolve();
      }
    }, 50); // Check every 50ms
    
    // Timeout setelah 5 detik
    setTimeout(() => {
      clearInterval(checkInterval);
      console.warn('⚠️ Timeout waiting for dependencies');
      resolve();
    }, 5000);
  });
}

// Initialize setelah dependencies ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async function() {
    await waitForDependencies();
    initializeNotificationPanel();
  });
} else {
  waitForDependencies().then(() => {
    initializeNotificationPanel();
  });
}

// Export functions
window.notificationHandler = {
  toggleNotificationPanel,
  loadNotifications,
  updateNotificationBadge,
  markAllNotificationsAsRead
};