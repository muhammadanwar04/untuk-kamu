// Deklarasi fungsi transisi di Scope Global (window) agar bisa dipanggil langsung dari atribut HTML 'onclick'
window.openSurat = function() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    
    if (!welcomeScreen || !mainContent) return;

    // Cegah klik ganda selama animasi berlangsung
    welcomeScreen.style.pointerEvents = 'none';
    
    // Mulai animasi fade-out pada layar selamat datang
    welcomeScreen.style.opacity = '0';
    
    // Tampilkan konten utama secara instan agar transisinya terasa smooth dan responsif
    mainContent.classList.remove('hidden');
    
    // Jalankan pemutaran musik bawaan lokal
    if (bgMusic) {
        bgMusic.play().catch(err => {
            console.log("Pemutaran musik tertunda/diblokir kebijakan browser:", err);
        });
    }
    
    // Bersihkan elemen welcome screen sepenuhnya dari layout setelah transisi CSS selesai (800ms)
    setTimeout(() => {
        welcomeScreen.classList.add('hidden');
    }, 800);
};

document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');

    // Pengikat cadangan via Event Listener jika pemanggilan inline HTML diblokir oleh ekstensi browser tertentu
    const btnStart = document.getElementById('btn-start');
    if (btnStart) {
        btnStart.addEventListener('click', () => {
            if (typeof window.openSurat === 'function') {
                window.openSurat();
            }
        });
    }

    // =========================================================================
    // MANAGEMENT TOGGLE AUDIO CONTROL
    // =========================================================================
    let isPlaying = true;
    if (musicToggle && bgMusic) {
        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Mencegah memicu efek partikel klik jendela global
            if (isPlaying) {
                bgMusic.pause();
                musicToggle.textContent = '🔇';
            } else {
                bgMusic.play().catch(err => console.log(err));
                musicToggle.textContent = '🎵';
            }
            isPlaying = !isPlaying;
        });
    }

    // =========================================================================
    // ACTIVE NAVIGATION SCROLL TRACKER
    // =========================================================================
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // Offset kompensasi tinggi navbar

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    });

    // =========================================================================
    // HIGH-PERFORMANCE INTERACTIVE HEART TRAIL (OPTIMIZED FOR LOWER RAM DEVICE)
    // =========================================================================
    const emojiPool = ['❤️', '💖', '✨', '🌸', '💕'];
    let lastEffectExecution = 0;
    const throttleDelay = 80; // Satuan ms pembatas generasi node HTML agar HP tidak lag/overheat

    function spawnHeartParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'heart-trail';
        
        const randomEmoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
        particle.innerHTML = randomEmoji;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        const randomScale = Math.random() * 0.4 + 0.8; // Skala dinamis 0.8 s/d 1.2
        particle.style.transform = `scale(${randomScale})`;
        
        document.body.appendChild(particle);

        // Alokasi otomatis penghapusan DOM Element agar memori browser tetap bersih
        setTimeout(() => {
            particle.remove();
        }, 1800);
    }

    // Capture Pergerakan Kursor Mouse Desktop
    window.addEventListener('mousemove', (e) => {
        const currentTime = Date.now();
        if (currentTime - lastEffectExecution > throttleDelay) {
            spawnHeartParticle(e.clientX, e.clientY);
            lastEffectExecution = currentTime;
        }
    });

    // Capture Geseran Jari Layar Sentuh HP (Touch Move)
    window.addEventListener('touchmove', (e) => {
        const currentTime = Date.now();
        if (currentTime - lastEffectExecution > throttleDelay && e.touches.length > 0) {
            const touch = e.touches[0];
            spawnHeartParticle(touch.clientX, touch.clientY);
            lastEffectExecution = currentTime;
        }
    });

    // Capture Ketukan Tunggal (Instant Tap / Click)
    window.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A') {
            spawnHeartParticle(e.clientX, e.clientY);
        }
    });
});