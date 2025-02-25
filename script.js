document.addEventListener('DOMContentLoaded', function () {
    // Loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.style.overflow = 'visible';
            // Initialize enhanced section animations after loading
            initEnhancedSectionAnimations();
        }, 1000);
    }, 3000);

    // Initialize Email.js
    (function() {
        emailjs.init("YOUR_USER_ID"); // Replace with your Email.js user ID
    })();

    // Progress bar and section tracking
    const progressBar = document.getElementById('progressBar');
    const sections = document.querySelectorAll('section');
    const dots = document.querySelectorAll('.indicator-dot');

    // Set section names on dots
    dots.forEach((dot, index) => {
        if (sections[index]) {
            dot.setAttribute('data-section', sections[index].id.charAt(0).toUpperCase() + sections[index].id.slice(1));
        }
    });

    // Track currently active section for animation control
    let currentActiveIndex = -1;
    let lastScrollTop = 0;
    let scrollingDirection = 'down';

    // Update progress and active section
    function updateProgress() {
        const windowHeight = window.innerHeight;
        const fullHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / fullHeight) * 100;
        progressBar.style.height = progress + '%';

        // Determine scroll direction
        scrollingDirection = scrolled > lastScrollTop ? 'down' : 'up';
        lastScrollTop = scrolled;

        // Find which section should be active
        let newActiveIndex = -1;
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            
            // Determine if section is active (in the viewport center)
            if (rect.top <= windowHeight * 0.4 && rect.bottom >= windowHeight * 0.4) {
                newActiveIndex = index;
            }
        });

        // If active section changed, handle transitions
        if (newActiveIndex !== currentActiveIndex && newActiveIndex >= 0) {
            // Get previous and current section elements
            const prevSection = currentActiveIndex >= 0 ? sections[currentActiveIndex] : null;
            const newSection = sections[newActiveIndex];
            
            // Update dots
            dots.forEach(dot => dot.classList.remove('active'));
            dots[newActiveIndex].classList.add('active');
            
            // Animate exit for previous section if it exists
            if (prevSection) {
                prevSection.classList.add('section-exiting');
                setTimeout(() => {
                    prevSection.classList.remove('active-section', 'section-exiting');
                }, 600);
            }
            
            // Animate entrance for new section
            newSection.classList.add('section-entering', 'active-section');
            setTimeout(() => {
                newSection.classList.remove('section-entering');
            }, 600);
            
            currentActiveIndex = newActiveIndex;
        }
    }

    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    updateProgress(); // Initial call

    // Enhanced section animations with IntersectionObserver
    function initEnhancedSectionAnimations() {
        const animatedItems = document.querySelectorAll('.animate-item');
        
        const itemObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Calculate a delay if specified
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    
                    // Get the parent section
                    const parentSection = entry.target.closest('.section-animate');
                    if (parentSection && parentSection.classList.contains('active-section')) {
                        setTimeout(() => {
                            entry.target.classList.add('animate-active');
                            
                            // Special handling for skill bars
                            if (entry.target.classList.contains('skill-category')) {
                                const bar = entry.target.querySelector('.skill-progress');
                                if (bar) {
                                    setTimeout(() => {
                                        bar.style.width = bar.getAttribute('data-progress');
                                    }, 150);
                                }
                            }
                        }, delay);
                    } else {
                        // If parent section is not active yet, wait for it
                        const observer = new MutationObserver((mutations) => {
                            mutations.forEach((mutation) => {
                                if (mutation.target.classList.contains('active-section')) {
                                    setTimeout(() => {
                                        entry.target.classList.add('animate-active');
                                        
                                        // Special handling for skill bars
                                        if (entry.target.classList.contains('skill-category')) {
                                            const bar = entry.target.querySelector('.skill-progress');
                                            if (bar) {
                                                setTimeout(() => {
                                                    bar.style.width = bar.getAttribute('data-progress');
                                                }, 150);
                                            }
                                        }
                                    }, delay);
                                    observer.disconnect();
                                }
                            });
                        });
                        
                        if (parentSection) {
                            observer.observe(parentSection, { attributes: true, attributeFilter: ['class'] });
                        }
                    }
                } else if (!entry.isIntersecting && scrollingDirection === 'up') {
                    // Reset animation when scrolling up and element is out of view
                    entry.target.classList.remove('animate-active');
                    
                    // Reset skill bars when scrolling up
                    if (entry.target.classList.contains('skill-category')) {
                        const bar = entry.target.querySelector('.skill-progress');
                        if (bar) {
                            bar.style.width = '0';
                        }
                    }
                }
            });
        }, { 
            threshold: 0.2,
            rootMargin: '0px 0px -15% 0px' // Start animation a bit before element enters viewport
        });

        // Observe all animated items
        animatedItems.forEach(item => {
            itemObserver.observe(item);
        });
    }

    // Smooth scroll for navigation and indicator dots
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            sections[index].scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // Mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    const failureMessage = document.getElementById('failure-message');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Here you would typically send the form data via email.js or another service
        // For demo purposes, we'll show success message after a delay
        
        setTimeout(() => {
            // Show success message (replace with actual form submission)
            successMessage.classList.remove('d-none');
            successMessage.classList.add('show');
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
                setTimeout(() => {
                    successMessage.classList.add('d-none');
                }, 300);
            }, 5000);
        }, 1000);
        
        /* Uncomment and modify when you have Email.js setup
        emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contactForm)
            .then(function() {
                successMessage.classList.remove('d-none');
                successMessage.classList.add('show');
                contactForm.reset();
                
                setTimeout(() => {
                    successMessage.classList.remove('show');
                    setTimeout(() => {
                        successMessage.classList.add('d-none');
                    }, 300);
                }, 5000);
            }, function(error) {
                failureMessage.classList.remove('d-none');
                failureMessage.classList.add('show');
                
                setTimeout(() => {
                    failureMessage.classList.remove('show');
                    setTimeout(() => {
                        failureMessage.classList.add('d-none');
                    }, 300);
                }, 5000);
            });
        */
    });

    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});