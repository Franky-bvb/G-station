/**
 * G Station - Main JavaScript
 * Handles common site functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const setupMobileMenu = () => {
        const headerHeight = document.querySelector('header').clientHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    };

    // Game card hover effects
    const setupGameCards = () => {
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    };

    // Responsive iframe resizing
    const setupResponsiveIframes = () => {
        const gameWrapper = document.querySelector('.game-wrapper');
        if (gameWrapper) {
            const updateIframeSize = () => {
                const width = gameWrapper.clientWidth;
                const aspectRatio = window.innerWidth <= 768 ? 0.75 : 0.5625; // 4:3 on mobile, 16:9 on desktop
                gameWrapper.style.paddingBottom = `${width * aspectRatio}px`;
            };
            
            updateIframeSize();
            window.addEventListener('resize', updateIframeSize);
        }
    };

    // Lazy loading images
    const setupLazyLoading = () => {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without intersection observer
            let lazyImages = document.querySelectorAll('img[data-src]');
            const loadImages = () => {
                lazyImages.forEach(img => {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                });
                lazyImages = [];
            };

            // Load all images after page load
            setTimeout(loadImages, 200);
        }
    };

    // Initialize all components
    setupMobileMenu();
    setupGameCards();
    setupResponsiveIframes();
    setupLazyLoading();

    // Handle search form submission
    const searchForm = document.querySelector('.search-bar form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            const searchInput = searchForm.querySelector('input[name="q"]');
            if (!searchInput.value.trim()) {
                e.preventDefault();
            }
        });
    }
});

// Analytics tracking (placeholder)
function trackGamePlay(gameId, gameName) {
    console.log(`Game played: ${gameName} (${gameId})`);
    // In a real implementation, you would send this data to your analytics service
}

// Handle social sharing (placeholder)
function shareGame(platform, gameUrl, gameTitle) {
    let shareUrl;
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(gameUrl)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(gameUrl)}&text=${encodeURIComponent('Check out this awesome game: ' + gameTitle)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(gameTitle + ': ' + gameUrl)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
} 