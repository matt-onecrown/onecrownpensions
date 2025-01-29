document.addEventListener("DOMContentLoaded", function() {
    let players = {};
    let isVideoTriggered = false;
    let isYouTubeAPILoaded = false;
    const pendingInitialisations = [];

    function loadYouTubeAPI() {
        if (!document.getElementById('youtube-api-script')) {
            const tag = document.createElement('script');
            tag.id = 'youtube-api-script';
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
        }
    }

    function setupTrigger(triggerId, playerId) {
        const trigger = document.getElementById(triggerId);

        if (trigger && trigger.offsetParent !== null) { // Check if trigger is visible
            trigger.addEventListener('click', function() {
                trigger.style.display = 'none';
                isVideoTriggered = true;

                if (!isYouTubeAPILoaded) {
                    // Add playerId to pending initialisations
                    pendingInitialisations.push(playerId);
                    loadYouTubeAPI();
                } else if (!players[playerId]) {
                    // Initialise player if API is loaded
                    initialisePlayer(playerId);
                } else {
                    // Play video if player is already initialised
                    players[playerId].playVideo();
                }
            });
        }
    }

    function initialisePlayer(playerId) {
        if (!isYouTubeAPILoaded) return; // Safety check to ensure API is loaded

        const startTime = parseInt('{{wf {&quot;path&quot;:&quot;start-time&quot;,&quot;type&quot;:&quot;Number&quot;\} }}', 10) || 0;

        players[playerId] = new YT.Player(playerId, {
            height: '100%',
            width: '100%',
            videoId: '{{wf {&quot;path&quot;:&quot;youtube-video-id&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}',
            playerVars: { 'rel': 0, 'autoplay': 0, 'controls': 1, 'start': startTime },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    window.onYouTubeIframeAPIReady = function() {
        isYouTubeAPILoaded = true;

        // Initialise any pending players
        while (pendingInitialisations.length > 0) {
            const playerId = pendingInitialisations.shift();
            initialisePlayer(playerId);
        }
    };

    function onPlayerReady(event) {
        if (isVideoTriggered) event.target.playVideo();
    }

    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.ENDED) {
            isVideoTriggered = false;

            // Show all triggers again
            ['video-trigger-1', 'video-trigger-2'].forEach(triggerId => {
                const trigger = document.getElementById(triggerId);
                if (trigger && trigger.offsetParent !== null) trigger.style.display = 'flex';
            });
        }
    }

    // Set up triggers for both instances
    setupTrigger("video-trigger-1", "player-1");
    setupTrigger("video-trigger-2", "player-2");
});
