(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function setupNavigation() {
        var button = document.querySelector("[data-nav-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
        if (slides.length <= 1) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }
        function start() {
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5600);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                stop();
                show(dotIndex);
                start();
            });
        });
        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        start();
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function filterCards(input) {
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
        var empty = document.querySelector("[data-empty-result]");
        var keyword = normalize(input.value);
        var visible = 0;
        cards.forEach(function (card) {
            var haystack = normalize(card.getAttribute("data-search") || card.textContent);
            var matched = !keyword || haystack.indexOf(keyword) !== -1;
            card.style.display = matched ? "" : "none";
            if (matched) {
                visible += 1;
            }
        });
        if (empty) {
            empty.classList.toggle("is-visible", visible === 0);
        }
    }

    function setupFilters() {
        var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-filter-input]"));
        if (!inputs.length) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var q = params.get("q");
        inputs.forEach(function (input) {
            if (q && !input.value) {
                input.value = q;
            }
            filterCards(input);
            input.addEventListener("input", function () {
                filterCards(input);
            });
        });
    }

    function setupPlayer(options) {
        var video = document.getElementById(options.videoId);
        var button = document.getElementById(options.buttonId);
        var streamUrl = options.url;
        var hlsInstance = null;
        var prepared = false;
        if (!video || !button || !streamUrl) {
            return;
        }
        function prepare() {
            if (prepared) {
                return;
            }
            prepared = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }
        function startPlayback() {
            prepare();
            button.classList.add("is-hidden");
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {
                    button.classList.remove("is-hidden");
                });
            }
        }
        button.addEventListener("click", startPlayback);
        video.addEventListener("click", function () {
            if (video.paused) {
                startPlayback();
            }
        });
        video.addEventListener("play", function () {
            button.classList.add("is-hidden");
        });
        video.addEventListener("pause", function () {
            if (!video.ended) {
                button.classList.remove("is-hidden");
            }
        });
        video.addEventListener("ended", function () {
            button.classList.remove("is-hidden");
        });
        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    window.MovieApp = {
        initPlayer: setupPlayer
    };

    ready(function () {
        setupNavigation();
        setupHero();
        setupFilters();
    });
})();
