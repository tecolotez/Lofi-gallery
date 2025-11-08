const gallery = document.getElementById('gallery');
const tabList = document.getElementById('tabList');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxDate = document.getElementById('lightbox-date');
const lightboxLocation = document.getElementById('lightbox-location');
const lightboxMeta = document.getElementById('lightbox-meta');
const closeBtn = document.querySelector('.lightbox .close');
const leftArrow = document.querySelector('.lightbox .left');
const rightArrow = document.querySelector('.lightbox .right');

let photos = [];
let currentIndex = 0;

// Load all photos from backend
async function loadPhotos() {
  const res = await fetch('/photos');
  photos = await res.json();
  gallery.innerHTML = '';
  const tabs = new Set(['all']);

  photos.forEach((p, i) => {
    tabs.add(p.year);
    tabs.add(p.location);

    const card = document.createElement('div');
    card.classList.add('photo-card');
    card.dataset.year = p.year;
    card.dataset.location = p.location;

    card.innerHTML = `
      <img src="${p.url}" alt="${p.location}">
      <div class="caption">
        <span class="date">${p.date}</span>
        <span class="location">${p.location}</span>
      </div>
    `;
    gallery.appendChild(card);

    // Click event to open lightbox
    const imgEl = card.querySelector('img');
    imgEl.addEventListener('click', () => openLightbox(i));
  });

  renderTabs(tabs);
}

// Render tabs dynamically
function renderTabs(tabs) {
  tabList.innerHTML = '';
  tabs.forEach(t => {
    const li = document.createElement('li');
    li.classList.add('tab');
    if (t === 'all') li.classList.add('active');
    li.textContent = t.charAt(0).toUpperCase() + t.slice(1);
    li.dataset.filter = t;
    tabList.appendChild(li);
  });

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      document.querySelectorAll('.photo-card').forEach(card => {
        card.style.display =
          filter === 'all' ||
          card.dataset.year === filter ||
          card.dataset.location === filter
            ? 'block'
            : 'none';
      });
    });
  });
}

// Handle uploads
const uploadForm = document.getElementById('uploadForm');
uploadForm.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(uploadForm);
  const res = await fetch('/upload', {
    method: 'POST',
    body: formData
  });
  if (res.ok) {
    loadPhotos();
    uploadForm.reset();
  } else {
    alert('Upload failed.');
  }
});

// 🌌 Lightbox functions
function openLightbox(index) {
  const p = photos[index];
  currentIndex = index;
  lightboxImg.src = p.url;
  lightboxDate.textContent = `📅 ${p.date}`;
  lightboxLocation.textContent = `📍 ${p.location}`;
  lightboxMeta.textContent = p.camera
    ? `📷 ${p.camera || ''} | ${p.lens || ''} | ${p.settings || ''}`
    : '';
  lightbox.classList.add('visible');
}

function closeLightbox() {
  lightbox.classList.remove('visible');
  setTimeout(() => (lightboxImg.src = ''), 300);
}

function showNextPhoto() {
  currentIndex = (currentIndex + 1) % photos.length;
  openLightbox(currentIndex);
}

function showPrevPhoto() {
  currentIndex = (currentIndex - 1 + photos.length) % photos.length;
  openLightbox(currentIndex);
}

closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
rightArrow.addEventListener('click', showNextPhoto);
leftArrow.addEventListener('click', showPrevPhoto);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('visible')) return;
  if (e.key === 'ArrowRight') showNextPhoto();
  if (e.key === 'ArrowLeft') showPrevPhoto();
  if (e.key === 'Escape') closeLightbox();
});

loadPhotos();


