// Theme Management
class ThemeManager {
    constructor() {
        this.themeSwitch = document.getElementById('theme-switch');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Update switch position
        this.themeSwitch.checked = this.currentTheme === 'dark';
        
        // Add event listener
        this.themeSwitch.addEventListener('change', () => {
            this.currentTheme = this.themeSwitch.checked ? 'dark' : 'light';
            this.setTheme(this.currentTheme);
            this.saveTheme();
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector("meta[name=theme-color]");
        if (metaThemeColor) {
            metaThemeColor.setAttribute("content", theme === 'dark' ? '#0f172a' : '#ffffff');
        }
    }

    saveTheme() {
        localStorage.setItem('theme', this.currentTheme);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(this.currentTheme);
        this.themeSwitch.checked = this.currentTheme === 'dark';
        this.saveTheme();
    }
}

// Smooth scrolling for navigation links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Navbar background change on scroll
function initNavbarScroll() {
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'var(--card-bg)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'var(--card-bg)';
            navbar.style.backdropFilter = 'none';
        }
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isDisplayed = navLinks.style.display === 'flex';
            navLinks.style.display = isDisplayed ? 'none' : 'flex';
            hamburger.classList.toggle('active');
        });
    }
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Basic validation
            if (!name || !email || !message) {
                this.showAlert('Please fill in all fields', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                this.showAlert('Please enter a valid email address', 'error');
                return;
            }
            
            // Here you would typically send the data to a server
            console.log('Form submitted:', { name, email, message });
            
            // Show success message
            this.showAlert('Thank you for your message! I will get back to you soon.', 'success');
            this.reset();
        });
        
        // Add alert method to form
        contactForm.showAlert = function(message, type) {
            // Remove existing alerts
            const existingAlert = this.querySelector('.form-alert');
            if (existingAlert) {
                existingAlert.remove();
            }
            
            // Create new alert
            const alert = document.createElement('div');
            alert.className = `form-alert ${type}`;
            alert.textContent = message;
            alert.style.cssText = `
                padding: 1rem;
                margin: 1rem 0;
                border-radius: var(--border-radius);
                background: ${type === 'error' ? '#fee2e2' : '#dcfce7'};
                color: ${type === 'error' ? '#dc2626' : '#16a34a'};
                border: 1px solid ${type === 'error' ? '#fecaca' : '#bbf7d0'};
            `;
            
            this.insertBefore(alert, this.firstChild);
            
            // Remove alert after 5 seconds
            setTimeout(() => {
                alert.remove();
            }, 5000);
        };
    }
}

// Animation on scroll
function initScrollAnimations() {
    const elements = document.querySelectorAll('.project-card, .skill-category, .about-content, .contact-content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Keyboard shortcut for theme toggle (Alt + T)
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            themeManager.toggleTheme();
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme manager
    window.themeManager = new ThemeManager();
    
    // Initialize all features
    initSmoothScroll();
    initNavbarScroll();
    initMobileMenu();
    initContactForm();
    initScrollAnimations();
    initKeyboardShortcuts();
    
    // Add current year to footer
    const footer = document.querySelector('.footer p');
    if (footer) {
        footer.innerHTML = `&copy; ${new Date().getFullYear()} John Doe. All rights reserved.`;
    }
    
    // Add theme info to console
    console.log(`%c🎨 Portfolio Theme: ${themeManager.currentTheme} mode`, 
        'color: #2563eb; font-weight: bold; font-size: 14px;');
    console.log(`%cPress Alt + T to toggle theme`, 
        'color: #64748b; font-style: italic;');
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager };
}