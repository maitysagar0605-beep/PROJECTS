const generateBtn = document.querySelector('.generate-btn');
const paletteContainer = document.querySelector('.palette-container');

generateBtn.addEventListener('click', generatePalette);

paletteContainer.addEventListener('click', (event) => {
    const copyBtn = event.target.closest('.copy-btn');
    const colorDiv = event.target.closest('.color');

    // Case 1: Copy icon clicked
    if (copyBtn) {
        const colorInfo = copyBtn.closest('.color-info');
        const hexValue = colorInfo.querySelector('.hex-value').textContent;

        navigator.clipboard
            .writeText(hexValue)
            .then(() => showCopySuccess(copyBtn))
            .catch((err) => console.error(err));
    } 
    // Case 2: Color box area clicked
    else if (colorDiv) {
        const colorBox = colorDiv.closest('.color-box');
        const hexValue = colorBox.querySelector('.hex-value').textContent;
        const targetCopyBtn = colorBox.querySelector('.copy-btn');

        navigator.clipboard
            .writeText(hexValue)
            .then(() => showCopySuccess(targetCopyBtn))
            .catch((err) => console.error(err));
    }
});

function showCopySuccess(element) {
    if (!element) return;

    // Get the parent container (.copy-btn)
    const btn = element.closest('.copy-btn') || element;

    btn.replaceChildren(); // Clears all existing icons/SVGs to prevent duplicates
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.style.color = '#48bb78';

    setTimeout(() => {
        btn.replaceChildren(); // Clears check icon before inserting copy icon
        btn.innerHTML = '<i class="far fa-copy"></i>';
        btn.style.color = '';
    }, 1500);
}

function generatePalette() {
    const colors = [];
    for (let i = 0; i < 5; i++) {
        colors.push(generateRandomColor());
    }
    updatePaletteUI(colors);
}

function generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function updatePaletteUI(colors) {
    const colorBoxes = document.querySelectorAll('.color-box');

    colorBoxes.forEach((box, index) => {
        if (colors[index]) {
            const colorDiv = box.querySelector('.color');
            const hexValueDiv = box.querySelector('.hex-value');

            colorDiv.style.backgroundColor = colors[index];
            hexValueDiv.textContent = colors[index];
        }
    });
}

// Initial generator call
generatePalette();