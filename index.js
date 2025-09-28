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

        prevBtn.addEventListener('click', () => {
            let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prevIndex, 'prev');
            resetAutoSlide();
        });


        // Fungsi autoplay
        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
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