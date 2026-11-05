// Video carousel: preview on hover, YouTube pop-up on click.
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".video-carousel");
  if (!carousel) return;

  const track = carousel.querySelector(".video-carousel-track");
  const cards = carousel.querySelectorAll(".video-card");
  const prevBtn = carousel.querySelector(".prev");
  const nextBtn = carousel.querySelector(".next");
  const modalEl = document.getElementById("videoModal");
  const frame = document.getElementById("videoModalFrame");
  const modalTitle = document.getElementById("videoModalTitle");
  const modal = new bootstrap.Modal(modalEl);
  const canHover = window.matchMedia("(hover: hover)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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
      // Let the pop-up grow out of this card (and shrink back into it).
      // The pop-up is centered, so its origin is the card's offset from the screen center.
      const r = card.getBoundingClientRect();
      const dx = r.left + r.width / 2 - window.innerWidth / 2;
      const dy = r.top + r.height / 2 - window.innerHeight / 2;
      const dialogWidth = Math.min(window.innerWidth - 32, 1140);
      const fromScale = Math.min(Math.max(r.width / dialogWidth, 0.3), 0.9);
      modalEl.style.setProperty("--origin-x", `calc(50% + ${dx}px)`);
      modalEl.style.setProperty("--origin-y", `calc(50% + ${dy}px)`);
      modalEl.style.setProperty("--from-scale", fromScale);

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

  const step = () => cards[0].offsetWidth + 24;
  const maxScroll = () => track.scrollWidth - track.clientWidth;
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const nearestCard = (x) => clamp(Math.round(x / step()) * step(), 0, maxScroll());

  // ---- Spring animation of the scroll position ----
  // Critically damped (no overshoot). Always starts from the current
  // position and speed, so it can be interrupted or redirected at any time.
  const RESPONSE = 0.45; // seconds, lower = snappier
  let spring = null; // { target, velocity, frame, last }

  function stopSpring() {
    if (!spring) return;
    cancelAnimationFrame(spring.frame);
    spring = null;
    track.classList.remove("is-gliding");
  }

  function glideTo(target, velocity = 0) {
    target = clamp(target, 0, maxScroll());
    if (reduceMotion.matches) {
      stopSpring();
      track.scrollLeft = target;
      return;
    }
    // Already moving? Keep its current speed, just change where it goes.
    if (spring) {
      spring.target = target;
      return;
    }
    track.classList.add("is-gliding"); // snapping off while we steer
    spring = { target, velocity, last: performance.now(), x: track.scrollLeft };
    const omega = (2 * Math.PI) / RESPONSE;

    const tick = (now) => {
      const dt = Math.min((now - spring.last) / 1000, 1 / 30);
      spring.last = now;
      const accel = -omega * omega * (spring.x - spring.target) - 2 * omega * spring.velocity;
      spring.velocity += accel * dt;
      spring.x += spring.velocity * dt;
      track.scrollLeft = spring.x;

      if (Math.abs(spring.x - spring.target) < 0.5 && Math.abs(spring.velocity) < 10) {
        track.scrollLeft = spring.target;
        stopSpring();
        return;
      }
      spring.frame = requestAnimationFrame(tick);
    };
    spring.frame = requestAnimationFrame(tick);
  }

  // Where would a flick of this speed come to rest? (Apple's projection)
  const project = (velocity, rate = 0.998) => ((velocity / 1000) * rate) / (1 - rate);

  // Soft edges: the further you pull past the end, the less it follows
  const rubberband = (overshoot, size, c = 0.55) =>
    (overshoot * size * c) / (size + c * Math.abs(overshoot));

  // ---- Arrow buttons ----
  // Repeated clicks stack up: each one moves one card past the current target.
  const arrowTarget = () => (spring ? spring.target : nearestCard(track.scrollLeft));
  prevBtn.addEventListener("click", () => glideTo(nearestCard(arrowTarget() - step())));
  nextBtn.addEventListener("click", () => glideTo(nearestCard(arrowTarget() + step())));

  // Hide an arrow when there is nothing more in that direction
  function updateArrows() {
    prevBtn.disabled = track.scrollLeft <= 1;
    nextBtn.disabled = track.scrollLeft >= maxScroll() - 1;
  }
  track.addEventListener("scroll", updateArrows, { passive: true });
  window.addEventListener("resize", updateArrows);
  updateArrows();

  // Someone scrolls with a trackpad, wheel or finger: let go of the animation
  track.addEventListener("wheel", stopSpring, { passive: true });
  track.addEventListener("touchstart", stopSpring, { passive: true });

  // ---- Drag with the mouse (touch screens already swipe natively) ----
  let startX = 0;
  let startScroll = 0;
  let pointerDown = false;
  let dragged = false;
  let samples = []; // recent { x, t } to measure speed at release
  let rubber = 0;

  track.addEventListener("dragstart", (e) => e.preventDefault());

  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    stopSpring(); // grab it mid-glide, right where it is
    track.style.transition = "none";
    track.style.transform = "";
    rubber = 0;
    pointerDown = true;
    dragged = false;
    startX = e.clientX;
    startScroll = track.scrollLeft;
    samples = [{ x: e.clientX, t: e.timeStamp }];
  });

  window.addEventListener("pointermove", (e) => {
    if (!pointerDown) return;
    const dx = e.clientX - startX;
    if (!dragged && Math.abs(dx) > 5) {
      dragged = true;
      track.classList.add("is-dragging");
      // Keep following the mouse even outside the carousel
      track.setPointerCapture(e.pointerId);
    }
    if (!dragged) return;

    samples.push({ x: e.clientX, t: e.timeStamp });
    while (samples.length > 2 && e.timeStamp - samples[0].t > 100) samples.shift();

    const wanted = startScroll - dx;
    const max = maxScroll();
    const clamped = clamp(wanted, 0, max);
    track.scrollLeft = clamped;
    rubber = rubberband(wanted - clamped, track.clientWidth);
    track.style.transform = rubber ? `translateX(${-rubber}px)` : "";
  });

  function release(e) {
    if (!pointerDown) return;
    pointerDown = false;
    if (!dragged) return;
    track.classList.remove("is-dragging");

    // Spring back from the edge
    if (rubber) {
      track.style.transition = reduceMotion.matches
        ? "none"
        : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
      track.style.transform = "";
      rubber = 0;
    }

    // Mouse speed over the last ~100ms (0 if the mouse stood still)
    let velocity = 0;
    const first = samples[0];
    const last = samples[samples.length - 1];
    if (last && first && last.t > first.t && e.timeStamp - last.t < 80) {
      velocity = -((last.x - first.x) / (last.t - first.t)) * 1000; // px/s of scroll
    }

    // Aim at the card nearest to where the flick would land,
    // and keep the speed the mouse already had.
    const target = nearestCard(track.scrollLeft + project(velocity));
    glideTo(target, velocity);
  }
  window.addEventListener("pointerup", release);
  window.addEventListener("pointercancel", release);

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
