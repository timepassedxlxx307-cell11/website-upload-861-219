import { H as Hls } from './hls-module.js';

const players = Array.from(document.querySelectorAll('[data-player]'));

players.forEach((player) => {
  const video = player.querySelector('video');
  const button = player.querySelector('[data-play]');
  let controller = null;
  let started = false;

  const start = async () => {
    if (!video) {
      return;
    }

    const stream = video.dataset.stream;

    if (!stream) {
      return;
    }

    if (!started) {
      started = true;

      if (Hls.isSupported()) {
        controller = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        controller.loadSource(stream);
        controller.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      }
    }

    if (button) {
      button.classList.add('hidden');
    }

    try {
      await video.play();
    } catch (error) {
      if (button) {
        button.classList.remove('hidden');
      }
    }
  };

  if (button) {
    button.addEventListener('click', start);
  }

  if (video) {
    video.addEventListener('click', start);
    video.addEventListener('pause', () => {
      if (button && video.currentTime === 0) {
        button.classList.remove('hidden');
      }
    });
  }

  window.addEventListener('pagehide', () => {
    if (controller) {
      controller.destroy();
      controller = null;
    }
  });
});
