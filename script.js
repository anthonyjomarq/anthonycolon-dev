document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation();
  initializeDarkMode();
  initializeBackToTop();
  initializeSmoothScroll();
  initializeLightbox();
});

function initializeNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', throttle(() => {
    let current = '';
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navButtons.forEach(btn => {
      const href = btn.getAttribute('href');
      btn.classList.toggle('is-active', href === '#' + current);
    });
  }, 100));
}

function initializeDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;

  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark-mode' || (!savedTheme && systemPrefersDark)) {
    enableDarkMode();
  }

  darkModeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  });

  function enableDarkMode() {
    body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark-mode');
  }

  function disableDarkMode() {
    body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light-mode');
  }
}

function initializeBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');

  if (!backToTopBtn) return;

  window.addEventListener('scroll', throttle(() => {
    if (window.pageYOffset > 500) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }, 100));

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function initializeSmoothScroll() {
  const scrollLinks = document.querySelectorAll('a[href^="#"]');

  scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      if (href === '#') return;

      e.preventDefault();

      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        const headerHeight = 80;
        const targetPosition = targetSection.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;

  return function (...args) {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

function initializeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  if (!lightbox) return;

  let clickableImages = [];
  let currentImageIndex = 0;
  let lastFocusedElement = null;

  function isOpen() {
    return lightbox.style.display === 'block';
  }

  function updateClickableImages() {
    clickableImages = Array.from(document.querySelectorAll('.clickable-image'));
  }

  function makeImagesClickable() {
    updateClickableImages();

    clickableImages.forEach((img, index) => {
      img.addEventListener('click', function() {
        currentImageIndex = index;
        openLightbox(this);
      });
    });
  }

  function openLightbox(img) {
    lastFocusedElement = document.activeElement;
    lightbox.style.display = 'block';
    lightboxImg.src = img.src;
    lightboxCaption.textContent = img.alt || '';
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % clickableImages.length;
    lightboxImg.src = clickableImages[currentImageIndex].src;
    lightboxCaption.textContent = clickableImages[currentImageIndex].alt || '';
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + clickableImages.length) % clickableImages.length;
    lightboxImg.src = clickableImages[currentImageIndex].src;
    lightboxCaption.textContent = clickableImages[currentImageIndex].alt || '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNextImage);
  if (prevBtn) prevBtn.addEventListener('click', showPrevImage);

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (!isOpen()) return;

    if (e.key === 'Escape') {
      closeLightbox();
      return;
    }
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();

    if (e.key === 'Tab') {
      const focusable = [closeBtn, prevBtn, nextBtn].filter(Boolean);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  makeImagesClickable();
}
