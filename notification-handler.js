// ===== NOTIFICATION PANEL HANDLER (FIXED VERSION) =====
// File ini membaca notifikasi dari localStorage (persistent storage)

console.log('🔔 Notification handler loading...');

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
  
  console.log('📥 Loading notifications from localStorage...');
  
  // Check if SessionManager exists
  if (!window.SessionManager) {
    console.error('❌ SessionManager not found!');
    notificationList.innerHTML = `
      <div class="notification-empty">
        <i class="bi bi-bell-slash"></i>
        <p>System error: SessionManager not loaded</p>
      </div>
    `;
    return;
  }
  
  // Check if user is logged in
  const isLoggedIn = window.SessionManager.isLoggedIn();
  console.log('🔐 Is logged in:', isLoggedIn);
  
  if (!isLoggedIn) {
    notificationList.innerHTML = `
      <div class="notification-empty">
        <i class="bi bi-bell-slash"></i>
        <p>Silakan login untuk melihat notifikasi</p>
      </div>
    `;
    return;
  }
  
  // Get current user
  const currentUser = window.SessionManager.getCurrentUser();
  console.log('👤 Current user:', currentUser?.username);
  
  if (!currentUser) {
    notificationList.innerHTML = `
      <div class="notification-empty">
        <i class="bi bi-bell-slash"></i>
        <p>User data not found</p>
      </div>
    `;
    return;
  }
  
  // ===== CRITICAL FIX: Read from localStorage =====
  let usersData;
  try {
    const storedData = localStorage.getItem('klikSecondUsers');
    if (storedData) {
      usersData = JSON.parse(storedData);
      console.log('✅ Users data loaded from localStorage');
    } else {
      console.warn('⚠️ No users data in localStorage, using window.usersData');
      usersData = window.usersData;
    }
  } catch (e) {
    console.error('❌ Error reading localStorage:', e);
    usersData = window.usersData;
  }
  
  if (!usersData || !usersData.users) {
    console.error('❌ Users data not found!');
    notificationList.innerHTML = `
      <div class="notification-empty">
        <i class="bi bi-bell-slash"></i>
        <p>Data users tidak ditemukan</p>
      </div>
    `;
    return;
  }
  
  // Find user by username
  const fullUser = usersData.users.find(u => u.username === currentUser.username);
  console.log('🔍 Full user data found:', !!fullUser);
  
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
  console.log('📨 Notifications found:', notifications.length);
  
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
  
  // Display notifications
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
  
  console.log('✅ Notifications displayed successfully');
}

function getNotificationIcon(type) {
  const icons = {
    'auction_sold': 'trophy-fill',
    'product_approved': 'check-circle-fill',
    'bid_received': 'hammer',
    'welcome': 'hand-thumbs-up-fill',
    'product_rejected': 'x-circle-fill',
    'new_message': 'chat-dots-fill',
    'order_success': 'bag-check-fill',
    'order_cod': 'cash-coin',
    'order_shipped': 'truck',
    'order_delivered': 'box-seam-fill'
  };
  
  return icons[type] || 'bell-fill';
}

function handleNotificationClick(notificationId, username) {
  console.log('🖱️ Notification clicked:', notificationId);
  
  try {
    // Read from localStorage
    const storedData = localStorage.getItem('klikSecondUsers');
    if (!storedData) return;
    
    const usersData = JSON.parse(storedData);
    
    // Find user and mark notification as read
    const user = usersData.users.find(u => u.username === username);
    if (user) {
      const notification = user.notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        notification.read = true;
        
        // Save back to localStorage
        localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
        
        // Update window.usersData if exists
        if (window.usersData) {
          const windowUser = window.usersData.users.find(u => u.username === username);
          if (windowUser) {
            const windowNotif = windowUser.notifications.find(n => n.id === notificationId);
            if (windowNotif) {
              windowNotif.read = true;
            }
          }
        }
        
        console.log('✅ Notification marked as read');
      }
    }
    
    // Update badge
    updateNotificationBadge();
    
    // Reload notifications
    loadNotifications();
  } catch (e) {
    console.error('❌ Error handling notification click:', e);
  }
}

function markAllNotificationsAsRead() {
  console.log('✅ Mark all as read');
  
  if (!window.SessionManager || !window.SessionManager.isLoggedIn()) return;
  
  const currentUser = window.SessionManager.getCurrentUser();
  if (!currentUser) return;
  
  try {
    // Read from localStorage
    const storedData = localStorage.getItem('klikSecondUsers');
    if (!storedData) return;
    
    const usersData = JSON.parse(storedData);
    
    // Find user and mark all notifications as read
    const user = usersData.users.find(u => u.username === currentUser.username);
    if (user && user.notifications) {
      user.notifications.forEach(n => n.read = true);
      
      // Save back to localStorage
      localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
      
      // Update window.usersData if exists
      if (window.usersData) {
        const windowUser = window.usersData.users.find(u => u.username === currentUser.username);
        if (windowUser && windowUser.notifications) {
          windowUser.notifications.forEach(n => n.read = true);
        }
      }
      
      console.log('✅ All notifications marked as read');
    }
    
    // Update badge
    updateNotificationBadge();
    
    // Reload notifications
    loadNotifications();
  } catch (e) {
    console.error('❌ Error marking all as read:', e);
  }
}

function updateNotificationBadge() {
  if (!window.SessionManager || !window.SessionManager.isLoggedIn()) return;
  
  const currentUser = window.SessionManager.getCurrentUser();
  if (!currentUser) return;
  
  const badge = document.querySelector('.notification-badge');
  if (!badge) return;
  
  try {
    // Read from localStorage
    const storedData = localStorage.getItem('klikSecondUsers');
    let usersData;
    
    if (storedData) {
      usersData = JSON.parse(storedData);
    } else if (window.usersData) {
      usersData = window.usersData;
    } else {
      return;
    }
    
    // Find user and count unread notifications
    const user = usersData.users.find(u => u.username === currentUser.username);
    if (user && user.notifications) {
      const count = user.notifications.filter(n => !n.read).length;
      badge.textContent = count;
      
      if (count > 0) {
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
      
      console.log('🔢 Badge updated:', count, 'unread notifications');
    }
  } catch (e) {
    console.error('❌ Error updating badge:', e);
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
      console.log('🔔 Notification button clicked!');
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

// ===== WAIT FOR DEPENDENCIES =====
function waitForDependencies() {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if (window.SessionManager) {
        clearInterval(checkInterval);
        console.log('✅ Dependencies loaded');
        resolve();
      }
    }, 50); // Check every 50ms
    
    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      console.warn('⚠️ Timeout waiting for dependencies');
      resolve();
    }, 5000);
  });
}

// ===== AUTO-INITIALIZE =====
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

// ===== EXPORT FUNCTIONS =====
window.notificationHandler = {
  toggleNotificationPanel,
  loadNotifications,
  updateNotificationBadge,
  markAllNotificationsAsRead
};

console.log('✅ Notification handler loaded successfully');