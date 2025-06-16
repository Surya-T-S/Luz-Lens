document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    const carouselImages = carousel.querySelector('.carousel-images');
    const images = carouselImages.querySelectorAll('img');
    const prevButton = carousel.querySelector('.prev');
    const nextButton = carousel.querySelector('.next');
    const indicators = carousel.querySelector('.carousel-indicators');

    let currentIndex = 0;
    const totalImages = images.length;
    let autoplayInterval;

    // Create indicator dots
    images.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        indicators.appendChild(dot);
    });

    function updateCarousel() {
        const offset = -currentIndex * carousel.offsetWidth;
        carouselImages.style.transform = `translateX(${offset}px)`;

        // Update indicators
        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalImages;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateCarousel();
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Event listeners
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Start autoplay initially
    startAutoplay();

    // Initial update
    updateCarousel();
});
