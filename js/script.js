document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const carouselImages = carousel.querySelector('.carousel-images');
    const images = carouselImages.querySelectorAll('img');
    const prevButton = carousel.querySelector('.prev');
    const nextButton = carousel.querySelector('.next');
    const indicators = carousel.querySelector('.carousel-indicators');
    
    let currentIndex = 0;
    let isTransitioning = false;
    const totalImages = images.length;

    // Set initial width for proper sliding
    function setCarouselWidth() {
        const carouselWidth = carousel.offsetWidth;
        images.forEach(img => {
            img.style.width = `${carouselWidth}px`;
        });
        carouselImages.style.width = `${carouselWidth * totalImages}px`;
        updateCarousel(false);
    }

    // Create indicator dots
    images.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        indicators.appendChild(dot);
    });

    function updateCarousel(animate = true) {
        if (isTransitioning) return;
        
        const offset = -currentIndex * carousel.offsetWidth;
        carouselImages.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
        carouselImages.style.transform = `translateX(${offset}px)`;
        
        // Update indicators
        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // Update active state of images
        images.forEach((img, index) => {
            img.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        if (isTransitioning || index === currentIndex) return;
        isTransitioning = true;
        currentIndex = index;
        updateCarousel();
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }

    function nextSlide() {
        if (isTransitioning) return;
        currentIndex = (currentIndex + 1) % totalImages;
        updateCarousel();
    }

    function prevSlide() {
        if (isTransitioning) return;
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateCarousel();
    }

    // Event listeners
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);

    // Handle window resize
    window.addEventListener('resize', () => {
        setCarouselWidth();
    });

    // Auto-advance carousel
    let autoplayInterval = setInterval(nextSlide, 5000);

    // Pause autoplay on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    carousel.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextSlide);
    });

    // Handle transition end
    carouselImages.addEventListener('transitionend', () => {
        isTransitioning = false;
    });

    // Initial setup
    setCarouselWidth();
});
