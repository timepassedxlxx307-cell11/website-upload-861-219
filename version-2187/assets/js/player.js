(function () {
    function activatePlayer(shell) {
        var video = shell.querySelector('video');
        var button = shell.querySelector('[data-play-button]');
        if (!video || !button) {
            return;
        }
        var stream = video.getAttribute('data-stream');
        var attached = false;
        var hlsInstance = null;

        function attach() {
            if (attached || !stream) {
                return;
            }
            attached = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
            } else {
                video.src = stream;
            }
        }

        function play() {
            attach();
            shell.classList.add('is-playing');
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }

        button.addEventListener('click', play);
        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener('ended', function () {
            if (hlsInstance && typeof hlsInstance.stopLoad === 'function') {
                hlsInstance.stopLoad();
            }
        });
    }

    document.querySelectorAll('[data-player]').forEach(activatePlayer);
})();
