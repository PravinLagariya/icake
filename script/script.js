document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  const heroTrack = document.querySelector(".hero-track");
  const heroPrev = document.querySelector(".hero-arrow-prev");
  const heroNext = document.querySelector(".hero-arrow-next");
  const testTrack = document.getElementById("testiTrack");
  const testiPrev = document.getElementById("testiPrev");
  const testiNext = document.getElementById("testiNext");
  const btop = document.getElementById("bktop");
  const newsForm = document.getElementById("newsForm");
  const newsBtn = document.getElementById("newsBtn");
  const newsInp = document.getElementById("newsInp");
  const burger =
    document.getElementById("burger") || document.querySelector(".burger");
  const mobileNav = document.getElementById("mobileNav");
  const closeMenu =
    document.getElementById("closeMenu") ||
    document.querySelector(".mobile-close");
  const animItems = document.querySelectorAll(".anim");
  const faqItems = document.querySelectorAll(".faq-item");
  const searchBtn = document.querySelector(".icon-btn.search");
  const searchBox = document.querySelector(".search-box");
  const searchInnerBox = document.querySelector(".search-box-inner");
  let slideIndex = 0;

  function updateHeroSlide(index) {
    if (!slides.length) return;
    slideIndex = (index + slides.length) % slides.length;
    if (heroTrack) {
      heroTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
    }
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === slideIndex);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === slideIndex);
    });
  }

  if (slides.length && dots.length) {
    updateHeroSlide(0);
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        updateHeroSlide(Number(dot.dataset.i) || 0);
      });
    });
    heroPrev?.addEventListener("click", () => {
      updateHeroSlide(slideIndex - 1);
    });
    heroNext?.addEventListener("click", () => {
      updateHeroSlide(slideIndex + 1);
    });
  }

  if (burger && mobileNav) {
    burger.addEventListener("click", () => {
      mobileNav.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  }

  if (closeMenu && mobileNav) {
    closeMenu.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      document.body.style.overflow = "";
    });
  }

  document.querySelectorAll(".mobile-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      if (!mobileNav) return;
      mobileNav.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  if (animItems.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("vis");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    animItems.forEach((item) => observer.observe(item));
  }

  function getTrackOffset() {
    if (!testTrack) return 0;
    const transform = getComputedStyle(testTrack).transform;
    if (transform === "none") return 0;
    const match = transform.match(
      /matrix\(([^,]+),[^,]+,[^,]+,[^,]+,([^,]+),([^\)]+)\)/,
    );
    return match ? Math.abs(Number(match[5])) : 0;
  }

  function setTrackOffset(value) {
    if (testTrack) testTrack.style.transform = `translateX(-${value}px)`;
  }

  function testimonialCardWidth() {
    if (!testTrack) return 342;
    const card = testTrack.querySelector(".testi-card");
    return card ? card.clientWidth + 22 : 342;
  }

  testiPrev?.addEventListener("click", () => {
    const offset = Math.max(0, getTrackOffset() - testimonialCardWidth());
    setTrackOffset(offset);
  });

  testiNext?.addEventListener("click", () => {
    if (!testTrack || !testTrack.parentElement) return;
    const maxOffset = Math.max(
      0,
      testTrack.scrollWidth - testTrack.parentElement.clientWidth,
    );
    const offset = Math.min(
      maxOffset,
      getTrackOffset() + testimonialCardWidth(),
    );
    setTrackOffset(offset);
  });

  newsForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!newsBtn || !newsInp) return;
    newsBtn.textContent = "✓ Subscribed!";
    newsBtn.style.background = "var(--green)";
    setTimeout(() => {
      newsBtn.textContent = "Subscribe";
      newsBtn.style.background = "";
      newsInp.value = "";
    }, 3000);
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btop?.classList.add("vis");
    } else {
      btop?.classList.remove("vis");
    }
  });

  btop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  faqItems.forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    if (!q || !a) return;

    if (item.classList.contains("open")) {
      a.style.maxHeight = `${a.scrollHeight}px`;
    }

    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((other) => {
        if (other !== item) {
          other.classList.remove("open");
          const otherAnswer = other.querySelector(".faq-a");
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });
      item.classList.toggle("open", !isOpen);
      a.style.maxHeight = !isOpen ? `${a.scrollHeight}px` : null;
    });
  });

  window.addEventListener("resize", () => {
    document.querySelectorAll(".faq-item.open").forEach((item) => {
      const a = item.querySelector(".faq-a");
      if (a) a.style.maxHeight = `${a.scrollHeight}px`;
    });
  });

  if (searchBtn && searchBox && searchInnerBox) {
    searchBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      searchBox.classList.toggle("active");
      if (searchBox.classList.contains("active")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });

    searchInnerBox.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    document.addEventListener("click", () => {
      searchBox.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  if ("IntersectionObserver" in window) {
    const duration = 2000; // animation duration in ms

    function animateCounter(counter) {
      if (counter.dataset.counted) return;
      counter.dataset.counted = "true";

      const originalText = counter.textContent.trim();
      const match = originalText.match(/[\d,]+/);
      if (!match) return;

      const target = parseInt(match[0].replace(/,/g, ""), 10);
      const prefix = originalText.substring(0, match.index);
      const suffix = originalText.substring(match.index + match[0].length);

      let startTime = null;

      function update(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const current = Math.floor(progress * target);
        counter.textContent = prefix + current + suffix;
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = prefix + target + suffix;
        }
      }

      requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll(
              ".t-txt strong, .t-txt span",
            );
            counters.forEach((counter) => animateCounter(counter));
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );

    document.querySelectorAll(".tbar-g").forEach((section) => {
      observer.observe(section);
    });
  }


    // Set your countdown end date and time here
  const countdownDate = new Date("August 30, 2026 23:59:59").getTime();

  const timer = setInterval(function () {

  const now = new Date().getTime();
  const distance = countdownDate - now;

  // Calculate time
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor(
      (distance % (1000 * 60 * 60)) / (1000 * 60)
  );
  const seconds = Math.floor(
      (distance % (1000 * 60)) / 1000
  );

  // Update HTML
  document.getElementById("cd-days").textContent = days;
  document.getElementById("cd-hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("cd-mins").textContent = String(minutes).padStart(2, "0");
  document.getElementById("cd-secs").textContent = String(seconds).padStart(2, "0");

  // When countdown finishes
  if (distance < 0) {
    clearInterval(timer);

    document.getElementById("cd-days").textContent = "0";
    document.getElementById("cd-hours").textContent = "00";
    document.getElementById("cd-mins").textContent = "00";
    document.getElementById("cd-secs").textContent = "00";
  }

  }, 1000);

});


/* ========== Mobile Accordion Dropdown ========== */
document.querySelectorAll('.mob-dd-toggle').forEach(function(toggle) {
  toggle.addEventListener('click', function() {
    var expanded = this.getAttribute('aria-expanded') === 'true';
    // Close all others
    document.querySelectorAll('.mob-dd-toggle').forEach(function(t) {
      t.setAttribute('aria-expanded', 'false');
      var list = t.nextElementSibling;
      if (list) list.classList.remove('open');
    });
    // Toggle clicked one
    if (!expanded) {
      this.setAttribute('aria-expanded', 'true');
      var list = this.nextElementSibling;
      if (list) list.classList.add('open');
    }
  });
});
