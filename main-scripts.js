document.addEventListener("DOMContentLoaded", function() {
    // Tab Selection
    const featuredTab = document.querySelector('a[data-w-tab="Featured"]');
    const upNextTab = document.querySelector('a[data-w-tab="Up Next"]');
    if (featuredTab && !featuredTab.offsetParent && upNextTab) {
        upNextTab.classList.add('w--current');
    }

    // Copy to Clipboard
    window.copyToClipboard = function() {
        const copyText = document.getElementById("shareURL");
        if (copyText) {
            copyText.select();
            document.execCommand("copy");
            alert("Link copied to clipboard!");
        }
    };

    // Search Focus
    const searchTab = document.querySelector('#search-tab');
    const searchInput = document.querySelector('.in-line-search');
    if (searchTab && searchInput) {
        searchTab.addEventListener('click', function() {
            setTimeout(() => searchInput.focus(), 300);
        });
    }

    // Announcement Bar Logic
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

    // Popup Logic
    const excludedUrls = [
        'https://www.onecrownpensions.com/contact-us',
        'https://www.onecrownpensions.com/book-a-call'
    ];
    const isExcludedPage = excludedUrls.includes(window.location.href);
    const isVideoPage = window.location.href.startsWith('https://www.onecrownpensions.com/ssas-video-hub/');
    if (!isExcludedPage) {
        let visitCount = parseInt(localStorage.getItem('pageVisitCount') || '0', 10);
        visitCount += 1;
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
            console.log("120 minutes have passed since last dismissal. Resetting dismissal time.");
            localStorage.removeItem('popupDismissedTime');
            popupDismissedTime = 0;
        }

        if (isVideoPage) {
            if (videoPageVisitCount === 2 && popupDismissedTime === 0) {
                console.log("Second video page visit. Showing popup immediately.");
                showPopup();
            }
        } else {
            if (visitCount % 2 === 0 && popupDismissedTime === 0) {
                console.log("Non-video page. Conditions met. Popup will show after 45 seconds.");
                setTimeout(showPopup, 45000);
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const popupClose = document.getElementById('popup-close');
            if (popupClose) {
                popupClose.addEventListener('click', dismissPopup);
            }
        });
    }

    function loadHubSpotForm() {
        const formContainer = document.getElementById('form-container');
        if (formContainer && !formContainer.hasChildNodes()) {
            const script = document.createElement('script');
            script.src = "//js.hsforms.net/forms/embed/v2.js";
            script.onload = function() {
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
            console.log("Popup displayed.");
            loadHubSpotForm();
        }
    }

    function dismissPopup() {
        const popup = document.getElementById('popup');
        if (popup) {
            popup.style.display = 'none';
            console.log("Popup dismissed.");
            localStorage.setItem('popupDismissedTime', Date.now().toString());
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const triggerPopupButton = document.getElementById('trigger-popup-button');
        if (triggerPopupButton) {
            triggerPopupButton.addEventListener('click', showPopup);
        }
    });
});
