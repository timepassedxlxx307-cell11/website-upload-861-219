(function () {
    function loadVideo(video, source) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });

            hls.loadSource(source);
            hls.attachMedia(video);
            return;
        }

        video.src = source;
    }

    window.initializeMoviePlayer = function (source, videoId, overlayId) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);
        var loaded = false;

        if (!video || !overlay || !source) {
            return;
        }

        function play() {
            if (!loaded) {
                loadVideo(video, source);
                loaded = true;
            }

            overlay.classList.add('is-hidden');

            var result = video.play();

            if (result && typeof result.catch === 'function') {
                result.catch(function () {
                    overlay.classList.remove('is-hidden');
                });
            }
        }

        overlay.addEventListener('click', play);

        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            }
        });
    };
})();
