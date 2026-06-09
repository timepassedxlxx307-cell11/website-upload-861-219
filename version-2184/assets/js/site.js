const menuButton = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
}

document.querySelectorAll('img').forEach((image) => {
  image.addEventListener('error', () => {
    image.style.opacity = '0';
  }, { once: true });
});

const hero = document.querySelector('[data-hero]');

if (hero) {
  const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
  let activeIndex = 0;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === activeIndex);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === activeIndex);
    });
  };

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      showSlide(Number(dot.dataset.heroDot || '0'));
    });
  });

  if (slides.length > 1) {
    setInterval(() => {
      showSlide(activeIndex + 1);
    }, 6500);
  }
}

const filterInput = document.querySelector('[data-card-filter]');

if (filterInput) {
  const cards = Array.from(document.querySelectorAll('[data-card]'));

  filterInput.addEventListener('input', () => {
    const value = filterInput.value.trim().toLowerCase();

    cards.forEach((card) => {
      const text = [
        card.dataset.title,
        card.dataset.genre,
        card.dataset.region,
        card.dataset.year,
        card.textContent
      ].join(' ').toLowerCase();

      card.classList.toggle('is-hidden', value && !text.includes(value));
    });
  });
}

const resultsRoot = document.querySelector('[data-search-results]');

if (resultsRoot && typeof siteMovies !== 'undefined') {
  const params = new URLSearchParams(window.location.search);
  const queryInput = document.querySelector('[data-site-search-input]');
  const initialQuery = params.get('q') || '';

  if (queryInput) {
    queryInput.value = initialQuery;
  }

  const renderResults = (query) => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const list = words.length
      ? siteMovies.filter((movie) => words.every((word) => movie.searchText.includes(word)))
      : siteMovies.slice(0, 48);

    if (!list.length) {
      resultsRoot.innerHTML = '<p class="empty-state">没有找到匹配内容，可尝试输入影片名、年份、地区或题材关键词。</p>';
      return;
    }

    resultsRoot.innerHTML = list.slice(0, 120).map((movie) => `
      <article class="rank-card" data-card>
        <a class="rank-cover" href="${movie.href}">
          <img src="${movie.cover}" alt="${movie.title}" loading="lazy">
        </a>
        <div class="rank-info">
          <a href="${movie.href}" class="rank-title">${movie.title}</a>
          <p>${movie.year} · ${movie.genre}</p>
          <strong>★ ${movie.rating}</strong>
        </div>
      </article>
    `).join('');
  };

  renderResults(initialQuery);

  if (queryInput) {
    queryInput.addEventListener('input', () => {
      renderResults(queryInput.value);
    });
  }
}
