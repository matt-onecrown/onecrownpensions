document.addEventListener("DOMContentLoaded", function () {
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
        setTimeout(() => {
            const trigger = document.getElementById(triggerId);
            if (trigger) {
                console.log(`Trigger found: ${triggerId}`);
                trigger.addEventListener('click', function () {
                    console.log(`Trigger clicked: ${triggerId}`);

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
                console.warn(`Trigger ${triggerId} not found! Retrying...`);
                setTimeout(() => setupTrigger(triggerId, playerId), 500);
            }
        }, 500);
    }

    function initialisePlayer(playerId) {
        if (!isYouTubeAPILoaded) return;

        const videoData = window.dynamicVideoData?.find(data => data.playerId === playerId);
        if (!videoData) {
            console.error(`No video data found for ${playerId}`);
            return;
        }

        const startTime = parseInt(videoData.startTime, 10) || 0;

        console.log(`Initialising YouTube player for ${playerId}, Start Time: ${startTime}, Video ID: ${videoData.videoId}`);

        players[playerId] = new YT.Player(playerId, {
            height: '100%',
            width: '100%',
            videoId: videoData.videoId,
            playerVars: { 'rel': 0, 'autoplay': 1, 'controls': 1, 'start': startTime },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    window.onYouTubeIframeAPIReady = function () {
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
                if (trigger) trigger.style.display = 'flex';
            });
        }
    }

    function waitForDynamicData(callback, retries = 10) {
        if (window.dynamicVideoData && Array.isArray(window.dynamicVideoData)) {
            callback();
        } else if (retries > 0) {
            console.warn('Dynamic video data not available yet, retrying...');
            setTimeout(() => waitForDynamicData(callback, retries - 1), 200);
        } else {
            console.error('Dynamic video data could not be loaded.');
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
