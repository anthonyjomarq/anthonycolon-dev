document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation();
  initializeDarkMode();
  initializeContactForm();
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
      if (href === '#' + current) {
        btn.style.background = 'var(--black)';
        btn.style.color = 'var(--white)';
      } else {
        btn.style.background = 'var(--white)';
        btn.style.color = 'var(--black)';
      }
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

function initializeContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'SENDING...';
    submitBtn.disabled = true;

    const formData = new FormData(contactForm);

    fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then((response) => {
      if (response.ok) {
        showSuccessNotification();
        contactForm.reset();
      } else {
        showErrorNotification();
      }
    })
    .catch(() => {
      showErrorNotification();
    })
    .finally(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
  });
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

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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

function showSuccessNotification() {
  const notification = document.createElement('div');
  notification.className = 'success-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <strong>MESSAGE SENT!</strong>
      <p>Thanks for reaching out! I'll get back to you soon.</p>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    .success-notification {
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: #2ECC71;
      border: 4px solid #000000;
      box-shadow: 8px 8px 0 #000000;
      padding: 1.5rem;
      max-width: 400px;
      z-index: 10000;
      animation: slideIn 0.3s ease forwards;
    }

    .success-notification .notification-content strong {
      display: block;
      font-family: var(--font-heading);
      font-size: 1rem;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
      color: #000000;
    }

    .success-notification .notification-content p {
      margin: 0;
      color: #000000;
      font-size: 0.875rem;
    }

    .success-notification.fade-out {
      animation: slideOut 0.3s ease forwards;
    }

    @keyframes slideIn {
      from {
        transform: translateX(120%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(120%);
        opacity: 0;
      }
    }

    @media (max-width: 768px) {
      .success-notification {
        top: 1rem;
        right: 1rem;
        left: 1rem;
      }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

function showErrorNotification() {
  const notification = document.createElement('div');
  notification.className = 'success-notification';
  notification.style.background = '#FF6B6B';
  notification.innerHTML = `
    <div class="notification-content">
      <strong>FAILED TO SEND</strong>
      <p>Something went wrong. Please try emailing me directly.</p>
    </div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (document.activeElement) {
      document.activeElement.blur();
    }
  }
});

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
    lightbox.style.display = 'block';
    lightboxImg.src = img.src;
    lightboxCaption.textContent = img.alt || '';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
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

  // Event Listeners
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', showNextImage);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', showPrevImage);
  }

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (lightbox.style.display === 'block') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextImage();
      if (e.key === 'ArrowLeft') showPrevImage();
    }
  });

  makeImagesClickable();
}

if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        console.log(`⚡ Page load time: ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
        console.log(`🚀 Portfolio ready!`);
      }
    }, 0);
  });
}
