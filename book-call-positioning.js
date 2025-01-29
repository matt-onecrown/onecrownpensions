    function updateFixedElementPosition() {
        var fixedElement = document.querySelector('.fixed-call-btn');
        var footer = document.querySelector('.s_footer');
        if (fixedElement && footer) {
            var footerTop = footer.getBoundingClientRect().top;
            var windowHeight = window.innerHeight;
            var fixedElementHeight = fixedElement.offsetHeight;
            var desiredBottomPosition = 10;

            var fixedElementBottomPosition = windowHeight - desiredBottomPosition;

            var isOverlapping = fixedElementBottomPosition + fixedElementHeight > footerTop && footerTop < windowHeight;
            fixedElement.style.bottom = isOverlapping 
                ? (windowHeight - footerTop + 10) + 'px' 
                : desiredBottomPosition + 'px';
        }
    }

    // Debounced scroll and resize event listeners
    let debounceTimer;
    function debounceUpdate() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updateFixedElementPosition, 50);
    }

    window.addEventListener('scroll', debounceUpdate);
    window.addEventListener('resize', debounceUpdate);

    // Initial call
    updateFixedElementPosition();
