// Enhanced Background Animations
class BackgroundAnimations {
    constructor() {
        this.particlesContainer = document.getElementById('particles');
        this.particleCount = 50;
        this.particles = [];
        this.init();
    }

    init() {
        this.createParticles();
        this.startAnimationLoop();
        this.handleResize();
    }

    createParticles() {
        if (!this.particlesContainer) return;

        for (let i = 0; i < this.particleCount; i++) {
            const particle = this.createParticle();
            this.particles.push(particle);
            this.particlesContainer.appendChild(particle.element);
        }
    }

    createParticle() {
        const element = document.createElement('div');
        element.className = 'particle';
        
        const size = Math.random() * 4 + 1;
        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight + size;
        const speed = Math.random() * 2 + 0.5;
        const opacity = Math.random() * 0.3 + 0.1;

        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.opacity = opacity;

        return {
            element,
            x,
            y,
            speed,
            size,
            opacity
        };
    }

    updateParticles() {
        this.particles.forEach((particle, index) => {
            particle.y -= particle.speed;
            particle.element.style.top = `${particle.y}px`;

            // Reset particle when it goes off screen
            if (particle.y < -particle.size) {
                particle.y = window.innerHeight + particle.size;
                particle.x = Math.random() * window.innerWidth;
                particle.element.style.left = `${particle.x}px`;
                particle.element.style.top = `${particle.y}px`;
            }
        });
    }

    startAnimationLoop() {
        const animate = () => {
            this.updateParticles();
            requestAnimationFrame(animate);
        };
        animate();
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.particles.forEach(particle => {
                if (particle.x > window.innerWidth) {
                    particle.x = Math.random() * window.innerWidth;
                    particle.element.style.left = `${particle.x}px`;
                }
            });
        });
    }
}

// Performance optimizations
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeImages();
        this.enableLazyLoading();
        this.preloadCriticalResources();
        this.optimizeAnimations();
    }

    optimizeImages() {
        // Add loading="lazy" to non-critical images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }

    enableLazyLoading() {
        // Intersection Observer for lazy loading elements
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe sections for animations
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    preloadCriticalResources() {
        // Preload critical fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
        fontLink.as = 'style';
        fontLink.onload = function() {
            this.onload = null;
            this.rel = 'stylesheet';
        };
        document.head.appendChild(fontLink);
    }

    optimizeAnimations() {
        // Reduce animations on slower devices
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (mediaQuery.matches) {
            document.body.classList.add('reduce-motion');
        }

        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            const animations = document.querySelectorAll('[style*="animation"]');
            animations.forEach(el => {
                if (document.hidden) {
                    el.style.animationPlayState = 'paused';
                } else {
                    el.style.animationPlayState = 'running';
                }
            });
        });
    }
}

// Enhanced scroll effects
class ScrollEffects {
    constructor() {
        this.init();
    }

    init() {
        this.parallaxElements = document.querySelectorAll('.tech-icon');
        this.handleScroll();
        this.addScrollListener();
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        this.parallaxElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.02);
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0) rotate(${scrolled * 0.1}deg)`;
        });
    }

    addScrollListener() {
        let ticking = false;

        const updateScroll = () => {
            this.handleScroll();
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScroll);
                ticking = true;
            }
        });
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new BackgroundAnimations();
    new PerformanceOptimizer();
    new ScrollEffects();
});

// Export for use in other modules
window.BackgroundAnimations = BackgroundAnimations;
