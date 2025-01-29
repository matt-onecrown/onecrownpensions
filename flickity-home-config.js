Webflow.push(function () {
    // Function to initialise Flickity carousel
    function moveByFour(flickityInstance, direction) {
        const nextIndex = flickityInstance.selectedIndex + 4 * direction;
        flickityInstance.select(nextIndex);
    }

    function initFlickityCarousel(element, options = {}) {
        if (!element) return; // Exit if the element doesn't exist

        const carousel = new Flickity(element, {
            cellAlign: "left",
            contain: true,
            lazyLoad: 5,
            wrapAround: true,
            prevNextButtons: true,
            pageDots: false,
            ...options
        });

        if (options.moveByFour) {
            const prevButton = element.querySelector(".flickity-prev-next-button.previous");
            const nextButton = element.querySelector(".flickity-prev-next-button.next");
            prevButton?.addEventListener("click", () => moveByFour(carousel, -1));
            nextButton?.addEventListener("click", () => moveByFour(carousel, 1));
        }

        return carousel;
    }

    // 1. Initialise homeCarousel immediately if it exists
    const homeCarousel = document.querySelector("#homeCarousel");
    if (homeCarousel) {
        initFlickityCarousel(homeCarousel, {
            autoPlay: 3000,
            moveByFour: true
        });
    }

    // 2. Lazy-load featureCarousel when it comes into view
    const featureCarousel = document.querySelector(".feature-carousel");
    if (featureCarousel) {
        const featureCarouselObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initFlickityCarousel(entry.target, { autoPlay: 3000, moveByFour: true });
                    featureCarouselObserver.unobserve(entry.target); // Only initialise once
                }
            });
        }, { root: null, threshold: 0.1 });
        featureCarouselObserver.observe(featureCarousel);
    }

    // 3. Initialise prevCarousels on #showMoreButton click
    const showMoreButton = document.querySelector("#showMoreButton");
    if (showMoreButton) {
        showMoreButton.addEventListener("click", function () {
            setTimeout(() => {
                const carouselsToInit = ["#prevCarousel1", "#prevCarousel2", "#prevCarousel3"];
                carouselsToInit.forEach(selector => {
                    const element = document.querySelector(selector);
                    if (element && !element.classList.contains("flickity-enabled")) {
                        initFlickityCarousel(element, { moveByFour: selector === "#prevCarousel1" });
                    }
                });

                // Media query-specific logic for prevCarousel3
                const mediaQuery = window.matchMedia("(max-width: 1130px)");
                function handleMediaQueryChange(e) {
                    if (e.matches) {
                        const prevCarousel3 = document.querySelector("#prevCarousel3");
                        if (prevCarousel3 && !prevCarousel3.classList.contains("flickity-enabled")) {
                            initFlickityCarousel(prevCarousel3);
                        }
                    }
                }
                mediaQuery.addEventListener("change", handleMediaQueryChange);
                if (mediaQuery.matches) {
                    handleMediaQueryChange(mediaQuery);
                }
            }, 100); // Adjust delay if necessary
        });
    }
});
