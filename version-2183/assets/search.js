(function () {
  var form = document.querySelector('[data-search-form]');
  var input = document.querySelector('[data-search-input]');
  var results = document.querySelector('[data-search-results]');
  var params = new URLSearchParams(window.location.search);
  var query = params.get('q') || '';

  function normalize(text) {
    return String(text || '').toLowerCase().replace(/\s+/g, '');
  }

  function card(movie) {
    var title = escapeHtml(movie.title);
    var line = escapeHtml(movie.oneLine);
    return [
      '<article class="movie-card">',
      '<a class="poster-link" href="./' + movie.file + '" aria-label="' + title + ' 在线观看">',
      '<img src="' + movie.image + '" alt="' + title + ' 在线观看" loading="lazy">',
      '<span class="poster-badge">' + escapeHtml(movie.type) + '</span>',
      '</a>',
      '<div class="movie-card-body">',
      '<div class="movie-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span></div>',
      '<h3><a href="./' + movie.file + '">' + title + '</a></h3>',
      '<p>' + line + '</p>',
      '<div class="tag-row"><span>' + escapeHtml(movie.genre) + '</span><span>' + escapeHtml(movie.category) + '</span></div>',
      '</div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function search(value) {
    if (!results || !window.SEARCH_MOVIES) {
      return;
    }
    var needle = normalize(value);
    var pool = window.SEARCH_MOVIES;
    var list = !needle ? pool.slice(0, 24) : pool.filter(function (movie) {
      var text = normalize([
        movie.title,
        movie.year,
        movie.region,
        movie.type,
        movie.genre,
        movie.tags,
        movie.oneLine,
        movie.category
      ].join(' '));
      return text.indexOf(needle) !== -1;
    }).slice(0, 120);

    results.innerHTML = list.map(card).join('');
    results.classList.toggle('is-empty', list.length === 0);
  }

  if (input) {
    input.value = query;
    input.addEventListener('input', function () {
      search(input.value);
    });
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var value = input ? input.value : '';
      var url = new URL(window.location.href);
      if (value) {
        url.searchParams.set('q', value);
      } else {
        url.searchParams.delete('q');
      }
      window.history.replaceState({}, '', url.toString());
      search(value);
    });
  }

  search(query);
})();
