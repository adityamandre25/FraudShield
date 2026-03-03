const predictBtn = document.getElementById('predictBtn');
const textInput = document.getElementById('textInput');
const resultCard = document.getElementById('resultCard');
const resultLabel = document.getElementById('resultLabel');
const errorContainer = document.getElementById('errorContainer');
const errorText = document.getElementById('errorText');
const spinner = predictBtn.querySelector('.spinner');
const buttonText = predictBtn.querySelector('.btn-text');

function resetResult() {
    resultCard.className = 'result hidden';
    resultLabel.textContent = '';
}

function showError(msg) {
    errorText.textContent = msg;
    errorContainer.classList.remove('hidden');
}

predictBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    // ripple effect
    const circle = document.createElement('span');
    circle.className = 'ripple';
    const rect = predictBtn.getBoundingClientRect();
    circle.style.left = `${e.clientX - rect.left}px`;
    circle.style.top = `${e.clientY - rect.top}px`;
    predictBtn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);

    const text = textInput.value.trim();
    if (!text) return;

    errorContainer.classList.add('hidden');
    resetResult();

    predictBtn.disabled = true;
    spinner.classList.remove('hidden');
    buttonText.textContent = 'Analyzing...';

    try {
        const resp = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        if (!resp.ok) throw new Error('Network response was not ok');
        const data = await resp.json();
        const label = (data.label || '').toUpperCase();
        if (!label) throw new Error('Invalid response');

        resultCard.className = 'result';
        const cls = 'result-' + label.toLowerCase();
        resultCard.classList.add(cls);
        resultLabel.textContent = label;
    } catch (err) {
        showError('Server error. Please try again.');
    } finally {
        predictBtn.disabled = false;
        spinner.classList.add('hidden');
        buttonText.textContent = 'Analyze';
    }
});