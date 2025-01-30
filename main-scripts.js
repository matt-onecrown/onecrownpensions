document.addEventListener("DOMContentLoaded", function() {
    // Convert whenClicked to onClick (Avoids eval() Security Issue)
    window.onload = function () {
        document.querySelectorAll('[whenClicked]').forEach(anchor => {
            anchor.onclick = function () {
                const code = this.getAttribute('whenClicked');
                if (code) {
                    try {
                        new Function(code)(); // Replaces eval()
                    } catch (error) {
                        console.error('Error executing whenClicked attribute:', error);
                    }
                }
            }
        });
    };

    // Optimised Book a Call Button Positioning (Uses IntersectionObserver)
    function updateFixedElementPosition() {
        var fixedElement = document.querySelector('.fixed-call-btn');
        var footer = document.querySelector('.s_footer');

        if (fixedElement && footer) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        fixedElement.style.bottom = (entry.boundingClientRect.height + 10) + 'px';
                    } else {
                        fixedElement.style.bottom = '10px';
                    }
                });
            });

            observer.observe(footer);
        }
    }
    updateFixedElementPosition();

    // Book a Call Mobile Movement
    const callBtn = document.querySelector('.fixed-call-btn');
    if (callBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 0) {
                callBtn.classList.add('show');
            }
        }, { once: true });
    }

    // Menu Bar Adjustments
    const megaUnderResources = document.getElementById("mega-under-resources");
    const megaResources = document.getElementById("mega-resources");
    if (megaUnderResources && megaResources) {
        megaResources.appendChild(megaUnderResources);
    }

    // Prevent Dropdown Window Closing on Tab Selection
    document.querySelectorAll('.primary-dropdown-category').forEach(tab => {
        tab.addEventListener('click', event => event.stopPropagation());
    });

    // Announcement Bar Logic (Optimised to Prevent Excess Cloning)
    const wrapper = document.querySelector('.announcement-bar-text-wrapper');
    const textElement = document.querySelector('.announcement-bar-text');

    function duplicateTextElements() {
        if (window.innerWidth <= 767 && wrapper && textElement) {
            wrapper.innerHTML = ""; // Clears previous duplicates
            for (let i = 0; i < 3; i++) {
                wrapper.appendChild(textElement.cloneNode(true));
            }
        }
    }
    duplicateTextElements();

    window.addEventListener('resize', debounce(duplicateTextElements, 200));

    // Popup Logic
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
            localStorage.setItem('videoPageVisitCount', (++videoPageVisitCount).toString());
        }

        let popupDismissedTime = parseInt(localStorage.getItem('popupDismissedTime') || '0', 10);
        const now = Date.now();
        const minDismissalTime = 120 * 60 * 1000; // 120 minutes

        if (popupDismissedTime && (now - popupDismissedTime >= minDismissalTime)) {
            localStorage.removeItem('popupDismissedTime');
            popupDismissedTime = 0;
        }

        if (isVideoPage) {
            if (videoPageVisitCount === 2 && popupDismissedTime === 0) {
                showPopup();
            }
        } else if (visitCount % 2 === 0 && popupDismissedTime === 0) {
            setTimeout(showPopup, 45000);
        }

        document.getElementById('popup-close')?.addEventListener('click', dismissPopup);
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

    document.getElementById('trigger-popup-button')?.addEventListener('click', showPopup);
});

// Utility: Debounce Function
function debounce(func, delay) {
    let debounceTimer;
    return function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
    };
}
