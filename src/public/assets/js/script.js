"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initTopHeader();
  initInterviewSlider();
  initFaqAccordion();
});

function initTopHeader() {
  const header = document.querySelector(".top-header");
  if (!header) return;

  const toggle = header.querySelector(".top-header__menu-toggle");
  const backdrop = header.querySelector(".top-header__backdrop");
  const nav = header.querySelector(".top-header__nav");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    header.classList.toggle("top-header--menu-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (backdrop) backdrop.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  };

  toggle.addEventListener("click", () => {
    setOpen(!header.classList.contains("top-header--menu-open"));
  });

  if (backdrop) {
    backdrop.addEventListener("click", () => setOpen(false));
  }

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

function initInterviewSlider() {
  const slider = document.querySelector(".interviews__slider");
  if (!slider) return;

  const track = slider.querySelector(".interviews__track");
  const prev = slider.querySelector(".interviews__btn--prev");
  const next = slider.querySelector(".interviews__btn--next");
  if (!track || !prev || !next) return;

  const scrollAmount = () => {
    const card = track.querySelector(".interview-card");
    return card ? card.offsetWidth + 20 : 400;
  };

  const setInitialScroll = () => {
    // Figma 1:423 — トラック x=-440 でビューポート左端が 440px 位置
    const offset = Math.min(slider.offsetWidth * 0.2292, 440);
    track.scrollLeft = offset;
  };

  setInitialScroll();

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  });
}

function initFaqAccordion() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const duration = 300;
  const easing = "cubic-bezier(0.4, 0, 0.2, 1)";

  document.querySelectorAll(".faq-item").forEach((details) => {
    const summary = details.querySelector(".faq-item__question");
    const answer = details.querySelector(".faq-item__answer");
    const inner = details.querySelector(".faq-item__answer-inner");
    if (!summary || !answer || !inner) return;

    let activeAnimation = null;

    const resetAnswerStyles = () => {
      answer.style.height = "";
      answer.style.overflow = "";
    };

    summary.addEventListener("click", (event) => {
      event.preventDefault();
      if (details.dataset.faqAnimating === "true") return;

      if (activeAnimation) {
        activeAnimation.cancel();
        activeAnimation = null;
      }

      if (details.open) {
        details.dataset.faqAnimating = "true";
        const startHeight = answer.offsetHeight;
        answer.style.overflow = "hidden";
        answer.style.height = `${startHeight}px`;

        activeAnimation = answer.animate(
          [{ height: `${startHeight}px` }, { height: "0px" }],
          { duration, easing }
        );

        activeAnimation.onfinish = () => {
          activeAnimation = null;
          details.open = false;
          resetAnswerStyles();
          delete details.dataset.faqAnimating;
        };
        return;
      }

      details.open = true;
      details.dataset.faqAnimating = "true";
      const endHeight = inner.offsetHeight;
      answer.style.overflow = "hidden";
      answer.style.height = "0px";

      activeAnimation = answer.animate(
        [{ height: "0px" }, { height: `${endHeight}px` }],
        { duration, easing }
      );

      activeAnimation.onfinish = () => {
        activeAnimation = null;
        resetAnswerStyles();
        delete details.dataset.faqAnimating;
      };
    });
  });
}
