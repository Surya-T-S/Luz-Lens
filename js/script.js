document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    if (carousel) {
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
    }

    // Dot-matrix digit patterns (3x5)
    const DOT_MATRIX_DIGITS = [
      [1,1,1,1,0,1,1,0,1,1,0,1,1,1,1], // 0
      [0,1,0,1,1,0,0,1,0,0,1,0,1,1,1], // 1
      [1,1,1,0,0,1,1,1,1,1,0,0,1,1,1], // 2
      [1,1,1,0,0,1,1,1,1,0,0,1,1,1,1], // 3
      [1,0,1,1,0,1,1,1,1,0,0,1,0,0,1], // 4
      [1,1,1,1,0,0,1,1,1,0,0,1,1,1,1], // 5
      [1,1,1,1,0,0,1,1,1,1,0,1,1,1,1], // 6
      [1,1,1,0,0,1,0,1,0,0,1,0,0,1,0], // 7
      [1,1,1,1,0,1,1,1,1,1,0,1,1,1,1], // 8
      [1,1,1,1,0,1,1,1,1,0,0,1,1,1,1], // 9
    ];
    function renderDotMatrixVisitorCount(count) {
      const container = document.querySelector('.dot-matrix');
      if (!container) return;
      container.innerHTML = '';
      const str = count.toString().padStart(6, '0');
      for (const char of str) {
        const digit = parseInt(char);
        const pattern = DOT_MATRIX_DIGITS[digit];
        const digitDiv = document.createElement('div');
        digitDiv.className = 'dot-digit';
        pattern.forEach(on => {
          const dot = document.createElement('div');
          dot.className = 'dot' + (on ? ' on' : '');
          digitDiv.appendChild(dot);
        });
        container.appendChild(digitDiv);
      }
    }
    // Update dot-matrix on every load
    // Visitor counter logic: increment on first visit in session
    
    /*
    let visitorCount = parseInt(localStorage.getItem('visitorCount') || '0');
    if (!sessionStorage.getItem('visitedLuzLensGallery')) {
      visitorCount++;
      localStorage.setItem('visitorCount', visitorCount);
      sessionStorage.setItem('visitedLuzLensGallery', '1');
    }
    */
    
    // Fixed visitor count for demo
    const visitorCount = 224;
    renderDotMatrixVisitorCount(visitorCount);

    // Like functionality
    function getLikes() {
      let likes = localStorage.getItem('imageLikes');
      try {
        likes = JSON.parse(likes);
        if (!Array.isArray(likes)) likes = [];
      } catch {
        likes = [];
      }
      return likes;
    }
    function setLikes(likes) {
      localStorage.setItem('imageLikes', JSON.stringify(likes));
    }
    function initializeLikes() {
      const likes = getLikes();
      document.querySelectorAll('.gallery-item').forEach((item, index) => {
        const likeButton = item.querySelector('.like-button');
        const likeCount = likeButton.querySelector('.like-count');
        const count = Number(likes[index] || 0);
        likeCount.textContent = count;
        likeButton.classList.toggle('liked', count > 0);
      });
    }
    function updateLikeCount(button, increment = true) {
      const galleryItem = button.closest('.gallery-item');
      const index = Array.from(document.querySelectorAll('.gallery-item')).indexOf(galleryItem);
      const likeCount = button.querySelector('.like-count');
      let likes = getLikes();
      let currentLikes = Number(likes[index] || 0);
      let newCount = increment ? currentLikes + 1 : currentLikes - 1;
      if (newCount < 0) newCount = 0;
      likes[index] = newCount;
      setLikes(likes);
      likeCount.textContent = newCount;
      button.classList.toggle('liked', newCount > 0);
      // Update modal like button if visible
      const modal = document.querySelector('.modal');
      if (modal && modal.classList.contains('active')) {
        const modalLike = modal.querySelector('.modal-like');
        if (modalLike) {
          modalLike.querySelector('.like-count').textContent = newCount;
          modalLike.classList.toggle('liked', newCount > 0);
        }
      }
    }
    document.querySelectorAll('.like-button').forEach(button => {
      button.addEventListener('click', function(e) {
        e.stopPropagation();
        const isLiked = button.classList.contains('liked');
        updateLikeCount(button, !isLiked);
      });
    });
    initializeLikes();

    // Modal functionality
    let currentImageIndex = 0;
    const modal = document.querySelector('.modal');
    const modalImg = document.querySelector('#modal-img');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');
    const modalLike = document.querySelector('.modal-like');
    const galleryItems = document.querySelectorAll('.gallery-item');

    function openModal(index) {
        currentImageIndex = index;
        const currentItem = galleryItems[index];
        modalImg.src = currentItem.dataset.src;
        
        // Update modal like button
        const itemLikeButton = currentItem.querySelector('.like-button');
        modalLike.querySelector('.like-count').textContent = 
            itemLikeButton.querySelector('.like-count').textContent;
        modalLike.classList.toggle('liked', 
            itemLikeButton.classList.contains('liked'));
        
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    function navigateModal(direction) {
        currentImageIndex = 
            (currentImageIndex + direction + galleryItems.length) % galleryItems.length;
        openModal(currentImageIndex);
    }

    // Event listeners for modal
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.like-button')) {
                openModal(index);
            }
        });
    });

    modalClose && modalClose.addEventListener('click', closeModal);
    modalPrev && modalPrev.addEventListener('click', () => navigateModal(-1));
    modalNext && modalNext.addEventListener('click', () => navigateModal(1));
    
    modalLike && modalLike.addEventListener('click', () => {
        const currentItem = galleryItems[currentImageIndex];
        const itemLikeButton = currentItem.querySelector('.like-button');
        itemLikeButton.click();
    });

    // Close modal when clicking outside
    modal && modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                navigateModal(-1);
                break;
            case 'ArrowRight':
                navigateModal(1);
                break;
            case 'Escape':
                closeModal();
                break;
        }
    });

    // Show visitor counter only at end of page
    function handleVisitorCounterVisibility() {
      const counter = document.querySelector('.visitor-counter');
      if (!counter) return;
      const scrollY = window.scrollY || window.pageYOffset;
      const windowH = window.innerHeight || document.documentElement.clientHeight;
      const docH = document.documentElement.scrollHeight;
      // If user is at the bottom (within 40px of the end)
      if (scrollY + windowH >= docH - 40) {
        counter.classList.add('visible');
      } else {
        counter.classList.remove('visible');
      }
    }
    window.addEventListener('scroll', handleVisitorCounterVisibility);
    window.addEventListener('resize', handleVisitorCounterVisibility);
    handleVisitorCounterVisibility();
});
