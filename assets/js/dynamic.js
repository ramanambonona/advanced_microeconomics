// dynamic.js - Module d'optimisation dynamique
document.addEventListener('DOMContentLoaded', function() {
    // Elements DOM
    const form = document.getElementById('dynamicProblemForm');
    const horizonTypeSelect = document.getElementById('horizonType');
    const timePeriodsSection = document.getElementById('timePeriodsSection');
    const timePeriodsInput = document.getElementById('T');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    const solutionStepsDiv = document.getElementById('solutionSteps');
    const stepsList = document.getElementById('stepsList');
    const eulerEquationsDiv = document.getElementById('eulerEquations');
    const eulerList = document.getElementById('eulerList');

    // State variables
    let lastDynamicResult = null;
    let lastDynamicProblemData = null;

    function appendHTML(container, html) {
        container.insertAdjacentHTML('beforeend', html);
    }

    // Initialize
    initializeForm();

    // Event Listeners
    horizonTypeSelect.addEventListener('change', handleHorizonTypeChange);
    form.addEventListener('submit', handleFormSubmit);

    // Mobile menu
    initializeMobileMenu();

    function initializeForm() {
        handleHorizonTypeChange();
        convertToSymbolicInputs();
    }

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

    function handleHorizonTypeChange() {
        if (horizonTypeSelect.value === 'infinite') {
            timePeriodsSection.classList.add('hidden');
        } else {
            timePeriodsSection.classList.remove('hidden');
        }
    }

    function convertToSymbolicInputs() {
        // Convert numeric inputs to text inputs for symbolic parameters
        const numericInputs = form.querySelectorAll('input[type="number"]');
        numericInputs.forEach(input => {
            if (!['T', 'nSimulations'].includes(input.name)) {
                input.type = 'text';
            }
        });
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        solveDynamicProblem();
    }

    async function solveDynamicProblem() {
        const formData = new FormData(form);
        const problemData = {
            problem_type: "discrete",
            horizon_type: formData.get('horizonType'),
            T: formData.get('horizonType') === 'infinite' ? 'oo' : formData.get('T'),
            utility_expr: formData.get('utilityExpr'),
            constraint_expr: formData.get('constraintExpr'),
            beta: formData.get('beta'),
            parameters: {}
        };

        // Collect symbolic parameters
        const paramNames = ['alpha', 'delta', 'A', 'gamma'];
        paramNames.forEach(param => {
            const value = formData.get(param);
            if (value) problemData.parameters[param] = value;
        });

        // Show loading
        showLoading();
        clearResults();

        try {
            // Check backend health first
            const isHealthy = await MicroeconomicsAPI.healthCheck();
            if (!isHealthy) {
                throw new Error('Le serveur backend n\'est pas accessible. Veuillez réessayer plus tard.');
            }

            const result = await MicroeconomicsAPI.solveDynamic(problemData);
            
            if (result.success) {
                lastDynamicResult = result;
                lastDynamicProblemData = problemData;
                displayDynamicResults(result, problemData);
            } else {
                showError(result.error || 'Erreur inconnue lors de la résolution');
            }
        } catch (error) {
            showError(error.message);
        } finally {
            hideLoading();
        }
    }

    function displayDynamicResults(result, problemData) {
        let resultsHTML = `
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 result-fade-in">
                <h3 class="text-lg font-bold text-green-800 mb-2">✅ Problème Dynamique Résolu</h3>
                <div class="space-y-2">
                    <p><strong>Type d'horizon:</strong> ${problemData.horizon_type === 'infinite' ? 'Infini' : 'Fini'}</p>
                    <p><strong>Périodes:</strong> ${problemData.horizon_type === 'infinite' ? '∞' : problemData.T}</p>
                    <p><strong>Fonction d'utilité:</strong> 
                        <div class="math-equation mt-1">$$U(c) = ${problemData.utility_expr || '\\log(c)'}$$</div>
                    </p>
                    <p><strong>Facteur d'escompte:</strong> $\\beta = ${problemData.beta}$</p>
                </div>
            </div>
        `;

        // Download buttons
        resultsHTML += `
            <div class="mt-4 flex space-x-4 result-fade-in">
                <button id="downloadLatex" class="download-btn bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center">
                    <i data-feather="download" class="w-4 h-4 mr-2"></i>Télécharger LaTeX
                </button>
                <button id="downloadPDF" class="download-btn bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center">
                    <i data-feather="file-text" class="w-4 h-4 mr-2"></i>Télécharger PDF
                </button>
            </div>
        `;

        resultsDiv.innerHTML = resultsHTML;

        // Add event listeners for download buttons
        document.getElementById('downloadLatex').addEventListener('click', downloadLaTeX);
        document.getElementById('downloadPDF').addEventListener('click', downloadPDF);

        // Display solution details
        displaySolutionDetails(result, problemData);
        
        // Update feather icons
        if (window.feather) {
            feather.replace();
        }
        
        // Render MathJax
        if (window.MathJax) {
            MathJax.typesetPromise().catch(err => console.error('MathJax error:', err));
        }
    }

    function displaySolutionDetails(result, problemData) {
        // Display Euler equations
        if (result.euler_equations && result.euler_equations.length > 0) {
            eulerEquationsDiv.classList.remove('hidden');
            eulerList.innerHTML = result.euler_equations.map((eq, index) => `
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 result-fade-in" style="animation-delay: ${index * 0.1}s">
                    <div class="flex items-center mb-2">
                        <span class="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3">${index + 1}</span>
                        <h5 class="font-bold text-blue-800">Équation d'Euler ${problemData.horizon_type === 'infinite' ? 'en régime stationnaire' : `pour la période ${index + 1}`}</h5>
                    </div>
                    <div class="math-equation text-center text-lg">$$${eq}$$</div>
                </div>
            `).join('');
        }

        // Display steady state for infinite horizon
        if (result.steady_state && Object.keys(result.steady_state).length > 0) {
            const steadyStateHTML = `
                <div class="mt-6 result-fade-in">
                    <h4 class="font-bold text-grenat mb-3 text-lg">⚖️ État Stationnaire</h4>
                    <div class="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                        ${Object.entries(result.steady_state).map(([variable, value]) => `
                            <div class="flex items-center justify-between py-2 border-b border-purple-100 last:border-b-0">
                                <span class="text-sm font-medium text-grenat">${variable}:</span>
                                <span class="text-sm math-equation font-mono bg-white px-3 py-1 rounded border">$$${value}$$</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            appendHTML(resultsDiv, steadyStateHTML);
        }

        // Display value function (if available)
        if (result.value_function) {
            const valueFunctionHTML = `
                <div class="mt-6 result-fade-in">
                    <h4 class="font-bold text-grenat mb-3 text-lg">📈 Fonction de Valeur</h4>
                    <div class="equation-block">
                        <div class="math-equation text-center text-lg">$$V(k) = ${result.value_function}$$</div>
                    </div>
                </div>
            `;
            appendHTML(resultsDiv, valueFunctionHTML);
        }

        // Display policy functions
        if (result.policy_functions && Object.keys(result.policy_functions).length > 0) {
            const policyHTML = `
                <div class="mt-6 result-fade-in">
                    <h4 class="font-bold text-grenat mb-3 text-lg">🎯 Fonctions de Politique Optimale</h4>
                    <div class="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4">
                        ${Object.entries(result.policy_functions).map(([variable, expression]) => `
                            <div class="flex items-center justify-between py-2 border-b border-green-100 last:border-b-0">
                                <span class="text-sm font-medium text-grenat">${variable}:</span>
                                <span class="text-sm math-equation font-mono bg-white px-3 py-1 rounded border">$$${expression}$$</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            appendHTML(resultsDiv, policyHTML);
        }

        // Display steps if available
        if (result.steps && result.steps.length > 0) {
            solutionStepsDiv.classList.remove('hidden');
            stepsList.innerHTML = result.steps.map((step, index) => `
                <div class="border-l-4 border-grenat pl-4 py-3 result-fade-in" style="animation-delay: ${index * 0.1}s">
                    <div class="flex items-start">
                        <span class="bg-grenat text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-1">${index + 1}</span>
                        <div class="flex-1">
                            <h5 class="font-bold text-gray-800">${step.step_name}</h5>
                            ${step.equation ? `<div class="bg-gray-50 p-3 rounded my-2"><div class="math-equation text-sm">$$${step.equation}$$</div></div>` : ''}
                            <p class="text-sm text-gray-600 mt-1">${step.explanation}</p>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Display time path for finite horizon
        if (result.time_path && problemData.horizon_type === 'finite') {
            const timePathHTML = `
                <div class="mt-6 result-fade-in">
                    <h4 class="font-bold text-grenat mb-3 text-lg">🕐 Chemin Temporel Optimal</h4>
                    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
                                    ${Object.keys(result.time_path[0] || {}).map(key => 
                                        `<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">${key}</th>`
                                    ).join('')}
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                ${result.time_path.map((period, index) => `
                                    <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
                                        <td class="px-4 py-2 text-sm font-medium text-gray-900">t=${index}</td>
                                        ${Object.values(period).map(value => 
                                            `<td class="px-4 py-2 text-sm text-gray-600">${typeof value === 'number' ? value.toFixed(4) : value}</td>`
                                        ).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            appendHTML(resultsDiv, timePathHTML);
        }
    }

    async function downloadLaTeX() {
        if (!lastDynamicResult || !lastDynamicProblemData) {
            showError('Aucun résultat disponible pour le téléchargement');
            return;
        }
        
        try {
            showLoading('Génération du fichier LaTeX...');
            const blob = await MicroeconomicsAPI.generateLaTeX('dynamic', lastDynamicProblemData, lastDynamicResult);
            downloadBlob(blob, `solution_dynamique_${Date.now()}.tex`);
        } catch (error) {
            showError(`Erreur lors du téléchargement LaTeX: ${error.message}`);
        } finally {
            hideLoading();
        }
    }

    async function downloadPDF() {
        if (!lastDynamicResult || !lastDynamicProblemData) {
            showError('Aucun résultat disponible pour le téléchargement');
            return;
        }
        
        try {
            showLoading('Génération du PDF...');
            const blob = await MicroeconomicsAPI.generatePDF('dynamic', lastDynamicProblemData, lastDynamicResult);
            downloadBlob(blob, `rapport_dynamique_${Date.now()}.pdf`);
        } catch (error) {
            showError(`Erreur lors du téléchargement PDF: ${error.message}`);
        } finally {
            hideLoading();
        }
    }

    function showLoading(message = 'Résolution en cours...') {
        loadingDiv.classList.remove('hidden');
        if (message) {
            const loadingText = loadingDiv.querySelector('p');
            if (loadingText) {
                loadingText.textContent = message;
            }
        }
    }

    function hideLoading() {
        loadingDiv.classList.add('hidden');
    }

    function clearResults() {
        resultsDiv.innerHTML = '';
        solutionStepsDiv.classList.add('hidden');
        eulerEquationsDiv.classList.add('hidden');
    }

    function showError(message) {
        resultsDiv.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 result-fade-in">
                <div class="flex items-center">
                    <i data-feather="alert-triangle" class="w-5 h-5 text-red-600 mr-2"></i>
                    <h3 class="text-lg font-bold text-red-800">Erreur</h3>
                </div>
                <p class="text-red-700 mt-2">${message}</p>
                <p class="text-red-600 text-sm mt-2">Veuillez vérifier vos paramètres et réessayer.</p>
            </div>
        `;
        
        if (window.feather) {
            feather.replace();
        }
    }
});