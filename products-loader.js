// ===== LOAD PRODUCTS FROM JSON =====
const productsData = {
  // ===== BANNER PRODUCTS (Featured) - CRITICAL FOR BANNER BUTTONS =====
  "banner": [
    {
      "id": "banner-iphone-15-pro-max",  // ⭐ ID ini harus match dengan data-product-id
      "name": "iPhone 15 Pro Max",
      "price": 17200000,
      "city": "Jakarta",
      "category": "iPhone",
      "grade": "A",
      "battery": "90%",
      "storage": "8GB + 256GB",
      "condition": "Fullset no minus",
      "usage": "3-4 bulan pemakaian",
      "images": [
        "https://images.tokopedia.net/img/cache/700/VqbcmM/2023/10/27/e692ce96-2164-4c9c-9f58-b8dda1ef3037.jpg",
        "https://asset.kompas.com/crops/d9bQyjdtuHm9-sMgpDtT8rUsnu4=/46x0:910x576/1200x800/data/photo/2023/09/13/6500fef74d9db.jpg",
        "https://images.tokopedia.net/img/cache/700/VqbcmM/2023/10/27/e692ce96-2164-4c9c-9f58-b8dda1ef3037.jpg"
      ],
      "seller": "Apple Premium Store Jakarta",
      "rating": 4.9,
      "reviews": 2150,
      "shipping": "Gratis Ongkir"
    },
    {
      "id": "banner-infinix-hot-40-pro",  // ⭐ ID ini harus match dengan data-product-id
      "name": "Infinix Hot 40 Pro",
      "price": 1900000,
      "city": "Surabaya",
      "category": "Android",
      "grade": "A",
      "battery": "94%",
      "storage": "8GB + 256GB",
      "condition": "Fullset no minus",
      "usage": "Kurang dari 2 bulan",
      "images": [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"
      ],
      "seller": "Infinix Official Store Surabaya",
      "rating": 4.8,
      "reviews": 1450,
      "shipping": "Gratis Ongkir"
    },
    {
      "id": "banner-iphone-13-pro-max",  // ⭐ ID ini harus match dengan data-product-id
      "name": "iPhone 13 Pro Max",
      "price": 19200000,
      "city": "Bandung",
      "category": "iPhone",
      "grade": "A",
      "battery": "88%",
      "storage": "8GB + 512GB",
      "condition": "Fullset no minus",
      "usage": "5 bulan pemakaian",
      "images": [
        "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800",
        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800",
        "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&q=80"
      ],
      "seller": "iStore Bandung Premium",
      "rating": 4.9,
      "reviews": 1890,
      "shipping": "Gratis Ongkir"
    }
  ],
  
  // ===== TABLET PRODUCTS =====
  "tablets": [
    {
      "id": "tablet-001",
      "name": "iPad Pro 11",
      "price": 11500000,
      "city": "Medan",
      "category": "Tablet",
      "grade": "A",
      "battery": "95%",
      "storage": "256GB",
      "condition": "Fullset no minus",
      "usage": "3 bulan pemakaian",
      "images": [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=60"
      ],
      "seller": "TechMart Medan",
      "rating": 4.9,
      "reviews": 850,
      "shipping": "Gratis Ongkir"
    },
    {
      "id": "tablet-002",
      "name": "Samsung Galaxy Tab S8",
      "price": 10200000,
      "city": "Semarang",
      "category": "Tablet",
      "grade": "A",
      "battery": "92%",
      "storage": "128GB",
      "condition": "Fullset",
      "usage": "2 bulan pemakaian",
      "images": [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnepxAOw4hM9DlU6uT7BwrAtRWBoscqSK2sQ&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnepxAOw4hM9DlU6uT7BwrAtRWBoscqSK2sQ&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnepxAOw4hM9DlU6uT7BwrAtRWBoscqSK2sQ&s"
      ],
      "seller": "Gadget Store Semarang",
      "rating": 4.7,
      "reviews": 620,
      "shipping": "Gratis Ongkir"
    },
    {
      "id": "tablet-003",
      "name": "Xiaomi Pad 6",
      "price": 5900000,
      "city": "Yogyakarta",
      "category": "Tablet",
      "grade": "B+",
      "battery": "88%",
      "storage": "128GB",
      "condition": "Fullset",
      "usage": "4 bulan pemakaian",
      "images": [
        "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800",
        "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80",
        "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=60"
      ],
      "seller": "Xiaomi Official Yogyakarta",
      "rating": 4.6,
      "reviews": 450,
      "shipping": "Gratis Ongkir"
    }
  ],
  
  // ===== ANDROID PRODUCTS =====
  "android": [
    {
      "id": "android-001",
      "name": "Samsung Galaxy S23",
      "price": 12000000,
      "city": "Jakarta",
      "category": "Android",
      "grade": "A",
      "battery": "93%",
      "storage": "8GB + 256GB",
      "condition": "Fullset no minus",
      "usage": "2 bulan pemakaian",
      "images": [
        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80",
        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=60"
      ],
      "seller": "Samsung Official Jakarta",
      "rating": 4.9,
      "reviews": 1250,
      "shipping": "Gratis Ongkir"
    },
    {
      "id": "android-002",
      "name": "Google Pixel 7",
      "price": 9200000,
      "city": "Surabaya",
      "category": "Android",
      "grade": "A",
      "battery": "91%",
      "storage": "8GB + 128GB",
      "condition": "Fullset",
      "usage": "3 bulan pemakaian",
      "images": [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800",
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=60"
      ],
      "seller": "Google Store Surabaya",
      "rating": 4.8,
      "reviews": 890,
      "shipping": "Gratis Ongkir"
    },
    {
      "id": "android-003",
      "name": "OnePlus 11",
      "price": 8700000,
      "city": "Makassar",
      "category": "Android",
      "grade": "A",
      "battery": "90%",
      "storage": "12GB + 256GB",
      "condition": "Fullset no minus",
      "usage": "1 bulan pemakaian",
      "images": [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=60"
      ],
      "seller": "OnePlus Store Makassar",
      "rating": 4.7,
      "reviews": 720,
      "shipping": "Gratis Ongkir"
    }
  ],
  
  // ===== IPHONE PRODUCTS =====
  "iphone": [
    {
      "id": "iphone-001",
      "name": "iPhone 14 Pro Max",
      "price": 20000000,
      "city": "Bali",
      "category": "iPhone",
      "grade": "A",
      "battery": "94%",
      "storage": "8GB + 256GB",
      "condition": "Fullset no minus",
      "usage": "2 bulan pemakaian",
      "images": [
        "https://media.karousell.com/media/photos/products/2024/7/5/iphone_14_promax_256gb_silver__1720185076_53ffec9c_progressive.jpg",
        "https://media.karousell.com/media/photos/products/2024/7/5/iphone_14_promax_256gb_silver__1720185076_53ffec9c_progressive.jpg",
        "https://media.karousell.com/media/photos/products/2024/7/5/iphone_14_promax_256gb_silver__1720185076_53ffec9c_progressive.jpg"
      ],
      "seller": "iStore Bali",
      "rating": 4.9,
      "reviews": 1450,
      "shipping": "Gratis Ongkir"
    },
    {
      "id": "iphone-002",
      "name": "iPhone 13 Mini",
      "price": 11500000,
      "city": "Bandung",
      "category": "iPhone",
      "grade": "A",
      "battery": "89%",
      "storage": "4GB + 128GB",
      "condition": "Fullset",
      "usage": "4 bulan pemakaian",
      "images": [
        "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800",
        "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&q=80",
        "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&q=60"
      ],
      "seller": "Apple Center Bandung",
      "rating": 4.8,
      "reviews": 980,
      "shipping": "Gratis Ongkir"
    },
    {
      "id": "iphone-003",
      "name": "iPhone SE 2022",
      "price": 7800000,
      "city": "Medan",
      "category": "iPhone",
      "grade": "B+",
      "battery": "87%",
      "storage": "4GB + 64GB",
      "condition": "Fullset",
      "usage": "5 bulan pemakaian",
      "images": [
        "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800",
        "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80",
        "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=60"
      ],
      "seller": "iPhone Store Medan",
      "rating": 4.6,
      "reviews": 650,
      "shipping": "Gratis Ongkir"
    }
  ]
};

// ===== HELPER FUNCTION: FORMAT PRICE =====
function formatPrice(price) {
  return new Intl.NumberFormat('id-ID').format(price);
}

// ===== HELPER FUNCTION: CREATE PRODUCT CARD =====
function createProductCard(product) {
  return `
    <div class="produk-card">
      <a href="product-detail.html?id=${product.id}">
        <img src="${product.images[0]}" alt="${product.name}">
        <h4>${product.name}</h4>
        <p class="harga">Rp ${formatPrice(product.price)}</p>
        <span class="kota"><i class="bi bi-geo-alt-fill"></i> ${product.city}</span>
      </a>
    </div>
  `;
}

// ===== FUNCTION: LOAD PRODUCTS INTO GRID =====
function loadProducts() {
  // Load Tablets
  const tabletGrid = document.getElementById('tablet-grid');
  if (tabletGrid) {
    productsData.tablets.forEach(product => {
      tabletGrid.innerHTML += createProductCard(product);
    });
  }

  // Load Android
  const androidGrid = document.getElementById('android-grid');
  if (androidGrid) {
    productsData.android.forEach(product => {
      androidGrid.innerHTML += createProductCard(product);
    });
  }

  // Load iPhone
  const iphoneGrid = document.getElementById('iphone-grid');
  if (iphoneGrid) {
    productsData.iphone.forEach(product => {
      iphoneGrid.innerHTML += createProductCard(product);
    });
  }
}

// ===== STORE PRODUCTS DATA GLOBALLY =====
if (typeof window !== 'undefined') {
  window.productsData = productsData;
  console.log('✅ Products data loaded globally');
  console.log('📦 Total banner products:', productsData.banner.length);
  console.log('📦 Total tablet products:', productsData.tablets.length);
  console.log('📦 Total android products:', productsData.android.length);
  console.log('📦 Total iPhone products:', productsData.iphone.length);
  
  // ⭐ CRITICAL: Log all banner IDs for debugging
  console.log('🎯 Banner Product IDs:');
  productsData.banner.forEach(product => {
    console.log(`  - ${product.id}: ${product.name}`);
  });
}

// ===== LOAD PRODUCTS WHEN DOM IS READY =====
document.addEventListener('DOMContentLoaded', function() {
  console.log('📱 DOM Ready - Loading products...');
  loadProducts();
});

console.log('✅ products-loader.js loaded successfully');