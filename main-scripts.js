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

// Announcement Bar Duplication for Mobile
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

// Popup Handling
const excludedUrls = [
    'https://www.onecrownpensions.com/contact-us',
    'https://www.onecrownpensions.com/book-a-call'
];
const isExcludedPage = excludedUrls.includes(window.location.href);
const isVideoPage = window.location.href.startsWith('https://www.onecrownpensions.com/ssas-video-hub/');

if (!isExcludedPage) {
    let visitCount = parseInt(localStorage.getItem('pageVisitCount') || '0', 10) + 1;
    localStorage.setItem('pageVisitCount', visitCount.toString());
    
    let videoPageVisitCount = parseInt(localStorage.getItem('videoPageVisitCount') || '0', 10);
    if (isVideoPage) {
        videoPageVisitCount += 1;
        localStorage.setItem('videoPageVisitCount', videoPageVisitCount.toString());
    }

    let popupDismissedTime = parseInt(localStorage.getItem('popupDismissedTime') || '0', 10);
    const now = Date.now();
    const minDismissalTime = 120 * 60 * 1000;

    if (popupDismissedTime && (now - popupDismissedTime >= minDismissalTime)) {
        localStorage.removeItem('popupDismissedTime');
        popupDismissedTime = 0;
    }

    if (isVideoPage && videoPageVisitCount === 2 && popupDismissedTime === 0) {
        document.addEventListener('DOMContentLoaded', showPopup);
    } else if (!isVideoPage && visitCount % 2 === 0 && popupDismissedTime === 0) {
        setTimeout(showPopup, 45000);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const popupClose = document.getElementById('popup-close');
        if (popupClose) {
            popupClose.addEventListener('click', dismissPopup);
        }
    });
} else {
    console.log("Popup will not show on this excluded page.");
}

function loadHubSpotForm() {
    const formContainer = document.getElementById('form-container');
    if (formContainer && !formContainer.hasChildNodes()) {
        const script = document.createElement('script');
        script.src = "//js.hsforms.net/forms/embed/v2.js";
        script.onload = function () {
            hbspt.forms.create({
                portalId: "5380630",
                formId: "123749c9-2e68-411b-a5f0-cb9212c7ca4f",
                target: "#form-container"
            });
        };
        document.body.appendChild(script);
    }
}

function showPopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.style.display = 'block';
        loadHubSpotForm();
    }
}

function dismissPopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.style.display = 'none';
        localStorage.setItem('popupDismissedTime', Date.now().toString());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const triggerPopupButton = document.getElementById('trigger-popup-button');
    if (triggerPopupButton) {
        triggerPopupButton.addEventListener('click', showPopup);
    }
});
