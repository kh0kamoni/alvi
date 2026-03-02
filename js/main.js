// Main JavaScript for Portfolio

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize dropdowns
    initDropdowns();
    
    // Set active nav link based on current page
    setActiveNavLink();
    
    // Initialize any animations
    initAnimations();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            menuToggle.classList.toggle('open');
            
            // Prevent body scroll when menu is open
            if (navLinks.classList.contains('show')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
                
                // Close all dropdowns when closing mobile menu
                document.querySelectorAll('.dropdown').forEach(drop => {
                    drop.classList.remove('open');
                });
            }
        });

        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('show');
                menuToggle.classList.remove('open');
                document.body.style.overflow = '';
                
                // Close all dropdowns
                document.querySelectorAll('.dropdown').forEach(drop => {
                    drop.classList.remove('open');
                });
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && 
                !menuToggle.contains(event.target) && 
                navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                menuToggle.classList.remove('open');
                document.body.style.overflow = '';
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('show');
                menuToggle.classList.remove('open');
                document.body.style.overflow = '';
                
                // Reset mobile dropdown states
                document.querySelectorAll('.dropdown').forEach(drop => {
                    drop.classList.remove('open');
                });
            }
        });

        // Handle escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                if (navLinks.classList.contains('show')) {
                    navLinks.classList.remove('show');
                    menuToggle.classList.remove('open');
                    document.body.style.overflow = '';
                    
                    document.querySelectorAll('.dropdown').forEach(drop => {
                        drop.classList.remove('open');
                    });
                }
            }
        });
    }
}

// Initialize dropdowns for mobile
function initDropdowns() {
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                const dropdown = this.closest('.dropdown');
                dropdown.classList.toggle('open');
            });
        });
    }
}

// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else if (currentPage === '' && linkHref === 'index.html') {
            link.classList.add('active');
        }
    });
}

// Initialize animations (counters, etc.)
function initAnimations() {
    // Animate statistics counters if they exist
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length > 0) {
        animateCounters();
    }
}

// Animate counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-val');
    
    counters.forEach(counter => {
        const target = parseInt(counter.innerText);
        if (isNaN(target)) return;
        
        let count = 0;
        const duration = 1500; // ms
        const stepTime = 20; // ms
        const steps = duration / stepTime;
        const increment = target / steps;
        
        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                counter.innerText = target;
                clearInterval(timer);
            } else {
                counter.innerText = Math.floor(count);
            }
        }, stepTime);
    });
}

// Load publications dynamically (if using JSON)
function loadPublications() {
    const container = document.getElementById('publications-list');
    if (!container) return;
    
    fetch('data/publications.json')
        .then(response => response.json())
        .then(publications => {
            publications.forEach(pub => {
                const item = document.createElement('li');
                item.className = 'pub-item';
                item.innerHTML = `
                    <span class="pub-type">${pub.type} · ${pub.year}</span>
                    <p class="pub-title">${pub.title}</p>
                    <p class="pub-authors">${pub.authors} · <em>${pub.journal}</em></p>
                `;
                container.appendChild(item);
            });
        })
        .catch(error => console.error('Error loading publications:', error));
}

// Load CVEs dynamically
function loadCVEs() {
    const container = document.getElementById('cves-list');
    if (!container) return;
    
    fetch('data/cves.json')
        .then(response => response.json())
        .then(cves => {
            cves.forEach(cve => {
                const item = document.createElement('div');
                item.className = 'cve-list-item';
                // Add CVE HTML structure
                container.appendChild(item);
            });
        })
        .catch(error => console.error('Error loading CVEs:', error));
}

// Contact form handling (if using Formspree)
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;
        
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                showAlert('Thank you! Your message has been sent.', 'success');
                form.reset();
            } else {
                return response.json().then(data => {
                    if (data.errors) {
                        showAlert(data.errors.map(error => error.message).join(', '), 'error');
                    } else {
                        showAlert('Oops! There was a problem sending your message.', 'error');
                    }
                });
            }
        })
        .catch(error => {
            showAlert('Oops! There was a problem sending your message.', 'error');
        })
        .finally(() => {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        });
    });
}

// Show alert message
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} glass`;
    alertDiv.textContent = message;
    
    const main = document.querySelector('main');
    main.insertBefore(alertDiv, main.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Initialize based on page
if (document.getElementById('publications-list')) {
    loadPublications();
}

if (document.getElementById('cves-list')) {
    loadCVEs();
}

if (document.getElementById('contact-form')) {
    initContactForm();
}