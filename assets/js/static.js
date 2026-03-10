// static.js - Module d'optimisation statique
document.addEventListener('DOMContentLoaded', function() {
    // Elements DOM
    const form = document.getElementById('staticProblemForm');
    const problemTypeSelect = document.getElementById('problemType');
    const nGoodsInput = document.getElementById('nGoods');
    const utilityTypeSelect = document.getElementById('utilityType');
    const customUtilitySection = document.getElementById('customUtilitySection');
    const customUtilityInput = document.getElementById('customUtility');
    const parametersSection = document.getElementById('parametersSection');
    const parametersContainer = document.getElementById('parametersContainer');
    const utilityPreview = document.getElementById('utilityPreview');
    const previewContent = document.getElementById('previewContent');
    const additionalParamsSection = document.getElementById('additionalParamsSection');
    const budgetLabel = document.getElementById('budgetLabel');
    const utilityLevelSection = document.getElementById('utilityLevelSection');
    const priceSection = document.getElementById('priceSection');
    const priceContainer = document.getElementById('priceContainer');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    const solutionStepsDiv = document.getElementById('solutionSteps');
    const stepsList = document.getElementById('stepsList');
    const marshallianResults = document.getElementById('marshallianResults');
    const hicksianResults = document.getElementById('hicksianResults');
    const demandEquations = document.getElementById('demandEquations');
    const elasticitiesSection = document.getElementById('elasticitiesSection');
    const elasticitiesContent = document.getElementById('elasticitiesContent');
    const hicksianEquations = document.getElementById('hicksianEquations');
    const expenditureSection = document.getElementById('expenditureSection');
    const expenditureContent = document.getElementById('expenditureContent');
    const tmsSection = document.getElementById('tmsSection');
    const tmsContent = document.getElementById('tmsContent');
    const slutskySection = document.getElementById('slutskySection');
    const slutskyContent = document.getElementById('slutskyContent');
    const graphicalResults = document.getElementById('graphicalResults');
    const graphContainer = document.getElementById('graphContainer');

    // State variables
    let currentNGoods = 2;
    let currentUtilityType = 'cobb-douglas';
    let lastStaticResult = null;
    let lastStaticProblemData = null;

    // Initialize the form
    initializeForm();

    // Event Listeners
    problemTypeSelect.addEventListener('change', updateProblemType);
    nGoodsInput.addEventListener('input', handleNGoodsChange);
    utilityTypeSelect.addEventListener('change', handleUtilityTypeChange);
    customUtilityInput?.addEventListener('input', updateUtilityPreview);
    parametersContainer.addEventListener('input', updateUtilityPreview);
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);

    // Mobile menu (if exists)
    initializeMobileMenu();

    function initializeForm() {
        updateProblemType();
        updateParametersSection();
        updatePriceSection();
        updateUtilityPreview();
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

    function handleNGoodsChange() {
        currentNGoods = Math.max(1, Math.min(10, parseInt(this.value) || 2));
        this.value = currentNGoods;
        updateParametersSection();
        updatePriceSection();
        updateUtilityPreview();
    }

    function handleUtilityTypeChange() {
        currentUtilityType = this.value;
        updateParametersSection();
        updateUtilityPreview();
        
        if (this.value === 'custom') {
            customUtilitySection.classList.remove('hidden');
        } else {
            customUtilitySection.classList.add('hidden');
        }
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        solveStaticProblem();
    }

    function updateProblemType() {
        const problemType = problemTypeSelect.value;
        
        if (problemType === 'hicksian') {
            utilityLevelSection.classList.remove('hidden');
            budgetLabel.textContent = 'Dépense minimale (E)';
        } else {
            utilityLevelSection.classList.add('hidden');
            budgetLabel.textContent = 'Revenu (R)';
        }
    }

    function convertToSymbolicInputs() {
        // Convert numeric inputs to text inputs for symbolic parameters
        const numericInputs = form.querySelectorAll('input[type="number"]');
        numericInputs.forEach(input => {
            if (!['nGoods', 'T', 'nSimulations'].includes(input.name)) {
                input.type = 'text';
            }
        });
    }

    function updateParametersSection() {
        parametersContainer.innerHTML = '';
        
        switch(currentUtilityType) {
            case 'cobb-douglas':
                parametersContainer.innerHTML = `
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">A (facteur d'échelle)</label>
                            <input type="text" name="A" value="1" 
                                   class="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-grenat"
                                   placeholder="1 ou A">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        ${Array.from({length: currentNGoods}, (_, i) => `
                            <div>
                                <label class="block text-xs text-gray-600 mb-1">Alpha ${i+1} (α${i+1})</label>
                                <input type="text" name="alpha${i+1}" value="${(1/currentNGoods).toFixed(2)}" 
                                       class="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-grenat"
                                       placeholder="0.5 ou α${i+1}">
                            </div>
                        `).join('')}
                    </div>
                `;
                break;
                
            case 'leontief':
                parametersContainer.innerHTML = `
                    <div class="grid grid-cols-2 gap-4">
                        ${Array.from({length: currentNGoods}, (_, i) => `
                            <div>
                                <label class="block text-xs text-gray-600 mb-1">Coefficient a${i+1}</label>
                                <input type="text" name="a${i+1}" value="1" 
                                       class="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-grenat"
                                       placeholder="1 ou a${i+1}">
                            </div>
                        `).join('')}
                    </div>
                `;
                break;
                
            case 'ces':
                parametersContainer.innerHTML = `
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">Rho (ρ)</label>
                            <input type="text" name="rho" value="0.5" 
                                   class="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-grenat"
                                   placeholder="0.5 ou ρ">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        ${Array.from({length: currentNGoods}, (_, i) => `
                            <div>
                                <label class="block text-xs text-gray-600 mb-1">Poids ${i+1}</label>
                                <input type="text" name="weight${i+1}" value="${(1/currentNGoods).toFixed(2)}" 
                                       class="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-grenat"
                                       placeholder="0.5 ou w${i+1}">
                            </div>
                        `).join('')}
                    </div>
                `;
                break;
                
            case 'crra':
                parametersContainer.innerHTML = `
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">Gamma (γ)</label>
                            <input type="text" name="gamma" value="2" 
                                   class="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-grenat"
                                   placeholder="2 ou γ">
                        </div>
                    </div>
                `;
                break;
                
            case 'cara':
                parametersContainer.innerHTML = `
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">Alpha (α)</label>
                            <input type="text" name="alpha" value="1" 
                                   class="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-grenat"
                                   placeholder="1 ou α">
                        </div>
                    </div>
                `;
                break;
                
            default:
                parametersContainer.innerHTML = '<p class="text-gray-500 text-sm">Aucun paramètre nécessaire pour cette fonction</p>';
        }

        // Add event listeners to new parameter inputs
        parametersContainer.addEventListener('input', updateUtilityPreview);
    }

    function updatePriceSection() {
        priceContainer.innerHTML = '';
        
        priceContainer.innerHTML = Array.from({length: currentNGoods}, (_, i) => `
            <div>
                <label class="block text-xs text-gray-600 mb-1">Prix p${i+1}</label>
                <input type="text" name="p${i+1}" value="${(i + 1).toFixed(1)}" 
                       class="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-grenat"
                       placeholder="${(i + 1).toFixed(1)} ou p${i+1}">
            </div>
        `).join('');
    }

    function updateUtilityPreview() {
        const utilityType = utilityTypeSelect.value;
        let preview = '';

        if (utilityType === 'custom') {
            const customExpr = customUtilityInput.value;
            preview = customExpr || 'U(x_1, x_2, \\ldots) = \\text{...}';
        } else {
            switch(utilityType) {
                case 'cobb-douglas':
                    preview = `U = \\prod_{i=1}^{${currentNGoods}} x_i^{\\alpha_i}`;
                    break;
                    
                case 'leontief':
                    preview = `U = \\min\\left(${Array.from({length: currentNGoods}, (_, i) => `\\frac{x_{${i+1}}}{a_{${i+1}}}`).join(', ')}\\right)`;
                    break;
                    
                case 'ces':
                    preview = `U = \\left(\\sum_{i=1}^{${currentNGoods}} \\alpha_i x_i^{\\rho}\\right)^{\\frac{1}{\\rho}}`;
                    break;
                    
                case 'crra':
                    preview = `U = \\sum_{i=1}^{${currentNGoods}} \\frac{x_i^{1-\\gamma}}{1-\\gamma}`;
                    break;
                    
                case 'cara':
                    preview = `U = -\\sum_{i=1}^{${currentNGoods}} e^{-\\alpha x_i}`;
                    break;
            }
        }

        previewContent.innerHTML = `$$${preview}$$`;
        utilityPreview.classList.remove('hidden');
        
        // Render MathJax
        if (window.MathJax) {
            MathJax.typesetPromise([previewContent]).catch(err => console.error('MathJax error:', err));
        }
    }

    async function solveStaticProblem() {
        const formData = new FormData(form);
        const problemData = {
            problem_type: formData.get('problemType'),
            utility_type: formData.get('utilityType'),
            n_goods: parseInt(formData.get('nGoods')),
            parameters: {},
            constraints: [],
            options: {
                compute_elasticities: formData.get('computeElasticities') === 'on',
                compute_tms: formData.get('computeTMS') === 'on',
                show_steps: formData.get('showSteps') === 'on'
            }
        };

        // Handle custom utility
        if (problemData.utility_type === 'custom') {
            problemData.custom_utility = formData.get('customUtility');
        }

        // Collect parameters (symbolic)
        const paramNames = getParameterNames(currentUtilityType, currentNGoods);
        paramNames.forEach(param => {
            const value = formData.get(param);
            if (value) problemData.parameters[param] = value;
        });

        // Collect prices and additional parameters
        for (let i = 1; i <= currentNGoods; i++) {
            const price = formData.get(`p${i}`);
            if (price) problemData.parameters[`p${i}`] = price;
        }

        const R = formData.get('R');
        if (R) problemData.parameters['R'] = R;
        
        if (problemData.problem_type === 'hicksian') {
            const U_bar = formData.get('U_bar');
            if (U_bar) problemData.parameters['U_bar'] = U_bar;
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

            const result = await MicroeconomicsAPI.solveStatic(problemData);
            
            if (result.success) {
                lastStaticResult = result;
                lastStaticProblemData = problemData;
                displayStaticResults(result, problemData);
            } else {
                showError(result.error || 'Erreur inconnue lors de la résolution');
            }
        } catch (error) {
            showError(error.message);
        } finally {
            hideLoading();
        }
    }

    function getParameterNames(utilityType, nGoods) {
        switch(utilityType) {
            case 'cobb-douglas':
                return ['A', ...Array.from({length: nGoods}, (_, i) => `alpha${i+1}`)];
            case 'leontief':
                return Array.from({length: nGoods}, (_, i) => `a${i+1}`);
            case 'ces':
                return ['rho', ...Array.from({length: nGoods}, (_, i) => `weight${i+1}`)];
            case 'crra':
                return ['gamma'];
            case 'cara':
                return ['alpha'];
            default:
                return [];
        }
    }

    function displayStaticResults(result, problemData) {
        let resultsHTML = `
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 result-fade-in">
                <h3 class="text-lg font-bold text-green-800 mb-2">✅ Solution trouvée</h3>
                <div class="space-y-2">
                    <p><strong>Type de problème:</strong> ${problemData.problem_type === 'marshallian' ? 'Marshallien' : 'Hicksien'}</p>
                    <p><strong>Fonction d'utilité:</strong> 
                        <div class="math-equation mt-1">${result.utility_function ? `$$${result.utility_function}$$` : 'Non spécifié'}</div>
                    </p>
                    <p><strong>Nombre de biens:</strong> ${problemData.n_goods}</p>
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
        // Display FOCs
        if (result.focs && result.focs.length > 0) {
            const focsHTML = `
                <div class="mt-6 result-fade-in">
                    <h4 class="font-bold text-grenat mb-3 text-lg">📐 Conditions du Premier Ordre</h4>
                    <div class="space-y-3">
                        ${result.focs.map((foc, index) => `
                            <div class="equation-block">
                                <div class="math-equation text-sm">$$${foc}$$</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            resultsDiv.innerHTML += focsHTML;
        }

        // Display solution
        if (result.solution && Object.keys(result.solution).length > 0) {
            const solutionHTML = `
                <div class="mt-6 result-fade-in">
                    <h4 class="font-bold text-grenat mb-3 text-lg">🎯 Solution Optimale</h4>
                    <div class="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                        ${Object.entries(result.solution).map(([variable, expression]) => `
                            <div class="flex items-center justify-between py-2 border-b border-yellow-100 last:border-b-0">
                                <span class="text-sm font-medium text-grenat">${variable}:</span>
                                <span class="text-sm math-equation font-mono bg-white px-3 py-1 rounded border">$$${expression}$$</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            resultsDiv.innerHTML += solutionHTML;
        }

        // Display elasticities
        if (result.elasticities && Object.keys(result.elasticities).length > 0) {
            elasticitiesSection.classList.remove('hidden');
            elasticitiesContent.innerHTML = Object.entries(result.elasticities).map(([key, value]) => `
                <div class="flex justify-between items-center py-2 border-b border-gray-200">
                    <span class="text-sm font-medium">${key.replace(/_/g, ' ')}:</span>
                    <span class="text-sm font-mono bg-white px-2 py-1 rounded">${typeof value === 'number' ? value.toFixed(3) : value}</span>
                </div>
            `).join('');
        }

        // Display TMS
        if (result.tms && problemData.options.compute_tms) {
            tmsSection.classList.remove('hidden');
            tmsContent.innerHTML = `
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="math-equation text-center text-lg">$$\\text{TMS} = ${result.tms}$$</div>
                    <p class="text-xs text-gray-600 mt-2 text-center">Taux Marginal de Substitution entre x₁ et x₂</p>
                </div>
            `;
        }

        // Display steps if available
        if (result.steps && result.steps.length > 0 && problemData.options.show_steps) {
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

        // Try to display graphical results for 2 goods
        if (currentNGoods === 2) {
            displayGraphicalResults(result, problemData);
        }
    }

    async function downloadLaTeX() {
        if (!lastStaticResult || !lastStaticProblemData) {
            showError('Aucun résultat disponible pour le téléchargement');
            return;
        }
        
        try {
            showLoading('Génération du fichier LaTeX...');
            const blob = await MicroeconomicsAPI.generateLaTeX('static', lastStaticProblemData, lastStaticResult);
            downloadBlob(blob, `solution_statique_${Date.now()}.tex`);
        } catch (error) {
            showError(`Erreur lors du téléchargement LaTeX: ${error.message}`);
        } finally {
            hideLoading();
        }
    }

    async function downloadPDF() {
        if (!lastStaticResult || !lastStaticProblemData) {
            showError('Aucun résultat disponible pour le téléchargement');
            return;
        }
        
        try {
            showLoading('Génération du PDF...');
            const blob = await MicroeconomicsAPI.generatePDF('static', lastStaticProblemData, lastStaticResult);
            downloadBlob(blob, `rapport_statique_${Date.now()}.pdf`);
        } catch (error) {
            showError(`Erreur lors du téléchargement PDF: ${error.message}`);
        } finally {
            hideLoading();
        }
    }

    function displayGraphicalResults(result, problemData) {
        graphicalResults.classList.remove('hidden');
        
        // Placeholder for graphical representation
        graphContainer.innerHTML = `
            <div class="text-center space-y-4 result-fade-in">
                <p class="text-gray-600">📊 Représentation graphique pour 2 biens</p>
                <div class="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 h-64 flex flex-col items-center justify-center">
                    <i data-feather="bar-chart-2" class="w-12 h-12 text-gray-400 mb-2"></i>
                    <p class="text-gray-500">Visualisation en cours de développement</p>
                    <p class="text-xs text-gray-400 mt-2">Les graphiques interactifs seront bientôt disponibles</p>
                </div>
                <div class="grid grid-cols-2 gap-4 text-xs">
                    <div class="text-center">
                        <div class="w-4 h-4 bg-grenat rounded-full mx-auto mb-1"></div>
                        <span>Courbe d'indifférence</span>
                    </div>
                    <div class="text-center">
                        <div class="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-1"></div>
                        <span>Contrainte budgétaire</span>
                    </div>
                </div>
            </div>
        `;

        // Update feather icons
        if (window.feather) {
            feather.replace();
        }
    }

    function showLoading(message = 'Résolution en cours...') {
        loadingDiv.classList.remove('hidden');
        if (message) {
            loadingDiv.querySelector('p').textContent = message;
        }
    }

    function hideLoading() {
        loadingDiv.classList.add('hidden');
    }

    function clearResults() {
        resultsDiv.innerHTML = '';
        solutionStepsDiv.classList.add('hidden');
        marshallianResults.classList.add('hidden');
        hicksianResults.classList.add('hidden');
        tmsSection.classList.add('hidden');
        slutskySection.classList.add('hidden');
        graphicalResults.classList.add('hidden');
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

    // Initialize the form when the page loads
    initializeForm();
});