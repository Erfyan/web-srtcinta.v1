/* =============================================
   WEBSITE HADIAH VIRTUAL ROMANTIS — SCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ============ ELEMEN ============
    const sections = {
        landing: document.getElementById('sectionLanding'),
        letter: document.getElementById('sectionLetter'),
        gallery: document.getElementById('sectionGallery'),
        reasons: document.getElementById('sectionReasons'),
        countdown: document.getElementById('sectionCountdown'),
        final: document.getElementById('sectionFinal'),
    };

    const envelope = document.getElementById('envelope');
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicVisualizer = document.getElementById('musicVisualizer');

    let currentSection = 'landing';
    let musicPlaying = false;

    // ============ HATI MELAYANG BACKGROUND ============
    function createFloatingHearts() {
        const container = document.getElementById('floatingHearts');
        const hearts = ['💕', '💖', '💗', '💝', '💘', '🩷', '✨', '🌸'];

        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('span');
            heart.className = 'floating-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (10 + Math.random() * 14) + 's';
            heart.style.animationDelay = (Math.random() * 12) + 's';
            heart.style.fontSize = (0.7 + Math.random() * 0.8) + 'rem';
            container.appendChild(heart);
        }
    }
    createFloatingHearts();

    // ============ CANVAS PARTIKEL BINTANG ============
    const sparkleCanvas = document.getElementById('sparkleCanvas');
    const ctx = sparkleCanvas.getContext('2d');
    let sparkles = [];

    function resizeCanvas() {
        sparkleCanvas.width = window.innerWidth;
        sparkleCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Sparkle {
        constructor(x, y) {
            this.x = x || Math.random() * sparkleCanvas.width;
            this.y = y || Math.random() * sparkleCanvas.height;
            this.size = Math.random() * 2.5 + 0.8;
            this.speedX = (Math.random() - 0.5) * 1.5;
            this.speedY = (Math.random() - 0.5) * 1.5;
            this.opacity = Math.random() * 0.8;
            this.fadeRate = 0.006 + Math.random() * 0.01;
            this.hue = Math.random() > 0.5 ? 340 : 45; // pink atau emas
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= this.fadeRate;
        }

        draw() {
            if (this.opacity <= 0) return;
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = `hsl(${this.hue}, 80%, 70%)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 8;
            ctx.shadowColor = `hsl(${this.hue}, 80%, 60%)`;
            ctx.fill();
            ctx.restore();
        }
    }

    function addRandomSparkles() {
        if (sparkles.length < 35) {
            sparkles.push(new Sparkle());
        }
    }

    function animateSparkles() {
        ctx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);
        sparkles = sparkles.filter(s => s.opacity > 0);
        sparkles.forEach(s => {
            s.update();
            s.draw();
        });
        if (Math.random() < 0.25) addRandomSparkles();
        requestAnimationFrame(animateSparkles);
    }
    animateSparkles();

    // Efek sentuh — partikel muncul saat diketuk
    document.addEventListener('click', (e) => {
        for (let i = 0; i < 6; i++) {
            sparkles.push(new Sparkle(e.clientX, e.clientY));
        }
    });

    // ============ NAVIGASI BAGIAN ============
    function showSection(sectionName) {
        Object.keys(sections).forEach(key => {
            sections[key].classList.remove('active');
        });
        sections[sectionName].classList.add('active');
        currentSection = sectionName;

        // Setup khusus per bagian
        if (sectionName === 'countdown') startCountdown();
        if (sectionName === 'final') triggerFinalHeartBurst();

        // Scroll ke atas saat ganti bagian
        sections[sectionName].scrollTop = 0;
    }

    // ============ INTERAKSI AMPLOP ============
    let envelopeOpened = false;

    envelopeWrapper.addEventListener('click', () => {
        if (envelopeOpened) return;
        envelopeOpened = true;

        // Buka amplop
        envelope.classList.add('opened');

        // Coba mulai musik
        tryPlayMusic();

        // Transisi ke bagian surat cinta
        setTimeout(() => {
            showSection('letter');
        }, 1400);
    });

    // ============ NAVIGASI TOMBOL ============
    document.getElementById('btnToGallery').addEventListener('click', () => showSection('gallery'));
    document.getElementById('btnToReasons').addEventListener('click', () => showSection('reasons'));
    document.getElementById('btnToCountdown').addEventListener('click', () => showSection('countdown'));
    document.getElementById('btnToFinal').addEventListener('click', () => showSection('final'));
    document.getElementById('btnReplay').addEventListener('click', () => {
        envelopeOpened = false;
        envelope.classList.remove('opened');
        showSection('landing');
    });

    // ============ CAROUSEL ALASAN ============
    const reasonCards = document.querySelectorAll('.reason-card');
    const dotsContainer = document.getElementById('carouselDots');
    let currentReason = 0;

    // Buat titik-titik
    reasonCards.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToReason(i));
        dotsContainer.appendChild(dot);
    });

    function goToReason(index) {
        const direction = index > currentReason ? 1 : -1;

        reasonCards.forEach((card, i) => {
            card.classList.remove('active', 'exit-left');
            if (i === currentReason && i !== index) {
                card.classList.add(direction > 0 ? 'exit-left' : '');
            }
        });

        currentReason = index;
        reasonCards[currentReason].classList.add('active');

        // Update titik-titik
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentReason);
        });
    }

    document.getElementById('prevReason').addEventListener('click', () => {
        const prev = (currentReason - 1 + reasonCards.length) % reasonCards.length;
        goToReason(prev);
    });

    document.getElementById('nextReason').addEventListener('click', () => {
        const next = (currentReason + 1) % reasonCards.length;
        goToReason(next);
    });

    // Otomatis geser carousel
    let carouselInterval;
    function startCarouselAuto() {
        clearInterval(carouselInterval);
        carouselInterval = setInterval(() => {
            if (currentSection === 'reasons') {
                const next = (currentReason + 1) % reasonCards.length;
                goToReason(next);
            }
        }, 4000);
    }
    startCarouselAuto();

    // Dukungan swipe sentuh untuk carousel
    let touchStartX = 0;
    const carousel = document.getElementById('reasonsCarousel');

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        clearInterval(carouselInterval);
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goToReason((currentReason + 1) % reasonCards.length);
            } else {
                goToReason((currentReason - 1 + reasonCards.length) % reasonCards.length);
            }
        }
        startCarouselAuto();
    }, { passive: true });

    // ============ PENGHITUNG WAKTU ============
    // Tanggal jadian: 21 September 2026
    const startDate = new Date('2026-09-21T00:00:00');
    let countdownRunning = false;

    function startCountdown() {
        if (countdownRunning) return;
        countdownRunning = true;
        updateCountdown();
    }

    function updateCountdown() {
        const now = new Date();
        const diff = Math.max(0, now - startDate);

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        animateValue('countDays', days);
        animateValue('countHours', hours);
        animateValue('countMinutes', minutes);
        animateValue('countSeconds', seconds);

        requestAnimationFrame(() => setTimeout(updateCountdown, 1000));
    }

    function animateValue(id, value) {
        const el = document.getElementById(id);
        const current = parseInt(el.textContent);
        if (current !== value) {
            el.style.transform = 'translateY(-4px)';
            el.style.opacity = '0.5';
            setTimeout(() => {
                el.textContent = value.toString().padStart(2, '0');
                el.style.transform = 'translateY(0)';
                el.style.opacity = '1';
            }, 130);
        }
    }

    // ============ LEDAKAN HATI DI HALAMAN TERAKHIR ============
    function triggerFinalHeartBurst() {
        const container = document.getElementById('heartBurst');
        container.innerHTML = '';

        const heartEmojis = ['❤️', '💕', '💖', '💗', '💝', '💘', '✨', '🌹', '🥰'];

        for (let i = 0; i < 25; i++) {
            setTimeout(() => {
                const heart = document.createElement('span');
                heart.className = 'burst-heart';
                heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

                const centerX = container.offsetWidth / 2;
                const centerY = container.offsetHeight / 2;
                const angle = (Math.PI * 2 * i) / 25;
                const distance = 80 + Math.random() * 150;
                const endX = Math.cos(angle) * distance;
                const endY = Math.sin(angle) * distance;

                heart.style.left = centerX + 'px';
                heart.style.top = centerY + 'px';
                heart.style.fontSize = (0.9 + Math.random() * 1.2) + 'rem';

                heart.animate([
                    { transform: 'translate(0, 0) scale(0)', opacity: 1 },
                    { transform: `translate(${endX}px, ${endY}px) scale(1)`, opacity: 0 }
                ], {
                    duration: 700 + Math.random() * 500,
                    easing: 'ease-out',
                    fill: 'forwards'
                });

                container.appendChild(heart);
                setTimeout(() => heart.remove(), 1300);
            }, i * 35);
        }
    }

    // Interaksi klik hati besar
    const bigHeart = document.getElementById('bigHeart');
    bigHeart.addEventListener('click', () => {
        bigHeart.classList.add('clicked');
        triggerFinalHeartBurst();
        setTimeout(() => bigHeart.classList.remove('clicked'), 600);
    });

    // ============ KONTROL MUSIK ============
    function tryPlayMusic() {
        bgMusic.volume = 0.5;
        bgMusic.play().then(() => {
            musicPlaying = true;
            musicVisualizer.classList.add('playing');
        }).catch(() => {
            // Autoplay diblokir — pengguna perlu klik tombol musik
        });
    }

    musicToggle.addEventListener('click', () => {
        if (musicPlaying) {
            bgMusic.pause();
            musicPlaying = false;
            musicVisualizer.classList.remove('playing');
        } else {
            bgMusic.volume = 0.5;
            bgMusic.play().then(() => {
                musicPlaying = true;
                musicVisualizer.classList.add('playing');
            });
        }
    });

    // ============ NAVIGASI KEYBOARD ============
    document.addEventListener('keydown', (e) => {
        const order = ['landing', 'letter', 'gallery', 'reasons', 'countdown', 'final'];
        const idx = order.indexOf(currentSection);

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            if (currentSection === 'landing' && !envelopeOpened) {
                envelopeWrapper.click();
            } else if (idx < order.length - 1) {
                showSection(order[idx + 1]);
            }
        }

        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (idx > 0) {
                showSection(order[idx - 1]);
            }
        }

        if (e.key === 'Escape') {
            closeLightbox();
        }
    });

    // ============ INTERAKSI LIGHTBOX PREVIEW FOTO ============
    const lightbox = document.getElementById('photoLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxBackdrop = document.getElementById('lightboxBackdrop');

    document.querySelectorAll('.gallery-card').forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            const caption = card.querySelector('.gallery-caption');
            if (img) {
                lightboxImg.src = img.src;
                lightboxCaption.textContent = caption ? caption.textContent : '';
                lightbox.classList.add('active');
            }
        });
    });

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
        }
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

});

