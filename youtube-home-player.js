document.addEventListener('DOMContentLoaded', function () {
    let player;
    let isScriptLoaded = false;
    let playOnLoad = false;

    function loadYouTubeScript() {
        if (!isScriptLoaded) {
            isScriptLoaded = true;
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
        }
    }

    // Define player setup after API loads.
    window.onYouTubeIframeAPIReady = function () {
        player = new YT.Player("player", {
            height: "100%",
            width: "100%",
            videoId: "1_PFWWny_5k",
            playerVars: { rel: 0, autoplay: 0, controls: 1, start: 0 },
            events: {
                onReady: function () {
                    if (playOnLoad) {
                        player.playVideo();
                    }
                },
                onStateChange: onPlayerStateChange
            }
        });
    };

    // Handle showing and playing video on first click.
    document.getElementById("video-trigger").addEventListener("click", function () {
        loadYouTubeScript();  // Load YouTube script only once.
        playOnLoad = true;  // Set flag to auto-play after loading.

        // Replace the placeholder with the YouTube player
        document.getElementById("video-trigger").style.display = "none";
        document.getElementById("player").style.display = "block";

        if (player && typeof player.playVideo === "function") {
            player.playVideo();
        }
    });
});

function onPlayerStateChange(event) {
    const playerElement = document.getElementById("player");

    if (event.data === YT.PlayerState.ENDED) {
        playerElement.style.display = "none";
        document.getElementById("video-trigger").style.display = "flex";
    }
}
