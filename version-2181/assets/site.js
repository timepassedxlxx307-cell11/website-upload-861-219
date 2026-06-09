(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-main-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var root = document.querySelector("[data-hero-carousel]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var thumbs = Array.prototype.slice.call(root.querySelectorAll("[data-hero-thumb]"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, current) {
        slide.classList.toggle("is-active", current === index);
      });
      thumbs.forEach(function (thumb, current) {
        thumb.classList.toggle("is-active", current === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    thumbs.forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        var target = parseInt(thumb.getAttribute("data-hero-thumb"), 10);
        show(target);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function initFilters() {
    var input = document.querySelector(".js-search-input");
    var scope = document.querySelector(".js-filter-scope");
    var buttons = Array.prototype.slice.call(document.querySelectorAll(".js-filter"));
    if (!scope) {
      return;
    }
    var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card, .compact-card, .ranking-row"));

    function apply(value) {
      var keyword = String(value || "").trim().toLowerCase();
      cards.forEach(function (card) {
        var haystack = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
        card.classList.toggle("is-filter-hidden", keyword !== "" && haystack.indexOf(keyword) === -1);
      });
    }

    if (input) {
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q") || "";
      if (query) {
        input.value = query;
      }
      apply(input.value);
      input.addEventListener("input", function () {
        apply(input.value);
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var value = button.getAttribute("data-filter") || "";
        if (input) {
          input.value = value;
        }
        apply(value);
      });
    });
  }

  window.initMoviePlayer = function (source) {
    var video = document.querySelector(".js-video");
    var cover = document.querySelector(".player-cover");
    var attached = false;
    var hls = null;

    if (!video || !source) {
      return;
    }

    function attach() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function start() {
      attach();
      if (cover) {
        cover.classList.add("is-hidden");
      }
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener("click", start);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });

    video.addEventListener("play", function () {
      if (cover) {
        cover.classList.add("is-hidden");
      }
    });

    window.addEventListener("beforeunload", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  };

  ready(function () {
    initMenu();
    initHero();
    initFilters();
  });
})();
