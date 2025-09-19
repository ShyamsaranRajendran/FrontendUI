/* ================= MODAL FUNCTIONALITY ================= */
const modal = document.getElementById("videoModal");
const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");

if (openModalBtn && modal && closeModalBtn) {
  // Open modal
  openModalBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // Close modal (X button)
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal when clicking outside content
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Close modal on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modal.style.display = "none";
    }
  });
}

/* ================= CAROUSEL / SLIDER ================= */
$(document).ready(function () {
  const $carousel = $(".carousel");
  const $slides = $carousel.find(".slide");
  let currentIndex = 0;
  let slideInterval;

  function showSlide(index) {
    $slides.hide();
    $slides.eq(index).fadeIn();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % $slides.length;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + $slides.length) % $slides.length;
    showSlide(currentIndex);
  }

  // Init
  showSlide(currentIndex);

  // Auto-slide every 5s
  function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoSlide() {
    clearInterval(slideInterval);
  }

  startAutoSlide();

  // Next/Prev buttons
  $(".next").on("click", function () {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
  });

  $(".prev").on("click", function () {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
  });

  // Keyboard navigation
  $(document).on("keydown", function (e) {
    if (e.key === "ArrowRight") {
      stopAutoSlide();
      nextSlide();
      startAutoSlide();
    } else if (e.key === "ArrowLeft") {
      stopAutoSlide();
      prevSlide();
      startAutoSlide();
    }
  });

  // Optional: drag/swipe support
  let startX = 0;
  let endX = 0;

  $carousel.on("mousedown touchstart", function (e) {
    startX = e.pageX || e.originalEvent.touches[0].pageX;
  });

  $carousel.on("mouseup touchend", function (e) {
    endX = e.pageX || e.originalEvent.changedTouches[0].pageX;
    if (startX - endX > 50) {
      // swipe left
      stopAutoSlide();
      nextSlide();
      startAutoSlide();
    } else if (endX - startX > 50) {
      // swipe right
      stopAutoSlide();
      prevSlide();
      startAutoSlide();
    }
  });
});
