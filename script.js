// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    setTimeout(function() {
        const loader = document.querySelector('.loader');
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
        
        // Start animations after loader is hidden
        initializeAnimations();
    }, 1500);
    
    // Header scroll effect
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            document.querySelector('.floating-stats').style.display = 'block';
        } else {
            header.classList.remove('scrolled');
            document.querySelector('.floating-stats').style.display = 'none';
        }
    });
    
    // Initialize tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Smooth scroll to the target section
            window.scrollTo({
                top: targetSection.offsetTop - 100,
                behavior: 'smooth'
            });
        });
    });
    
    // Handle form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.querySelector('#name').value;
            const company = this.querySelector('#company').value;
            const email = this.querySelector('#email').value;
            const message = this.querySelector('#message').value;
            
            if (!name || !company || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Simulate form submission
            this.reset();
            showNotification('Your enterprise inquiry has been submitted', 'success');
        });
    }
    
    // Initialize metrics animation
    initializeCounters();
});

// Initialize animations
function initializeAnimations() {
    // Animate elements with data-aos attribute as they come into view
    const animateElements = document.querySelectorAll('[data-aos]');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add staggered animation delays
    document.querySelectorAll('.solution-card, .tech-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

// Initialize counters for statistics
function initializeCounters() {
    const speed = 200; // Speed of counting animation (lower is faster)
    
    // Animate floating stats counters
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(counter => {
        const targetCount = counter.dataset.count;
        const increment = Math.ceil(targetCount / speed);
        animateCounter(counter, targetCount, increment);
    });
    
    // Animate metric numbers when they come into view
    const metricObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const targetValue = counter.getAttribute('data-value');
                const increment = Math.ceil(targetValue / speed);
                animateCounter(counter, targetValue, increment);
                metricObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.metric-number').forEach(counter => {
        metricObserver.observe(counter);
    });
}

// Animate counter from 0 to target
function animateCounter(counter, target, increment) {
    let currentCount = 0;
    const updateCounter = () => {
        currentCount += increment;
        
        if (currentCount >= target) {
            counter.innerText = target;
            if (counter.hasAttribute('data-suffix')) {
                counter.innerText += counter.getAttribute('data-suffix');
            }
        } else {
            counter.innerText = currentCount;
            requestAnimationFrame(updateCounter);
        }
    };
    
    requestAnimationFrame(updateCounter);
}

// Show notification message
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <p>${message}</p>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Add dynamic 3D effect to cards on mouse move
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.solution-card, .enterprise-tier');
    
    cards.forEach(card => {
        // Get card position
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        
        // Calculate mouse position relative to card center
        const mouseX = e.clientX - cardCenterX;
        const mouseY = e.clientY - cardCenterY;
        
        // Calculate rotation based on mouse position
        // Only apply effect when mouse is near the card
        const maxDistance = Math.max(rect.width, rect.height) * 1.5;
        const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
        
        if (distance < maxDistance) {
            // Calculate rotation angle (max 5 degrees)
            const maxRotation = 5;
            const rotateX = (mouseY / rect.height) * -maxRotation;
            const rotateY = (mouseX / rect.width) * maxRotation;
            
            // Apply transform
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        } else {
            card.style.transform = '';
        }
    });
});

// Add current date to footer
document.addEventListener('DOMContentLoaded', function() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const footerYear = document.querySelector('.copyright p');
    if (footerYear) {
        footerYear.innerHTML = `&copy; ${year} LEURS Enterprise Solutions. All rights reserved.`;
    }
    
    // Add current time to last update
    const lastUpdated = document.createElement('div');
    lastUpdated.className = 'last-updated';
    lastUpdated.innerText = `Last Updated: 2025-04-02 07:59:30 UTC`;
    document.querySelector('.footer-bottom').appendChild(lastUpdated);
    
    // Add user info if available
    if (typeof currentUser !== 'undefined' && currentUser) {
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        userInfo.innerText = `Welcome, ${currentUser}`;
        document.querySelector('.header-content').appendChild(userInfo);
    }
});