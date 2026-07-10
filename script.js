// --- PASSWORD CONFIG ---
// CUSTOMIZE HERE: Your desired password
const CORRECT_PASSWORD = "2107"; 

function checkPassword() {
    const userInput = document.getElementById("password-input").value;
    if (userInput === CORRECT_PASSWORD) {
        document.getElementById("lock-screen").classList.remove("active");
        const mainScreen = document.getElementById("main-content");
        mainScreen.style.display = "block";
        setTimeout(() => { startEffects(); }, 300);
    } else {
        document.getElementById("login-error").style.display = "block";
    }
}

// --- MUSIC TOGGLE ---
function toggleMusic() {
    const audio = document.getElementById("bg-music");
    const btn = document.getElementById("music-toggle");
    if (audio.paused) {
        audio.play().catch(e => console.log("Audio play delayed till user interaction"));
        btn.innerText = "⏸️ Pause Music";
    } else {
        audio.pause();
        btn.innerText = "🎵 Play Music";
    }
}

// --- COUNTDOWN TIMER ---
function updateCountdown() {
    const countdownEl = document.getElementById("countdown");
    const targetDate = new Date(countdownEl.getAttribute("data-date")).getTime();
    
    setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference < 0) {
            countdownEl.innerText = "🎉 HAPPY BIRTHDAY! 🎆";
            isBirthday = true; // Triggers automatic fireworks
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        countdownEl.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
}
updateCountdown();

// --- SLIDESHOW LOGIC ---
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) { showSlides(slideIndex += n); }
function showSlides(n) {
    let slides = document.getElementsByClassName("slide");
    if (slides.length === 0) return;
    if (n > slides.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = slides.length}
    for (let i = 0; i < slides.length; i++) { slides[i].style.display = "none"; }
    slides[slideIndex-1].style.display = "block";
}
// Auto advance slides every 4 seconds
setInterval(() => { plusSlides(1); }, 4000);

// --- GIFT BOX ---
function openGift() {
    document.getElementById("gift-box").innerText = "💥💥";
    setTimeout(() => {
        document.getElementById("gift-box").style.display = "none";
        document.getElementById("gift-message").classList.remove("hidden");
        triggerGiftFireworks();
    }, 500);
}

// --- SCRATCH CARD SETUP ---
const canvas = document.getElementById('scratch-canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#888';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = '#fff';
ctx.font = '20px sans-serif';
ctx.fillText('Scratch to Reveal! 🔍', 50, 80);

let isDrawing = false;
function scratch(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
}
canvas.addEventListener('mousedown', () => isDrawing = true);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mousemove', scratch);
canvas.addEventListener('touchstart', () => isDrawing = true);
canvas.addEventListener('touchend', () => isDrawing = false);
canvas.addEventListener('touchmove', scratch);


// --- HTML5 CANVAS CANVAS EFFECTS SYSTEM (Hearts, Flowers, Stars, Fireworks) ---
const animCanvas = document.getElementById("animationCanvas");
const animCtx = animCanvas.getContext("2d");
let elements = [];
let fireworks = [];
let isBirthday = false;

function resizeCanvas() {
    animCanvas.width = window.innerWidth;
    animCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(type) {
        this.type = type; // 'heart', 'flower', 'star'
        this.x = Math.random() * animCanvas.width;
        this.y = type === 'star' ? Math.random() * animCanvas.height * 0.5 : animCanvas.height + 20;
        this.speedY = type === 'star' ? Math.random() * 4 + 4 : -(Math.random() * 2 + 1);
        this.speedX = Math.random() * 2 - 1;
        this.size = Math.random() * 15 + 10;
        this.color = `hsl(${Math.random() * 360}, 100%, 75%)`;
        if (type === 'star') { this.x = animCanvas.width + 50; this.speedX = -(Math.random() * 4 + 4); this.speedY = Math.random() * 2 + 1; }
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    draw() {
        animCtx.fillStyle = this.color;
        animCtx.font = `${this.size}px serif`;
        if (this.type === 'heart') animCtx.fillText('❤️', this.x, this.y);
        if (this.type === 'flower') animCtx.fillText('🌸', this.x, this.y);
        if (this.type === 'star') animCtx.fillText('⭐', this.x, this.y);
    }
}

class FireworkParticle {
    constructor(x, y, color) {
        this.x = x; this.y = y; this.color = color;
        this.dx = Math.random() * 6 - 3;
        this.dy = Math.random() * 6 - 3;
        this.alpha = 1;
    }
    update() { this.x += this.dx; this.y += this.dy; this.alpha -= 0.02; }
    draw() {
        animCtx.save();
        animCtx.globalAlpha = this.alpha;
        animCtx.fillStyle = this.color;
        animCtx.beginPath(); animCtx.arc(this.x, this.y, 3, 0, Math.PI*2); animCtx.fill();
        animCtx.restore();
    }
}

function triggerGiftFireworks() {
    const colors = ['#ff4b91', '#ff7cd4', '#ffda76', '#76ffb6'];
    for(let i=0; i<5; i++) {
        setTimeout(() => {
            let x = Math.random() * animCanvas.width;
            let y = Math.random() * animCanvas.height * 0.5;
            let color = colors[Math.floor(Math.random()*colors.length)];
            for(let p=0; p<40; p++) fireworks.push(new FireworkParticle(x, y, color));
        }, i * 300);
    }
}

function startEffects() {
    setInterval(() => {
        if(elements.length < 50) {
            elements.push(new Particle('heart'));
            elements.push(new Particle('flower'));
            if(Math.random() < 0.1) elements.push(new Particle('star')); // Shooting stars infrequent
        }
        if(isBirthday && Math.random() < 0.05) {
            let x = Math.random() * animCanvas.width;
            let y = Math.random() * animCanvas.height * 0.4;
            for(let p=0; p<30; p++) fireworks.push(new FireworkParticle(x, y, `hsl(${Math.random()*360}, 100%, 50%)`));
        }
    }, 100);
    animate();
}

function animate() {
    animCtx.clearRect(0, 0, animCanvas.width, animCanvas.height);
    
    elements.forEach((p, index) => {
        p.update(); p.draw();
        if (p.y < -50 || p.x < -50) elements.splice(index, 1);
    });

    fireworks.forEach((f, index) => {
        f.update(); f.draw();
        if (f.alpha <= 0) fireworks.splice(index, 1);
    });

    requestAnimationFrame(animate);
}