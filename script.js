/* ============================================================
   script.js — Portfolio Johan Abdallah
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Burger menu ───────────────────────────────────────── */
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ── Fade-in au scroll ─────────────────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-in');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => io.observe(el));

  /* ── Barres de progression (compétences) ───────────────── */
  const progBars = document.querySelectorAll('.progress');
  if (progBars.length) {
    const barObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          bar.style.width = bar.dataset.width || bar.style.width;
          barObs.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });
    progBars.forEach(bar => {
      const target = bar.style.width;
      bar.dataset.width = target;
      bar.style.width = '0';
      barObs.observe(bar);
    });
  }

  /* ── Filtres projets ───────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        projectCards.forEach(card => {
          card.classList.toggle('hide', f !== 'all' && card.dataset.category !== f);
        });
        currentFiltered = getVisibleCards();
      });
    });
  }

  /* ── Modale projets ────────────────────────────────────── */
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;

  const modalImg       = overlay.querySelector('.modal-img');
  const modalBadge     = overlay.querySelector('.modal-badge');
  const modalTitle     = overlay.querySelector('.modal-title');
  const modalContext   = overlay.querySelector('.modal-context');
  const modalObjectif  = overlay.querySelector('.modal-objectif');
  const modalSolution  = overlay.querySelector('.modal-solution');
  const modalPersonnel = overlay.querySelector('.modal-personnel');
  const modalTags      = overlay.querySelector('.modal-tags');
  const modalDownload  = overlay.querySelector('.modal-download');
  const modalCounter   = overlay.querySelector('.modal-counter');
  const btnPrev        = overlay.querySelector('#modal-prev');
  const btnNext        = overlay.querySelector('#modal-next');

  let currentIdx = 0;
  let currentFiltered = getVisibleCards();

  function getVisibleCards() {
    return Array.from(document.querySelectorAll('.project-card:not(.hide)'));
  }

  function openModal(idx) {
    currentFiltered = getVisibleCards();
    currentIdx = idx;
    const card = currentFiltered[idx];
    if (!card) return;

    const data = card.dataset;
    if (modalImg) { modalImg.src = data.img || ''; modalImg.alt = data.title || ''; }
    if (modalBadge)     modalBadge.textContent  = data.badge || '';
    if (modalTitle)     modalTitle.textContent  = data.title || '';
    if (modalContext)   modalContext.textContent = data.context || '';
    if (modalObjectif)  modalObjectif.innerHTML  = data.objectif || '';
    if (modalSolution)  modalSolution.innerHTML  = data.solution || '';
    if (modalPersonnel) modalPersonnel.textContent = data.personnel || '';
    if (modalTags) {
      modalTags.innerHTML = '';
      (data.tags || '').split(',').filter(t => t.trim()).forEach(t => {
        const s = document.createElement('span');
        s.textContent = t.trim();
        modalTags.appendChild(s);
      });
    }
    if (modalDownload) {
      if (data.file) {
        modalDownload.href = data.file;
        modalDownload.download = '';
        modalDownload.style.display = 'inline-flex';
        modalDownload.innerHTML = '<i class="fa-solid fa-file-pdf"></i> ' + (data.filelabel || 'Télécharger le rapport');
      } else {
        modalDownload.style.display = 'none';
      }
    }
    updateCounter();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateCounter() {
    if (modalCounter) modalCounter.textContent = (currentIdx + 1) + ' / ' + currentFiltered.length;
    if (btnPrev) btnPrev.disabled = currentIdx === 0;
    if (btnNext) btnNext.disabled = currentIdx === currentFiltered.length - 1;
  }

  // Ouvrir depuis card
  document.querySelectorAll('.project-card').forEach((card, _i) => {
    card.addEventListener('click', () => {
      currentFiltered = getVisibleCards();
      const idx = currentFiltered.indexOf(card);
      if (idx !== -1) openModal(idx);
    });
  });

  // Fermer
  overlay.querySelector('.modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft'  && currentIdx > 0)                       openModal(currentIdx - 1);
    if (e.key === 'ArrowRight' && currentIdx < currentFiltered.length-1) openModal(currentIdx + 1);
  });

  // Naviguer
  if (btnPrev) btnPrev.addEventListener('click', () => { if (currentIdx > 0) openModal(currentIdx - 1); });
  if (btnNext) btnNext.addEventListener('click', () => { if (currentIdx < currentFiltered.length-1) openModal(currentIdx + 1); });
});
