(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function startTimer() {
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                window.clearInterval(timer);
                showSlide(dotIndex);
                startTimer();
            });
        });

        startTimer();
    }

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll('.movie-search'));

    searchInputs.forEach(function (input) {
        var scope = input.closest('main') || document;
        var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));

        input.addEventListener('input', function () {
            var value = input.value.trim().toLowerCase();

            cards.forEach(function (card) {
                var text = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
                card.classList.toggle('is-hidden-by-search', value && text.indexOf(value) === -1);
            });
        });
    });
})();
