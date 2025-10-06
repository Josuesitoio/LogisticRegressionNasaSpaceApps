// Este script maneja el fondo de estrellas y el núcleo galáctico giratorio (Canvas 2D).

const canvas = document.getElementById('galaxy-canvas');

// Solo ejecuta si el canvas existe
if (canvas) {
    const ctx = canvas.getContext('2d');

    // Inicialización del tamaño del canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const rand = (min, max) => Math.random() * (max - min) + min;

    // --- MANEJO DE REDIMENSIONAMIENTO ---
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Regenerar elementos al redimensionar
        stars = [];
        initStars();
        ringParticles = [];
        initRingParticles();
    });

    // ---- PARÁMETROS DEL NÚCLEO Y ANILLO ----
    const CORE_RADIUS = 30; 
    const CORE_COLOR = 'rgba(255, 230, 200, 1)'; 
    const RING_PARTICLE_COUNT = 500; 
    const RING_MIN_RADIUS = CORE_RADIUS + 10; 
    const RING_MAX_RADIUS = CORE_RADIUS + 80; 
    let ringParticles = []; 

    const RING_COLORS_PALETTE = [
        'rgba(96, 150, 249, 0.34)', 'rgba(255, 100, 100, 0.35)',
        'rgba(100, 100, 255, 0.24)', 'rgba(150, 255, 255, 0.28)',
        'rgba(193, 196, 101, 1)' 
    ];


    // ---- CLASE RingParticle ----
    function RingParticle() {
        this.orbitRadius = rand(RING_MIN_RADIUS, RING_MAX_RADIUS); 
        this.angle = rand(0, Math.PI * 2); 
        this.speed = rand(0.005, 0.015); 
        this.size = rand(0.8, 1.5); 
        this.color = RING_COLORS_PALETTE[Math.floor(rand(0, RING_COLORS_PALETTE.length))];
    }

    RingParticle.prototype.draw = function(centerX, centerY) {
        const x = centerX + this.orbitRadius * Math.cos(this.angle);
        const y = centerY + this.orbitRadius * Math.sin(this.angle);
        ctx.fillStyle = this.color; 
        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fill();
    };

    RingParticle.prototype.update = function() {
        this.angle += this.speed; 
    };

    function initRingParticles() {
        for (let i = 0; i < RING_PARTICLE_COUNT; i++) {
            ringParticles.push(new RingParticle());
        }
    }

    // ---- FUNCIONES DE DIBUJO PARA EL NÚCLEO ----
    function drawGalaxyCore() {
        const coreX = canvas.width / 2;
        const coreY = canvas.height / 2;
        ctx.beginPath();
        ctx.arc(coreX, coreY, CORE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = CORE_COLOR;
        ctx.shadowColor = CORE_COLOR; 
        ctx.shadowBlur = 15; 
        ctx.fill();
        ctx.shadowBlur = 0; 
    }

    // ---- CÓDIGO DE ESTRELLAS ----
    const STAR_COUNT = 3000;
    let stars = [];

    function Star() {
        this.x = rand(0, canvas.width);
        this.y = rand(0, canvas.height);
        this.radius = rand(0.5, 1);
        this.alpha = rand(0.3, 0.9); 
        this.alphaSpeed = rand(0.005, 0.015); 
        this.moveX = rand(-0.5, 0.5); 
        this.moveY = rand(-0.5, 0.5); 
    }

    function initStars() {
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push(new Star());
        }
    }

    Star.prototype.draw = function() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    };

    Star.prototype.update = function() {
        this.alpha += this.alphaSpeed;
        if (this.alpha > 0.9 || this.alpha < 0.3) {
            this.alphaSpeed *= -1; 
        }
        this.x += this.moveX;
        this.y += this.moveY;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    };

    // ---- INICIALIZACIÓN GENERAL Y BUCLE ----
    initStars(); 
    initRingParticles(); 

    function animateBackground() {
        requestAnimationFrame(animateBackground);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        
        const coreX = canvas.width / 2;
        const coreY = canvas.height / 2;

        drawGalaxyCore();

        ringParticles.forEach(particle => {
            particle.update();
            particle.draw(coreX, coreY);
        });

        stars.forEach(star => {
            star.update();
            star.draw();
        });
    }

    animateBackground(); 
}