// Video carousel: preview on hover, YouTube pop-up on click.
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".video-carousel");
  if (!carousel) return;

  const track = carousel.querySelector(".video-carousel-track");
  const cards = carousel.querySelectorAll(".video-card");
  const modalEl = document.getElementById("videoModal");
  const frame = document.getElementById("videoModalFrame");
  const modalTitle = document.getElementById("videoModalTitle");
  const modal = new bootstrap.Modal(modalEl);
  const canHover = window.matchMedia("(hover: hover)").matches;

  cards.forEach((card) => {
    const video = card.querySelector(".video-card-preview");

    if (canHover && video) {
      card.addEventListener("mouseenter", () => {
        // Only load the preview file the first time someone hovers
        if (!video.src && video.dataset.src) video.src = video.dataset.src;
        video.currentTime = 0;
        video.play().catch(() => {});
      });
      card.addEventListener("mouseleave", () => video.pause());
    }

    card.addEventListener("click", () => {
      const id = card.dataset.youtube;
      modalTitle.textContent = card.dataset.title || "";
      frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
      modal.show();
    });
  });

  // Stop the YouTube video when the pop-up closes
  modalEl.addEventListener("hidden.bs.modal", () => {
    frame.src = "";
  });

  // Arrow buttons scroll one card at a time
  const step = () => cards[0].offsetWidth + 24;
  carousel.querySelector(".prev").addEventListener("click", () =>
    track.scrollBy({ left: -step(), behavior: "smooth" })
  );
  carousel.querySelector(".next").addEventListener("click", () =>
    track.scrollBy({ left: step(), behavior: "smooth" })
  );

  // Drag with the mouse (touch screens already swipe natively)
  let startX = 0;
  let startScroll = 0;
  let pointerDown = false;
  let dragged = false;

  track.addEventListener("dragstart", (e) => e.preventDefault());

  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    pointerDown = true;
    dragged = false;
    startX = e.clientX;
    startScroll = track.scrollLeft;
  });

  window.addEventListener("pointermove", (e) => {
    if (!pointerDown) return;
    const dx = e.clientX - startX;
    if (!dragged && Math.abs(dx) > 5) {
      dragged = true;
      track.classList.add("is-dragging");
    }
    if (dragged) track.scrollLeft = startScroll - dx;
  });

  window.addEventListener("pointerup", () => {
    if (!pointerDown) return;
    pointerDown = false;
    if (!dragged) return;

    // Glide to the nearest card, then turn snapping back on
    const target = Math.round(track.scrollLeft / step()) * step();
    track.scrollTo({ left: target, behavior: "smooth" });
    setTimeout(() => track.classList.remove("is-dragging"), 400);
  });

  // A drag should not count as a click on a card
  track.addEventListener(
    "click",
    (e) => {
      if (dragged) {
        e.stopPropagation();
        e.preventDefault();
        dragged = false;
      }
    },
    true
  );
});
