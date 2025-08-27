/**
 * Main JavaScript Module
 * Orchestrates all portfolio functionality
 */

class Portfolio {
    constructor() {
        this.modules = {};
        this.isLoaded = false;
        
        this.init();
    }

    async init() {
        try {
            // Show loading animation
            this.showLoading();

            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Initialize modules
            await this.initializeModules();

            // Setup global event listeners
            this.setupGlobalEvents();

            // Mark as loaded
            this.markAsLoaded();

        } catch (error) {
            console.error('Portfolio initialization failed:', error);
            this.handleInitError(error);
        }
    }

    async initializeModules() {
        try {
            // Initialize DevOps background effects
            this.initDevOpsBackground();

            // Initialize Navigation
            if (typeof Navigation !== 'undefined') {
                this.modules.navigation = new Navigation();
                console.log('✓ Navigation module initialized');
            }

            // Initialize Portfolio filtering
            if (typeof PortfolioFilter !== 'undefined') {
                this.modules.portfolio = new PortfolioFilter();
                console.log('✓ Portfolio module initialized');
            }

            // Initialize Contact Form
            if (typeof ContactForm !== 'undefined') {
                this.modules.contactForm = new ContactForm();
                console.log('✓ Contact Form module initialized');
            }

            // Initialize Animations
            if (typeof Animations !== 'undefined') {
                this.modules.animations = new Animations();
                console.log('✓ Animations module initialized');
            }

            // Initialize additional features
            this.initializeAdditionalFeatures();

        } catch (error) {
            console.error('Module initialization error:', error);
            throw error;
        }
    }

    initializeAdditionalFeatures() {
        // Hire Me button functionality
        this.setupHireButton();

        // Scroll indicator
        this.setupScrollIndicator();

        // Theme toggle (if needed)
        this.setupThemeToggle();

        // Performance monitoring
        this.setupPerformanceMonitoring();

        // Error tracking
        this.setupErrorTracking();
    }

    setupHireButton() {
        const hireBtn = document.querySelector('.hire-btn');
        if (hireBtn) {
            hireBtn.addEventListener('click', () => {
                const contactSection = document.querySelector('#contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }

    setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const aboutSection = document.querySelector('#about');
                if (aboutSection) {
                    aboutSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }

    setupThemeToggle() {
        // Future implementation for light/dark theme toggle
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme) {
            document.body.classList.add(`theme-${savedTheme}`);
        }
    }

    setupGlobalEvents() {
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Handle beforeunload
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    handleResize() {
        // Trigger resize events for modules
        Object.values(this.modules).forEach(module => {
            if (module.handleResize) {
                module.handleResize();
            }
        });
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - pause animations if needed
            this.pauseAnimations();
        } else {
            // Page is visible - resume animations
            this.resumeAnimations();
        }
    }

    handleKeyboardShortcuts(e) {
        // Example shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'k':
                    e.preventDefault();
                    this.focusSearch();
                    break;
                case '/':
                    e.preventDefault();
                    this.showHelp();
                    break;
            }
        }

        // Escape key handling
        if (e.key === 'Escape') {
            this.handleEscape();
        }
    }

    focusSearch() {
        // Focus portfolio filter or search if available
        const firstFilterBtn = document.querySelector('.filter-btn');
        if (firstFilterBtn) {
            firstFilterBtn.focus();
        }
    }

    showHelp() {
        // Show keyboard shortcuts help
        console.log('Keyboard shortcuts:', {
            'Ctrl/Cmd + K': 'Focus portfolio filter',
            'Ctrl/Cmd + /': 'Show this help',
            'Escape': 'Close modals/menus'
        });
    }

    handleEscape() {
        // Close any open modals or menus
        const openModal = document.querySelector('.portfolio-modal.active');
        if (openModal && this.modules.portfolio) {
            this.modules.portfolio.closeModal();
        }

        const activeMenu = document.querySelector('.nav-menu.active');
        if (activeMenu && this.modules.navigation) {
            this.modules.navigation.closeMobileMenu();
        }
    }

    pauseAnimations() {
        document.body.classList.add('animations-paused');
    }

    resumeAnimations() {
        document.body.classList.remove('animations-paused');
    }

    setupPerformanceMonitoring() {
        // Monitor performance
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const loadTime = perfData.loadEventEnd - perfData.fetchStart;
                    
                    if (loadTime > 3000) {
                        console.warn('Slow page load detected:', loadTime + 'ms');
                    }
                    
                    // Log to analytics if needed
                    this.logPerformance(loadTime);
                }, 0);
            });
        }
    }

    setupErrorTracking() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.logError(e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.logError(e.reason);
        });
    }

    logPerformance(loadTime) {
        // Send to analytics service
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load_time', {
                custom_parameter: loadTime
            });
        }
    }

    logError(error) {
        // Send to error tracking service
        console.error('Logged error:', error);
    }

    showLoading() {
        const loading = document.createElement('div');
        loading.className = 'loading';
        loading.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(loading);
    }

    markAsLoaded() {
        setTimeout(() => {
            document.body.classList.add('loaded');
            this.hideLoading();
            this.isLoaded = true;
            
            // Trigger loaded event
            document.dispatchEvent(new CustomEvent('portfolioLoaded'));
            
            console.log('🎉 Portfolio fully loaded and ready!');
        }, 1000);
    }

    hideLoading() {
        const loading = document.querySelector('.loading');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.remove();
            }, 500);
        }
    }

    handleInitError(error) {
        console.error('Portfolio initialization failed:', error);
        
        // Show error message to user
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #ff4757;
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                z-index: 10000;
            ">
                <h3>Oops! Something went wrong</h3>
                <p>Please refresh the page to try again.</p>
                <button onclick="location.reload()" style="
                    background: white;
                    color: #ff4757;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 10px;
                ">Refresh Page</button>
            </div>
        `;
        document.body.appendChild(errorDiv);
    }

    cleanup() {
        // Cleanup modules
        Object.values(this.modules).forEach(module => {
            if (module.destroy) {
                module.destroy();
            }
        });

        console.log('Portfolio cleanup completed');
    }

    initDevOpsBackground() {
        // Add subtle mouse interaction to tech icons
        const techIcons = document.querySelectorAll('.tech-icon');
        
        techIcons.forEach((icon, index) => {
            // Add random color variation
            const colors = ['var(--primary-color)', '#00ff9d', '#3498db', '#9b59b6', '#f39c12'];
            icon.style.color = colors[index % colors.length];
            
            // Add mouse proximity effect
            icon.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.3)';
                icon.style.opacity = '0.8';
            });
            
            icon.addEventListener('mouseleave', () => {
                icon.style.transform = 'scale(1)';
                icon.style.opacity = '0.4';
            });
        });

        // Add parallax effect to DevOps watermark on scroll
        const watermark = document.querySelector('.devops-watermark');
        if (watermark) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.1;
                watermark.style.transform = `translate(-50%, -50%) rotate(-45deg) translateY(${rate}px)`;
            });
        }

        console.log('✓ DevOps background effects initialized');
    }

    // Public API methods
    getModule(name) {
        return this.modules[name];
    }

    isReady() {
        return this.isLoaded;
    }

    // Method to reload specific module
    reloadModule(name) {
        if (this.modules[name] && this.modules[name].destroy) {
            this.modules[name].destroy();
        }

        // Reinitialize based on module name
        switch (name) {
            case 'navigation':
                this.modules.navigation = new Navigation();
                break;
            case 'portfolio':
                this.modules.portfolio = new PortfolioFilter();
                break;
            case 'contactForm':
                this.modules.contactForm = new ContactForm();
                break;
            case 'animations':
                this.modules.animations = new Animations();
                break;
        }
    }
}

// Initialize portfolio when DOM is ready
const portfolioApp = new Portfolio();

// Make it globally available for debugging
window.Portfolio = portfolioApp;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Portfolio;
}
