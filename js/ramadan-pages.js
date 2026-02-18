// Ramadan Design for All Pages
document.addEventListener('DOMContentLoaded', function() {
    createRamadanElementsForAllPages();
    addRamadanInteractionsForAllPages();
    addRamadanEffectsForAllPages();
});

function createRamadanElementsForAllPages() {
    // Create Ramadan sky background
    createRamadanSkyForAllPages();
    
    // Create Ramadan stars
    createRamadanStarsForAllPages();
    
    // Create Ramadan moon
    createRamadanMoonForAllPages();
    
    // Create floating lanterns
    // createFloatingLanternsForAllPages();
}

function createRamadanSkyForAllPages() {
    // Check if sky already exists
    if (document.querySelector('.ramadan-sky')) return;
    
    const sky = document.createElement('div');
    sky.className = 'ramadan-sky';
    document.body.appendChild(sky);
}

function createRamadanStarsForAllPages() {
    // Check if stars already exist
    if (document.querySelector('.ramadan-stars-bg')) return;
    
    const starsContainer = document.createElement('div');
    starsContainer.className = 'ramadan-stars-bg';
    
    // Create 10 stars
    for (let i = 0; i < 10; i++) {
        const star = document.createElement('div');
        star.className = 'ramadan-star';
        starsContainer.appendChild(star);
    }
    
    document.body.appendChild(starsContainer);
}

function createRamadanMoonForAllPages() {
    // Check if moon already exists
    if (document.querySelector('.ramadan-moon')) return;
    
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
            <circle cx="35" cy="50" r="2" fill="#f4d03f" opacity="0.3"/>
            <circle cx="65" cy="45" r="3" fill="#f4d03f" opacity="0.4"/>
            <circle cx="42" cy="60" r="2" fill="#f4d03f" opacity="0.2"/>
        </svg>
    `;
    document.body.appendChild(moon);
}

function createFloatingLanternsForAllPages() {
    // Check if lanterns already exist
    if (document.querySelector('.ramadan-lanterns')) return;
    
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

function addRamadanInteractionsForAllPages() {
    // Add hover effects to subject cards
    const cards = document.querySelectorAll('.subject-card-new');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            createCardSparkleForAllPages(this);
        });
        
        card.addEventListener('click', function() {
            showRamadanBlessingForAllPages();
        });
    });
    
    // Add navigation effects
    const navLinks = document.querySelectorAll('.nav > div > a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            createNavLinkSparkleForAllPages(this);
        });
    });
    
    // Add effects to lesson cards
    const lessonCards = document.querySelectorAll('.lesson-card');
    lessonCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            createLessonCardSparkle(this);
        });
    });
    
    // Add effects to buttons
    const buttons = document.querySelectorAll('.ramadan-btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            createButtonSparkle(this);
        });
    });
}

function createCardSparkleForAllPages(card) {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
        position: absolute;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        width: 8px;
        height: 8px;
        background: #f4d03f;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10;
        animation: cardSparkleAnim 1.5s ease-out forwards;
        box-shadow: 0 0 20px rgba(244, 208, 63, 1);
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cardSparkleAnim {
            0% { transform: scale(0) rotate(0deg); opacity: 1; }
            50% { transform: scale(2) rotate(180deg); opacity: 0.8; }
            100% { transform: scale(4) rotate(360deg); opacity: 0; }
        }
    `;
    if (!document.querySelector('#card-sparkle-style')) {
        style.id = 'card-sparkle-style';
        document.head.appendChild(style);
    }
    
    card.appendChild(sparkle);
    
    // Remove after animation
    setTimeout(() => {
        sparkle.remove();
    }, 1500);
}

function createNavLinkSparkleForAllPages(link) {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 6px;
        height: 6px;
        background: #f4d03f;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10;
        animation: navSparkleAnim 1s ease-out forwards;
        box-shadow: 0 0 15px rgba(244, 208, 63, 1);
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes navSparkleAnim {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            50% { transform: translate(-50%, -50%) scale(1.5) translateY(-10px); opacity: 0.8; }
            100% { transform: translate(-50%, -50%) scale(3) translateY(-20px); opacity: 0; }
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
    }, 1000);
}

function createLessonCardSparkle(card) {
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
        animation: lessonSparkleAnim 1.2s ease-out forwards;
        box-shadow: 0 0 15px rgba(244, 208, 63, 1);
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes lessonSparkleAnim {
            0% { transform: scale(0) rotate(0deg); opacity: 1; }
            50% { transform: scale(1.8) rotate(180deg); opacity: 0.8; }
            100% { transform: scale(3) rotate(360deg); opacity: 0; }
        }
    `;
    if (!document.querySelector('#lesson-sparkle-style')) {
        style.id = 'lesson-sparkle-style';
        document.head.appendChild(style);
    }
    
    card.appendChild(sparkle);
    
    // Remove after animation
    setTimeout(() => {
        sparkle.remove();
    }, 1200);
}

function createButtonSparkle(btn) {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 8px;
        height: 8px;
        background: #f4d03f;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10;
        animation: buttonSparkleAnim 1s ease-out forwards;
        box-shadow: 0 0 20px rgba(244, 208, 63, 1);
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes buttonSparkleAnim {
            0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 1; }
            50% { transform: translate(-50%, -50%) scale(2) rotate(180deg); opacity: 0.8; }
            100% { transform: translate(-50%, -50%) scale(4) rotate(360deg); opacity: 0; }
        }
    `;
    if (!document.querySelector('#button-sparkle-style')) {
        style.id = 'button-sparkle-style';
        document.head.appendChild(style);
    }
    
    btn.appendChild(sparkle);
    
    // Remove after animation
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

function showRamadanBlessingForAllPages() {
    const blessings = [
        '🌙 رمضان كريم',
        '✨ كل عام وأنتم بخير',
        '🤲 تقبل الله منا ومنكم',
        '🍽️ صيام مقبول وإفطار شهي',
        '🙏 غفران الذنوب',
        '🌺 جنات تحت ظل العرش',
        '🎉 عيدكم مبارك',
        '💫 شهر الخير والبركة',
        '🌟 ليلة القدر',
        '🏮 فوانيس رمضان',
        '🌅 شهر الصيام',
        '🕌 شهر القرآن',
        '📿 شهر الدعاء',
        '🌹 شهر المغفرة',
        '🎊 تعلم في رمضان',
        '📚 دراسة في شهر الخير'
    ];
    
    const blessing = blessings[Math.floor(Math.random() * blessings.length)];
    
    // Create blessing popup
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        color: #f4d03f;
        padding: 30px 50px;
        border-radius: 25px;
        border: 3px solid #f4d03f;
        font-size: 1.8rem;
        font-weight: 700;
        z-index: 10000;
        box-shadow: 0 20px 60px rgba(244, 208, 63, 0.6);
        cursor: pointer;
        backdrop-filter: blur(20px);
        text-align: center;
        text-shadow: 0 0 25px rgba(244, 208, 63, 0.8);
    `;
    popup.textContent = blessing;
    
    // Add entrance animation
    setTimeout(() => {
        popup.style.transform = 'translate(-50%, -50%) scale(1)';
        popup.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    }, 100);
    
    // Add click to close
    popup.addEventListener('click', function() {
        popup.style.transform = 'translate(-50%, -50%) scale(0)';
        setTimeout(() => {
            popup.remove();
        }, 300);
    });
    
    document.body.appendChild(popup);
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (popup.parentNode) {
            popup.style.transform = 'translate(-50%, -50%) scale(0)';
            setTimeout(() => {
                popup.remove();
            }, 300);
        }
    }, 5000);
}

function addRamadanEffectsForAllPages() {
    // Add keyboard shortcut (press R)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'r' || e.key === 'R') {
            showRamadanBlessingForAllPages();
            createRamadanSparklesForAllPages();
        }
    });
    
    // Add time-based effects
    addTimeBasedEffectsForAllPages();
    
    // Update effects every minute
    setInterval(addTimeBasedEffectsForAllPages, 60000);
    
    // Create floating particles occasionally
    setInterval(createFloatingParticleForAllPages, 8000);
}

function createRamadanSparklesForAllPages() {
    // Create multiple sparkles
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createSingleSparkleForAllPages();
        }, i * 100);
    }
}

function createSingleSparkleForAllPages() {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
        position: fixed;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        width: 10px;
        height: 10px;
        background: #f4d03f;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10001;
        animation: sparkleAnim 2s ease-out forwards;
        box-shadow: 0 0 25px rgba(244, 208, 63, 1);
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkleAnim {
            0% { 
                transform: scale(0) rotate(0deg); 
                opacity: 1; 
            }
            50% { 
                transform: scale(2.5) rotate(180deg); 
                opacity: 0.8; 
            }
            100% { 
                transform: scale(5) rotate(360deg); 
                opacity: 0; 
            }
        }
    `;
    if (!document.querySelector('#sparkle-style')) {
        style.id = 'sparkle-style';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(sparkle);
    
    // Remove after animation
    setTimeout(() => {
        sparkle.remove();
    }, 2000);
}

function addTimeBasedEffectsForAllPages() {
    const hour = new Date().getHours();
    const moon = document.querySelector('.ramadan-moon');
    
    if (moon) {
        if (hour >= 20 || hour < 5) {
            // Night - moon is more visible
            moon.style.opacity = '1';
        } else {
            // Day - moon is less visible
            moon.style.opacity = '0.5';
        }
    }
    
    // Show iftar message during iftar time
    if (hour >= 17 && hour < 20) {
        showIftarMessageForAllPages();
    }
}

function showIftarMessageForAllPages() {
    // Check if message already exists
    if (document.querySelector('.iftar-message')) return;
    
    const iftarMsg = document.createElement('div');
    iftarMsg.className = 'iftar-message';
    iftarMsg.style.cssText = `
        position: fixed;
        top: 150px;
        right: 20px;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        color: #f4d03f;
        padding: 20px 30px;
        border-radius: 20px;
        border: 3px solid #f4d03f;
        font-size: 1.3rem;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 10px 40px rgba(244, 208, 63, 0.5);
        animation: iftarSlide 0.8s ease-out;
        backdrop-filter: blur(20px);
        text-shadow: 0 0 15px rgba(244, 208, 63, 0.8);
    `;
    iftarMsg.innerHTML = '🌅 حان وقت الإفطار<br><small>كل عام وأنتم بخير</small>';
    
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
    
    // Remove after 15 seconds
    setTimeout(() => {
        iftarMsg.style.animation = 'iftarSlide 0.8s ease-out reverse';
        setTimeout(() => {
            iftarMsg.remove();
        }, 800);
    }, 15000);
}

function createFloatingParticleForAllPages() {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        bottom: -20px;
        left: ${Math.random() * 100}%;
        width: 6px;
        height: 6px;
        background: #f4d03f;
        border-radius: 50%;
        z-index: 5;
        animation: floatParticleUp 10s ease-in-out forwards;
        pointer-events: none;
        box-shadow: 0 0 15px rgba(244, 208, 63, 0.8);
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticleUp {
            0% { transform: translateY(0) translateX(0) scale(0); opacity: 0; }
            10% { transform: translateY(-20px) translateX(10px) scale(1); opacity: 1; }
            90% { transform: translateY(-400px) translateX(-10px) scale(1); opacity: 1; }
            100% { transform: translateY(-500px) translateX(0) scale(0); opacity: 0; }
        }
    `;
    if (!document.querySelector('#particle-up-style')) {
        style.id = 'particle-up-style';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(particle);
    
    // Remove after animation
    setTimeout(() => {
        particle.remove();
    }, 10000);
}
