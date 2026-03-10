// api.js - Client API pour le backend
const MicroeconomicsAPI = {
    baseURL: 'https://advanced-microeconomics-solver-backend.onrender.com',

    // Solve Static Problem
    async solveStatic(problemData) {
        try {
            const response = await fetch(`${this.baseURL}/solve/static`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(problemData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Static Error:', error);
            throw new Error(`Erreur lors de la résolution du problème statique: ${error.message}`);
        }
    },

    // Solve Dynamic Problem
    async solveDynamic(problemData) {
        try {
            const response = await fetch(`${this.baseURL}/solve/dynamic`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(problemData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Dynamic Error:', error);
            throw new Error(`Erreur lors de la résolution du problème dynamique: ${error.message}`);
        }
    },

    // Solve Stochastic Problem
    async solveStochastic(problemData) {
        try {
            const response = await fetch(`${this.baseURL}/solve/stochastic`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(problemData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Stochastic Error:', error);
            throw new Error(`Erreur lors de la résolution du problème stochastique: ${error.message}`);
        }
    },

    // Generate LaTeX Report
    async generateLaTeX(module, problemData, results) {
        try {
            const response = await fetch(`${this.baseURL}/generate-latex`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    module: module,
                    problem: problemData,
                    results: results
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.blob();
        } catch (error) {
            console.error('LaTeX Generation Error:', error);
            throw new Error(`Erreur lors de la génération du fichier LaTeX: ${error.message}`);
        }
    },

    // Generate PDF Report
    async generatePDF(module, problemData, results) {
        try {
            const response = await fetch(`${this.baseURL}/generate-report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    module: module,
                    problem: problemData,
                    results: results
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.blob();
        } catch (error) {
            console.error('PDF Generation Error:', error);
            throw new Error(`Erreur lors de la génération du PDF: ${error.message}`);
        }
    },

    // Monte Carlo Simulation
    async runMonteCarlo(problemData) {
        try {
            const response = await fetch(`${this.baseURL}/monte-carlo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(problemData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Monte Carlo Error:', error);
            throw new Error(`Erreur lors de la simulation Monte Carlo: ${error.message}`);
        }
    },

    // Health Check
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            return response.ok;
        } catch (error) {
            console.error('Health Check Error:', error);
            return false;
        }
    }
};

// Utility function for downloading blobs
function downloadBlob(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// MathJax configuration
window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        packages: {'[+]': ['ams', 'color']}
    },
    options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
        renderActions: {
            addMenu: [0, '', '']
        }
    },
    startup: {
        pageReady: () => {
            return MathJax.startup.defaultPageReady().then(() => {
                console.log('MathJax is ready');
            });
        }
    }
};