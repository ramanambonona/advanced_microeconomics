// documentation.js - Documentation et guide d'utilisation
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for documentation navigation
    const navLinks = document.querySelectorAll('.doc-nav-link');
    const sections = document.querySelectorAll('.doc-section');
    
    // Mobile menu functionality
    initializeMobileMenu();

    // Copy code functionality
    initializeCodeCopy();

    // Initialize interactive examples
    initializeExamples();

    // MathJax configuration for documentation
    initializeMathJax();

    // Navigation functionality
    initializeNavigation();

    function initializeMobileMenu() {
        const mobileMenuButton = document.getElementById('mobileMenuButton');
        const closeMobileMenu = document.getElementById('closeMobileMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        const mobileMenu = document.getElementById('mobileMenu');

        if (mobileMenuButton && mobileMenu) {
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

    function initializeNavigation() {
        // Smooth scrolling for documentation navigation
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 100; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active state
                    navLinks.forEach(l => {
                        l.classList.remove('bg-grenat', 'text-white', 'font-medium');
                        l.classList.add('text-gray-700', 'hover:bg-grenat', 'hover:text-white');
                    });
                    this.classList.add('bg-grenat', 'text-white', 'font-medium');
                    this.classList.remove('text-gray-700', 'hover:bg-grenat', 'hover:text-white');

                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobileMenu');
                    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.add('hidden');
                        mobileMenuOverlay.classList.add('hidden');
                        mobileMenu.classList.remove('active');
                    }
                }
            });
        });

        // Update active nav link on scroll
        function updateActiveNavLink() {
            let currentSection = '';
            const scrollPosition = window.scrollY + 150;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = '#' + section.id;
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('bg-grenat', 'text-white', 'font-medium');
                link.classList.add('text-gray-700', 'hover:bg-grenat', 'hover:text-white');
                
                if (link.getAttribute('href') === currentSection) {
                    link.classList.add('bg-grenat', 'text-white', 'font-medium');
                    link.classList.remove('text-gray-700', 'hover:bg-grenat', 'hover:text-white');
                }
            });
        }
        
        window.addEventListener('scroll', updateActiveNavLink);
        updateActiveNavLink(); // Initialize on load
    }

    function initializeCodeCopy() {
        // Add copy code functionality to all code blocks
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(codeBlock => {
            const pre = codeBlock.parentElement;
            
            // Create copy button
            const button = document.createElement('button');
            button.innerHTML = '<i data-feather="copy" class="w-4 h-4"></i>';
            button.className = 'absolute top-3 right-3 bg-gray-700 hover:bg-gray-800 text-white p-2 rounded text-xs opacity-0 transition-opacity duration-200';
            button.title = 'Copier le code';
            
            // Style the pre element
            pre.style.position = 'relative';
            pre.classList.add('group', 'bg-gray-900', 'rounded-lg', 'p-4', 'overflow-x-auto');
            
            // Add button to pre element
            pre.appendChild(button);
            
            // Show button on hover
            pre.addEventListener('mouseenter', () => {
                button.classList.remove('opacity-0');
            });
            
            pre.addEventListener('mouseleave', () => {
                button.classList.add('opacity-0');
            });
            
            // Copy functionality
            button.addEventListener('click', async function() {
                const code = codeBlock.textContent;
                try {
                    await navigator.clipboard.writeText(code);
                    
                    // Visual feedback
                    const originalHTML = button.innerHTML;
                    button.innerHTML = '<i data-feather="check" class="w-4 h-4"></i>';
                    button.classList.add('bg-green-600');
                    feather.replace();
                    
                    setTimeout(() => {
                        button.innerHTML = originalHTML;
                        button.classList.remove('bg-green-600');
                        feather.replace();
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy code: ', err);
                    button.innerHTML = '<i data-feather="x" class="w-4 h-4"></i>';
                    button.classList.add('bg-red-600');
                    feather.replace();
                    
                    setTimeout(() => {
                        button.innerHTML = originalHTML;
                        button.classList.remove('bg-red-600');
                        feather.replace();
                    }, 2000);
                }
            });
        });

        // Update feather icons after adding copy buttons
        if (window.feather) {
            feather.replace();
        }
    }

    function initializeExamples() {
        // Interactive examples for each module
        const examples = {
            static: {
                title: "Exemple: Demande Marshallienne Cobb-Douglas",
                problem: {
                    problem_type: "marshallian",
                    utility_type: "cobb-douglas",
                    n_goods: 2,
                    parameters: {
                        A: "1",
                        alpha1: "0.3",
                        alpha2: "0.7",
                        p1: "2",
                        p2: "3",
                        R: "100"
                    }
                },
                description: "Cet exemple résout un problème de maximisation d'utilité Cobb-Douglas avec 2 biens."
            },
            dynamic: {
                title: "Exemple: Croissance Optimale avec Horizon Infini",
                problem: {
                    problem_type: "discrete",
                    horizon_type: "infinite",
                    utility_expr: "log(c)",
                    constraint_expr: "k_next - (1-delta)*k - A*k**alpha + c",
                    beta: "0.96",
                    parameters: {
                        alpha: "0.33",
                        delta: "0.08",
                        A: "1"
                    }
                },
                description: "Modèle de croissance optimale en horizon infini avec fonction d'utilité logarithmique."
            },
            stochastic: {
                title: "Exemple: Économie avec Chocs de Productivité",
                problem: {
                    problem_type: "markov",
                    T: 10,
                    S: 2,
                    P: [[0.9, 0.1], [0.2, 0.8]],
                    utility_type: "crra",
                    constraint_expr: "k_next - (1-delta)*k - A*z*k**alpha + c",
                    parameters: {
                        beta: "0.96",
                        gamma: "2",
                        alpha: "0.33",
                        delta: "0.08",
                        A: "1"
                    }
                },
                description: "Modèle stochastique avec deux états de productivité et matrice de transition Markovienne."
            }
        };

        // Add example buttons to documentation
        addExampleButtons(examples);
    }

    function addExampleButtons(examples) {
        // Add example buttons to relevant sections
        Object.keys(examples).forEach(module => {
            const example = examples[module];
            const section = document.getElementById(`${module}-module`);
            
            if (section) {
                const exampleDiv = document.createElement('div');
                exampleDiv.className = 'mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200';
                exampleDiv.innerHTML = `
                    <h4 class="font-bold text-blue-800 mb-2">${example.title}</h4>
                    <p class="text-sm text-gray-700 mb-3">${example.description}</p>
                    <button class="load-example bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition"
                            data-module="${module}">
                        <i data-feather="play" class="w-4 h-4 inline mr-1"></i>
                        Charger cet exemple
                    </button>
                    <div class="mt-3 text-xs text-gray-600">
                        <strong>Paramètres:</strong> ${JSON.stringify(example.problem.parameters)}
                    </div>
                `;
                
                section.appendChild(exampleDiv);
            }
        });

        // Add event listeners for example buttons
        document.querySelectorAll('.load-example').forEach(button => {
            button.addEventListener('click', function() {
                const module = this.getAttribute('data-module');
                const example = examples[module];
                
                // Store example in sessionStorage and redirect
                sessionStorage.setItem(`example_${module}`, JSON.stringify(example));
                
                // Redirect to the appropriate page
                window.location.href = `${module}.html`;
            });
        });

        // Update feather icons
        if (window.feather) {
            feather.replace();
        }
    }

    function initializeMathJax() {
        // Additional MathJax configuration for documentation
        if (window.MathJax) {
            // Typeset the entire document
            MathJax.typesetPromise().catch(err => {
                console.error('MathJax typesetting error:', err);
            });

            // Re-typeset when new content is added
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length) {
                        MathJax.typesetPromise(mutation.addedNodes).catch(err => {
                            console.error('MathJax typesetting error:', err);
                        });
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // API endpoint documentation with test functionality
    initializeAPITesting();

    function initializeAPITesting() {
        const apiTestButtons = document.querySelectorAll('.api-test-btn');
        
        apiTestButtons.forEach(button => {
            button.addEventListener('click', async function() {
                const endpoint = this.getAttribute('data-endpoint');
                const exampleData = this.getAttribute('data-example');
                
                if (endpoint && exampleData) {
                    await testAPIEndpoint(endpoint, JSON.parse(exampleData));
                }
            });
        });
    }

    async function testAPIEndpoint(endpoint, exampleData) {
        const resultDiv = document.getElementById('api-test-result');
        if (!resultDiv) return;

        resultDiv.innerHTML = `
            <div class="bg-blue-50 border border-blue-200 rounded p-3">
                <div class="flex items-center">
                    <i data-feather="loader" class="w-4 h-4 animate-spin mr-2"></i>
                    <span>Test en cours...</span>
                </div>
            </div>
        `;
        feather.replace();

        try {
            const response = await fetch(`https://advanced-microeconomics-solver-backend.onrender.com${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(exampleData)
            });

            const result = await response.json();

            if (response.ok) {
                resultDiv.innerHTML = `
                    <div class="bg-green-50 border border-green-200 rounded p-3">
                        <div class="flex items-center mb-2">
                            <i data-feather="check-circle" class="w-4 h-4 text-green-600 mr-2"></i>
                            <span class="font-medium text-green-800">Test réussi</span>
                        </div>
                        <pre class="text-xs bg-white p-2 rounded overflow-x-auto">${JSON.stringify(result, null, 2)}</pre>
                    </div>
                `;
            } else {
                resultDiv.innerHTML = `
                    <div class="bg-red-50 border border-red-200 rounded p-3">
                        <div class="flex items-center mb-2">
                            <i data-feather="x-circle" class="w-4 h-4 text-red-600 mr-2"></i>
                            <span class="font-medium text-red-800">Erreur: ${response.status}</span>
                        </div>
                        <pre class="text-xs bg-white p-2 rounded overflow-x-auto">${JSON.stringify(result, null, 2)}</pre>
                    </div>
                `;
            }
        } catch (error) {
            resultDiv.innerHTML = `
                <div class="bg-red-50 border border-red-200 rounded p-3">
                    <div class="flex items-center">
                        <i data-feather="wifi-off" class="w-4 h-4 text-red-600 mr-2"></i>
                        <span class="font-medium text-red-800">Erreur de connexion: ${error.message}</span>
                    </div>
                </div>
            `;
        }

        feather.replace();
    }

    // Search functionality for documentation
    initializeSearch();

    function initializeSearch() {
        const searchInput = document.getElementById('doc-search');
        if (!searchInput) return;

        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const sections = document.querySelectorAll('.doc-section');
            let foundResults = false;

            sections.forEach(section => {
                const text = section.textContent.toLowerCase();
                const header = section.querySelector('h2, h3, h4');
                
                if (text.includes(searchTerm)) {
                    section.style.display = 'block';
                    foundResults = true;
                    
                    // Highlight the section
                    if (header) {
                        header.classList.add('bg-yellow-200', 'px-2', 'py-1', 'rounded');
                    }
                } else {
                    section.style.display = 'none';
                    if (header) {
                        header.classList.remove('bg-yellow-200', 'px-2', 'py-1', 'rounded');
                    }
                }
            });

            // Show/hide no results message
            const noResults = document.getElementById('no-results');
            if (noResults) {
                if (!foundResults && searchTerm.length > 0) {
                    noResults.classList.remove('hidden');
                } else {
                    noResults.classList.add('hidden');
                }
            }
        });
    }

    // Table of contents generation
    generateTableOfContents();

    function generateTableOfContents() {
        const tocContainer = document.getElementById('toc-container');
        if (!tocContainer) return;

        const headings = document.querySelectorAll('.doc-section h2, .doc-section h3');
        let tocHTML = '<h4 class="font-bold text-grenat mb-3">Table des matières</h4><nav class="space-y-1">';

        headings.forEach(heading => {
            const level = heading.tagName.toLowerCase();
            const text = heading.textContent;
            const id = heading.id || text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            
            // Ensure heading has an ID
            if (!heading.id) {
                heading.id = id;
            }

            if (level === 'h2') {
                tocHTML += `
                    <a href="#${id}" class="block py-1 px-3 text-sm font-medium text-grenat hover:bg-grenat hover:text-white rounded doc-nav-link">
                        ${text}
                    </a>
                `;
            } else if (level === 'h3') {
                tocHTML += `
                    <a href="#${id}" class="block py-1 px-6 text-xs text-gray-600 hover:bg-gray-100 hover:text-grenat rounded doc-nav-link">
                        • ${text}
                    </a>
                `;
            }
        });

        tocHTML += '</nav>';
        tocContainer.innerHTML = tocHTML;

        // Re-initialize navigation for TOC links
        document.querySelectorAll('#toc-container .doc-nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 100;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Print functionality
    initializePrint();

    function initializePrint() {
        const printBtn = document.getElementById('print-doc');
        if (printBtn) {
            printBtn.addEventListener('click', function() {
                window.print();
            });
        }
    }

    // Initialize everything when the page loads
    console.log('Documentation initialized successfully');
});