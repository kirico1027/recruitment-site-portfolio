"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initTopHeader();
  initInterviewSlider();
  initFaqAccordion();
  initEntryModal();
  initCasualModal();
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
  const MAX_CARD_WIDTH = 380; // Figma 1:431 — 1905px カンプ
  const NARROW_MAX_CARD_WIDTH = 200; // 1枚表示時の上限
  const CARD_GAP = 20;
  const STORAGE_KEY = "interviews-active-index";

  const clampIndex = (index) => Math.min(Math.max(0, index), cards.length - 1);

  const savedIndex = sessionStorage.getItem(STORAGE_KEY);
  let activeIndex =
    savedIndex !== null && !Number.isNaN(Number.parseInt(savedIndex, 10))
      ? clampIndex(Number.parseInt(savedIndex, 10))
      : Math.floor((cards.length - 1) / 2);

  const persistActiveIndex = () => {
    sessionStorage.setItem(STORAGE_KEY, String(activeIndex));
  };

  const computeLayout = (containerWidth) => {
    const isFluid = containerWidth <= FLUID_BREAKPOINT;
    const minWidth = isFluid ? FLUID_MIN_CARD_WIDTH : MIN_CARD_WIDTH;

    if (!isFluid) {
      // カード幅 380px を優先（1905px 幅で 3 枚 @ 380px）
      for (let count = 7; count >= 1; count -= 2) {
        const naturalWidth = (containerWidth - (count - 1) * CARD_GAP) / count;
        if (naturalWidth >= MAX_CARD_WIDTH) {
          return {
            visibleCount: count,
            cardWidth: MAX_CARD_WIDTH,
            isFluid,
          };
        }
      }
    }

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

  const getScrollLeftForIndex = (index) => {
    const card = cards[index];
    if (!card) return 0;

    return card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2;
  };

  const scrollToCard = (index, behavior = "auto") => {
    const scrollLeft = getScrollLeftForIndex(index);

    if (behavior === "smooth") {
      track.scrollTo({ left: scrollLeft, behavior: "smooth" });
      return;
    }

    track.scrollLeft = scrollLeft;
  };

  const updateSlider = (behavior = "auto") => {
    applyLayout();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToCard(activeIndex, behavior));
    });
  };

  updateSlider();

  prev.addEventListener("click", () => {
    activeIndex = clampIndex(activeIndex - 1);
    scrollToCard(activeIndex, "smooth");
    persistActiveIndex();
  });

  next.addEventListener("click", () => {
    activeIndex = clampIndex(activeIndex + 1);
    scrollToCard(activeIndex, "smooth");
    persistActiveIndex();
  });

  window.addEventListener("pagehide", persistActiveIndex);

  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;

    applyLayout();
    scrollToCard(activeIndex, "auto");
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
  const closeOpacityDuration = Math.round(duration * 0.6);
  const easing = "cubic-bezier(0.4, 0, 0.2, 1)";

  document.querySelectorAll(".faq-item").forEach((details) => {
    const summary = details.querySelector(".faq-item__question");
    const answer = details.querySelector(".faq-item__answer");
    const inner = details.querySelector(".faq-item__answer-inner");
    if (!summary || !answer || !inner) return;

    details.classList.add("faq-item--js");
    if (details.open) {
      details.classList.add("faq-item--expanded");
    }

    let activeAnimations = [];

    const cancelAnimations = () => {
      activeAnimations.forEach((animation) => animation.cancel());
      activeAnimations = [];
    };

    const resetAnswerStyles = () => {
      answer.style.height = "";
      answer.style.overflow = "";
      inner.style.opacity = "";
    };

    const runAnimations = (animations, onFinish) => {
      cancelAnimations();
      activeAnimations = animations;

      let finishedCount = 0;
      const handleFinish = () => {
        finishedCount += 1;
        if (finishedCount === animations.length) {
          activeAnimations = [];
          onFinish();
        }
      };

      animations.forEach((animation) => {
        animation.onfinish = handleFinish;
      });
    };

    summary.addEventListener("click", (event) => {
      event.preventDefault();
      if (details.dataset.faqAnimating === "true") return;

      if (details.open) {
        details.dataset.faqAnimating = "true";
        details.classList.remove("faq-item--expanded");
        const startHeight = answer.offsetHeight;
        answer.style.overflow = "hidden";
        answer.style.height = `${startHeight}px`;
        inner.style.opacity = "1";

        runAnimations(
          [
            inner.animate([{ opacity: 1 }, { opacity: 0 }], {
              duration: closeOpacityDuration,
              easing,
              fill: "forwards",
            }),
            answer.animate(
              [{ height: `${startHeight}px` }, { height: "0px" }],
              { duration, easing }
            ),
          ],
          () => {
            details.open = false;
            resetAnswerStyles();
            delete details.dataset.faqAnimating;
          }
        );
        return;
      }

      details.open = true;
      details.classList.add("faq-item--expanded");
      details.dataset.faqAnimating = "true";
      const endHeight = inner.offsetHeight;
      answer.style.overflow = "hidden";
      answer.style.height = "0px";
      inner.style.opacity = "0";

      runAnimations(
        [
          answer.animate(
            [{ height: "0px" }, { height: `${endHeight}px` }],
            { duration, easing }
          ),
          inner.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration,
            easing,
            fill: "forwards",
          }),
        ],
        () => {
          resetAnswerStyles();
          delete details.dataset.faqAnimating;
        }
      );
    });
  });
}

const MODAL_PAGE_INERT_SELECTORS = ["main", ".top-header", ".top-footer"];
const MODAL_FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

let modalPageLockCount = 0;

function setModalPageInert(inert) {
  MODAL_PAGE_INERT_SELECTORS.forEach((selector) => {
    document.querySelector(selector)?.toggleAttribute("inert", inert);
  });
}

function lockModalPage() {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty("--entry-modal-scrollbar-width", `${scrollbarWidth}px`);
  document.documentElement.classList.add("entry-modal-open");
  document.body.classList.add("entry-modal-open");
  modalPageLockCount += 1;

  if (modalPageLockCount === 1) {
    setModalPageInert(true);
  }
}

function unlockModalPage() {
  modalPageLockCount = Math.max(0, modalPageLockCount - 1);

  if (modalPageLockCount === 0) {
    document.documentElement.classList.remove("entry-modal-open");
    document.body.classList.remove("entry-modal-open");
    document.documentElement.style.removeProperty("--entry-modal-scrollbar-width");
    setModalPageInert(false);
  }
}

function getModalFocusableElements(modal) {
  return [...modal.querySelectorAll(MODAL_FOCUSABLE_SELECTOR)].filter((element) => {
    if (element.closest("[hidden]")) return false;
    return element.getClientRects().length > 0;
  });
}

function initSlideModal({ modalId, openSelector, closeSelector }) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  const panel = modal.querySelector(".entry-modal__panel");
  const backdrop = modal.querySelector(".entry-modal__backdrop");
  const form = modal.querySelector(".entry-modal__form");
  const success = modal.querySelector(".entry-modal__success");
  const closeButtons = modal.querySelectorAll(closeSelector);
  const openButtons = document.querySelectorAll(openSelector);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const openAnimationDuration = prefersReducedMotion ? 0 : 400;
  const closeAnimationDuration = prefersReducedMotion ? 0 : 300;
  let lastTrigger = null;
  let isClosing = false;
  let closeTimer = null;

  const focusFirstField = () => {
    const firstField = modal.querySelector(".entry-modal__input, .entry-modal__textarea, .entry-modal__select");
    if (firstField) {
      firstField.focus();
      return;
    }
    modal.querySelector(".entry-modal__close")?.focus();
  };

  const resetModal = () => {
    modal.classList.remove("entry-modal--submitted");
    if (success) success.hidden = true;
    form?.reset();
  };

  const finishClose = () => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }

    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    modal.classList.remove("entry-modal--visible", "entry-modal--closing");
    unlockModalPage();
    resetModal();
    lastTrigger?.focus();
    lastTrigger = null;
    isClosing = false;
  };

  const openModal = (trigger) => {
    if (isClosing || !modal.hidden) return;

    lastTrigger = trigger;
    resetModal();
    modal.classList.remove("entry-modal--closing");
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    lockModalPage();

    if (prefersReducedMotion) {
      modal.classList.add("entry-modal--visible");
      focusFirstField();
      return;
    }

    modal.classList.remove("entry-modal--visible");
    void panel?.offsetWidth;
    requestAnimationFrame(() => {
      modal.classList.add("entry-modal--visible");
    });

    panel?.addEventListener(
      "transitionend",
      (event) => {
        if (event.target !== panel || event.propertyName !== "transform") return;
        focusFirstField();
      },
      { once: true }
    );
  };

  const closeModal = () => {
    if (modal.hidden || isClosing) return;

    if (prefersReducedMotion || !panel) {
      finishClose();
      return;
    }

    isClosing = true;
    modal.classList.add("entry-modal--closing");
    modal.classList.remove("entry-modal--visible");

    let panelDone = false;
    let backdropDone = false;

    const tryFinishClose = () => {
      if (panelDone && backdropDone) {
        finishClose();
      }
    };

    const onPanelTransitionEnd = (event) => {
      if (event.target !== panel || event.propertyName !== "transform") return;
      panelDone = true;
      tryFinishClose();
    };

    const onBackdropTransitionEnd = (event) => {
      if (event.target !== backdrop || event.propertyName !== "background-color") return;
      backdropDone = true;
      tryFinishClose();
    };

    panel.addEventListener("transitionend", onPanelTransitionEnd, { once: true });

    if (backdrop) {
      backdrop.addEventListener("transitionend", onBackdropTransitionEnd, { once: true });
    } else {
      backdropDone = true;
    }

    closeTimer = window.setTimeout(() => {
      if (isClosing) finishClose();
    }, closeAnimationDuration + 50);
  };

  const handleModalKeydown = (event) => {
    if (modal.hidden || event.key !== "Tab") return;

    const focusables = getModalFocusableElements(modal);
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  openButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openModal(button);
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  modal.addEventListener("keydown", handleModalKeydown);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    modal.classList.add("entry-modal--submitted");
    if (success) {
      success.hidden = false;
    }
    modal.querySelector(".entry-modal__success-title")?.focus();
  });
}

function initEntryModal() {
  initSlideModal({
    modalId: "entry-modal",
    openSelector: "[data-entry-modal-open]",
    closeSelector: "[data-entry-modal-close]",
  });
}

function initCasualModal() {
  initSlideModal({
    modalId: "casual-modal",
    openSelector: "[data-casual-modal-open]",
    closeSelector: "[data-casual-modal-close]",
  });
}
