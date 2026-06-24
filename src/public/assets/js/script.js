"use strict";

/**
 * スクロールアニメーション共通の発火位置（以降のセクションもこの値を使う）
 *
 * 発火ライン = 画面下端から SCROLL_REVEAL_OFFSET_BOTTOM_PX 手前の水平線。
 * 要素の SCROLL_REVEAL_VISIBLE_RATIO 以上がそのラインより上に入ったら is-inview。
 */
const SCROLL_REVEAL_VISIBLE_RATIO = 0.1;
const SCROLL_REVEAL_OFFSET_BOTTOM_PX = 80;

const SCROLL_REVEAL = {
  threshold: SCROLL_REVEAL_VISIBLE_RATIO,
  rootMargin: `0px 0px -${SCROLL_REVEAL_OFFSET_BOTTOM_PX}px 0px`,
  inviewClass: "is-inview",
  revealedClass: "is-revealed",
  activeClass: "scroll-reveal-active",
};

function onDocumentReady(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
  } else {
    callback();
  }
}

onDocumentReady(() => {
  initTopHeader();
  initInterviewSlider();
  initFaqAccordion();
  initEntryModal();
  initCasualModal();
  bootScrollReveal();
});

let scrollRevealBooted = false;

function bootScrollReveal() {
  if (scrollRevealBooted) return;

  scrollRevealBooted = true;
  document.documentElement.classList.add(SCROLL_REVEAL.activeClass);

  requestAnimationFrame(() => {
    primeScrollRevealInView();
    initSectionHeadingScrollReveal();
    initJobsScrollReveal();
    initJobsListingIntroReveal();
    initInterviewsScrollReveal();
    initWelfareScrollReveal();
    initBlogScrollReveal();
    initGalleryScrollReveal();
    initFaqScrollReveal();
    initCtaScrollReveal();
  });
}

window.addEventListener("pageshow", () => {
  if (!scrollRevealBooted) {
    bootScrollReveal();
    return;
  }

  primeScrollRevealInView();
  primeJobsListingIfVisible();
});

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function runScrollRevealClassAdd(callback) {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
}

/** ページロード時に1回だけ再生（jobs 一覧 intro 向け） */
function initLoadReveal(targets, beforeReveal, { durationMs = 700 } = {}) {
  const elements = targets
    .filter(Boolean)
    .filter((element) => !element.classList.contains(SCROLL_REVEAL.revealedClass));
  if (elements.length === 0) return;

  elements.forEach((element) => beforeReveal?.(element));

  if (prefersReducedMotion()) {
    elements.forEach((element) => {
      element.classList.add(SCROLL_REVEAL.inviewClass, SCROLL_REVEAL.revealedClass);
    });
    return;
  }

  runScrollRevealClassAdd(() => {
    elements.forEach((element) => {
      element.classList.add(SCROLL_REVEAL.inviewClass);
    });
  });

  elements.forEach((element) => {
    const delay = parseInt(
      element.style.getPropertyValue("--scroll-reveal-stagger-delay") || "0",
      10
    );
    setTimeout(() => {
      element.classList.add(SCROLL_REVEAL.revealedClass);
    }, delay + durationMs);
  });
}

/**
 * 要素が共通の発火位置に入ったら is-inview を付与する。
 * @param {Element[]} targets
 * @param {(element: Element) => void} [beforeReveal]
 */
function initScrollReveal(targets, beforeReveal) {
  const elements = targets
    .filter(Boolean)
    .filter((element) => !element.classList.contains(SCROLL_REVEAL.inviewClass));
  if (elements.length === 0) return;

  const reveal = (element) => {
    beforeReveal?.(element);

    runScrollRevealClassAdd(() => {
      element.classList.add(SCROLL_REVEAL.inviewClass);
    });
  };

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    elements.forEach((element) => {
      beforeReveal?.(element);
      element.classList.add(SCROLL_REVEAL.inviewClass, SCROLL_REVEAL.revealedClass);
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        observer.unobserve(entry.target);
        reveal(entry.target);
      });
    },
    {
      threshold: SCROLL_REVEAL.threshold,
      rootMargin: SCROLL_REVEAL.rootMargin,
    }
  );

  elements.forEach((element) => observer.observe(element));
}

function isScrollRevealIntersecting(target) {
  const rect = target.getBoundingClientRect();
  const rootBottom = window.innerHeight - SCROLL_REVEAL_OFFSET_BOTTOM_PX;

  if (rect.bottom <= 0 || rect.top >= rootBottom) return false;

  const visibleTop = Math.max(rect.top, 0);
  const visibleBottom = Math.min(rect.bottom, rootBottom);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);

  return visibleHeight >= rect.height * SCROLL_REVEAL_VISIBLE_RATIO;
}

function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight;
}

const JOB_CARD_REVEAL_SELECTOR =
  ".job-card__figure, .job-card__head, .job-card__links";
/** document 直下の複合セレクタ用（カンマ結合で祖先条件が外れないよう :is で包む） */
const JOB_CARD_REVEAL_IN_SELECTOR =
  ":is(.job-card__figure, .job-card__head, .job-card__links)";

function primeScrollRevealInView() {
  if (prefersReducedMotion()) return;

  primeJobsSectionIfVisible();
  primeInterviewsScrollRevealIfVisible();
  primeWelfareIfVisible();
  primeBlogSectionIfVisible();
  primeGalleryIfVisible();
  primeFaqIfVisible();
  primeCtaIfVisible();

  const targets = [
    ...document.querySelectorAll(".top-page .section-heading.js-scroll-reveal"),
    ...document.querySelectorAll(
      `.top-page .jobs.js-scroll-reveal ${JOB_CARD_REVEAL_IN_SELECTOR}`
    ),
    ...document.querySelectorAll(".welfare-item.js-scroll-reveal"),
    ...document.querySelectorAll(
      `.top-page .blog.js-scroll-reveal :is(.blog-card__figure, .blog-card__body)`
    ),
    ...document.querySelectorAll(GALLERY_ITEM_SELECTOR),
    ...document.querySelectorAll(FAQ_ITEM_SELECTOR),
    ...document.querySelectorAll(CTA_BLOCK_SELECTOR),
  ];

  targets.forEach((target) => {
    if (target.classList.contains(SCROLL_REVEAL.inviewClass)) return;
    if (!isScrollRevealIntersecting(target)) return;

    target.classList.add(SCROLL_REVEAL.inviewClass, SCROLL_REVEAL.revealedClass);
  });
}

function primeJobsSectionIfVisible() {
  const section = document.querySelector(".top-page .jobs.js-scroll-reveal");
  if (!section) return;

  section
    .querySelectorAll(`.section-heading.js-scroll-reveal, ${JOB_CARD_REVEAL_SELECTOR}`)
    .forEach((element) => {
      if (element.classList.contains(SCROLL_REVEAL.inviewClass)) return;
      if (!isScrollRevealIntersecting(element)) return;

      element.classList.add(SCROLL_REVEAL.inviewClass, SCROLL_REVEAL.revealedClass);
    });
}

function initSectionHeadingScrollReveal() {
  const headings = [...document.querySelectorAll(".top-page .section-heading.js-scroll-reveal")].filter(
    (heading) => !heading.closest(".jobs.js-scroll-reveal")
  );
  initScrollReveal(headings);
}

const JOBS_STAGGER_STEP_MS = 120;
const JOBS_LISTING_INTRO_SELECTOR =
  ".jobs-page .jobs-intro__title.js-load-reveal, .jobs-page .jobs-intro__text.js-load-reveal";
const JOBS_LISTING_INTRO_TEXT_DELAY_MS = 80;

function getJobsGridColumns(section) {
  if (section?.classList.contains("jobs--listing")) {
    if (window.matchMedia("(max-width: 768px)").matches) return 1;
    return 2;
  }

  if (window.matchMedia("(max-width: 768px)").matches) return 1;
  if (window.matchMedia("(max-width: 1400px)").matches) return 2;
  return 3;
}

function initJobsScrollReveal() {
  document.querySelectorAll(".jobs.js-scroll-reveal").forEach((section) => {
    const heading = section.querySelector(".section-heading.js-scroll-reveal");
    const cards = [...section.querySelectorAll(".job-card")];
    const parts = [...section.querySelectorAll(JOB_CARD_REVEAL_SELECTOR)];

    const setStagger = (target) => {
      const card = target.closest(".job-card");
      if (!card) return;

      const index = cards.indexOf(card);
      const columns = getJobsGridColumns(section);
      const staggerDelay =
        columns === 1
          ? 0
          : columns === 2
            ? Math.floor(index / columns) * JOBS_STAGGER_STEP_MS
            : (index % columns) * JOBS_STAGGER_STEP_MS;

      target.style.setProperty("--scroll-reveal-stagger-delay", `${staggerDelay}ms`);
    };

    if (section.classList.contains("jobs--listing")) {
      if (parts.length === 0) return;

      const pendingParts = parts.filter(
        (part) => !part.classList.contains(SCROLL_REVEAL.inviewClass)
      );
      const visibleParts = [];
      const scrollParts = [];

      pendingParts.forEach((part) => {
        if (isElementInViewport(part)) {
          visibleParts.push(part);
        } else {
          scrollParts.push(part);
        }
      });

      initScrollReveal(scrollParts, setStagger);

      runScrollRevealClassAdd(() => {
        visibleParts.forEach((part) => {
          setStagger(part);
          part.classList.add(SCROLL_REVEAL.inviewClass);
        });
      });
      return;
    }

    const targets = heading ? [heading, ...parts] : parts;
    if (targets.length === 0) return;

    initScrollReveal(targets, setStagger);
  });
}

function initJobsListingIntroReveal() {
  if (!document.body.classList.contains("jobs-page")) return;

  const targets = [...document.querySelectorAll(JOBS_LISTING_INTRO_SELECTOR)];
  initLoadReveal(targets, (target) => {
    if (!target.classList.contains("jobs-intro__text")) return;

    target.style.setProperty(
      "--scroll-reveal-stagger-delay",
      `${JOBS_LISTING_INTRO_TEXT_DELAY_MS}ms`
    );
  });
}

function primeJobsListingIfVisible() {
  if (!document.body.classList.contains("jobs-page")) return;

  document.querySelectorAll(JOBS_LISTING_INTRO_SELECTOR).forEach((element) => {
    if (element.classList.contains(SCROLL_REVEAL.inviewClass)) return;
    if (!isScrollRevealIntersecting(element)) return;

    element.classList.add(SCROLL_REVEAL.inviewClass, SCROLL_REVEAL.revealedClass);
  });
}

const WELFARE_ITEM_SELECTOR = ".welfare-item.js-scroll-reveal";
const WELFARE_STAGGER_STEP_MS = 80;

function getWelfareGridColumns() {
  if (window.matchMedia("(max-width: 500px)").matches) return 1;
  if (window.matchMedia("(max-width: 768px)").matches) return 2;
  if (window.matchMedia("(max-width: 1400px)").matches) return 3;
  return 4;
}

function initWelfareScrollReveal() {
  const items = [...document.querySelectorAll(WELFARE_ITEM_SELECTOR)];
  initScrollReveal(items, (target) => {
    const index = items.indexOf(target);
    const columns = getWelfareGridColumns();
    const staggerDelay =
      columns === 1 ? 0 : (index % columns) * WELFARE_STAGGER_STEP_MS;

    target.style.setProperty("--scroll-reveal-stagger-delay", `${staggerDelay}ms`);
  });
}

function primeWelfareIfVisible() {
  document.querySelectorAll(WELFARE_ITEM_SELECTOR).forEach((element) => {
    if (element.classList.contains(SCROLL_REVEAL.inviewClass)) return;
    if (!isScrollRevealIntersecting(element)) return;

    element.classList.add(SCROLL_REVEAL.inviewClass, SCROLL_REVEAL.revealedClass);
  });
}

const BLOG_CARD_REVEAL_SELECTOR = ".blog-card__figure, .blog-card__body";
const BLOG_STAGGER_STEP_MS = 120;

function getBlogGridColumns() {
  if (window.matchMedia("(max-width: 768px)").matches) return 1;
  if (window.matchMedia("(max-width: 1400px)").matches) return 2;
  return 3;
}

function initBlogScrollReveal() {
  const section = document.querySelector(".top-page .blog.js-scroll-reveal");
  if (!section) return;

  const cards = [...section.querySelectorAll(".blog-card")];
  const parts = [...section.querySelectorAll(BLOG_CARD_REVEAL_SELECTOR)];

  initScrollReveal(parts, (target) => {
    const card = target.closest(".blog-card");
    if (!card) return;

    const index = cards.indexOf(card);
    const columns = getBlogGridColumns();
    const staggerDelay =
      columns === 1 ? 0 : (index % columns) * BLOG_STAGGER_STEP_MS;

    target.style.setProperty("--scroll-reveal-stagger-delay", `${staggerDelay}ms`);
  });
}

function primeBlogSectionIfVisible() {
  const section = document.querySelector(".top-page .blog.js-scroll-reveal");
  if (!section) return;

  section.querySelectorAll(BLOG_CARD_REVEAL_SELECTOR).forEach((element) => {
    if (element.classList.contains(SCROLL_REVEAL.inviewClass)) return;
    if (!isScrollRevealIntersecting(element)) return;

    element.classList.add(SCROLL_REVEAL.inviewClass, SCROLL_REVEAL.revealedClass);
  });
}

const GALLERY_ITEM_SELECTOR = ".top-page .gallery__item.js-scroll-reveal";
const GALLERY_ROW_STAGGER_MS = 80;
const GALLERY_COL_STAGGER_MS = 40;

function getGalleryGridColumns() {
  if (window.matchMedia("(max-width: 768px)").matches) return 2;
  return 3;
}

function getGalleryStaggerDelay(index, columns) {
  const row = Math.floor(index / columns);
  const col = index % columns;
  return row * GALLERY_ROW_STAGGER_MS + col * GALLERY_COL_STAGGER_MS;
}

function initGalleryScrollReveal() {
  const items = [...document.querySelectorAll(GALLERY_ITEM_SELECTOR)];
  initScrollReveal(items, (target) => {
    const index = items.indexOf(target);
    const columns = getGalleryGridColumns();
    const staggerDelay = getGalleryStaggerDelay(index, columns);

    target.style.setProperty("--scroll-reveal-stagger-delay", `${staggerDelay}ms`);
  });
}

function primeGalleryIfVisible() {
  document.querySelectorAll(GALLERY_ITEM_SELECTOR).forEach((element) => {
    if (element.classList.contains(SCROLL_REVEAL.inviewClass)) return;
    if (!isScrollRevealIntersecting(element)) return;

    element.classList.add(SCROLL_REVEAL.inviewClass, SCROLL_REVEAL.revealedClass);
  });
}

const FAQ_ITEM_SELECTOR = ".top-page .faq-item.js-scroll-reveal";
const FAQ_STAGGER_STEP_MS = 80;

function initFaqScrollReveal() {
  const items = [...document.querySelectorAll(FAQ_ITEM_SELECTOR)];
  initScrollReveal(items, (target) => {
    const index = items.indexOf(target);
    target.style.setProperty(
      "--scroll-reveal-stagger-delay",
      `${index * FAQ_STAGGER_STEP_MS}ms`
    );
  });
}

function primeFaqIfVisible() {
  document.querySelectorAll(FAQ_ITEM_SELECTOR).forEach((element) => {
    if (element.classList.contains(SCROLL_REVEAL.inviewClass)) return;
    if (!isScrollRevealIntersecting(element)) return;

    element.classList.add(SCROLL_REVEAL.inviewClass, SCROLL_REVEAL.revealedClass);
  });
}

const CTA_BLOCK_SELECTOR = ".top-page .top-cta__block.js-scroll-reveal";
const CTA_STAGGER_STEP_MS = 120;

function initCtaScrollReveal() {
  const blocks = [...document.querySelectorAll(CTA_BLOCK_SELECTOR)];
  initScrollReveal(blocks, (target) => {
    const index = blocks.indexOf(target);
    target.style.setProperty(
      "--scroll-reveal-stagger-delay",
      `${index * CTA_STAGGER_STEP_MS}ms`
    );
  });
}

function primeCtaIfVisible() {
  document.querySelectorAll(CTA_BLOCK_SELECTOR).forEach((element) => {
    if (element.classList.contains(SCROLL_REVEAL.inviewClass)) return;
    if (!isScrollRevealIntersecting(element)) return;

    element.classList.add(SCROLL_REVEAL.inviewClass, SCROLL_REVEAL.revealedClass);
  });
}

const INTERVIEW_TRACK_SELECTOR = ".interviews__track.js-scroll-reveal";
const INTERVIEW_CONTROLS_SELECTOR = ".interviews__controls.js-scroll-reveal";

function getInterviewSlider() {
  return document.querySelector(".interviews__slider");
}

function getVisibleInterviewCardIndices(activeIndex, visibleCount, total) {
  const half = Math.floor(visibleCount / 2);
  let start = activeIndex - half;
  let end = start + visibleCount - 1;

  if (start < 0) {
    end += -start;
    start = 0;
  }
  if (end >= total) {
    start -= end - (total - 1);
    end = total - 1;
  }
  start = Math.max(0, start);

  const indices = [];
  for (let index = start; index <= end && indices.length < visibleCount; index += 1) {
    indices.push(index);
  }

  return indices;
}

function prepareInterviewRevealTargets(slider) {
  const api = slider.__interviewSlider;
  if (!api) return;

  const { cards, activeIndex, visibleCount } = api.getRevealState();
  const indices = getVisibleInterviewCardIndices(activeIndex, visibleCount, cards.length);

  indices.forEach((cardIndex) => {
    cards[cardIndex].classList.add("is-reveal-target");
  });
}

function primeInterviewScrollRevealTarget(target, { skipAnimation = false } = {}) {
  if (!target || target.classList.contains(SCROLL_REVEAL.inviewClass)) return;
  if (!isScrollRevealIntersecting(target)) return;

  target.classList.add(SCROLL_REVEAL.inviewClass);
  if (skipAnimation) {
    target.classList.add(SCROLL_REVEAL.revealedClass);
  }
}

function primeInterviewsScrollRevealIfVisible() {
  const slider = getInterviewSlider();
  if (!slider) return;

  prepareInterviewRevealTargets(slider);

  primeInterviewScrollRevealTarget(slider.querySelector(INTERVIEW_TRACK_SELECTOR), {
    skipAnimation: true,
  });
  primeInterviewScrollRevealTarget(slider.querySelector(INTERVIEW_CONTROLS_SELECTOR), {
    skipAnimation: true,
  });
}

function initInterviewsScrollReveal() {
  const slider = getInterviewSlider();
  if (!slider) return;

  const track = slider.querySelector(INTERVIEW_TRACK_SELECTOR);
  const controls = slider.querySelector(INTERVIEW_CONTROLS_SELECTOR);
  if (!track || !controls) return;

  prepareInterviewRevealTargets(slider);

  const targets = [track, controls].filter(
    (target) => !target.classList.contains(SCROLL_REVEAL.inviewClass)
  );
  if (targets.length === 0) return;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    targets.forEach((target) => {
      target.classList.add(SCROLL_REVEAL.inviewClass, SCROLL_REVEAL.revealedClass);
    });
    return;
  }

  initScrollReveal(targets);
}

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

  slider.__interviewSlider = {
    getRevealState: () => {
      const visibleCount = Number.parseInt(
        slider.style.getPropertyValue("--interview-visible-count") || "3",
        10
      );

      return { cards, activeIndex, visibleCount };
    },
  };
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
