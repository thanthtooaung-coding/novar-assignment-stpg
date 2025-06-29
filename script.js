// Modern PaperPrint Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initTabs();
    initForms();
    initAnimations();
    initNotifications();
    initInteractiveElements();
    initHeaderEffects();
    initLazyLoading();
    
    // Navigation System
    function initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const pages = document.querySelectorAll('.page');
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        // Page navigation
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const pageId = this.getAttribute('data-page');
                if (pageId) {
                    showPage(pageId);
                    updateActiveNav(this);
                }
            });
        });
        
        // Mobile menu toggle
        if (hamburger) {
            hamburger.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                this.classList.toggle('active');
            });
        }
        
        function showPage(pageId) {
            pages.forEach(page => {
                page.classList.remove('active');
            });
            
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
                targetPage.classList.add('fade-in');
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
        
        function updateActiveNav(activeLink) {
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            activeLink.classList.add('active');
        }
        
        // Auth page switching
        const authSwitchLinks = document.querySelectorAll('.auth-switch a');
        authSwitchLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const pageId = this.getAttribute('data-page');
                if (pageId) {
                    showPage(pageId);
                }
            });
        });
    }
    
    // Tab System
    function initTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Update active button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update active pane
                tabPanes.forEach(pane => pane.classList.remove('active'));
                const targetPane = document.getElementById(tabId);
                if (targetPane) {
                    targetPane.classList.add('active');
                    targetPane.classList.add('fade-in');
                }
            });
        });
    }
    
    // Form Handling
    function initForms() {
        const contactForm = document.getElementById('contactForm');
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleFormSubmission(this, 'Thank you for your message! We\'ll get back to you soon.');
            });
        }
        
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleFormSubmission(this, 'Login successful! Welcome back.', () => {
                    setTimeout(() => {
                        showPage('profile');
                    }, 1500);
                });
            });
        }
        
        if (signupForm) {
            signupForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleFormSubmission(this, 'Account created successfully! Please sign in.', () => {
                    setTimeout(() => {
                        showPage('login');
                    }, 1500);
                });
            });
        }
        
        function handleFormSubmission(form, message, callback) {
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            // Simulate API call
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                
                window.showNotification(message, 'success');
                form.reset();
                
                if (callback) callback();
            }, 2000);
        }
        
        // Real-time form validation
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', validateEmail);
            input.addEventListener('input', clearValidation);
        });
        
        function validateEmail(e) {
            const email = e.target.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                e.target.classList.add('error');
                window.showNotification('Please enter a valid email address', 'error');
            }
        }
        
        function clearValidation(e) {
            e.target.classList.remove('error');
        }
    }
    
    // Animation System
    function initAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll('.service-card, .package-card, .team-member, .feature-item');
        animateElements.forEach(el => {
            observer.observe(el);
        });
        
        // Smooth scroll for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }
    
    // Notification System
    function initNotifications() {
        window.showNotification = function(message, type = 'info') {
            // Remove existing notifications
            const existingNotifications = document.querySelectorAll('.notification');
            existingNotifications.forEach(notification => {
                notification.remove();
            });
            
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-${getNotificationIcon(type)}"></i>
                    <span>${message}</span>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Auto remove after 4 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'slideOutRight 0.3s ease';
                    setTimeout(() => {
                        notification.remove();
                    }, 300);
                }
            }, 4000);
            
            // Click to dismiss
            notification.addEventListener('click', function() {
                this.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    this.remove();
                }, 300);
            });
        };
        
        function getNotificationIcon(type) {
            const icons = {
                success: 'check-circle',
                error: 'exclamation-circle',
                warning: 'exclamation-triangle',
                info: 'info-circle'
            };
            return icons[type] || icons.info;
        }
    }
    
    // Interactive Elements
    function initInteractiveElements() {
        // Service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('click', function() {
                const serviceName = this.querySelector('h3').textContent;
                window.showNotification(`Learn more about ${serviceName}`, 'info');
            });
        });
        
        // Package buttons
        const packageBtns = document.querySelectorAll('.package-btn');
        packageBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const packageName = this.textContent;
                window.showNotification(`${packageName} selected! Redirecting to checkout...`, 'success');
                
                // Simulate redirect
                setTimeout(() => {
                    window.showNotification('Checkout feature coming soon!', 'info');
                }, 2000);
            });
        });
        
        // Profile menu items
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all items
                menuItems.forEach(mi => mi.classList.remove('active'));
                
                if (this.classList.contains('logout')) {
                    window.showNotification('Logged out successfully!', 'success');
                    setTimeout(() => {
                        showPage('home');
                    }, 1500);
                } else {
                    // Add active class to clicked item
                    this.classList.add('active');
                    const feature = this.querySelector('span').textContent;
                    window.showNotification(`${feature} feature coming soon!`, 'info');
                }
            });
        });
        
        // Social login buttons
        const socialBtns = document.querySelectorAll('.btn-social');
        socialBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const provider = this.textContent.trim();
                window.showNotification(`${provider} login coming soon!`, 'info');
            });
        });
        
        // Hero buttons
        const heroButtons = document.querySelectorAll('.hero .btn');
        heroButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.textContent.includes('Get Started')) {
                    showPage('packages');
                } else if (this.textContent.includes('Portfolio')) {
                    window.showNotification('Portfolio feature coming soon!', 'info');
                }
            });
        });
        
        // Custom quote button
        const customQuoteBtn = document.querySelector('.custom-package .btn');
        if (customQuoteBtn) {
            customQuoteBtn.addEventListener('click', function() {
                window.showNotification('Custom quote request submitted! We\'ll contact you within 24 hours.', 'success');
            });
        }
    }
    
    // Header scroll effect
    function initHeaderEffects() {
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }
            
            // Hide/show header on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }
    
    // Lazy loading for images (if any are added later)
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Initialize the page
    showPage('home');
    
    // Utility functions
    function showPage(pageId) {
        const pages = document.querySelectorAll('.page');
        const navLinks = document.querySelectorAll('.nav-link');
        
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.classList.add('fade-in');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        const activeNavLink = document.querySelector(`[data-page="${pageId}"]`);
        if (activeNavLink) {
            activeNavLink.classList.add('active');
        }
    }
    
    // Add CSS for error states
    const errorStyles = document.createElement('style');
    errorStyles.textContent = `
        .form-group input.error,
        .form-group textarea.error {
            border-color: #ef4444;
            background-color: #fef2f2;
        }
        
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 1rem;
            border-radius: 0 0 0.5rem 0.5rem;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
        
        @media (min-width: 769px) {
            .nav-menu {
                display: flex !important;
            }
        }
    `;
    document.head.appendChild(errorStyles);
    
    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .notification {
            font-family: Arial, sans-serif;
            cursor: pointer;
            transition: transform 0.2s ease;
            position: fixed;
            top: 20px;
            right: 20px;
            background: #17a2b8;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        }
        
        .notification:hover {
            transform: translateX(-5px);
        }
        
        .notification.success {
            background: #28a745;
        }
        
        .notification.error {
            background: #dc3545;
        }
        
        .notification.warning {
            background: #ffc107;
        }
    `;
    document.head.appendChild(style);
    
    // Performance optimization
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
});