/* Minimal helpers */
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));

/* Set current year in footer */
document.getElementById('year').textContent = new Date().getFullYear();

/* Modal logic */
(function(){
  const modal = $('#modalSignup');
  const openBtn = $('#ctaOpenModal');
  const closeables = $$('.modal__close, .modal__backdrop, [data-dismiss="modal"]');

  function openModal() {
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('input[name=email]').focus();
  }
  function closeModal() {
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  closeables.forEach(el => el.addEventListener('click', closeModal));
  // Escape closes
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
  });

  // modal form (demo)
  const modalForm = $('#modalForm');
  if(modalForm) modalForm.addEventListener('submit', function(ev){
    ev.preventDefault();
    const email = modalForm.email.value.trim();
    if(!email){ alert('Please provide an email'); return; }
    alert('Thanks — check your inbox: ' + email);
    modalForm.reset(); closeModal();
  });
})();

/* Contact form demo */
(function(){
  const frm = $('#contactForm');
  if(!frm) return;
  frm.addEventListener('submit', function(e){
    e.preventDefault();
    alert('Message sent — thank you!');
    frm.reset();
  });
})();

/* Carousel implementation
   Requirements:
     - next/prev
     - auto-slide every 5s
     - keyboard left/right
     - drag / touch support
*/
(function(){
  const carousel = $('#testimonialsCarousel');
  if(!carousel) return;

  const track = carousel.querySelector('.carousel__track');
  // Wrap track children into inner wrapper to control transform
  const slides = Array.from(carousel.querySelectorAll('.carousel__slide'));
  const inner = document.createElement('div');
  inner.className = 'carousel__track_inner';
  slides.forEach(s => inner.appendChild(s));
  track.innerHTML = '';
  track.appendChild(inner);

  const prevBtn = carousel.querySelector('[data-action="prev"]');
  const nextBtn = carousel.querySelector('[data-action="next"]');
  const dotsWrap = carousel.querySelector('.carousel__dots');

  let index = 0;
  const total = slides.length;
  let width = track.clientWidth;
  let autoTimer = null;
  let isDragging = false;
  let startX = 0, currentTranslate = 0, prevTranslate = 0, animationID = null;

  // create dots
  const dots = [];
  for(let i=0;i<total;i++){
    const d = document.createElement('button');
    d.className = 'carousel__dot';
    d.setAttribute('aria-label','Go to slide ' + (i+1));
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
    dots.push(d);
  }

  function update() {
    inner.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d,i) => d.classList.toggle('active', i===index));
  }

  function goTo(i){
    index = (i + total) % total;
    update();
    restartAuto();
  }
  function next(){
    goTo(index+1);
  }
  function prev(){
    goTo(index-1);
  }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  // Keyboard
  carousel.addEventListener('keydown', e => {
    if(e.key === 'ArrowLeft') prev();
    if(e.key === 'ArrowRight') next();
  });

  // Auto-slide every 5s
  function startAuto(){
    autoTimer = setInterval(next, 5000);
  }
  function stopAuto(){
    clearInterval(autoTimer);
    autoTimer = null;
  }
  function restartAuto(){
    stopAuto();
    startAuto();
  }
  startAuto();

  // Drag / touch
  inner.addEventListener('pointerdown', startDrag);
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  window.addEventListener('pointermove', onDrag);

  function startDrag(e){
    isDragging = true;
    startX = e.clientX;
    prevTranslate = -index * track.clientWidth;
    inner.style.transition = 'none';
    stopAuto();
    inner.setPointerCapture && inner.setPointerCapture(e.pointerId);
  }
  function onDrag(e){
    if(!isDragging) return;
    const dx = e.clientX - startX;
    const percent = dx / track.clientWidth * 100;
    inner.style.transform = `translateX(${prevTranslate + dx}px)`; // pixel-based
  }
  function endDrag(e){
    if(!isDragging) return;
    isDragging = false;
    const dx = e.clientX - startX;
    const threshold = track.clientWidth * 0.2;
    if(dx > threshold) {
      prev();
    } else if(dx < -threshold){
      next();
    } else {
      update(); // snap back
    }
    inner.style.transition = ''; // allow css transitions
    restartAuto();
  }

  // responsive: update width on resize
  window.addEventListener('resize', () => {
    width = track.clientWidth;
    update();
  });

  // initial
  update();
})();
