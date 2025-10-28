// ===== CS CHATBOT AI SYSTEM =====
// 24/7 Customer Service Chatbot with AI-like responses

console.log('🤖 Chatbot AI loading...');

class ChatbotAI {
  constructor() {
    this.isOpen = false;
    this.messageHistory = [];
    this.currentUser = null;
    this.isTyping = false;
    
    // Knowledge Base - Responses based on keywords
    this.knowledgeBase = {
      greeting: {
        keywords: ['halo', 'hai', 'hello', 'hi', 'pagi', 'siang', 'sore', 'malam', 'assalamualaikum'],
        responses: [
          'Halo {name}! 👋 Selamat datang di Klik Second. Ada yang bisa saya bantu?',
          'Hai {name}! 😊 Senang bisa membantu Anda hari ini. Ada pertanyaan?',
          'Halo {name}! Saya CS Klik Second siap membantu Anda 24/7. Silakan tanya apa saja!'
        ]
      },
      product: {
        keywords: ['produk', 'barang', 'hp', 'handphone', 'gadget', 'iphone', 'android', 'tablet', 'samsung', 'xiaomi'],
        responses: [
          'Kami menyediakan berbagai gadget second berkualitas seperti iPhone, Android, dan Tablet. Semua produk sudah dicek quality control dan bergaransi. Mau cari produk apa, {name}?',
          'Klik Second punya koleksi lengkap gadget second grade A hingga B+. Bisa filter berdasarkan kategori, harga, atau kondisi. Butuh rekomendasi produk tertentu?'
        ]
      },
      price: {
        keywords: ['harga', 'berapa', 'biaya', 'ongkir', 'bayar', 'payment', 'mahal', 'murah'],
        responses: [
          'Harga produk kami sangat kompetitif, {name}! Mulai dari 1 jutaan untuk Android, 10 jutaan untuk iPhone. Ada gratis ongkir untuk pembelian tertentu. Mau cek produk spesifik?',
          'Kami punya range harga yang beragam sesuai kondisi dan spesifikasi. Pembayaran bisa COD, transfer, atau cicilan 0%. Produk apa yang sedang Anda cari?'
        ]
      },
      auction: {
        keywords: ['lelang', 'bid', 'auction', 'tender'],
        responses: [
          'Fitur Lelang kami memungkinkan Anda mendapat gadget dengan harga terbaik! Deposit Rp 500rb, ikuti lelang, dan menangkan produk impian Anda. Tertarik mencoba, {name}?',
          'Lelang di Klik Second transparan dan fair. Ada countdown timer, history bid, dan notifikasi real-time. Sudah pernah ikut lelang sebelumnya?'
        ]
      },
      pawnshop: {
        keywords: ['gadai', 'pegadaian', 'pawn', 'jaminan'],
        responses: [
          'Fitur Pegadaian kami bisa mengubah gadget Anda jadi uang tunai cepat! Proses hanya 1 hari, bunga rendah, dan gadget aman. Punya gadget yang mau digadaikan, {name}?',
          'Gadai gadget di Klik Second mudah: upload foto, dapat penawaran, setuju, dan uang langsung transfer. Gadget bisa ditebus kapan saja. Butuh info lebih lanjut?'
        ]
      },
      shipping: {
        keywords: ['kirim', 'pengiriman', 'ongkir', 'ekspedisi', 'kurir', 'jne', 'jnt', 'sicepat'],
        responses: [
          'Kami pakai ekspedisi terpercaya seperti JNE, JNT, dan SiCepat. Ada gratis ongkir untuk pembelian di atas 5 juta atau dalam kota. Mau tanya estimasi ke kota mana, {name}?',
          'Pengiriman aman dengan bubble wrap dan asuransi. Estimasi 2-4 hari untuk Jawa, 3-7 hari luar Jawa. Bisa tracking real-time juga!'
        ]
      },
      warranty: {
        keywords: ['garansi', 'warranty', 'jaminan', 'rusak', 'bermasalah'],
        responses: [
          'Semua produk kami bergaransi 7 hari! Jika ada masalah hardware (bukan user error), bisa tukar atau refund. Garansi mencakup komponen utama seperti LCD, baterai, dan board. Ada kendala produk, {name}?',
          'Garansi kami melindungi Anda dari produk bermasalah. Proses klaim mudah: lapor via chat, kirim bukti, kami proses maksimal 3 hari kerja. Produk dijamin original!'
        ]
      },
      payment: {
        keywords: ['bayar', 'pembayaran', 'transfer', 'cod', 'cicil', 'kredit'],
        responses: [
          'Metode pembayaran kami lengkap, {name}! Bisa transfer bank (BCA, Mandiri, BRI, BNI), e-wallet (GoPay, OVO, Dana), COD, atau cicilan 0% via kredivo/akulaku. Pilih yang paling nyaman!',
          'Pembayaran fleksibel: transfer langsung lunas, COD bayar saat terima barang, atau cicilan 3-12 bulan tanpa bunga. Semua aman dan terpercaya!'
        ]
      },
      account: {
        keywords: ['akun', 'account', 'daftar', 'register', 'login', 'password', 'lupa'],
        responses: [
          'Untuk transaksi, Anda perlu akun Klik Second, {name}. Daftar gratis, isi data diri, dan langsung bisa belanja atau jual. Sudah punya akun? Kalau lupa password, bisa reset via email.',
          'Akun Klik Second memberikan akses ke histori transaksi, wishlist, notifikasi lelang, dan tracking order. Belum daftar? Yuk buat akun sekarang!'
        ]
      },
      condition: {
        keywords: ['kondisi', 'grade', 'kualitas', 'mulus', 'lecet', 'bekas'],
        responses: [
          'Kami kategorikan kondisi produk dengan grade:\n• Grade A: Mulus 95-100%, no minus\n• Grade B+: Minor scratch 85-94%\n• Grade B: Bekas pakai normal 75-84%\n\nSemua sudah QC ketat, {name}!',
          'Setiap produk ada foto detail dan deskripsi kondisi lengkap. Grade A paling mulus, Grade B+ ada goresan minor, Grade B bekas pakai wajar. Transparansi adalah prioritas kami!'
        ]
      },
      contact: {
        keywords: ['kontak', 'hubungi', 'contact', 'cs', 'admin', 'whatsapp', 'email', 'telepon'],
        responses: [
          'Selain chat ini, Anda bisa hubungi kami via:\n📱 WhatsApp: 0812-3456-7890\n📧 Email: cs@kliksecond.com\n📞 Telepon: (021) 1234-5678\n\nOperasional 24/7, {name}! 🕐',
          'Tim CS kami siap membantu kapan saja! Chat ini otomatis, tapi untuk masalah kompleks bisa langsung WA atau email. Response time maksimal 15 menit di jam kerja.'
        ]
      },
      location: {
        keywords: ['alamat', 'lokasi', 'toko', 'store', 'showroom', 'dimana'],
        responses: [
          'Klik Second beroperasi online, tapi kami punya showroom di:\n📍 Jakarta Pusat - Jl. Sudirman No. 123\n📍 Bandung - Jl. Dago No. 456\n📍 Surabaya - Jl. Tunjungan No. 789\n\nBisa COD atau lihat produk langsung, {name}!',
          'Selain online, Anda bisa kunjungi showroom kami untuk lihat produk langsung. Buka Senin-Minggu 09:00-21:00. Ada staff yang siap bantu demo dan QnA!'
        ]
      },
      sell: {
        keywords: ['jual', 'sell', 'upload', 'posting', 'iklan'],
        responses: [
          'Mau jual gadget Anda, {name}? Mudah kok!\n1. Login/Daftar\n2. Klik tombol "+" Upload\n3. Isi detail produk + foto\n4. Tunggu verifikasi (maks 1 hari)\n5. Produk tayang dan bisa dilihat pembeli!\n\nGratis tanpa biaya admin!',
          'Jual gadget di Klik Second untung banyak! Fee hanya 5% dari harga jual, dapat exposure luas, dan pembayaran aman via escrow. Sudah siap upload produk?'
        ]
      },
      thanks: {
        keywords: ['terima kasih', 'thank', 'makasih', 'thx', 'tengkyu'],
        responses: [
          'Sama-sama, {name}! 😊 Senang bisa membantu. Ada yang bisa saya bantu lagi?',
          'Terima kasih kembali, {name}! Jangan ragu chat lagi kalau ada pertanyaan ya! 🙏',
          'You\'re welcome, {name}! Semoga pengalaman belanja di Klik Second menyenangkan! 🌟'
        ]
      },
      default: {
        keywords: [],
        responses: [
          'Hmm, saya kurang paham pertanyaan Anda, {name}. Bisa dijelaskan lebih detail? Atau pilih topik di bawah ini:',
          'Maaf {name}, saya butuh info lebih jelas. Mau tanya tentang produk, harga, pengiriman, atau yang lain?'
        ]
      }
    };
    
    // Quick reply suggestions
    this.quickReplies = [
      { text: '📱 Lihat Produk', action: 'products' },
      { text: '💰 Info Harga', action: 'price' },
      { text: '🚚 Pengiriman', action: 'shipping' },
      { text: '⚡ Lelang', action: 'auction' },
      { text: '💎 Pegadaian', action: 'pawnshop' },
      { text: '✅ Garansi', action: 'warranty' }
    ];
  }

  // Initialize chatbot
  init() {
    this.createChatbotWidget();
    this.attachEventListeners();
    this.checkUserLogin();
    console.log('✅ Chatbot AI initialized');
  }

  // Create chatbot HTML structure
  createChatbotWidget() {
    const widget = document.createElement('div');
    widget.className = 'chatbot-widget';
    widget.innerHTML = `
      <button class="chatbot-toggle" id="chatbot-toggle">
        <i class="bi bi-chat-dots-fill"></i>
        <i class="bi bi-x-lg"></i>
        <span class="chatbot-notification-badge" style="display: none;">1</span>
      </button>

      <div class="chatbot-window" id="chatbot-window">
        <div class="chatbot-header">
          <div class="chatbot-avatar">
            <i class="bi bi-robot"></i>
          </div>
          <div class="chatbot-info">
            <h4>CS Klik Second</h4>
            <p><i class="bi bi-circle-fill"></i> Online 24/7</p>
          </div>
          <button class="chatbot-minimize" id="chatbot-minimize">
            <i class="bi bi-dash-lg"></i>
          </button>
        </div>

        <div class="chatbot-messages" id="chatbot-messages">
          <!-- Messages will be added here -->
        </div>

        <div class="chatbot-input-area">
          <input 
            type="text" 
            class="chatbot-input" 
            id="chatbot-input" 
            placeholder="Ketik pesan Anda..."
            autocomplete="off"
          >
          <button class="chatbot-send-btn" id="chatbot-send-btn">
            <i class="bi bi-send-fill"></i>
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(widget);
  }

  // Attach event listeners
  attachEventListeners() {
    const toggle = document.getElementById('chatbot-toggle');
    const minimize = document.getElementById('chatbot-minimize');
    const sendBtn = document.getElementById('chatbot-send-btn');
    const input = document.getElementById('chatbot-input');

    toggle.addEventListener('click', () => this.toggleChat());
    minimize.addEventListener('click', () => this.toggleChat());
    sendBtn.addEventListener('click', () => this.sendMessage());
    
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });

    // Hide notification badge when chat opened
    toggle.addEventListener('click', () => {
      const badge = document.querySelector('.chatbot-notification-badge');
      if (badge) badge.style.display = 'none';
    });
  }

  // Check if user is logged in
  checkUserLogin() {
    if (window.SessionManager && window.SessionManager.isLoggedIn()) {
      this.currentUser = window.SessionManager.getCurrentUser();
      this.showWelcomeMessage();
    } else {
      this.currentUser = null;
    }
  }

  // Toggle chat window
  toggleChat() {
    this.isOpen = !this.isOpen;
    const window = document.getElementById('chatbot-window');
    const toggle = document.getElementById('chatbot-toggle');
    
    if (this.isOpen) {
      window.classList.add('active');
      toggle.classList.add('active');
      
      // Check login status when opening
      this.checkUserLogin();
      
      // If not logged in, show login prompt
      if (!this.currentUser) {
        this.showLoginPrompt();
      } else if (this.messageHistory.length === 0) {
        this.showWelcomeMessage();
      }
    } else {
      window.classList.remove('active');
      toggle.classList.remove('active');
    }
  }

  // Show login prompt
  showLoginPrompt() {
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.innerHTML = `
      <div class="login-prompt">
        <i class="bi bi-person-lock"></i>
        <h3>Login Diperlukan</h3>
        <p>Untuk menggunakan layanan Customer Service kami, silakan login terlebih dahulu. Kami siap membantu Anda 24/7!</p>
        <button class="login-prompt-btn" onclick="chatbot.handleLoginClick()">
          <i class="bi bi-box-arrow-in-right"></i>
          Login Sekarang
        </button>
      </div>
    `;
    
    // Disable input
    document.getElementById('chatbot-input').disabled = true;
    document.getElementById('chatbot-send-btn').disabled = true;
  }

  // Handle login button click
  handleLoginClick() {
    this.toggleChat();
    
    // Open auth modal (from auth-handler.js)
    if (typeof openAuthModal === 'function') {
      openAuthModal('login');
    } else {
      // Fallback: trigger login button
      const loginBtn = document.querySelector('.btn-login');
      if (loginBtn) loginBtn.click();
    }
  }

  // Show welcome message
  showWelcomeMessage() {
    const messagesContainer = document.getElementById('chatbot-messages');
    
    // Enable input
    document.getElementById('chatbot-input').disabled = false;
    document.getElementById('chatbot-send-btn').disabled = false;
    
    // Clear login prompt
    messagesContainer.innerHTML = '';
    
    // Only show welcome if no message history
    if (this.messageHistory.length === 0) {
      const userName = this.currentUser ? this.currentUser.fullname : 'Customer';
      const welcomeMessage = `Halo ${userName}! 👋\n\nSelamat datang di Customer Service Klik Second. Saya siap membantu Anda 24/7.\n\nAda yang bisa saya bantu hari ini?`;
      
      this.addMessage('bot', welcomeMessage, true);
      this.showQuickReplies();
    }
  }

  // Add message to chat
  addMessage(sender, text, skipHistory = false) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    const avatar = sender === 'bot' 
      ? '<div class="message-avatar"><i class="bi bi-robot"></i></div>'
      : `<div class="message-avatar"><i class="bi bi-person-fill"></i></div>`;
    
    messageDiv.innerHTML = `
      ${avatar}
      <div class="message-content">
        <div class="message-bubble">${text.replace(/\n/g, '<br>')}</div>
        <div class="message-time">${time}</div>
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    if (!skipHistory) {
      this.messageHistory.push({ sender, text, time });
    }
  }

  // Show quick replies
  showQuickReplies() {
    const messagesContainer = document.getElementById('chatbot-messages');
    
    const quickRepliesDiv = document.createElement('div');
    quickRepliesDiv.className = 'chat-message bot';
    quickRepliesDiv.innerHTML = `
      <div class="message-avatar"><i class="bi bi-robot"></i></div>
      <div class="message-content">
        <div class="quick-replies">
          ${this.quickReplies.map(reply => 
            `<button class="quick-reply-btn" onclick="chatbot.handleQuickReply('${reply.action}')">${reply.text}</button>`
          ).join('')}
        </div>
      </div>
    `;
    
    messagesContainer.appendChild(quickRepliesDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Handle quick reply click
  handleQuickReply(action) {
    const actionMap = {
      'products': 'Saya ingin lihat produk yang tersedia',
      'price': 'Bagaimana dengan harga produknya?',
      'shipping': 'Bagaimana sistem pengirimannya?',
      'auction': 'Saya tertarik dengan fitur lelang',
      'pawnshop': 'Ceritakan tentang fitur pegadaian',
      'warranty': 'Bagaimana dengan garansi produk?'
    };
    
    const message = actionMap[action] || action;
    
    // Add user message
    this.addMessage('user', message);
    
    // Get bot response
    this.getBotResponse(message);
  }

  // Send user message
  sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Check if logged in
    if (!this.currentUser) {
      this.showLoginPrompt();
      return;
    }
    
    // Clear input
    input.value = '';
    
    // Add user message
    this.addMessage('user', message);
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Simulate bot thinking time (500-1500ms)
    const thinkingTime = Math.random() * 1000 + 500;
    
    setTimeout(() => {
      this.hideTypingIndicator();
      this.getBotResponse(message);
    }, thinkingTime);
  }

  // Show typing indicator
  showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'chat-message bot';
    typingDiv.innerHTML = `
      <div class="message-avatar"><i class="bi bi-robot"></i></div>
      <div class="message-content">
        <div class="typing-indicator active">
          <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        </div>
      </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Hide typing indicator
  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  // Get bot response based on message
  getBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    let response = null;
    let showQuickReplies = false;
    
    // Find matching category
    for (const [category, data] of Object.entries(this.knowledgeBase)) {
      if (category === 'default') continue;
      
      const hasKeyword = data.keywords.some(keyword => 
        message.includes(keyword)
      );
      
      if (hasKeyword) {
        // Random response from category
        const randomIndex = Math.floor(Math.random() * data.responses.length);
        response = data.responses[randomIndex];
        
        // Show quick replies for greeting
        if (category === 'greeting') {
          showQuickReplies = true;
        }
        
        break;
      }
    }
    
    // Default response if no match
    if (!response) {
      const defaultResponses = this.knowledgeBase.default.responses;
      response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      showQuickReplies = true;
    }
    
    // Replace {name} placeholder
    const userName = this.currentUser ? this.currentUser.fullname.split(' ')[0] : 'Customer';
    response = response.replace(/{name}/g, userName);
    
    // Add bot response
    this.addMessage('bot', response);
    
    // Show quick replies if needed
    if (showQuickReplies) {
      setTimeout(() => {
        this.showQuickReplies();
      }, 300);
    }
  }
}

// Initialize chatbot when DOM is ready
let chatbot;

function initChatbot() {
  chatbot = new ChatbotAI();
  chatbot.init();
  
  // Listen for login events to update chatbot
  document.addEventListener('userLoggedIn', () => {
    if (chatbot.isOpen) {
      chatbot.checkUserLogin();
    }
  });
  
  console.log('✅ Chatbot ready to serve!');
}

// Safe initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatbot);
} else {
  initChatbot();
}

// Export for global access
window.chatbot = chatbot;