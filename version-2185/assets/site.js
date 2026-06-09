(() => {
    const menuButton = document.querySelector('[data-menu-button]');
    const mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
        });
    }

    const carousel = document.querySelector('[data-hero-carousel]');

    if (carousel) {
        const slides = Array.from(carousel.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(carousel.querySelectorAll('[data-hero-dot]'));
        let activeIndex = 0;
        let timer = null;

        const activate = (nextIndex) => {
            if (!slides.length) {
                return;
            }

            activeIndex = (nextIndex + slides.length) % slides.length;

            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === activeIndex);
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });
        };

        const start = () => {
            timer = window.setInterval(() => {
                activate(activeIndex + 1);
            }, 5800);
        };

        const restart = () => {
            if (timer) {
                window.clearInterval(timer);
            }

            start();
        };

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                activate(index);
                restart();
            });
        });

        carousel.addEventListener('mouseenter', () => {
            if (timer) {
                window.clearInterval(timer);
            }
        });

        carousel.addEventListener('mouseleave', start);
        activate(0);
        start();
    }

    const normalize = (value) => String(value || '').trim().toLowerCase();

    const applyFilters = () => {
        const scope = document.querySelector('[data-filter-scope]');
        const list = document.querySelector('[data-filter-list]');

        if (!scope || !list) {
            return;
        }

        const query = normalize(scope.querySelector('[data-search-input]')?.value);
        const year = normalize(scope.querySelector('[data-year-filter]')?.value);
        const region = normalize(scope.querySelector('[data-region-filter]')?.value);
        const type = normalize(scope.querySelector('[data-type-filter]')?.value);
        const cards = Array.from(list.querySelectorAll('[data-card]'));
        let visibleCount = 0;

        cards.forEach((card) => {
            const searchText = normalize(card.dataset.search);
            const cardYear = normalize(card.dataset.year);
            const cardRegion = normalize(card.dataset.region);
            const cardType = normalize(card.dataset.type);
            const matched =
                (!query || searchText.includes(query)) &&
                (!year || cardYear.includes(year)) &&
                (!region || cardRegion.includes(region)) &&
                (!type || cardType.includes(type));

            card.classList.toggle('is-hidden', !matched);

            if (matched) {
                visibleCount += 1;
            }
        });

        const empty = scope.querySelector('[data-filter-empty]');

        if (empty) {
            empty.hidden = visibleCount > 0;
        }
    };

    const filterScope = document.querySelector('[data-filter-scope]');

    if (filterScope) {
        filterScope.addEventListener('input', applyFilters);
        filterScope.addEventListener('change', applyFilters);

        const params = new URLSearchParams(window.location.search);
        const q = params.get('q');
        const input = filterScope.querySelector('[data-search-input]');

        if (q && input) {
            input.value = q;
        }

        applyFilters();
    }

    const players = Array.from(document.querySelectorAll('.js-video-player'));

    players.forEach((video) => {
        const shell = video.closest('.video-shell');
        const button = shell?.querySelector('[data-play-button]');
        const source = video.dataset.src;
        let hlsInstance = null;

        const showPlaybackError = (message) => {
            if (!shell) {
                return;
            }

            let errorBox = shell.querySelector('.video-error');

            if (!errorBox) {
                errorBox = document.createElement('div');
                errorBox.className = 'video-error';
                errorBox.style.position = 'absolute';
                errorBox.style.left = '16px';
                errorBox.style.right = '16px';
                errorBox.style.bottom = '16px';
                errorBox.style.padding = '12px 14px';
                errorBox.style.borderRadius = '14px';
                errorBox.style.background = 'rgba(127, 29, 29, 0.82)';
                errorBox.style.color = '#fee2e2';
                errorBox.style.fontWeight = '700';
                shell.appendChild(errorBox);
            }

            errorBox.textContent = message;
        };

        const playVideo = () => {
            if (!source) {
                showPlaybackError('当前影片没有可用播放源。');
                return;
            }

            if (button) {
                button.classList.add('is-hidden');
            }

            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                video.play().catch(() => {
                    showPlaybackError('浏览器阻止了自动播放，请再次点击播放器播放。');
                });
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false,
                    backBufferLength: 90
                });

                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch(() => {
                        showPlaybackError('浏览器阻止了自动播放，请再次点击播放器播放。');
                    });
                });
                hlsInstance.on(window.Hls.Events.ERROR, (_event, data) => {
                    if (data && data.fatal) {
                        showPlaybackError('播放源暂时无法加载，请稍后重试或切换浏览器。');
                        hlsInstance.destroy();
                        hlsInstance = null;
                    }
                });
                return;
            }

            video.src = source;
            video.play().catch(() => {
                showPlaybackError('当前浏览器不支持 HLS 播放，请使用支持 HLS 的浏览器访问。');
            });
        };

        if (button) {
            button.addEventListener('click', playVideo);
        }
    });
})();
