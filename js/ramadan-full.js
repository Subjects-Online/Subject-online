// Full Ramadan Theme
document.addEventListener('DOMContentLoaded', function() {
    createRamadanElements();
    addRamadanInteractions();
    addRamadanTimeEffects();
});

function createRamadanElements() {
    // Create particles
    createRamadanParticles();
    
    // Create lanterns
    createRamadanLanterns();
    
    // Create stars
    createRamadanStars();
    
    // Create moon
    createRamadanMoon();
}

function createRamadanParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'ramadan-particles';
    
    // Create 20 particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'ramadan-particle';
        
        // Random starting position and delay
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (10 + Math.random() * 5) + 's';
        
        particlesContainer.appendChild(particle);
    }
    
    document.body.appendChild(particlesContainer);
}

function createRamadanLanterns() {
    const lanternsContainer = document.createElement('div');
    lanternsContainer.className = 'ramadan-lanterns';
    
    // Create 5 lanterns
    for (let i = 0; i < 5; i++) {
        const lantern = document.createElement('div');
        lantern.className = 'ramadan-lantern';
        lantern.innerHTML = '🏮';
        lanternsContainer.appendChild(lantern);
    }
    
    document.body.appendChild(lanternsContainer);
}

function createRamadanStars() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'ramadan-stars';
    
    // Create 15 stars
    for (let i = 0; i < 15; i++) {
        const star = document.createElement('div');
        star.className = 'ramadan-star';
        starsContainer.appendChild(star);
    }
    
    document.body.appendChild(starsContainer);
}

function createRamadanMoon() {
    const moon = document.createElement('div');
    moon.className = 'ramadan-moon';
    moon.innerHTML = `
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#f4d03f" opacity="0.9"/>
            <circle cx="55" cy="45" r="35" fill="#1a1a2e" opacity="0.8"/>
            <circle cx="45" cy="55" r="5" fill="#f4d03f" opacity="0.7"/>
            <circle cx="40" cy="48" r="3" fill="#f4d03f" opacity="0.6"/>
            <circle cx="52" cy="58" r="3" fill="#f4d03f" opacity="0.5"/>
            <circle cx="48" cy="42" r="2" fill="#f4d03f" opacity="0.4"/>
            <circle cx="60" cy="52" r="2" fill="#f4d03f" opacity="0.3"/>
        </svg>
    `;
    
    document.body.appendChild(moon);
}

function addRamadanInteractions() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.subject-card-new');
    cards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            createCardSparkle(this);
        });
        
        card.addEventListener('click', function() {
            showRamadanBlessing();
        });
    });
    
    // Add navigation effects
    const navLinks = document.querySelectorAll('.nav > div > a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            createNavLinkSparkle(this);
        });
    });
}

function createCardSparkle(card) {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
        position: absolute;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        width: 6px;
        height: 6px;
        background: #f4d03f;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10;
        animation: sparkleAnim 1s ease-out forwards;
        box-shadow: 0 0 15px rgba(244, 208, 63, 0.8);
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkleAnim {
            0% { transform: scale(0) rotate(0deg); opacity: 1; }
            100% { transform: scale(3) rotate(180deg); opacity: 0; }
        }
    `;
    if (!document.querySelector('#sparkle-style')) {
        style.id = 'sparkle-style';
        document.head.appendChild(style);
    }
    
    card.appendChild(sparkle);
    
    // Remove after animation
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

function createNavLinkSparkle(link) {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 4px;
        height: 4px;
        background: #f4d03f;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10;
        animation: navSparkleAnim 0.8s ease-out forwards;
        box-shadow: 0 0 10px rgba(244, 208, 63, 0.8);
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes navSparkleAnim {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(2) translateY(-20px); opacity: 0; }
        }
    `;
    if (!document.querySelector('#nav-sparkle-style')) {
        style.id = 'nav-sparkle-style';
        document.head.appendChild(style);
    }
    
    link.appendChild(sparkle);
    
    // Remove after animation
    setTimeout(() => {
        sparkle.remove();
    }, 800);
}

function showRamadanBlessing() {
    const blessings = [
        '🌙 رمضان كريم',
        '✨ كل عام وأنتم بخير',
        '🤲 تقبل الله منا ومنكم',
        '🍽️ صيام مقبول وإفطار شهي',
        '🙏 غفران الذنوب',
        '🌺 جنات تحت ظل العرش',
        '🎉 عيدكم مبارك'
    ];
    
    const blessing = blessings[Math.floor(Math.random() * blessings.length)];
    
    // Create blessing popup
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        color: #f4d03f;
        padding: 20px 40px;
        border-radius: 15px;
        border: 2px solid #f4d03f;
        font-size: 1.5rem;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 10px 40px rgba(244, 208, 63, 0.5);
        animation: blessingPopup 0.5s ease-out;
        cursor: pointer;
        backdrop-filter: blur(10px);
    `;
    popup.textContent = blessing;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blessingPopup {
            0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.1) rotate(5deg); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
        }
    `;
    if (!document.querySelector('#blessing-style')) {
        style.id = 'blessing-style';
        document.head.appendChild(style);
    }
    
    // Add click to close
    popup.addEventListener('click', function() {
        this.style.animation = 'blessingPopup 0.3s ease-out reverse';
        setTimeout(() => {
            popup.remove();
        }, 300);
    });
    
    document.body.appendChild(popup);
    
    // Auto close after 3 seconds
    setTimeout(() => {
        if (popup.parentNode) {
            popup.style.animation = 'blessingPopup 0.3s ease-out reverse';
            setTimeout(() => {
                popup.remove();
            }, 300);
        }
    }, 3000);
}

function addRamadanTimeEffects() {
    const hour = new Date().getHours();
    let intensity = 0.5;
    
    // Different effects based on time of day
    if (hour >= 5 && hour < 12) {
        // Morning - softer effects
        intensity = 0.3;
        document.body.style.setProperty('--ramadan-glow', 'rgba(244, 208, 63, 0.3)');
    } else if (hour >= 12 && hour < 17) {
        // Afternoon - normal effects
        intensity = 0.5;
        document.body.style.setProperty('--ramadan-glow', 'rgba(244, 208, 63, 0.5)');
    } else if (hour >= 17 && hour < 20) {
        // Iftar time - enhanced effects
        intensity = 0.8;
        document.body.style.setProperty('--ramadan-glow', 'rgba(244, 208, 63, 0.8)');
        
        // Add special iftar message
        showIftarMessage();
    } else {
        // Night - magical effects
        intensity = 0.6;
        document.body.style.setProperty('--ramadan-glow', 'rgba(244, 208, 63, 0.6)');
    }
    
    // Update effects every minute
    setInterval(() => {
        updateRamadanEffects();
    }, 60000);
}

function showIftarMessage() {
    const hour = new Date().getHours();
    if (hour >= 17 && hour < 20) {
        const iftarMsg = document.createElement('div');
        iftarMsg.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            color: #f4d03f;
            padding: 15px 25px;
            border-radius: 10px;
            border: 1px solid #f4d03f;
            font-size: 1rem;
            z-index: 1000;
            box-shadow: 0 5px 20px rgba(244, 208, 63, 0.4);
            animation: iftarSlide 0.5s ease-out;
            backdrop-filter: blur(10px);
        `;
        iftarMsg.textContent = '🌅 حان وقت الإفطار';
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes iftarSlide {
                0% { transform: translateX(100%); opacity: 0; }
                100% { transform: translateX(0); opacity: 1; }
            }
        `;
        if (!document.querySelector('#iftar-style')) {
            style.id = 'iftar-style';
            document.head.appendChild(style);
        }
        
        document.body.appendChild(iftarMsg);
        
        // Remove after 10 seconds
        setTimeout(() => {
            iftarMsg.style.animation = 'iftarSlide 0.5s ease-out reverse';
            setTimeout(() => {
                iftarMsg.remove();
            }, 500);
        }, 10000);
    }
}

function updateRamadanEffects() {
    const hour = new Date().getHours();
    let intensity = 0.5;
    
    if (hour >= 5 && hour < 12) {
        intensity = 0.3;
    } else if (hour >= 12 && hour < 17) {
        intensity = 0.5;
    } else if (hour >= 17 && hour < 20) {
        intensity = 0.8;
    } else {
        intensity = 0.6;
    }
    
    document.body.style.setProperty('--ramadan-glow', `rgba(244, 208, 63, ${intensity})`);
    
    // Update particle intensity
    const particles = document.querySelectorAll('.ramadan-particle');
    particles.forEach(particle => {
        particle.style.opacity = intensity;
    });
}

// Add keyboard shortcut for blessing (press R)
document.addEventListener('keydown', function(e) {
    if (e.key === 'r' || e.key === 'R') {
        showRamadanBlessing();
    }
});

// Add floating lanterns occasionally
function createFloatingLantern() {
    const lantern = document.createElement('div');
    lantern.innerHTML = '🏮';
    lantern.style.cssText = `
        position: fixed;
        bottom: -50px;
        left: ${Math.random() * 100}%;
        font-size: 2rem;
        z-index: 5;
        animation: floatLanternUp 8s ease-in-out forwards;
        pointer-events: none;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatLanternUp {
            0% { transform: translateY(0) rotate(-5deg); opacity: 0; }
            10% { transform: translateY(-20px) rotate(5deg); opacity: 1; }
            90% { transform: translateY(-400px) rotate(-3deg); opacity: 1; }
            100% { transform: translateY(-500px) rotate(0deg); opacity: 0; }
        }
    `;
    if (!document.querySelector('#lantern-up-style')) {
        style.id = 'lantern-up-style';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(lantern);
    
    // Remove after animation
    setTimeout(() => {
        lantern.remove();
    }, 8000);
}

// Create floating lanterns every 15 seconds
setInterval(createFloatingLantern, 15000);
