function initMoviePlayer(source) {
  var video = document.getElementById('movie-player');
  var button = document.querySelector('[data-play-button]');
  var hlsInstance = null;
  var ready = false;

  if (!video || !source) {
    return;
  }

  function attach() {
    if (ready) {
      return;
    }
    ready = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
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
      return;
    }

    video.src = source;
  }

  function play() {
    attach();
    if (button) {
      button.classList.add('is-hidden');
    }
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  if (button) {
    button.addEventListener('click', play);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });

  video.addEventListener('play', function () {
    if (button) {
      button.classList.add('is-hidden');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
