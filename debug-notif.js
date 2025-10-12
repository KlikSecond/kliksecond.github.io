// ===== DEBUG SCRIPT - PASTE DI BROWSER CONSOLE =====
// Jalankan script ini di console untuk cek masalah

console.log('🔍 ===== DEBUGGING NOTIFICATION SYSTEM =====');

// 1. Cek localStorage
console.log('\n📦 1. CEK LOCALSTORAGE:');
const klikSecondUsers = localStorage.getItem('klikSecondUsers');
console.log('klikSecondUsers exists:', !!klikSecondUsers);
if (klikSecondUsers) {
  const parsed = JSON.parse(klikSecondUsers);
  console.log('Total users:', parsed.users.length);
  console.log('Users data:', parsed);
} else {
  console.error('❌ klikSecondUsers NOT FOUND in localStorage!');
}

// 2. Cek Session
console.log('\n🔐 2. CEK SESSION MANAGER:');
console.log('SessionManager exists:', !!window.SessionManager);
if (window.SessionManager) {
  console.log('Is logged in:', window.SessionManager.isLoggedIn());
  const user = window.SessionManager.getCurrentUser();
  console.log('Current user:', user);
  
  if (user && klikSecondUsers) {
    const parsed = JSON.parse(klikSecondUsers);
    const fullUser = parsed.users.find(u => u.username === user.username);
    console.log('Full user from localStorage:', fullUser);
    if (fullUser && fullUser.notifications) {
      console.log('Total notifications:', fullUser.notifications.length);
      console.log('Unread notifications:', fullUser.notifications.filter(n => !n.read).length);
      console.log('Notifications:', fullUser.notifications);
    }
  }
} else {
  console.error('❌ SessionManager NOT FOUND!');
}

// 3. Cek window.usersData
console.log('\n📊 3. CEK WINDOW.USERSDATA:');
console.log('window.usersData exists:', !!window.usersData);
if (window.usersData) {
  console.log('Total users:', window.usersData.users?.length);
  console.log('window.usersData:', window.usersData);
} else {
  console.error('❌ window.usersData NOT FOUND!');
}

// 4. Cek notification handler
console.log('\n🔔 4. CEK NOTIFICATION HANDLER:');
console.log('notificationHandler exists:', !!window.notificationHandler);
const badge = document.querySelector('.notification-badge');
console.log('Badge element exists:', !!badge);
if (badge) {
  console.log('Badge text:', badge.textContent);
  console.log('Badge display:', badge.style.display);
}

// 5. Cek notification panel
console.log('\n📋 5. CEK NOTIFICATION PANEL:');
const panel = document.getElementById('notification-panel');
console.log('Panel exists:', !!panel);
const list = document.getElementById('notification-list');
console.log('List exists:', !!list);
if (list) {
  console.log('List innerHTML:', list.innerHTML);
}

// 6. Cek script loading order
console.log('\n📜 6. CEK SCRIPT LOADING ORDER:');
const scripts = Array.from(document.querySelectorAll('script[src]'));
console.log('Loaded scripts:');
scripts.forEach((script, i) => {
  console.log(`${i + 1}. ${script.src.split('/').pop()}`);
});

// 7. Test manual add notification
console.log('\n🧪 7. TEST MANUAL ADD NOTIFICATION:');
if (window.SessionManager && window.SessionManager.isLoggedIn()) {
  const user = window.SessionManager.getCurrentUser();
  console.log('Trying to add test notification for:', user.username);
  
  try {
    const storedData = localStorage.getItem('klikSecondUsers');
    const usersData = JSON.parse(storedData);
    const fullUser = usersData.users.find(u => u.username === user.username);
    
    if (fullUser) {
      const testNotif = {
        id: `notif-test-${Date.now()}`,
        type: 'order_success',
        title: '🧪 TEST NOTIFICATION',
        message: 'Ini adalah test notification untuk debugging',
        date: new Date().toLocaleString('id-ID'),
        read: false
      };
      
      if (!fullUser.notifications) {
        fullUser.notifications = [];
      }
      fullUser.notifications.unshift(testNotif);
      
      localStorage.setItem('klikSecondUsers', JSON.stringify(usersData));
      console.log('✅ Test notification added successfully!');
      console.log('Test notification:', testNotif);
      
      // Update badge
      if (window.notificationHandler) {
        window.notificationHandler.updateNotificationBadge();
        console.log('✅ Badge updated');
      }
      
      console.log('🔄 Please reload page to see the test notification');
    }
  } catch (e) {
    console.error('❌ Error adding test notification:', e);
  }
}

console.log('\n✅ ===== DEBUGGING COMPLETE =====');
console.log('Copy semua output di atas dan kirim ke developer');