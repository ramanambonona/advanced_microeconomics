// app.js - Navigation principale et fonctionnalités communes
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    initializeMobileMenu();

    // Back to top button
    initializeBackToTop();

    // Health check for backend
    initializeHealthCheck();

    // Load examples from sessionStorage
    loadExamples();

    // Initialize MathJax
    initializeMathJax();

    // Add animation to feature cards
    initializeAnimations();

    function initializeMobileMenu() {
        const mobileMenuButton = document.getElementById('mobileMenuButton');
        const closeMobileMenu = document.getElementById('closeMobileMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        const mobileMenu = document.getElementById('mobileMenu');

        if (mobileMenuButton && closeMobileMenu && mobileMenuOverlay && mobileMenu) {
            mobileMenuButton.addEventListener('click', function() {
                mobileMenu.classList.remove('hidden');
                mobileMenuOverlay.classList.remove('hidden');
                mobileMenu.classList.add('active');
            });

            closeMobileMenu.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenuOverlay.classList.add('hidden');
                mobileMenu.classList.remove('active');
            });

            mobileMenuOverlay.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenuOverlay.classList.add('hidden');
                mobileMenu.classList.remove('active');
            });
        }
    }

    function initializeBackToTop() {
        const backToTopButton = document.createElement('button');
        backToTopButton.innerHTML = '<i data-feather="arrow-up" class="w-4 h-4"></i>';
        backToTopButton.className = 'fixed bottom-8 right-8 bg-grenat text-white p-3 rounded-full shadow-lg hover:bg-grenat-800 transition opacity-0 invisible';
        backToTopButton.id = 'backToTop';
        backToTopButton.title = 'Retour en haut';
        
        document.body.appendChild(backToTopButton);

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.remove('opacity-0', 'invisible');
                backToTopButton.classList.add('opacity-100', 'visible');
            } else {
                backToTopButton.classList.remove('opacity-100', 'visible');
                backToTopButton.classList.add('opacity-0', 'invisible');
            }
        });

        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        if (window.feather) {
            feather.replace();
        }
    }

    async function initializeHealthCheck() {
        try {
            const isHealthy = await MicroeconomicsAPI.healthCheck();
            const healthIndicator = document.getElementById('healthIndicator');
            
            if (healthIndicator) {
                if (isHealthy) {
                    healthIndicator.innerHTML = '<i data-feather="check-circle" class="w-4 h-4 text-green-500"></i> Serveur en ligne';
                    healthIndicator.className = 'flex items-center text-green-600 text-sm';
                } else {
                    healthIndicator.innerHTML = '<i data-feather="x-circle" class="w-4 h-4 text-red-500"></i> Serveur hors ligne';
                    healthIndicator.className = 'flex items-center text-red-600 text-sm';
                }
                
                if (window.feather) {
                    feather.replace();
                }
            }
        } catch (error) {
            console.error('Health check failed:', error);
        }
    }

    function loadExamples() {
        // Check if there are stored examples and load them
        const modules = ['static', 'dynamic', 'stochastic'];
        
        modules.forEach(module => {
            const storedExample = sessionStorage.getItem(`example_${module}`);
            if (storedExample) {
                console.log(`Loaded example for ${module}:`, JSON.parse(storedExample));
                // In actual implementation, this would pre-fill the form
                sessionStorage.removeItem(`example_${module}`); // Clear after loading
            }
        });
    }

    function initializeMathJax() {
        // Ensure MathJax is properly configured
        if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
            MathJax.typesetPromise().catch(err => {
                console.error('MathJax initialization error:', err);
            });
        }
    }

    function initializeAnimations() {
        // Add intersection observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-visible');
                }
            });
        }, observerOptions);

        // Observe all cards and sections
        document.querySelectorAll('.card, .feature-card, .module-card').forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-in-visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .result-fade-in {
            animation: fadeInUp 0.6s ease-out;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    console.log('AMS Frontend initialized successfully');
});

document.addEventListener('DOMContentLoaded', function() {
    const img = document.querySelector('img[alt="Logo AMS"]');
    if (img) {
        console.log('Chemin image:', img.src);
        console.log('Image chargée:', img.complete);
        img.onerror = function() {
            console.error('ERREUR: Image non trouvée à:', this.src);
        };
    }
});
