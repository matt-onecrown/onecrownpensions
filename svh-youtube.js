document.addEventListener("DOMContentLoaded", function() {
    let players = {};
    let isVideoTriggered = false;
    let isYouTubeAPILoaded = false;
    const pendingInitialisations = [];

    function loadYouTubeAPI() {
        if (!document.getElementById('youtube-api-script')) {
            console.log('Loading YouTube API...');
            const tag = document.createElement('script');
            tag.id = 'youtube-api-script';
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
        }
    }

    function setupTrigger(triggerId, playerId) {
        const trigger = document.getElementById(triggerId);

        if (trigger && trigger.offsetParent !== null) { // Ensure trigger is visible
            console.log(`Setting up trigger for ${playerId}`);
            trigger.addEventListener('click', function() {
                trigger.style.display = 'none';
                isVideoTriggered = true;

                if (!isYouTubeAPILoaded) {
                    console.log('YouTube API not loaded yet, queuing player initialisation:', playerId);
                    pendingInitialisations.push(playerId);
                    loadYouTubeAPI();
                } else if (!players[playerId]) {
                    console.log('API Loaded: Initialising Player:', playerId);
                    initialisePlayer(playerId);
                } else {
                    console.log('Player already initialised, playing video:', playerId);
                    players[playerId].playVideo();
                }
            });
        } else {
            console.warn(`Trigger ${triggerId} not found or not visible.`);
        }
    }

    function initialisePlayer(playerId) {
        if (!isYouTubeAPILoaded) return; // Ensure API is fully loaded

        const videoData = window.dynamicVideoData.find(data => data.playerId === playerId);
        if (!videoData) {
            console.error(`No video data found for ${playerId}`);
            return;
        }

        const startTime = parseInt(videoData.startTime, 10) || 0; // Convert to integer

        console.log(`Initialising YouTube player for ${playerId}, Start Time: ${startTime}, Video ID: ${videoData.videoId}`);

        players[playerId] = new YT.Player(playerId, {
            height: '100%',
            width: '100%',
            videoId: videoData.videoId,
            playerVars: { 'rel': 0, 'autoplay': 0, 'controls': 1, 'start': startTime },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    window.onYouTubeIframeAPIReady = function() {
        console.log('YouTube API is ready.');
        isYouTubeAPILoaded = true;

        while (pendingInitialisations.length > 0) {
            const playerId = pendingInitialisations.shift();
            console.log(`Initialising queued player: ${playerId}`);
            initialisePlayer(playerId);
        }
    };

    function onPlayerReady(event) {
        console.log(`Player ready: ${event.target.getIframe().id}`);
        if (isVideoTriggered) event.target.playVideo();
    }

    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.ENDED) {
            isVideoTriggered = false;
            console.log('Video ended, showing triggers again.');

            ['video-trigger-1', 'video-trigger-2'].forEach(triggerId => {
                const trigger = document.getElementById(triggerId);
                if (trigger && trigger.offsetParent !== null) trigger.style.display = 'flex';
            });
        }
    }

    // Ensure dynamic data is available before proceeding
    function waitForDynamicData(callback, timeout = 100) {
        if (window.dynamicVideoData && Array.isArray(window.dynamicVideoData)) {
            callback();
        } else {
            console.warn('Dynamic video data not available yet, retrying...');
            setTimeout(() => waitForDynamicData(callback, timeout), timeout);
        }
    }

    waitForDynamicData(() => {
        console.log('Dynamic video data detected:', window.dynamicVideoData);

        window.dynamicVideoData.forEach(data => {
            setupTrigger(`video-trigger-${data.playerId.split('-')[1]}`, data.playerId);
        });

        if (isYouTubeAPILoaded) {
            console.log('YouTube API already loaded, initialising players now...');
            window.dynamicVideoData.forEach(data => initialisePlayer(data.playerId));
        } else {
            console.log('YouTube API not yet loaded, waiting...');
        }
    });
});
