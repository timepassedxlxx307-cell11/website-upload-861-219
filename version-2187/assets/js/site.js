(function () {
    var body = document.body;
    var menuButton = document.querySelector('[data-menu-toggle]');
    if (menuButton) {
        menuButton.addEventListener('click', function () {
            body.classList.toggle('menu-open');
        });
    }

    document.querySelectorAll('[data-global-search]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = form.querySelector('input[name="q"]');
            var target = form.getAttribute('data-target') || 'search.html';
            var query = input ? input.value.trim() : '';
            if (query) {
                window.location.href = target + '?q=' + encodeURIComponent(query);
            } else {
                window.location.href = target;
            }
        });
    });

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        function start() {
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function restart() {
            window.clearInterval(timer);
            start();
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                restart();
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                show(dotIndex);
                restart();
            });
        });

        show(0);
        start();
    });

    document.querySelectorAll('[data-filter-box]').forEach(function (input) {
        var list = document.querySelector('[data-filter-list]');
        var empty = document.querySelector('[data-filter-empty]');
        if (!list) {
            return;
        }
        var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card, .rank-item'));

        function filter() {
            var value = input.value.trim().toLowerCase();
            var visible = 0;
            cards.forEach(function (card) {
                var text = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
                var matched = !value || text.indexOf(value) !== -1;
                card.classList.toggle('hidden', !matched);
                if (matched) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle('show', visible === 0);
            }
        }

        if (input.hasAttribute('data-url-query')) {
            var params = new URLSearchParams(window.location.search);
            var query = params.get('q');
            if (query) {
                input.value = query;
            }
        }

        input.addEventListener('input', filter);
        filter();
    });
})();
