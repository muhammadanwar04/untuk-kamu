window.openSurat = function() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    
    if (!welcomeScreen || !mainContent) return;
    welcomeScreen.style.pointerEvents = 'none';
    welcomeScreen.style.opacity = '0';
    mainContent.classList.remove('hidden');
    
    if (bgMusic) {
        bgMusic.play().catch(err => {
            console.log("Pemutaran musik tertunda/diblokir kebijakan browser:", err);
        });
    }
    
    setTimeout(() => {
        welcomeScreen.classList.add('hidden');
    }, 800);
};

document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const btnStart = document.getElementById('btn-start');
    
    if (btnStart) {
        btnStart.addEventListener('click', () => {
            if (typeof window.openSurat === 'function') {
                window.openSurat();
            }
        });
    }
    
    let isPlaying = true;
    if (musicToggle && bgMusic) {
        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation();
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

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; 

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

    const emojiPool = ['❤️', '💖', '✨', '🌸', '💕'];
    let lastEffectExecution = 0;
    const throttleDelay = 80; 

    function spawnHeartParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'heart-trail';
        
        const randomEmoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
        particle.innerHTML = randomEmoji;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        const randomScale = Math.random() * 0.4 + 0.8; 
        particle.style.transform = `scale(${randomScale})`;
        
        document.body.appendChild(particle);
        setTimeout(() => {
            particle.remove();
        }, 1800);
    }

    window.addEventListener('mousemove', (e) => {
        const currentTime = Date.now();
        if (currentTime - lastEffectExecution > throttleDelay) {
            spawnHeartParticle(e.clientX, e.clientY);
            lastEffectExecution = currentTime;
        }
    });

    window.addEventListener('touchmove', (e) => {
        const currentTime = Date.now();
        if (currentTime - lastEffectExecution > throttleDelay && e.touches.length > 0) {
            const touch = e.touches[0];
            spawnHeartParticle(touch.clientX, touch.clientY);
            lastEffectExecution = currentTime;
        }
    });

    window.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A') {
            spawnHeartParticle(e.clientX, e.clientY);
        }
    });
});
