(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------------------------------------------------
     Header: solid background after scrolling past hero
     -------------------------------------------------------------------- */
  var header = document.querySelector(".site-header");
  if (header && !document.body.classList.contains("page--interior")) {
    var onScroll = function () {
      if (window.scrollY > 60) {
        header.classList.add("is-solid");
      } else {
        header.classList.remove("is-solid");
      }
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --------------------------------------------------------------------
     Mobile navigation
     -------------------------------------------------------------------- */
  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  var mobileNavClose = document.querySelector(".mobile-nav-close");

  function openMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    var firstLink = mobileNav.querySelector("a");
    if (firstLink) firstLink.focus();
  }
  function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    navToggle.focus();
  }
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.contains("is-open");
      isOpen ? closeMobileNav() : openMobileNav();
    });
    if (mobileNavClose) mobileNavClose.addEventListener("click", closeMobileNav);
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileNav.classList.contains("is-open")) closeMobileNav();
    });
  }

  /* --------------------------------------------------------------------
     Horizontal scrollers with prev/next buttons (dishes, reviews)
     -------------------------------------------------------------------- */
  document.querySelectorAll("[data-scroller]").forEach(function (wrapper) {
    var track = wrapper.querySelector("[data-scroller-track]");
    var prevBtn = wrapper.querySelector("[data-scroller-prev]");
    var nextBtn = wrapper.querySelector("[data-scroller-next]");
    if (!track) return;

    function scrollByAmount(dir) {
      var card = track.querySelector(":scope > *");
      var amount = card ? card.getBoundingClientRect().width + 20 : 300;
      track.scrollBy({ left: dir * amount, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
    if (prevBtn) prevBtn.addEventListener("click", function () { scrollByAmount(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { scrollByAmount(1); });

    function updateButtons() {
      if (!prevBtn || !nextBtn) return;
      var max = track.scrollWidth - track.clientWidth - 4;
      prevBtn.disabled = track.scrollLeft <= 4;
      nextBtn.disabled = track.scrollLeft >= max;
    }
    track.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    updateButtons();
  });

  /* --------------------------------------------------------------------
     Reviews deck: click the front card to send it to the back of the
     stack and reveal the next one; loops forever. Keyboard-operable and
     keeps only the top card exposed to assistive tech.
     -------------------------------------------------------------------- */
  var reviewDeck = document.querySelector(".review-deck");
  if (reviewDeck) {
    var reviewCards = Array.prototype.slice.call(reviewDeck.querySelectorAll(".review-card"));

    function layoutDeck() {
      reviewCards.forEach(function (card, i) {
        if (i === 0) {
          card.setAttribute("data-stack", "0");
          card.removeAttribute("aria-hidden");
          card.setAttribute("tabindex", "0");
        } else if (i === 1) {
          card.setAttribute("data-stack", "1");
          card.setAttribute("aria-hidden", "true");
          card.removeAttribute("tabindex");
        } else if (i === 2) {
          card.setAttribute("data-stack", "2");
          card.setAttribute("aria-hidden", "true");
          card.removeAttribute("tabindex");
        } else {
          card.setAttribute("data-stack", "hidden");
          card.setAttribute("aria-hidden", "true");
          card.removeAttribute("tabindex");
        }
      });
    }

    function advanceDeck() {
      var front = reviewCards[0];
      if (!front) return;
      if (prefersReducedMotion) {
        reviewCards.push(reviewCards.shift());
        layoutDeck();
        return;
      }
      front.classList.add("is-leaving");
      setTimeout(function () {
        front.classList.remove("is-leaving");
        reviewCards.push(reviewCards.shift());
        layoutDeck();
      }, 450);
    }

    reviewCards.forEach(function (card) {
      card.addEventListener("click", function () {
        if (card.getAttribute("data-stack") === "0") advanceDeck();
      });
      card.addEventListener("keydown", function (e) {
        if ((e.key === "Enter" || e.key === " ") && card.getAttribute("data-stack") === "0") {
          e.preventDefault();
          advanceDeck();
        }
      });
    });

    layoutDeck();
  }

  /* --------------------------------------------------------------------
     Reservation form: lightweight client-side validation + feedback
     -------------------------------------------------------------------- */
  var reserveForm = document.querySelector("#reserve-form");
  if (reserveForm) {
    var feedback = reserveForm.querySelector(".form-feedback");

    function setError(field, message) {
      var wrapper = field.closest(".field");
      if (!wrapper) return;
      wrapper.classList.add("has-error");
      var errEl = wrapper.querySelector(".field-error");
      if (errEl) errEl.querySelector("span") && (errEl.querySelector("span").textContent = message);
      field.setAttribute("aria-invalid", "true");
    }
    function clearError(field) {
      var wrapper = field.closest(".field");
      if (!wrapper) return;
      wrapper.classList.remove("has-error");
      field.removeAttribute("aria-invalid");
    }

    reserveForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var required = reserveForm.querySelectorAll("[required]");
      var firstInvalid = null;
      required.forEach(function (field) {
        var valid = field.value && field.value.trim() !== "";
        if (field.type === "email" && valid) {
          valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
        }
        if (!valid) {
          setError(field, field.dataset.errorMessage || "Campo obbligatorio.");
          if (!firstInvalid) firstInvalid = field;
        } else {
          clearError(field);
        }
      });

      if (firstInvalid) {
        firstInvalid.focus();
        if (feedback) feedback.classList.remove("is-visible");
        return;
      }

      var submitBtn = reserveForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.textContent = "Invio in corso...";
      }

      setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.originalText;
        }
        if (feedback) feedback.classList.add("is-visible");
        reserveForm.reset();
      }, 900);
    });

    reserveForm.querySelectorAll("[required]").forEach(function (field) {
      field.addEventListener("blur", function () {
        if (field.value && field.value.trim() !== "") clearError(field);
      });
    });
  }

  /* --------------------------------------------------------------------
     Menu page: category tabs
     -------------------------------------------------------------------- */
  var menuTabs = document.querySelectorAll("[data-menu-tab]");
  if (menuTabs.length) {
    menuTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        menuTabs.forEach(function (t) { t.setAttribute("aria-selected", "false"); });
        tab.setAttribute("aria-selected", "true");
        var targetId = tab.getAttribute("data-menu-tab");
        var target = document.getElementById(targetId);
        if (target) {
          var y = target.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) + 24);
          window.scrollTo({ top: y, behavior: prefersReducedMotion ? "auto" : "smooth" });
        }
      });
    });
  }

  /* --------------------------------------------------------------------
     Deep link: menu.html#dish-xxx -> scroll to item (accounting for the
     fixed header) and flash a highlight. Done explicitly in JS rather
     than relying on native fragment scrolling, which some browsers only
     run once on the very first paint and skip on soft navigations.
     -------------------------------------------------------------------- */
  if (window.location.hash) {
    var hashTarget = null;
    try { hashTarget = document.querySelector(window.location.hash); } catch (err) { hashTarget = null; }
    if (hashTarget && hashTarget.classList.contains("menu-item")) {
      var headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) || 84;
      var scrollToTarget = function () {
        var y = hashTarget.getBoundingClientRect().top + window.scrollY - (headerOffset + 24);
        window.scrollTo({ top: y, behavior: "auto" });
      };
      window.requestAnimationFrame(function () { window.requestAnimationFrame(scrollToTarget); });
      hashTarget.classList.add("is-highlighted");
      setTimeout(function () { hashTarget.classList.remove("is-highlighted"); }, 3000);
    }
  }

  /* --------------------------------------------------------------------
     FAQ accordion: keep only one answer open at a time
     -------------------------------------------------------------------- */
  var faqItems = document.querySelectorAll(".faq-item");
  if (faqItems.length) {
    faqItems.forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (item.open) {
          faqItems.forEach(function (other) {
            if (other !== item) other.open = false;
          });
        }
      });
    });
  }

  /* --------------------------------------------------------------------
     Gallery filters
     -------------------------------------------------------------------- */
  var galleryFilters = document.querySelectorAll("[data-gallery-filter]");
  var galleryItems = document.querySelectorAll("[data-gallery-item]");
  if (galleryFilters.length && galleryItems.length) {
    galleryFilters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        galleryFilters.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        var filter = btn.getAttribute("data-gallery-filter");
        galleryItems.forEach(function (item) {
          var match = filter === "tutti" || item.getAttribute("data-category") === filter;
          item.hidden = !match;
        });
      });
    });
  }

  /* --------------------------------------------------------------------
     Gallery lightbox
     -------------------------------------------------------------------- */
  var lightbox = document.querySelector("[data-lightbox]");
  if (lightbox && galleryItems.length) {
    var lightboxImg = lightbox.querySelector("[data-lightbox-img]");
    var lightboxCaption = lightbox.querySelector(".lightbox-caption");
    var visibleItems = Array.prototype.slice.call(galleryItems);
    var currentIndex = 0;
    var lastFocused = null;

    function renderLightbox(index) {
      currentIndex = (index + visibleItems.length) % visibleItems.length;
      var item = visibleItems[currentIndex];
      var img = item.querySelector("img");
      var overlay = item.querySelector(".gallery-item-overlay");
      var caption = overlay ? overlay.textContent.trim() : (img ? img.alt : "");
      if (lightboxImg && img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
      }
      if (lightboxCaption) lightboxCaption.textContent = caption;
    }
    function openLightbox(index) {
      lastFocused = document.activeElement;
      renderLightbox(index);
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
      var closeBtn = lightbox.querySelector(".lightbox-close");
      if (closeBtn) closeBtn.focus();
    }
    function closeLightbox() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }
    galleryItems.forEach(function (item, index) {
      item.addEventListener("click", function () { openLightbox(index); });
    });
    var closeEl = lightbox.querySelector(".lightbox-close");
    var prevEl = lightbox.querySelector(".lightbox-prev");
    var nextEl = lightbox.querySelector(".lightbox-next");
    if (closeEl) closeEl.addEventListener("click", closeLightbox);
    if (prevEl) prevEl.addEventListener("click", function () { renderLightbox(currentIndex - 1); });
    if (nextEl) nextEl.addEventListener("click", function () { renderLightbox(currentIndex + 1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") renderLightbox(currentIndex + 1);
      if (e.key === "ArrowLeft") renderLightbox(currentIndex - 1);
    });
  }

  /* --------------------------------------------------------------------
     Section headings: subtle reveal-from-above as they scroll into view.
     The class is added only here, so without JS headings stay visible.
     -------------------------------------------------------------------- */
  var revealTargets = document.querySelectorAll("h2");
  if (revealTargets.length && "IntersectionObserver" in window) {
    revealTargets.forEach(function (el) { el.classList.add("reveal-down"); });
    if (prefersReducedMotion) {
      revealTargets.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var headingObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            headingObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
      revealTargets.forEach(function (el) { headingObserver.observe(el); });
    }
  }

  /* --------------------------------------------------------------------
     Cursor glow: leggera sfumatura premium che segue il mouse, solo su
     dispositivi con puntatore fine e senza preferenza di riduzione moto.
     -------------------------------------------------------------------- */
  if (!prefersReducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var cursorGlow = document.createElement("div");
    cursorGlow.className = "cursor-glow";
    cursorGlow.setAttribute("aria-hidden", "true");
    document.body.appendChild(cursorGlow);

    var glowX = 0, glowY = 0, glowTicking = false;
    function updateGlow() {
      cursorGlow.style.transform = "translate3d(" + glowX + "px," + glowY + "px,0)";
      glowTicking = false;
    }
    document.addEventListener("mousemove", function (e) {
      glowX = e.clientX;
      glowY = e.clientY;
      cursorGlow.classList.add("is-active");
      if (!glowTicking) {
        window.requestAnimationFrame(updateGlow);
        glowTicking = true;
      }
    }, { passive: true });
    document.addEventListener("mouseleave", function () {
      cursorGlow.classList.remove("is-active");
    });
  }

  /* --------------------------------------------------------------------
     Footer year
     -------------------------------------------------------------------- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
