// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const galleryGrid = document.getElementById('gallery-grid');
const gallerySearch = document.getElementById('gallery-search');
const filterButtons = document.querySelectorAll('.filter-btn');
const loadMoreBtn = document.getElementById('load-more');
const modal = document.getElementById('modal');
const modalClose = document.querySelector('.modal-close');
const modalImage = document.getElementById('modal-image');
const modalVideo = document.getElementById('modal-video');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const contactForm = document.querySelector('.contact-form');

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.updateThemeIcon();

        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.updateThemeIcon();
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme() {
        if (this.currentTheme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }

    updateThemeIcon() {
        const icon = themeToggle.querySelector('i');
        if (this.currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
        // Also update dock icon if present
        const dockIcon = document.getElementById('dock-theme-icon');
        if (dockIcon) {
            if (this.currentTheme === 'dark') {
                dockIcon.className = 'fas fa-sun';
                dockIcon.parentElement?.parentElement?.setAttribute('aria-pressed', 'true');
            } else {
                dockIcon.className = 'fas fa-moon';
                dockIcon.parentElement?.parentElement?.setAttribute('aria-pressed', 'false');
            }
        }
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        // Mobile menu toggle
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Header background on scroll
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(var(--card-rgb), 0.95)';
            } else {
                header.style.background = 'var(--card)';
            }
        });
    }
}

// Gallery Management
class GalleryManager {
    constructor() {
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.galleryItems = [];
        this.visibleItems = 6;
        this.init();
    }

    init() {
        this.galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

        // Filter buttons
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setActiveFilter(e.target);
                this.currentFilter = e.target.dataset.filter;
                this.filterItems();
            });
        });

        // Search functionality
        gallerySearch.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.filterItems();
        });

        // Load more functionality
        loadMoreBtn.addEventListener('click', () => {
            this.loadMoreItems();
        });

        // Initial filter
        this.filterItems();
        this.updateLoadMoreButton();
    }

    setActiveFilter(activeBtn) {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    filterItems() {
        let visibleCount = 0;

        this.galleryItems.forEach((item, index) => {
            const categories = item.dataset.category.toLowerCase();
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();

            const matchesFilter = this.currentFilter === 'all' ||
                categories.includes(this.currentFilter);
            const matchesSearch = this.searchTerm === '' ||
                title.includes(this.searchTerm) ||
                description.includes(this.searchTerm) ||
                categories.includes(this.searchTerm);

            if (matchesFilter && matchesSearch) {
                if (visibleCount < this.visibleItems) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            } else {
                item.classList.add('hidden');
                setTimeout(() => {
                    if (item.classList.contains('hidden')) {
                        item.style.display = 'none';
                    }
                }, 500);
            }
        });

        this.updateLoadMoreButton();
    }

    loadMoreItems() {
        this.visibleItems += 6;
        this.filterItems();
    }

    updateLoadMoreButton() {
        const hiddenItems = this.galleryItems.filter(item =>
            item.style.display === 'none' &&
            !item.classList.contains('hidden')
        );

        if (hiddenItems.length === 0) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
    }
}

// Modal Management
class ModalManager {
    constructor() {
        this.init();
    }

    init() {
        // Close modal events
        modalClose.addEventListener('click', () => {
            this.closeModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                this.closeModal();
            }
        });
    }

    openImageModal(title, description, src) {
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalImage.src = src;
        modalImage.style.display = 'block';
        modalVideo.style.display = 'none';
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    openVideoModal(title, description) {
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalImage.style.display = 'none';
        modalVideo.style.display = 'block';

        // Create a placeholder video or embed
        modalVideo.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #000; color: white; font-size: 1.2rem;">
                <div style="text-align: center;">
                    <i class="fas fa-play" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    <p>Video Preview</p>
                    <p style="font-size: 0.9rem; opacity: 0.7;">Click to play video content</p>
                </div>
            </div>
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        modalVideo.innerHTML = '';
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.observeElements();
        this.initParallax();
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Add animation classes to elements
        document.querySelectorAll('.gallery-item, .feature, .stat-card, .contact-item').forEach(el => {
            el.classList.add('scroll-animate');
            observer.observe(el);
        });
    }

    initParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-visual');

            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
}

// Form Management
class FormManager {
    constructor() {
        this.init();
    }

    init() {
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(e.target);
            });
        }
    }

    async handleFormSubmission(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            this.showNotification('Message sent successfully!', 'success');
            form.reset();
        } catch (error) {
            // Show error message
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? 'var(--primary)' : 'var(--destructive)'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: var(--radius);
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
            ">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation-triangle'}"></i>
                ${message}
            </div>
        `;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Cart Management
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.updateCartUI();
    }

    addItem(title, price) {
        this.cart.push({ title, price, id: Date.now() });
        this.saveCart();
        this.updateCartUI();

        // Show notification
        if (window.formManager) {
            window.formManager.showNotification(`Added "${title}" to cart ($${price})`, 'success');
        } else {
            alert(`Added "${title}" to cart!`);
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartUI() {
        // Update cart count if we had a cart icon
        const cartCount = this.cart.length;
        // console.log('Cart updated:', cartCount, 'items');
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Global Functions for HTML onclick handlers
window.openModal = function (button) {
    const title = button.dataset.title;
    const description = button.dataset.description;
    const src = button.dataset.src;

    window.modalManager.openImageModal(title, description, src);
};

window.openVideoModal = function (button) {
    const title = button.dataset.title;
    const description = button.dataset.description;

    window.modalManager.openVideoModal(title, description);
};

window.addToCart = function (title, price) {
    if (window.cartManager) {
        window.cartManager.addItem(title, price);
    }
};



// Performance Optimization
function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Additional CSS animations for notifications
const additionalCSS = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

// Add CSS to document
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    window.themeManager = new ThemeManager();
    window.navigationManager = new NavigationManager();
    window.galleryManager = new GalleryManager();
    window.modalManager = new ModalManager();
    window.animationManager = new AnimationManager();
    window.formManager = new FormManager();
    window.cartManager = new CartManager();


    // Initialize lazy loading
    lazyLoadImages();

    // Add loading states
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Handle resize events
    window.addEventListener('resize', debounce(() => {
        // Recalculate layouts if needed
        window.galleryManager.filterItems();
    }, 250));

    // Add smooth scroll behavior for better UX
    document.documentElement.style.scrollBehavior = 'smooth';

    console.log('LynDoo shop initialized successfully!');
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('Back online');
});

window.addEventListener('offline', () => {
    console.log('Gone offline');
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        NavigationManager,
        GalleryManager,
        ModalManager,
        AnimationManager,
        FormManager,
        CartManager
    };
}
