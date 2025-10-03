// ===== PARTICLES.JS CONFIGURATION =====
particlesJS("particles-js", {
  particles: {
    number: { value: 80 },
    color: { value: "#00ffff" },
    shape: { type: "circle" },
    opacity: { value: 0.5 },
    size: { value: 3 },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#00ffff",
      opacity: 0.4,
      width: 1
    },
    move: { enable: true, speed: 2 }
  },
  interactivity: {
    events: {
      onhover: { enable: true, mode: "grab" },
      resize: true
    },
    modes: {
      grab: { distance: 140, line_linked: { opacity: 1 } }
    }
  },
  retina_detect: true
});

// ===== GET PRODUCT DATA =====
function getAllProducts() {
  // Get products from products-loader.js
  if (window.productsData) {
    return [
      ...window.productsData.tablets,
      ...window.productsData.android,
      ...window.productsData.iphone
    ];
  }
  return [];
}

// ===== GET PRODUCT BY ID =====
function getProductById(productId) {
  const allProducts = getAllProducts();
  return allProducts.find(product => product.id === productId);
}

// ===== FORMAT PRICE =====
function formatPrice(price) {
  return new Intl.NumberFormat('id-ID').format(price);
}

// ===== RENDER STARS =====
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let starsHtml = '';
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="bi bi-star-fill"></i>';
  }
  
  // Half star
  if (hasHalfStar) {
    starsHtml += '<i class="bi bi-star-half"></i>';
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="bi bi-star"></i>';
  }
  
  return starsHtml;
}

// ===== UPDATE MAIN IMAGE =====
function updateMainImage(imageSrc) {
  const mainImage = document.getElementById('product-image');
  if (mainImage) {
    mainImage.src = imageSrc;
    
    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.image-thumbnails img');
    thumbnails.forEach(thumb => {
      if (thumb.src === imageSrc) {
        thumb.classList.add('active');
      } else {
        thumb.classList.remove('active');
      }
    });
  }
}

// ===== LOAD PRODUCT DETAILS =====
function loadProductDetails() {
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (!productId) {

  }
  
  // Get product data
  const product = getProductById(productId);
  
  if (!product) {

  }
  
  // Update page title
  document.title = `${product.name} - Klik Second`;
  
  // Update breadcrumb
  document.getElementById('product-category').textContent = product.category;
  document.getElementById('product-name-breadcrumb').textContent = product.name;
  
  // Update product name
  document.getElementById('product-name').textContent = product.name;
  
  // Update rating
  document.getElementById('product-rating').innerHTML = renderStars(product.rating);
  document.getElementById('rating-value').textContent = product.rating;
  document.getElementById('reviews-count').textContent = product.reviews;
  
  // Update price
  document.querySelector('#product-price span').textContent = formatPrice(product.price);
  
  // Update specs
  document.getElementById('product-condition').textContent = product.condition;
  document.getElementById('product-battery').textContent = product.battery;
  document.getElementById('product-storage').textContent = product.storage;
  document.getElementById('product-usage').textContent = product.usage;
  document.getElementById('product-grade').textContent = `Grade ${product.grade}`;
  
  // Update seller info
  document.getElementById('seller-name').textContent = product.seller;
  document.getElementById('seller-rating').textContent = product.rating;
  
  // Update shipping info
  document.getElementById('product-shipping').textContent = product.shipping;
  document.getElementById('product-location').textContent = product.city;
  
  // Update description
  const descriptionContent = `
    <p><strong>${product.name}</strong> adalah gadget berkualitas tinggi yang tersedia di Klik Second dengan kondisi ${product.condition.toLowerCase()}.</p>
    
    <p><strong>Detail Produk:</strong></p>
    <ul>
      <li>Kategori: ${product.category}</li>
      <li>Kondisi: ${product.condition}</li>
      <li>Grade: ${product.grade}</li>
      <li>Kapasitas Penyimpanan: ${product.storage}</li>
      <li>Health Battery: ${product.battery}</li>
      <li>Lama Pemakaian: ${product.usage}</li>
    </ul>
    
    <p><strong>Keunggulan Produk:</strong></p>
    <ul>
      <li>✅ Produk Original & Bergaransi</li>
      <li>✅ Sudah Dicek Quality Control</li>
      <li>✅ Free Ongkir untuk wilayah tertentu</li>
      <li>✅ Kemasan Aman & Rapi</li>
      <li>✅ Bisa COD & Cicilan 0%</li>
    </ul>
    
    <p><strong>Yang Didapatkan:</strong></p>
    <ul>
      <li>📦 Unit ${product.name}</li>
      <li>📦 Charger Original</li>
      <li>📦 Kabel Data</li>
      <li>📦 Box Original</li>
      <li>📦 Manual Book & Kartu Garansi</li>
    </ul>
    
    <p><em>Catatan: Pastikan untuk memeriksa produk saat diterima. Jika ada kendala, segera hubungi kami untuk pengembalian atau penggantian.</em></p>
  `;
  document.getElementById('product-description').innerHTML = descriptionContent;
  
  // Load images
  const mainImage = document.getElementById('product-image');
  const thumbnailsContainer = document.getElementById('thumbnails-container');
  
  if (product.images && product.images.length > 0) {
    // Set main image
    mainImage.src = product.images[0];
    mainImage.alt = product.name;
    
    // Clear and add thumbnails
    thumbnailsContainer.innerHTML = '';
    product.images.forEach((image, index) => {
      const thumbnail = document.createElement('img');
      thumbnail.src = image;
      thumbnail.alt = `${product.name} - Image ${index + 1}`;
      thumbnail.onclick = () => updateMainImage(image);
      
      // Mark first thumbnail as active
      if (index === 0) {
        thumbnail.classList.add('active');
      }
      
      thumbnailsContainer.appendChild(thumbnail);
    });
  }
  
  // Store product data for cart functionality
  window.currentProduct = product;
}

// ===== CART FUNCTIONALITY =====
let cart = [];

function addToCart() {
  if (!window.currentProduct) {
    alert('Produk tidak ditemukan!');
    return;
  }
  
  cart.push(window.currentProduct);
  alert(`${window.currentProduct.name} berhasil ditambahkan ke keranjang!`);
  console.log('Cart:', cart);
  
  // In a real application, you would save to localStorage or send to backend
  // localStorage.setItem('cart', JSON.stringify(cart));
}

function buyNow() {
  if (!window.currentProduct) {
    alert('Produk tidak ditemukan!');
    return;
  }
  
  alert(`Proses pembelian ${window.currentProduct.name}. Anda akan diarahkan ke halaman checkout.`);
  console.log('Buying:', window.currentProduct);
  
  // In a real application, you would redirect to checkout page
  // window.location.href = `checkout.html?id=${window.currentProduct.id}`;
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for products-loader.js to load
  setTimeout(() => {
    loadProductDetails();
  }, 100);
});

const slides = document.querySelectorAll('.slider .slide');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
let currentSlide = 0;
let autoSlideInterval;

// Fungsi untuk menampilkan slide
function showSlide(index, direction = null) {
  const outgoingSlide = slides[currentSlide];
  const incomingSlide = slides[index];

  slides.forEach((slide) => {
    slide.classList.remove('active', 'exit-left', 'exit-right', 'enter-from-left', 'enter-from-right');
  });

  if (direction === 'next') {
    // Posisi awal masuk dari kanan
    incomingSlide.classList.add('enter-from-right');
    setTimeout(() => {
      incomingSlide.classList.remove('enter-from-right');
      incomingSlide.classList.add('active');
      outgoingSlide.classList.add('exit-left');
    }, 20);
  } else if (direction === 'prev') {
    // Posisi awal masuk dari kiri
    incomingSlide.classList.add('enter-from-left');
    setTimeout(() => {
      incomingSlide.classList.remove('enter-from-left');
      incomingSlide.classList.add('active');
      outgoingSlide.classList.add('exit-right');
    }, 20);
  } else {
    // Load awal
    incomingSlide.classList.add('active');
  }

  currentSlide = index;
}

// Fungsi tombol Next
nextBtn.addEventListener('click', () => {
  let nextIndex = (currentSlide + 1) % slides.length;
  showSlide(nextIndex, 'next');
  resetAutoSlide();
});

// Fungsi tombol Previous
prevBtn.addEventListener('click', () => {
  let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(prevIndex, 'prev');
  resetAutoSlide();
});

// Fungsi autoplay
function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    let nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex, 'next');
  }, 10000); // 10 detik
}

// Fungsi untuk reset saat user klik manual
function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

// Inisialisasi pertama
showSlide(currentSlide);
startAutoSlide();