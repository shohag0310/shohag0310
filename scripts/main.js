// =============================================================================
// Modern Portfolio Website JavaScript
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeThemeToggle();
    initializeScrollEffects();
    initializeAnimations();
    initializeContactForm(); // This function is updated
    initializeTypingEffect();
    initializeSmoothScrolling();
});

// =============================================================================
// Navigation Functionality
// =============================================================================

function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide navbar on scroll down, show on scroll up
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all nav links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section's nav link
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}

// =============================================================================
// Theme Toggle Functionality
// =============================================================================

function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const currentTheme = savedTheme || systemTheme;
    
    // Apply theme immediately to prevent flash
    applyTheme(currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', function() {
        // Add click animation
        themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 150);
        
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Apply theme with transition
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Animate icon transition
        themeIcon.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            themeIcon.style.transform = '';
        }, 300);
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            applyTheme(newTheme);
            updateThemeIcon(newTheme);
        }
    });
    
    function applyTheme(theme) {
        // Add a smooth transition class
        document.documentElement.classList.add('theme-transitioning');
        document.documentElement.setAttribute('data-theme', theme);
        
        // Remove transition class after animation
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
        }, 300);
    }

    function updateThemeIcon(theme) {
        themeIcon.style.transition = 'transform 0.3s ease';
        
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
            themeToggle.setAttribute('title', 'Switch to light mode');
        } else {
            themeIcon.className = 'fas fa-moon';
            themeToggle.setAttribute('title', 'Switch to dark mode');
        }
    }
}

// =============================================================================
// Scroll Effects
// =============================================================================

function initializeScrollEffects() {
    // Back to top button
    const backToTopButton = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });

    // Scroll progress indicator
    const progressBar = createProgressBar();
    
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

    function createProgressBar() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'scroll-progress';
        progressContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(37, 99, 235, 0.1);
            z-index: 9999;
        `;

        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            width: 0%;
            transition: width 0.3s ease;
        `;

        progressContainer.appendChild(progressBar);
        document.body.appendChild(progressContainer);
        
        return progressBar;
    }
}

// =============================================================================
// Animation Effects
// =============================================================================

function initializeAnimations() {
    // Intersection Observer for scroll animations
    const animatedElements = document.querySelectorAll('.stat-item, .service-item, .skill-item, .project-card, .timeline-item');
    
    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
                
                // Add staggered animation delay for grid items
                const siblings = Array.from(entry.target.parentNode.children);
                const index = siblings.indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`;
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });

    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    function animateCounter(element) {
        const target = parseInt(element.textContent);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = element.textContent.includes('+') ? target + '+' : 
                                     element.textContent.includes('%') ? target + '%' : target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Skill items hover effect
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Project cards 3D tilt effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// =============================================================================
// Typing Animation Effect
// =============================================================================

function initializeTypingEffect() {
    const subtitleElement = document.querySelector('.hero-subtitle');
    if (!subtitleElement) return;

    // These titles are aligned with the resume
    // const titles = [
    //     'Senior Software Engineer',
    //     'Team Lead',
    //     'Full Stack Developer',
    //     '.NET & C# Expert',
    //     'FinTech Specialist',
    //     'Microservices Architect',
    //     'Mobile App Developer',
    //     'Problem Solver'
    // ];

    const titles = [
        'Senior Software Engineer',      // from resume [cite: 50]
        'Technical Team Lead',           // from resume [cite: 29]
        'Full-Stack Developer',          // from resume [cite: 16, 115]
        'FinTech Solutions Expert',      // from resume [cite: 13, 111]
        'Microservices Architect',       // from resume [cite: 13, 112]
        'Mobile Application Developer',  // from resume [cite: 14, 112]
        'Clean Architecture Advocate'    // from resume [cite: 19]
    ];

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;

    function typeTitle() {
        const currentTitle = titles[titleIndex];
        
        if (isWaiting) {
            setTimeout(() => {
                isWaiting = false;
                isDeleting = true;
                typeTitle();
            }, 2000);
            return;
        }

        if (isDeleting) {
            subtitleElement.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % titles.length;
            }
        } else {
            subtitleElement.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentTitle.length) {
                isWaiting = true;
            }
        }

        const typingSpeed = isDeleting ? 50 : 100;
        setTimeout(typeTitle, typingSpeed);
    }

    // Start typing animation after a short delay
    setTimeout(typeTitle, 1000);
}

// =============================================================================
// Smooth Scrolling
// =============================================================================

function initializeSmoothScrolling() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =============================================================================
// Contact Form Functionality (MODIFIED FOR REAL SUBMISSION)
// =============================================================================

function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const formValues = Object.fromEntries(formData);
        
        if (validateForm(formValues)) {
            submitForm(formValues);
        }
    });

    function validateForm(values) {
        const { name, email, subject, message } = values;
        
        if (!name.trim()) {
            showNotification('Please enter your name', 'error');
            return false;
        }
        
        if (!email.trim() || !isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return false;
        }
        
        if (!subject.trim()) {
            showNotification('Please enter a subject', 'error');
            return false;
        }
        
        if (!message.trim()) {
            showNotification('Please enter your message', 'error');
            return false;
        }
        
        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async function submitForm(values) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;

        // --- NEW: Use a form backend service like Formspree ---
        // IMPORTANT: Replace 'YOUR_FORM_ID' with your actual Formspree form ID
        // from your form's endpoint, e.g., https://formspree.io/f/YOUR_FORM_ID
        const formspreeEndpoint = 'https://formspree.io/f/xkgzpokr';

        try {
            const response = await fetch(formspreeEndpoint, {
                method: 'POST',
                body: JSON.stringify(values),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
            } else {
                // Handle server-side errors
                const errorData = await response.json();
                const errorMessage = errorData.errors ? errorData.errors.map(e => e.message).join(', ') : 'An unknown error occurred on the server.';
                showNotification(`Error: ${errorMessage}`, 'error');
            }
        } catch (error) {
            // Handle network or other client-side errors
            console.error('Form submission error:', error);
            showNotification('Failed to send message. Please check your connection and try again.', 'error');
        } finally {
            // Reset button state in all cases
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if(document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Add CSS animations for notifications if not already present
    if (!document.querySelector('#notification-animations')) {
        const style = document.createElement('style');
        style.id = 'notification-animations';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}


// =============================================================================
// Utility Functions
// =============================================================================

// Debounce function for performance optimization
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// =============================================================================
// Performance Optimizations
// =============================================================================

// Optimize scroll events with throttling
const optimizedScrollHandler = throttle(function() {
    // Any scroll-based functionality can be added here
}, 16); // 60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Preload critical images
function preloadImages() {
    const criticalImages = [
        './assets/DSC00060_no_bg.png', // Updated profile image
        './assets/Project/imgonline-com-ua-twotoone-XGXcjE7THWkkhNtX.png', // Project image
        './assets/Project/Screenshot 2023-07-26 0020001.png', // Project image
        './assets/Project/imgonline-com-ua-twotoone-MKjDl7gBtJI.png', // Project image
        './assets/Project/Screenshot 2023-07-26 002000.png', // Project image
        './assets/Project/Copilot_20250807_170732.png', // Project image
        './assets/Project/mm2.png', // Project image

        

    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
preloadImages();

// =============================================================================
// Error Handling
// =============================================================================

window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// =============================================================================
// Service Worker Registration (For PWA capabilities)
// =============================================================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

// =============================================================================
// Console Welcome Message
// =============================================================================

console.log(`
🚀 Welcome to Md. Arif Aslam's Portfolio!
📧 Email: shohag0310@gmail.com
🔗 GitHub: https://github.com/shohag0310
💼 LinkedIn: https://linkedin.com/in/md-arif-aslam

Thanks for checking out the source code! 
Feel free to reach out if you have any questions.
`);

// =============================================================================
// Export functions for testing (if needed)
// =============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        throttle,
        isInViewport
    };
}