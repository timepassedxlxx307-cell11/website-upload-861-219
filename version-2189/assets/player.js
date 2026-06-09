(function () {
  var video = document.querySelector('[data-video-url]');
  var button = document.querySelector('[data-play-button]');
  var shell = document.querySelector('.player-shell');

  if (!video || !button) {
    return;
  }

  var source = video.getAttribute('data-video-url');
  var started = false;
  var hlsInstance = null;

  function prepareVideo() {
    if (started || !source) {
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else {
      video.src = source;
    }

    started = true;
  }

  function playVideo() {
    prepareVideo();
    button.classList.add('is-hidden');
    video.controls = true;
    var playback = video.play();
    if (playback && typeof playback.catch === 'function') {
      playback.catch(function () {});
    }
  }

  button.addEventListener('click', playVideo);
  if (shell) {
    shell.addEventListener('click', function (event) {
      if (event.target === video) {
        return;
      }
      playVideo();
    });
  }

  video.addEventListener('play', function () {
    button.classList.add('is-hidden');
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance && typeof hlsInstance.destroy === 'function') {
      hlsInstance.destroy();
    }
  });
})();
