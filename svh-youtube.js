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
                    pendingInitialisations.push(playerId);
                    loadYouTubeAPI();
                } else if (!players[playerId]) {
                    initialisePlayer(playerId);
                } else {
                    players[playerId].playVideo();
                }
            });
        }
    }

    function initialisePlayer(playerId) {
        if (!isYouTubeAPILoaded) return;

        const videoData = window.dynamicVideoData.find(video => video.playerId === playerId);
        if (!videoData) return;

        const { startTime, videoId } = videoData;
        const parsedStartTime = parseInt(startTime, 10) || 0;

        players[playerId] = new YT.Player(playerId, {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: { 'rel': 0, 'autoplay': 0, 'controls': 1, 'start': parsedStartTime },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    window.onYouTubeIframeAPIReady = function() {
        isYouTubeAPILoaded = true;
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
            window.dynamicVideoData.forEach(video => {
                const trigger = document.getElementById(`video-trigger-${video.playerId.split('-')[1]}`);
                if (trigger && trigger.offsetParent !== null) trigger.style.display = 'flex';
            });
        }
    }

    window.dynamicVideoData.forEach(video => {
        setupTrigger(`video-trigger-${video.playerId.split('-')[1]}`, video.playerId);
    });
});
