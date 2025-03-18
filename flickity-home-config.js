Webflow.push(function () {
    // Function to initialise Flickity carousel
    function moveByThree(flickityInstance, direction) {
        const nextIndex = flickityInstance.selectedIndex + 3 * direction;
        flickityInstance.select(nextIndex, false, true);
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

        if (options.moveByThree) {
            const prevButton = element.querySelector(".flickity-prev-next-button.previous");
            const nextButton = element.querySelector(".flickity-prev-next-button.next");
            prevButton?.addEventListener("click", (event) => {
                event.preventDefault();
                moveByThree(carousel, -1);
            });
            nextButton?.addEventListener("click", (event) => {
                event.preventDefault();
                moveByThree(carousel, 1);
            });
        }

        return carousel;
    }

    // 1. Initialise homeCarousel immediately if it exists
    const homeCarousel = document.querySelector("#homeCarousel");
    if (homeCarousel) {
        initFlickityCarousel(homeCarousel, {
            autoPlay: 3000,
            moveByThree: true
        });
    }

    // 2. Initialise homeCarousel2 without autoplay
    const homeCarousel2 = document.querySelector("#homeCarousel2");
    if (homeCarousel2) {
        initFlickityCarousel(homeCarousel2, {
            moveByThree: true
        });
    }

    // 3. Lazy-load featureCarousel when it comes into view
    const featureCarousel = document.querySelector(".feature-carousel");
    if (featureCarousel) {
        const featureCarouselObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initFlickityCarousel(entry.target, { autoPlay: 3000, moveByThree: true });
                    featureCarouselObserver.unobserve(entry.target); // Only initialise once
                }
            });
        }, { root: null, threshold: 0.1 });
        featureCarouselObserver.observe(featureCarousel);
    }
});
