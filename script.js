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

// ===== SLIDER FUNCTIONALITY =====
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