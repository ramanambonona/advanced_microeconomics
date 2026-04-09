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
@@ -93,51 +93,51 @@ document.addEventListener('DOMContentLoaded', function() {
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
