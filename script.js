document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll('.tab');
  const photos = document.querySelectorAll('.photo-card');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxDate = document.getElementById('lightbox-date');
  const lightboxLocation = document.getElementById('lightbox-location');
  const closeBtn = document.querySelector('.lightbox .close');

  // Filter gallery by tab
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      photos.forEach(photo => {
        if (filter === 'all' || photo.dataset.year === filter) {
          photo.style.display = 'block';
        } else {
          photo.style.display = 'none';
        }
      });
    });
  });

  // Lightbox
  photos.forEach(photo => {
    const img = photo.querySelector('img');
    img.addEventListener('click', () => {
      lightbox.classList.add('visible');
      lightboxImg.src = img.src;
      lightboxDate.textContent = `📅 ${photo.dataset.year}`;
      lightboxLocation.textContent = `📍 ${photo.dataset.location}`;
    });
  });

  closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('visible');
  });

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) {
      lightbox.classList.remove('visible');
    }
  });
});






