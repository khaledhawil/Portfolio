/**
 * Portfolio Module
 * Handles portfolio filtering and modal functionality
 */

class PortfolioFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.portfolioItems = document.querySelectorAll('.portfolio-item');
        this.modal = document.querySelector('.portfolio-modal');
        this.modalContent = document.querySelector('.portfolio-modal-content');
        this.modalClose = document.querySelector('.portfolio-modal-close');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeFilter();
    }

    bindEvents() {
        // Filter button events
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleFilter(e));
        });

        // Portfolio item click events (for modal)
        this.portfolioItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleItemClick(e));
        });

        // Modal close events
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => this.closeModal());
        }

        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    initializeFilter() {
        // Show all items initially
        this.portfolioItems.forEach(item => {
            item.classList.add('visible');
            item.classList.remove('hidden');
        });
    }

    handleFilter(e) {
        const button = e.target;
        const filterValue = button.getAttribute('data-filter');

        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter portfolio items
        this.filterItems(filterValue);
    }

    filterItems(filterValue) {
        this.portfolioItems.forEach(item => {
            const categories = item.getAttribute('data-category');
            const shouldShow = filterValue === 'all' || categories.includes(filterValue);

            if (shouldShow) {
                item.classList.remove('hidden');
                item.classList.add('visible');
                item.style.display = 'block';
                
                // Animate in
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            } else {
                item.classList.remove('visible');
                item.classList.add('hidden');
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                
                // Hide after animation
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    handleItemClick(e) {
        const item = e.currentTarget;
        const projectData = this.extractProjectData(item);
        
        if (this.modal) {
            this.openModal(projectData);
        } else {
            // Fallback: scroll to project or show details inline
            console.log('Project clicked:', projectData);
        }
    }

    extractProjectData(item) {
        const title = item.querySelector('.portfolio-content h3')?.textContent || 'Project';
        const description = item.querySelector('.portfolio-content p')?.textContent || 'No description available';
        const tech = Array.from(item.querySelectorAll('.portfolio-tech span')).map(span => span.textContent);
        const image = item.querySelector('.portfolio-image img')?.src || '';
        const category = item.getAttribute('data-category') || '';

        return {
            title,
            description,
            tech,
            image,
            category
        };
    }

    openModal(projectData) {
        if (!this.modal || !this.modalContent) return;

        // Populate modal content
        this.modalContent.innerHTML = `
            <button class="portfolio-modal-close" aria-label="Close modal">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-header">
                <h2>${projectData.title}</h2>
                <div class="modal-tech">
                    ${projectData.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
            <div class="modal-body">
                ${projectData.image ? `<img src="${projectData.image}" alt="${projectData.title}" class="modal-image">` : ''}
                <p>${projectData.description}</p>
                <div class="modal-actions">
                    <button class="btn btn-outline">View Live</button>
                    <button class="btn">View Code</button>
                </div>
            </div>
        `;

        // Re-bind close event
        const closeBtn = this.modalContent.querySelector('.portfolio-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Show modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        if (!this.modal) return;

        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Public method to filter programmatically
    filterByCategory(category) {
        this.filterItems(category);
        
        // Update active button
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === category) {
                btn.classList.add('active');
            }
        });
    }

    // Public method to get current filter
    getCurrentFilter() {
        const activeButton = document.querySelector('.filter-btn.active');
        return activeButton ? activeButton.getAttribute('data-filter') : 'all';
    }
}

// Enhanced Portfolio Functionality
const projectDetails = {
    weather: {
        title: "WeatherApp – CI/CD with GitHub Actions & ArgoCD",
        description: "A comprehensive weather application demonstrating modern DevOps practices with complete CI/CD pipeline.",
        features: [
            "Microservices architecture with Go, Python, and Node.js",
            "GitHub Actions for automated CI/CD pipeline",
            "ArgoCD for GitOps-based deployment",
            "Kubernetes cluster orchestration",
            "Docker containerization",
            "Automated testing and security scanning",
            "Multi-environment deployment strategy"
        ],
        architecture: "The application follows a microservices architecture where each service is containerized and deployed independently. The CI pipeline automatically builds, tests, and scans for vulnerabilities before deploying to the Kubernetes cluster via ArgoCD.",
        technologies: ["GitHub Actions", "ArgoCD", "Kubernetes", "Docker", "Go", "Python", "Node.js", "Helm"]
    },
    iti: {
        title: "ITI Final Project – Full DevOps on AWS (MERN Stack)",
        description: "Complete DevOps implementation for a MERN stack application on AWS infrastructure.",
        features: [
            "Infrastructure as Code using Terraform",
            "Configuration management with Ansible",
            "Jenkins CI/CD pipeline integration",
            "AWS CloudWatch monitoring and alerting",
            "Trivy security scanning",
            "ArgoCD for continuous deployment",
            "Auto-scaling and load balancing",
            "Multi-tier architecture on AWS"
        ],
        architecture: "Fully automated AWS infrastructure provisioning using Terraform, configured with Ansible, and monitored through CloudWatch. The MERN application is deployed using a robust CI/CD pipeline with security scanning at every stage.",
        technologies: ["AWS", "Terraform", "Ansible", "Jenkins", "ArgoCD", "Docker", "Trivy", "CloudWatch", "MongoDB", "Express", "React", "Node.js"]
    },
    islamic: {
        title: "Islamic App – Full DevOps Deployment (React/Flask)",
        description: "Islamic application with React frontend and Flask backend, featuring complete DevOps automation.",
        features: [
            "React.js frontend with modern UI/UX",
            "Flask Python backend API",
            "PostgreSQL database with replication",
            "Docker containerization strategy",
            "Kubernetes orchestration",
            "Jenkins automated CI/CD",
            "ArgoCD GitOps workflow",
            "Trivy security scanning"
        ],
        architecture: "Full-stack application with React frontend and Flask backend, containerized and deployed on Kubernetes. The deployment process is fully automated using Jenkins and ArgoCD with comprehensive security scanning.",
        technologies: ["React", "Flask", "PostgreSQL", "Docker", "Kubernetes", "Jenkins", "ArgoCD", "Trivy", "Python", "JavaScript"]
    }
};

function showProjectDetails(projectKey) {
    const project = projectDetails[projectKey];
    if (!project) return;

    const modalContent = document.getElementById('projectDetails');
    modalContent.innerHTML = `
        <h2 style="color: var(--primary-color); margin-bottom: var(--spacing-lg);">${project.title}</h2>
        
        <div style="margin-bottom: var(--spacing-xl);">
            <h3 style="color: var(--text-primary); margin-bottom: var(--spacing-md);">Project Overview</h3>
            <p style="color: var(--text-secondary); line-height: 1.6;">${project.description}</p>
        </div>

        <div style="margin-bottom: var(--spacing-xl);">
            <h3 style="color: var(--text-primary); margin-bottom: var(--spacing-md);">Key Features</h3>
            <ul style="color: var(--text-secondary); padding-left: var(--spacing-lg);">
                ${project.features.map(feature => `<li style="margin-bottom: var(--spacing-xs);">${feature}</li>`).join('')}
            </ul>
        </div>

        <div style="margin-bottom: var(--spacing-xl);">
            <h3 style="color: var(--text-primary); margin-bottom: var(--spacing-md);">Architecture & Implementation</h3>
            <p style="color: var(--text-secondary); line-height: 1.6;">${project.architecture}</p>
        </div>

        <div>
            <h3 style="color: var(--text-primary); margin-bottom: var(--spacing-md);">Technologies Used</h3>
            <div style="display: flex; flex-wrap: wrap; gap: var(--spacing-sm);">
                ${project.technologies.map(tech => `
                    <span style="
                        background: rgba(0, 255, 157, 0.1);
                        color: var(--primary-color);
                        padding: var(--spacing-xs) var(--spacing-sm);
                        border-radius: var(--border-radius-sm);
                        font-size: var(--font-size-xs);
                        font-weight: var(--font-weight-medium);
                        border: 1px solid rgba(0, 255, 157, 0.2);
                    ">${tech}</span>
                `).join('')}
            </div>
        </div>
    `;

    const modal = document.getElementById('projectModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Modal close functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.project-modal-close');

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Add floating action buttons
    addFloatingActions();
    
    // Initialize scroll animations
    initializeScrollAnimations();
});

function addFloatingActions() {
    const floatingActions = document.createElement('div');
    floatingActions.className = 'floating-actions';
    floatingActions.innerHTML = `
        <button class="floating-btn scroll-to-top" onclick="scrollToTop()" title="Back to Top">
            <i class="fas fa-arrow-up"></i>
        </button>
        <a href="https://github.com/khaledhawil" target="_blank" class="floating-btn" title="GitHub Profile">
            <i class="fab fa-github"></i>
        </a>
    `;
    document.body.appendChild(floatingActions);

    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        const scrollBtn = document.querySelector('.scroll-to-top');
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function initializeScrollAnimations() {
    // Intersection Observer for portfolio items
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    // Observe all portfolio items
    document.querySelectorAll('.portfolio-item').forEach(item => {
        observer.observe(item);
    });
}
