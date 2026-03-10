// stochastic.js - Module d'optimisation stochastique
document.addEventListener('DOMContentLoaded', function() {
    // Elements DOM
    const form = document.getElementById('stochasticProblemForm');
    const problemTypeSelect = document.getElementById('problemType');
    const SInput = document.getElementById('S');
    const TInput = document.getElementById('T');
    const transitionMatrixSection = document.getElementById('transitionMatrixSection');
    const transitionMatrixDiv = document.getElementById('transitionMatrix');
    const utilityTypeSelect = document.getElementById('utilityType');
    const customUtilitySection = document.getElementById('customUtilitySection');
    const customUtilityInput = document.getElementById('customUtility');
    const enableMonteCarloCheckbox = document.getElementById('enableMonteCarlo');
    const monteCarloSettings = document.getElementById('monteCarloSettings');
    const nSimulationsInput = document.getElementById('nSimulations');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    const solutionStepsDiv = document.getElementById('solutionSteps');
    const stepsList = document.getElementById('stepsList');
    const eulerEquationsDiv = document.getElementById('eulerEquations');
    const eulerList = document.getElementById('eulerList');
    const monteCarloResultsDiv = document.getElementById('monteCarloResults');
    const monteCarloContent = document.getElementById('monteCarloContent');

    // State variables
    let currentS = 2;
    let lastStochasticResult = null;
    let lastStochasticProblemData = null;

    function appendHTML(container, html) {
        container.insertAdjacentHTML('beforeend', html);
    }

    // Initialize
    initializeForm();

    // Event Listeners
    SInput.addEventListener('input', handleSChange);
    utilityTypeSelect.addEventListener('change', handleUtilityTypeChange);
    enableMonteCarloCheckbox.addEventListener('change', handleMonteCarloChange);
    form.addEventListener('submit', handleFormSubmit);

    // Mobile menu
    initializeMobileMenu();

    function initializeForm() {
        updateTransitionMatrix(2);
        convertToSymbolicInputs();
        handleUtilityTypeChange();
        handleMonteCarloChange();
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

    function handleSChange() {
        currentS = Math.max(2, Math.min(5, parseInt(this.value) || 2));
        this.value = currentS;
        updateTransitionMatrix(currentS);
    }

    function handleUtilityTypeChange() {
        if (utilityTypeSelect.value === 'custom') {
            customUtilitySection.classList.remove('hidden');
        } else {
            customUtilitySection.classList.add('hidden');
        }
    }

    function handleMonteCarloChange() {
        if (enableMonteCarloCheckbox.checked) {
            monteCarloSettings.classList.remove('hidden');
        } else {
            monteCarloSettings.classList.add('hidden');
        }
    }

    function convertToSymbolicInputs() {
        // Convert numeric inputs to text inputs for symbolic parameters
        const numericInputs = form.querySelectorAll('input[type="number"]');
        numericInputs.forEach(input => {
            if (!['S', 'T', 'nSimulations'].includes(input.name)) {
                input.type = 'text';
            }
        });
    }

    function updateTransitionMatrix(S) {
        transitionMatrixDiv.innerHTML = '';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'mb-4';
        header.innerHTML = `
            <p class="text-sm text-gray-600 mb-2">Matrice de transition P (ligne i → colonne j):</p>
            <p class="text-xs text-gray-500">Chaque ligne doit sommer à 1</p>
        `;
        transitionMatrixDiv.appendChild(header);

        // Create matrix container
        const matrixContainer = document.createElement('div');
        matrixContainer.className = 'inline-block bg-white p-2 rounded-lg border border-gray-300';
        
        // Create header row
        let headerRow = document.createElement('div');
        headerRow.className = 'flex mb-1';
        headerRow.innerHTML = '<div class="w-16"></div>'; // Empty corner
        for (let j = 0; j < S; j++) {
            headerRow.innerHTML += `
                <div class="w-12 text-center text-xs font-bold text-grenat">État ${j+1}</div>
            `;
        }
        matrixContainer.appendChild(headerRow);

        // Create matrix rows
        for (let i = 0; i < S; i++) {
            let row = document.createElement('div');
            row.className = 'flex items-center mb-1';
            row.innerHTML = `
                <div class="w-16 text-xs font-bold text-grenat flex items-center justify-center">
                    État ${i+1} →
                </div>
            `;
            
            for (let j = 0; j < S; j++) {
                let input = document.createElement('input');
                input.type = 'number';
                input.min = '0';
                input.max = '1';
                input.step = '0.01';
                input.value = i === j ? '0.8' : (0.2 / (S - 1)).toFixed(2);
                input.className = 'w-12 h-10 text-center border border-gray-300 rounded mx-1 transition-cell focus:ring-2 focus:ring-grenat focus:border-transparent';
                input.dataset.row = i;
                input.dataset.col = j;
                input.addEventListener('input', validateTransitionMatrix);
                row.appendChild(input);
            }
            matrixContainer.appendChild(row);
        }
        transitionMatrixDiv.appendChild(matrixContainer);

        // Add validation message
        let validationDiv = document.createElement('div');
        validationDiv.id = 'matrixValidation';
        validationDiv.className = 'mt-3 text-sm';
        transitionMatrixDiv.appendChild(validationDiv);

        validateTransitionMatrix();
    }

    function validateTransitionMatrix() {
        const S = currentS;
        let isValid = true;
        let messages = [];

        for (let i = 0; i < S; i++) {
            let rowSum = 0;
            for (let j = 0; j < S; j++) {
                const input = document.querySelector(`input[data-row="${i}"][data-col="${j}"]`);
                const value = parseFloat(input.value) || 0;
                rowSum += value;
                
                // Validate individual probability
                if (value < 0 || value > 1) {
                    input.classList.add('border-red-500', 'bg-red-50');
                    isValid = false;
                    if (!messages.includes('Les probabilités doivent être entre 0 et 1')) {
                        messages.push('Les probabilités doivent être entre 0 et 1');
                    }
                } else {
                    input.classList.remove('border-red-500', 'bg-red-50');
                }
            }

            // Validate row sum
            if (Math.abs(rowSum - 1) > 0.001) {
                isValid = false;
                messages.push(`La somme de la ligne ${i+1} doit être égale à 1 (actuelle: ${rowSum.toFixed(3)})`);
                
                // Highlight the row
                for (let j = 0; j < S; j++) {
                    const input = document.querySelector(`input[data-row="${i}"][data-col="${j}"]`);
                    input.classList.add('border-yellow-500', 'bg-yellow-50');
                }
            } else {
                // Remove highlight if valid
                for (let j = 0; j < S; j++) {
                    const input = document.querySelector(`input[data-row="${i}"][data-col="${j}"]`);
                    input.classList.remove('border-yellow-500', 'bg-yellow-50');
                }
            }
        }

        const validationDiv = document.getElementById('matrixValidation');
        if (isValid) {
            validationDiv.innerHTML = `
                <div class="flex items-center text-green-600">
                    <i data-feather="check-circle" class="w-4 h-4 mr-2"></i>
                    <span>Matrice de transition valide</span>
                </div>
            `;
        } else {
            validationDiv.innerHTML = `
                <div class="flex items-center text-red-600 mb-2">
                    <i data-feather="alert-circle" class="w-4 h-4 mr-2"></i>
                    <span>Problèmes détectés:</span>
                </div>
                <ul class="text-sm text-red-600 list-disc list-inside">
                    ${messages.map(msg => `<li>${msg}</li>`).join('')}
                </ul>
            `;
        }

        if (window.feather) {
            feather.replace();
        }

        return isValid;
    }

    function getTransitionMatrix() {
        const S = currentS;
        const P = [];
        
        for (let i = 0; i < S; i++) {
            const row = [];
            for (let j = 0; j < S; j++) {
                const input = document.querySelector(`input[data-row="${i}"][data-col="${j}"]`);
                row.push(parseFloat(input.value));
            }
            P.push(row);
        }
        
        return P;
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        solveStochasticProblem();
    }

    async function solveStochasticProblem() {
        if (!validateTransitionMatrix()) {
            showError('Veuillez corriger la matrice de transition avant de continuer.');
            return;
        }

        const formData = new FormData(form);
        const P = getTransitionMatrix();
        
        const problemData = {
            problem_type: formData.get('problemType'),
            T: parseInt(formData.get('T')),
            S: currentS,
            P: P,
            utility_type: formData.get('utilityType'),
            constraint_expr: formData.get('constraint'),
            parameters: {}
        };

        // Handle custom utility
        if (problemData.utility_type === 'custom') {
            problemData.custom_utility = formData.get('customUtility');
        }

        // Collect symbolic parameters
        const paramNames = ['beta', 'gamma', 'alpha', 'delta', 'A'];
        paramNames.forEach(param => {
            const value = formData.get(param);
            if (value) problemData.parameters[param] = value;
        });

        // Handle Monte Carlo
        if (enableMonteCarloCheckbox.checked) {
            problemData.monte_carlo = {
                n_simulations: parseInt(formData.get('nSimulations'))
            };
        }

        // Show loading
        showLoading();
        clearResults();

        try {
            // Check backend health first
            const isHealthy = await MicroeconomicsAPI.healthCheck();
            if (!isHealthy) {
                throw new Error('Le serveur backend n\'est pas accessible. Veuillez réessayer plus tard.');
            }

            const result = await MicroeconomicsAPI.solveStochastic(problemData);
            
            if (result.success) {
                lastStochasticResult = result;
                lastStochasticProblemData = problemData;
                displayStochasticResults(result, problemData);
                
                // Run Monte Carlo if requested
                if (enableMonteCarloCheckbox.checked) {
                    await runMonteCarloSimulation(problemData);
                }
            } else {
                showError(result.error || 'Erreur inconnue lors de la résolution');
            }
        } catch (error) {
            showError(error.message);
        } finally {
            hideLoading();
        }
    }

    function displayStochasticResults(result, problemData) {
        let resultsHTML = `
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 result-fade-in">
                <h3 class="text-lg font-bold text-green-800 mb-2">✅ Problème Stochastique Résolu</h3>
                <div class="space-y-2">
                    <p><strong>Type de problème:</strong> ${problemData.problem_type === 'markov' ? 'Markovien' : 'Vectoriel'}</p>
                    <p><strong>Horizon:</strong> ${problemData.T} périodes</p>
                    <p><strong>États:</strong> ${problemData.S}</p>
                    <p><strong>Fonction d'utilité:</strong> 
                        <div class="math-equation mt-1">$$U(c) = ${problemData.utility_type === 'custom' ? problemData.custom_utility : (problemData.utility_type === 'log' ? '\\log(c)' : '\\frac{c^{1-\\gamma}}{1-\\gamma}')}$$</div>
                    </p>
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
        // Display transition matrix
        if (result.transition_matrix) {
            const matrixHTML = `
                <div class="mt-6 result-fade-in">
                    <h4 class="font-bold text-grenat mb-3 text-lg">🔄 Matrice de Transition</h4>
                    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto">
                        <div class="math-equation text-center mb-2">$$P = \\begin{bmatrix}
                            ${result.transition_matrix.map(row => 
                                row.map(val => typeof val === 'number' ? val.toFixed(3) : val).join(' & ')
                            ).join(' \\\\ ')}
                        \\end{bmatrix}$$</div>
                    </div>
                </div>
            `;
            appendHTML(resultsDiv, matrixHTML);
        }

        // Display stationary distribution
        if (result.stationary_distribution) {
            const stationaryHTML = `
                <div class="mt-6 result-fade-in">
                    <h4 class="font-bold text-grenat mb-3 text-lg">⚖️ Distribution Stationnaire</h4>
                    <div class="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                        <div class="math-equation text-center mb-3">$$\\pi = \\begin{bmatrix}
                            ${result.stationary_distribution.map(val => 
                                typeof val === 'number' ? val.toFixed(4) : val
                            ).join(' & ')}
                        \\end{bmatrix}$$</div>
                        <div class="grid grid-cols-${currentS} gap-2 text-center">
                            ${result.stationary_distribution.map((prob, index) => `
                                <div class="bg-white rounded p-2 border">
                                    <div class="text-sm font-medium text-grenat">État ${index + 1}</div>
                                    <div class="text-lg font-bold">${(prob * 100).toFixed(1)}%</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            appendHTML(resultsDiv, stationaryHTML);
        }

        // Display Euler equations
        if (result.euler_equations && result.euler_equations.length > 0) {
            eulerEquationsDiv.classList.remove('hidden');
            eulerList.innerHTML = result.euler_equations.map((eq, index) => `
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 result-fade-in" style="animation-delay: ${index * 0.1}s">
                    <div class="flex items-center mb-2">
                        <span class="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3">${index + 1}</span>
                        <h5 class="font-bold text-blue-800">Équation d'Euler Stochastique</h5>
                    </div>
                    <div class="math-equation text-center text-sm">$$${eq}$$</div>
                </div>
            `).join('');
        }

        // Display value functions by state
        if (result.value_functions && Object.keys(result.value_functions).length > 0) {
            const valueFunctionsHTML = `
                <div class="mt-6 result-fade-in">
                    <h4 class="font-bold text-grenat mb-3 text-lg">📊 Fonctions de Valeur par État</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${Object.entries(result.value_functions).map(([state, func]) => `
                            <div class="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4">
                                <h5 class="font-bold text-grenat mb-2">État ${parseInt(state) + 1}</h5>
                                <div class="math-equation text-center text-sm">$$V_{${parseInt(state) + 1}}(k) = ${func}$$</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            appendHTML(resultsDiv, valueFunctionsHTML);
        }

        // Display policy functions by state
        if (result.policy_functions && Object.keys(result.policy_functions).length > 0) {
            const policyHTML = `
                <div class="mt-6 result-fade-in">
                    <h4 class="font-bold text-grenat mb-3 text-lg">🎯 Politiques Optimales par État</h4>
                    <div class="bg-white border border-gray-200 rounded-lg p-4 overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">État</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fonction de Politique</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                ${Object.entries(result.policy_functions).map(([state, policy]) => `
                                    <tr class="bg-white">
                                        <td class="px-4 py-2 text-sm font-medium text-gray-900">État ${parseInt(state) + 1}</td>
                                        <td class="px-4 py-2 text-sm">
                                            <div class="math-equation">$$${policy}$$</div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
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
    }

    async function runMonteCarloSimulation(problemData) {
        try {
            showLoading('Simulation Monte Carlo en cours...');
            
            const result = await MicroeconomicsAPI.runMonteCarlo({
                T: problemData.T,
                S: problemData.S,
                P: problemData.P,
                n_simulations: problemData.monte_carlo.n_simulations,
                parameters: problemData.parameters
            });

            if (result.success) {
                monteCarloResultsDiv.classList.remove('hidden');
                monteCarloContent.innerHTML = `
                    <div class="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 result-fade-in">
                        <h4 class="font-bold text-purple-800 mb-3 text-lg">🎲 Résultats Monte Carlo</h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div class="bg-white rounded p-3 text-center border">
                                <div class="text-sm text-gray-600">Simulations</div>
                                <div class="text-2xl font-bold text-grenat">${result.n_simulations.toLocaleString()}</div>
                            </div>
                            <div class="bg-white rounded p-3 text-center border">
                                <div class="text-sm text-gray-600">États moyens</div>
                                <div class="text-lg font-bold text-grenat">${result.mean_path.join(' → ')}</div>
                            </div>
                            <div class="bg-white rounded p-3 text-center border">
                                <div class="text-sm text-gray-600">Écart-type</div>
                                <div class="text-sm font-mono text-grenat">${result.std_path.map(s => s.toFixed(3)).join(', ')}</div>
                            </div>
                        </div>
                        
                        <h5 class="font-bold text-gray-700 mb-2">Échantillon de chemins d'états:</h5>
                        <div class="bg-gray-50 border border-gray-200 rounded p-3 overflow-x-auto max-h-40">
                            <pre class="text-xs">${JSON.stringify(result.state_paths_sample, null, 2)}</pre>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Monte Carlo simulation failed:', error);
            showError(`Erreur simulation Monte Carlo: ${error.message}`);
        } finally {
            hideLoading();
        }
    }

    async function downloadLaTeX() {
        if (!lastStochasticResult || !lastStochasticProblemData) {
            showError('Aucun résultat disponible pour le téléchargement');
            return;
        }
        
        try {
            showLoading('Génération du fichier LaTeX...');
            const blob = await MicroeconomicsAPI.generateLaTeX('stochastic', lastStochasticProblemData, lastStochasticResult);
            downloadBlob(blob, `solution_stochastique_${Date.now()}.tex`);
        } catch (error) {
            showError(`Erreur lors du téléchargement LaTeX: ${error.message}`);
        } finally {
            hideLoading();
        }
    }

    async function downloadPDF() {
        if (!lastStochasticResult || !lastStochasticProblemData) {
            showError('Aucun résultat disponible pour le téléchargement');
            return;
        }
        
        try {
            showLoading('Génération du PDF...');
            const blob = await MicroeconomicsAPI.generatePDF('stochastic', lastStochasticProblemData, lastStochasticResult);
            downloadBlob(blob, `rapport_stochastique_${Date.now()}.pdf`);
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
        monteCarloResultsDiv.classList.add('hidden');
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