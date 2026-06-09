(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function setupMenu() {
        var button = document.querySelector("[data-menu-button]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            var opened = nav.classList.toggle("is-open");
            button.setAttribute("aria-expanded", opened ? "true" : "false");
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        var prev = document.querySelector("[data-hero-prev]");
        var next = document.querySelector("[data-hero-next]");
        if (!slides.length) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, idx) {
                slide.classList.toggle("is-active", idx === current);
            });
            dots.forEach(function (dot, idx) {
                dot.classList.toggle("is-active", idx === current);
            });
        }

        function play() {
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5000);
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            play();
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                restart();
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                restart();
            });
        });
        show(0);
        play();
    }

    function setupFilters() {
        var panel = document.querySelector("[data-filter-panel]");
        if (!panel) {
            return;
        }
        var input = panel.querySelector("[data-search-input]");
        var typeFilter = panel.querySelector("[data-type-filter]");
        var regionFilter = panel.querySelector("[data-region-filter]");
        var yearFilter = panel.querySelector("[data-year-filter]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
        var empty = document.querySelector("[data-empty-state]");

        function valueOf(control) {
            return control ? control.value.trim().toLowerCase() : "";
        }

        function apply() {
            var query = valueOf(input);
            var type = valueOf(typeFilter);
            var region = valueOf(regionFilter);
            var year = valueOf(yearFilter);
            var visible = 0;
            cards.forEach(function (card) {
                var text = (card.getAttribute("data-meta") || "").toLowerCase();
                var cardType = (card.getAttribute("data-type") || "").toLowerCase();
                var cardRegion = (card.getAttribute("data-region") || "").toLowerCase();
                var cardYear = (card.getAttribute("data-year") || "").toLowerCase();
                var match = true;
                if (query && text.indexOf(query) === -1) {
                    match = false;
                }
                if (type && cardType !== type) {
                    match = false;
                }
                if (region && cardRegion !== region) {
                    match = false;
                }
                if (year && cardYear !== year) {
                    match = false;
                }
                card.hidden = !match;
                if (match) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }

        [input, typeFilter, regionFilter, yearFilter].forEach(function (control) {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });
    }

    window.initMoviePlayer = function (source) {
        var player = document.querySelector("[data-player]");
        if (!player) {
            return;
        }
        var video = player.querySelector("video");
        var button = player.querySelector(".player-start");
        var attached = false;
        var hlsInstance = null;

        function attach() {
            if (attached || !video) {
                return;
            }
            attached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    maxBufferLength: 30,
                    backBufferLength: 30
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function begin() {
            attach();
            if (button) {
                button.classList.add("is-hidden");
            }
            var result = video.play();
            if (result && typeof result.catch === "function") {
                result.catch(function () {});
            }
        }

        if (button) {
            button.addEventListener("click", begin);
        }
        if (video) {
            video.addEventListener("click", function () {
                if (video.paused) {
                    begin();
                }
            });
            video.addEventListener("play", function () {
                if (button) {
                    button.classList.add("is-hidden");
                }
            });
            video.addEventListener("emptied", function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                    hlsInstance = null;
                    attached = false;
                }
            });
        }
    };

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
    });
})();
