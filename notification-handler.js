// ===== NOTIFICATION PANEL HANDLER =====

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
  const notifications = authSystem.getUserNotifications();
  
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
  notifications.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  notificationList.innerHTML = notifications.map(notif => `
    <div class="notification-item ${notif.read ? '' : 'unread'}" onclick="handleNotificationClick('${notif.id}')">
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

function handleNotificationClick(notificationId) {
  // Mark as read
  authSystem.markAsRead(notificationId);
  
  // Update badge
  updateNotificationBadge();
  
  // Reload notifications
  loadNotifications();
  
  // You can add navigation to related product/page here
}

function markAllNotificationsAsRead() {
  authSystem.markAllAsRead();
  updateNotificationBadge();
  loadNotifications();
  
  showNotification('Notifikasi', 'Semua notifikasi telah ditandai sebagai dibaca', 'success');
}

// Initialize notification panel
document.addEventListener('DOMContentLoaded', function() {
  const closeNotifBtn = document.querySelector('.close-notification');
  const markAllReadBtn = document.querySelector('.mark-all-read');
  
  if (closeNotifBtn) {
    closeNotifBtn.addEventListener('click', closeNotificationPanel);
  }
  
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', markAllNotificationsAsRead);
  }
});a