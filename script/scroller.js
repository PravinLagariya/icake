document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Category scroller ---------- */
  const track = document.getElementById("catTrack");
  const leftBtn = document.getElementById("catLeft");
  const rightBtn = document.getElementById("catRight");
  const leftFade = document.getElementById("leftFade");

  // Elements exist?
  if (!track || !leftBtn || !rightBtn || !leftFade) return;

  function updateArrows() {
    const max = track.scrollWidth - track.clientWidth - 4;

    leftBtn.classList.toggle("show", track.scrollLeft > 8);
    leftFade.classList.toggle("show", track.scrollLeft > 8);
    rightBtn.classList.toggle("hide", track.scrollLeft >= max);
  }

  track.addEventListener("scroll", updateArrows);
  window.addEventListener("resize", updateArrows);
  updateArrows();

  // Arrow buttons
  rightBtn.addEventListener("click", () => {
    track.scrollBy({
      left: track.clientWidth * 0.7,
      behavior: "smooth",
    });
  });

  leftBtn.addEventListener("click", () => {
    track.scrollBy({
      left: -track.clientWidth * 0.7,
      behavior: "smooth",
    });
  });

  // Click to select
  track.querySelectorAll(".cat-item").forEach((item) => {
    item.addEventListener("click", () => {
      track
        .querySelectorAll(".cat-item")
        .forEach((i) => i.classList.remove("active"));

      item.classList.add("active");
    });
  });

  // Desktop mouse drag
  let isDown = false;
  let startX = 0;
  let scrollStart = 0;

  track.addEventListener("mousedown", (e) => {
    isDown = true;
    track.classList.add("dragging");
    startX = e.pageX;
    scrollStart = track.scrollLeft;
  });

  window.addEventListener("mouseup", () => {
    isDown = false;
    track.classList.remove("dragging");
  });

  track.addEventListener("mouseleave", () => {
    isDown = false;
    track.classList.remove("dragging");
  });

  track.addEventListener("mousemove", (e) => {
    if (!isDown) return;

    e.preventDefault();
    track.scrollLeft = scrollStart - (e.pageX - startX);
  });
});
