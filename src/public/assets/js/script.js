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

  const cards = [...track.querySelectorAll(".interview-card")];
  if (!cards.length) return;

  const FLUID_BREAKPOINT = 1440;
  const MIN_CARD_WIDTH = 260; // 1441px 以上
  const FLUID_MIN_CARD_WIDTH = 200; // 1440px 以下 — 3枚表示を維持（640px 幅まで）
  const MAX_CARD_WIDTH = 380; // Figma 1:431 — 1920px カンプ
  const NARROW_MAX_CARD_WIDTH = 200; // 1枚表示時の上限
  const CARD_GAP = 20;

  let activeIndex = Math.floor((cards.length - 1) / 2);

  const computeLayout = (containerWidth) => {
    const isFluid = containerWidth <= FLUID_BREAKPOINT;
    const minWidth = isFluid ? FLUID_MIN_CARD_WIDTH : MIN_CARD_WIDTH;

    for (let count = 7; count >= 1; count -= 2) {
      const cardWidth = (containerWidth - (count - 1) * CARD_GAP) / count;
      if (cardWidth >= minWidth) {
        const maxWidth = count === 1 ? NARROW_MAX_CARD_WIDTH : MAX_CARD_WIDTH;
        return {
          visibleCount: count,
          cardWidth: Math.round(Math.min(cardWidth, maxWidth)),
          isFluid,
        };
      }
    }

    return {
      visibleCount: 1,
      cardWidth: Math.round(Math.min(containerWidth, NARROW_MAX_CARD_WIDTH)),
      isFluid,
    };
  };

  const applyLayout = () => {
    const layout = computeLayout(slider.offsetWidth);

    slider.classList.toggle("interviews__slider--fluid", layout.isFluid);
    slider.style.setProperty("--interview-card-width", `${layout.cardWidth}px`);
    slider.style.setProperty("--interview-gap", `${CARD_GAP}px`);
    slider.style.setProperty("--interview-visible-count", String(layout.visibleCount));
  };

  const scrollToCard = (index, behavior = "auto") => {
    const card = cards[index];
    if (!card) return;

    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const scrollLeft = cardCenter - track.clientWidth / 2;

    track.scrollTo({ left: scrollLeft, behavior });
  };

  const updateSlider = (behavior = "auto") => {
    applyLayout();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToCard(activeIndex, behavior));
    });
  };

  updateSlider();

  prev.addEventListener("click", () => {
    activeIndex = Math.max(0, activeIndex - 1);
    scrollToCard(activeIndex, "smooth");
  });

  next.addEventListener("click", () => {
    activeIndex = Math.min(cards.length - 1, activeIndex + 1);
    scrollToCard(activeIndex, "smooth");
  });

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(() => updateSlider());
    resizeObserver.observe(slider);
  }

  window.addEventListener("resize", () => updateSlider());
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
