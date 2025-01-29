// Convert whenClicked to onClick
window.onload = function () {
    var anchors = document.querySelectorAll('[whenClicked]');
    anchors.forEach(anchor => {
        anchor.onclick = function () {
            var code = this.getAttribute('whenClicked');
            if (code) {
                try {
                    eval(code);
                } catch (error) {
                    console.error('Error executing whenClicked attribute:', error);
                }
            }
        }
    });
};

// Book a Call Positioning
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

// Book a Call Mobile Movement
document.addEventListener("DOMContentLoaded", function () {
        const callBtn = document.querySelector('.fixed-call-btn');
        let hasScrolled = false;

        function handleScroll() {
            if (window.scrollY > 0 && !hasScrolled) {
                callBtn.classList.add('show');
                hasScrolled = true;
            }
        }

        window.addEventListener('scroll', handleScroll);
    });

// Menu Bar Adjustments
document.addEventListener('DOMContentLoaded', () => {
    const megaUnderResources = document.getElementById("mega-under-resources");
    const megaResources = document.getElementById("mega-resources");

    if (megaUnderResources && megaResources) {
        megaResources.appendChild(megaUnderResources);
    }
});

// Prevent Dropdown Window Closing on Tab Selection
document.addEventListener('DOMContentLoaded', () => {
    const dropdownTabs = document.querySelectorAll('.primary-dropdown-category');
    dropdownTabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    });
});
