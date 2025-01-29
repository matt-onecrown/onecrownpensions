    // Define URLs to exclude
    const excludedUrls = [
        'https://www.onecrownpensions.com/contact-us',
        'https://www.onecrownpensions.com/book-a-call'
    ];

    // Check if current page is excluded
    const isExcludedPage = excludedUrls.includes(window.location.href);

    // Check if current page is a video page (URL starts with /ssas-video-hub/)
    const isVideoPage = window.location.href.startsWith('https://www.onecrownpensions.com/ssas-video-hub/');

    if (!isExcludedPage) {
        // Track general page visit count
        let visitCount = parseInt(localStorage.getItem('pageVisitCount') || '0', 10);
        visitCount += 1;
        localStorage.setItem('pageVisitCount', visitCount.toString());

        // Track video page visits separately
        let videoPageVisitCount = parseInt(localStorage.getItem('videoPageVisitCount') || '0', 10);
        if (isVideoPage) {
            videoPageVisitCount += 1;
            localStorage.setItem('videoPageVisitCount', videoPageVisitCount.toString());
        }

        // Get the last time the popup was dismissed, if any
        let popupDismissedTime = parseInt(localStorage.getItem('popupDismissedTime') || '0', 10);
        const now = Date.now();
        const minDismissalTime = 120 * 60 * 1000; // 120 minutes in milliseconds

        // Reset dismissal time if 120 minutes have passed since last dismissal
        if (popupDismissedTime && (now - popupDismissedTime >= minDismissalTime)) {
            console.log("120 minutes have passed since last dismissal. Resetting dismissal time.");
            localStorage.removeItem('popupDismissedTime');
            popupDismissedTime = 0; // Reset to allow popup display
        }

        // Logic for video pages:
        // - Never show on first video page visited.
        // - Show immediately on the second video page visited (no delay), if popupDismissedTime == 0.
        if (isVideoPage) {
            if (videoPageVisitCount === 2 && popupDismissedTime === 0) {
                console.log("Second video page visit. Showing popup immediately.");
                // Show popup as soon as the page is loaded
                document.addEventListener('DOMContentLoaded', () => {
                    showPopup();
                });
            } else {
                console.log("Video page logic: Conditions not met for showing popup.");
            }
        } else {
            // Logic for non-video pages (excluding pages listed in excludedUrls):
            // Following the original logic but with a 45-second delay instead of 25 seconds.
            // If previously you required the popup only on even visits, keep that:
            if (visitCount % 2 === 0 && popupDismissedTime === 0) {
                console.log("Non-video page. Conditions met. Popup will show after 45 seconds.");
                setTimeout(() => {
                    showPopup();
                }, 45000); // Show popup after 45 seconds
            } else {
                console.log("Non-video page logic: Conditions not met for showing popup.");
            }
        }

        // Handle popup dismissal
        document.addEventListener('DOMContentLoaded', () => {
            const popupClose = document.getElementById('popup-close');
            if (popupClose) {
                popupClose.addEventListener('click', () => {
                    dismissPopup();
                });
            } else {
                console.error("Popup close element with id 'popup-close' not found.");
            }
        });
    } else {
        console.log("Popup will not show on this excluded page.");
    }

    // Function to load and embed the HubSpot form
    function loadHubSpotForm() {
        const formContainer = document.getElementById('form-container'); // Ensure the form container exists in your popup HTML
        if (formContainer && !formContainer.hasChildNodes()) { // Check if form is already loaded
            const script = document.createElement('script');
            script.src = "//js.hsforms.net/forms/embed/v2.js";
            script.onload = function () {
                hbspt.forms.create({
                    portalId: "5380630",
                    formId: "123749c9-2e68-411b-a5f0-cb9212c7ca4f",
                    target: "#form-container" // ID of the container in your popup
                });
            };
            document.body.appendChild(script);
        }
    }

    // Function to display the popup and load the form
    function showPopup() {
        const popup = document.getElementById('popup');
        if (popup) {
            popup.style.display = 'block';
            console.log("Popup displayed.");
            loadHubSpotForm(); // Load the HubSpot form when the popup appears
        } else {
            console.error("Popup element with id 'popup' not found.");
        }
    }

    // Function to dismiss the popup and record the dismissal time
    function dismissPopup() {
        const popup = document.getElementById('popup');
        if (popup) {
            popup.style.display = 'none';
            console.log("Popup dismissed.");
            localStorage.setItem('popupDismissedTime', Date.now().toString());
        }
    }

    // Immediate popup trigger on button click (check if the button exists)
    document.addEventListener('DOMContentLoaded', () => {
        const triggerPopupButton = document.getElementById('trigger-popup-button');
        if (triggerPopupButton) {
            triggerPopupButton.addEventListener('click', () => {
                showPopup(); // Show popup immediately on button click
            });
        } else {
            console.log("Popup trigger button with id 'trigger-popup-button' not found on this page.");
        }
    });
