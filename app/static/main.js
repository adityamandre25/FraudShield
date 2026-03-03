document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const textInput = document.getElementById('textInput');
    const resultCard = document.getElementById('resultCard');
    const resultLabel = document.getElementById('resultLabel');
    const errorContainer = document.getElementById('errorContainer');
    const errorText = document.getElementById('errorText');
    const spinner = analyzeBtn.querySelector('.spinner');
    const buttonText = analyzeBtn.querySelector('.btn-text');

    function resetResult() {
        resultCard.classList.add('hidden');
        resultCard.classList.remove(
            'result-safe',
            'result-fraud',
            'result-suspicious',
            'animate'
        );
        resultLabel.innerText = '';
    }

    function showError(msg) {
        errorText.innerText = msg;
        errorContainer.classList.remove('hidden');
    }

    analyzeBtn.addEventListener('click', async () => {
        const text = textInput.value.trim();
        if (!text) return;

        errorContainer.classList.add('hidden');
        resetResult();

        analyzeBtn.disabled = true;
        spinner.classList.remove('hidden');
        buttonText.innerText = 'Analyzing...';

        try {
            const resp = await fetch('/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });

            if (!resp.ok) throw new Error('Network error');

            const data = await resp.json();
            const label = data.label;

            if (!label) throw new Error('Invalid response');

            const cls = 'result-' + label.toLowerCase();

            resultCard.classList.remove('hidden');
            resultCard.classList.add(cls);

            
            void resultCard.offsetWidth;

            resultCard.classList.add('animate');
            resultLabel.innerText = label;

        } catch (err) {
            showError('Server error. Please try again.');
        } finally {
            analyzeBtn.disabled = false;
            spinner.classList.add('hidden');
            buttonText.innerText = 'Analyze';
        }
    });
});