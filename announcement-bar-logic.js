document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.announcement-bar-text-wrapper');
    const textElement = document.querySelector('.announcement-bar-text');

    function duplicateTextElements() {
        wrapper.querySelectorAll('.announcement-bar-text').forEach((el, index) => {
            if (index > 0) el.remove();
        });

        if (window.innerWidth <= 767 && wrapper && textElement) {
            for (let i = 0; i < 3; i++) {
                const clone = textElement.cloneNode(true);
                wrapper.appendChild(clone);
            }
        }
    }

    duplicateTextElements();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(duplicateTextElements, 200);
    });
});
