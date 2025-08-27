/**
 * Animations Module
 * Handles scroll animations, counters, and visual effects
 */

class Animations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observers = new Map();
        this.init();
    }

    init() {
        this.createIntersectionObserver();
        this.initParticles();
        this.initTypingAnimation();
        this.initCounters();
        this.initParallax();
    }

    createIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, this.observerOptions);

        // Observe elements for animation
        const elementsToAnimate = document.querySelectorAll(
            '.service-card, .portfolio-item, .stat-item, .skill-category, .about-text, .contact-info, .contact-form'
        );

        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });

        this.observers.set('intersection', observer);
    }

    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';

        // Add special animations for specific elements
        if (element.classList.contains('stat-item')) {
            this.animateStatCounter(element);
        }

        if (element.classList.contains('skill-category')) {
            this.animateSkillBars(element);
        }
    }

    animateStatCounter(statElement) {
        const numberElement = statElement.querySelector('.stat-number');
        if (!numberElement) return;

        const target = numberElement.textContent;
        const numericValue = parseInt(target.replace(/\D/g, ''));
        const suffix = target.replace(/\d/g, '');

        if (isNaN(numericValue)) return;

        this.animateCounter(numberElement, 0, numericValue, 2000, suffix);
    }

    animateCounter(element, start, end, duration, suffix = '') {
        const startTime = performance.now();
        const range = end - start;

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (range * easeOut));
            
            element.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = end + suffix;
            }
        };

        requestAnimationFrame(updateCounter);
    }

    animateSkillBars(skillElement) {
        const progressBars = skillElement.querySelectorAll('.progress-fill');
        
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                const skillLevel = bar.getAttribute('data-skill-level') || '90%';
                bar.style.width = skillLevel;
            }, index * 200);
        });
    }

    initTypingAnimation() {
        const heroTitle = document.querySelector('.hero-text h1');
        if (!heroTitle) return;

        const originalText = heroTitle.textContent;
        const highlightStart = originalText.indexOf('Ali Wazeer');
        
        if (highlightStart === -1) return;

        // Clear the title
        heroTitle.innerHTML = '';

        // Create typing effect
        this.typeWriter(heroTitle, originalText, 50, highlightStart, highlightStart + 10);
    }

    typeWriter(element, text, speed, highlightStart, highlightEnd) {
        let i = 0;
        
        const type = () => {
            if (i < text.length) {
                const char = text.charAt(i);
                
                if (i === highlightStart) {
                    element.innerHTML += '<span class="highlight">';
                }
                
                element.innerHTML += char;
                
                if (i === highlightEnd - 1) {
                    element.innerHTML += '</span>';
                }
                
                i++;
                setTimeout(type, speed);
            }
        };

        // Start typing after a delay
        setTimeout(type, 1000);
    }

    initParticles() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        heroSection.appendChild(particlesContainer);

        // Create particles
        for (let i = 0; i < 50; i++) {
            this.createParticle(particlesContainer);
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation delay and duration
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        
        container.appendChild(particle);
    }

    initCounters() {
        // Create observer specifically for stats section
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach((stat, index) => {
                        setTimeout(() => {
                            this.animateStatCounter(stat.closest('.stat-item'));
                        }, index * 300);
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const aboutSection = document.querySelector('.about');
        if (aboutSection) {
            statsObserver.observe(aboutSection);
        }

        this.observers.set('stats', statsObserver);
    }

    initParallax() {
        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-content');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });

            ticking = false;
        };

        const requestParallaxUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestParallaxUpdate);
    }

    // Loading animation
    showLoading() {
        const loading = document.createElement('div');
        loading.className = 'loading';
        loading.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(loading);
        
        return loading;
    }

    hideLoading() {
        const loading = document.querySelector('.loading');
        if (loading) {
            loading.classList.add('hidden');
            setTimeout(() => loading.remove(), 500);
        }
    }

    // Page transitions
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }

    fadeOut(element, duration = 300) {
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = '0';
        
        return new Promise(resolve => {
            setTimeout(() => resolve(), duration);
        });
    }

    slideInFromLeft(element, duration = 500) {
        element.style.transform = 'translateX(-100%)';
        element.style.transition = `transform ${duration}ms ease-out`;
        
        requestAnimationFrame(() => {
            element.style.transform = 'translateX(0)';
        });
    }

    slideInFromRight(element, duration = 500) {
        element.style.transform = 'translateX(100%)';
        element.style.transition = `transform ${duration}ms ease-out`;
        
        requestAnimationFrame(() => {
            element.style.transform = 'translateX(0)';
        });
    }

    // Cleanup method
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }

    // Public methods for external use
    animateOnScroll(selector, animation = 'fadeInUp') {
        const elements = document.querySelectorAll(selector);
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(`animate-${animation}`);
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        elements.forEach(el => observer.observe(el));
    }

    pulse(element, duration = 1000) {
        element.style.animation = `pulse ${duration}ms ease-in-out`;
        
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }
}

// Dynamic Typing Effect for Hero Section
class TypeWriter {
    constructor(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.wait = parseInt(wait, 10);
        this.txt = '';
        this.wordIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.element.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Enhanced Page Loading Animation
function initializePageAnimations() {
    // Add loading animation to body
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
        
        // Initialize typing effect
        const titleHighlight = document.querySelector('.title-highlight');
        if (titleHighlight) {
            const roles = [
                'DevOps & Cloud Engineer',
                'Linux Administrator',
                'Infrastructure',
                'AWS Certified'
            ];
            new TypeWriter(titleHighlight, roles, 3000);
        }
        
        // Animate stats counters
        animateCounters();
        
        // Initialize particle background
        initializeParticles();
    });
}

// Counter Animation for Statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    counters.forEach(counter => {
        const animate = () => {
            const value = +counter.getAttribute('data-target') || +counter.innerText.replace(/\+/g, '');
            const data = +counter.innerText.replace(/\+/g, '') || 0;
            const time = value / speed;
            
            if (data < value) {
                counter.innerText = Math.ceil(data + time);
                setTimeout(animate, 50);
            } else {
                const originalText = counter.getAttribute('data-original') || counter.innerText;
                counter.innerText = originalText;
            }
        };
        
        // Store original text and set data-target
        if (!counter.getAttribute('data-original')) {
            counter.setAttribute('data-original', counter.innerText);
            counter.setAttribute('data-target', counter.innerText.replace(/\+/g, ''));
        }
        
        animate();
    });
}

// Particle Background Effect
function initializeParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            dx: (Math.random() - 0.5) * 0.5,
            dy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.1
        };
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }

    function updateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.x += particle.dx;
            particle.y += particle.dy;

            if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 157, ${particle.opacity})`;
            ctx.fill();
        });

        requestAnimationFrame(updateParticles);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initParticles();
    updateParticles();
}

// Enhanced Smooth Scrolling with Progress Indicator
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--primary-color-dark));
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Enhanced Portfolio Filter Animation
function enhancePortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter portfolio items with animation
            portfolioItems.forEach((item, index) => {
                const categories = item.getAttribute('data-category').split(' ');
                
                if (filter === 'all' || categories.includes(filter)) {
                    setTimeout(() => {
                        item.style.display = 'block';
                        item.style.animation = 'portfolioItemFadeIn 0.5s ease-out forwards';
                    }, index * 100);
                } else {
                    item.style.animation = 'fadeOut 0.3s ease-out forwards';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Initialize all enhancements
document.addEventListener('DOMContentLoaded', function() {
    initializePageAnimations();
    addScrollProgress();
    enhancePortfolioFilters();
});

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    
    .txt::after {
        content: '|';
        display: inline-block;
        animation: blink 1s infinite;
        color: var(--primary-color);
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
`;
document.head.appendChild(style);

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Animations;
} else {
    window.Animations = Animations;
}
