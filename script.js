document.addEventListener('DOMContentLoaded', () => {
    const wordInput = document.getElementById('wordInput');
    const generateBtn = document.getElementById('generateBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultSection = document.getElementById('resultSection');
    const resultContent = document.getElementById('resultContent');
    const errorSection = document.getElementById('errorSection');
    const errorMessage = document.getElementById('errorMessage');
    const copyBtn = document.getElementById('copyBtn');

    generateBtn.addEventListener('click', generateThreeLine);
    wordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateThreeLine();
        }
    });

    copyBtn.addEventListener('click', copyToClipboard);

    async function generateThreeLine() {
        const word = wordInput.value.trim();

        if (!word) {
            showError('단어를 입력해주세요!');
            return;
        }

        if (word.length !== 3) {
            showError('3글자 단어를 입력해주세요!');
            return;
        }

        hideAll();
        showLoading();
        generateBtn.disabled = true;

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ word }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '서버 오류가 발생했습니다.');
            }

            const data = await response.json();
            showResult(data.threeLine);
        } catch (error) {
            console.error('Error:', error);
            showError(error.message || '삼행시 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            generateBtn.disabled = false;
            hideLoading();
        }
    }

    function showLoading() {
        loadingSpinner.classList.remove('hidden');
    }

    function hideLoading() {
        loadingSpinner.classList.add('hidden');
    }

    function showResult(threeLine) {
        resultContent.textContent = threeLine;
        resultSection.classList.remove('hidden');
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorSection.classList.remove('hidden');
    }

    function hideAll() {
        resultSection.classList.add('hidden');
        errorSection.classList.add('hidden');
    }

    async function copyToClipboard() {
        const text = resultContent.textContent;
        try {
            await navigator.clipboard.writeText(text);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✅ 복사됨!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        } catch (error) {
            console.error('복사 실패:', error);
            showError('복사에 실패했습니다.');
        }
    }
});
