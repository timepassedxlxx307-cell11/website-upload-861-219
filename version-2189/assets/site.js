(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
      menuButton.textContent = mobileMenu.classList.contains('is-open') ? '×' : '☰';
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5600);
    }
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var filterYear = document.querySelector('[data-filter-year]');
  var filterList = document.querySelector('[data-filter-list]');

  if (filterList && (filterInput || filterYear)) {
    var cards = Array.prototype.slice.call(filterList.querySelectorAll('.movie-card'));

    function normalize(text) {
      return String(text || '').toLowerCase().trim();
    }

    function applyFilter() {
      var query = normalize(filterInput ? filterInput.value : '');
      var year = filterYear ? filterYear.value : '';

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre')
        ].join(' '));
        var cardYear = card.getAttribute('data-year') || '';
        var matchesQuery = !query || haystack.indexOf(query) !== -1;
        var matchesYear = !year || (year === '1990' ? /^199/.test(cardYear) : cardYear === year);
        card.style.display = matchesQuery && matchesYear ? '' : 'none';
      });
    }

    if (filterInput) {
      filterInput.addEventListener('input', applyFilter);
    }
    if (filterYear) {
      filterYear.addEventListener('change', applyFilter);
    }
  }
})();
