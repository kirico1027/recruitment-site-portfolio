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
    initDesignerScrollReveal();
    initDesignerIntroReveal();
    initDesignerUxScrollReveal();
    initDesignerUxIntroReveal();
    initCompanyScrollReveal();
    initCompanyIntroReveal();
    initBlogPageScrollReveal();
    initBlogPageIntroReveal();
    initBlogCategoryScrollReveal();
    initBlogCategoryIntroReveal();
    initBlogArticleScrollReveal();
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
  primeDesignerIntroIfVisible();
  primeDesignerBlogIfVisible();
  primeDesignerUxIntroIfVisible();
  primeCompanyIntroIfVisible();
  primeCompanyScrollRevealIfVisible();
  primeBlogPageIntroIfVisible();
  primeBlogPageScrollRevealIfVisible();
  primeBlogCategoryIntroIfVisible();
  primeBlogCategoryScrollRevealIfVisible();
  primeBlogArticleScrollRevealIfVisible();
  primeCtaIfVisible();
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

/**
 * jobs 一覧と同型。画面内の要素は is-inview のみ付与しアニメーションを再生する。
 */
function initScrollRevealAnimateVisible(targets, beforeReveal) {
  const pending = targets.filter(
    (element) => !element.classList.contains(SCROLL_REVEAL.inviewClass)
  );
  const visible = [];
  const scroll = [];

  pending.forEach((element) => {
    if (isElementInViewport(element)) {
      visible.push(element);
    } else {
      scroll.push(element);
    }
  });

  initScrollReveal(scroll, beforeReveal);

  runScrollRevealClassAdd(() => {
    visible.forEach((element) => {
      beforeReveal?.(element);
      element.classList.add(SCROLL_REVEAL.inviewClass);
    });
  });
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
  primeDesignerBlogIfVisible();

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
  const headings = [
    ...document.querySelectorAll(".top-page .section-heading.js-scroll-reveal"),
    ...document.querySelectorAll(DESIGNER_BLOG_HEAD_SELECTOR),
  ].filter((heading) => !heading.closest(".jobs.js-scroll-reveal"));
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

      initScrollRevealAnimateVisible(parts, setStagger);
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

const DESIGNER_INTRO_SELECTOR =
  ".designer-page .designer-intro__title.js-load-reveal, .designer-page .designer-intro__text.js-load-reveal";
const DESIGNER_INTRO_TEXT_DELAY_MS = 80;
const DESIGNER_DETAIL_SELECTOR = ".designer-page .designer-detail.js-scroll-reveal";
const DESIGNER_DETAIL_CONTENT_REVEAL_SELECTOR = [
  ".designer-hero__figure",
  ".designer-skill",
  ".designer-description__text",
  ".designer-positions__item",
].join(", ");
const DESIGNER_BLOG_HEAD_SELECTOR =
  ".designer-page .designer-detail.js-scroll-reveal .designer-blog__head.section-heading.js-scroll-reveal";
const DESIGNER_BLOG_CARD_PARTS_SELECTOR =
  ".designer-page .designer-detail.js-scroll-reveal .designer-blog .blog-card__figure, .designer-page .designer-detail.js-scroll-reveal .designer-blog .blog-card__body";
const DESIGNER_SKILL_STAGGER_MS = 120;
const DESIGNER_DESCRIPTION_STAGGER_MS = 80;
const DESIGNER_POSITION_STAGGER_MS = 100;

function initDesignerIntroReveal() {
  if (!document.body.classList.contains("designer-page")) return;

  const targets = [...document.querySelectorAll(DESIGNER_INTRO_SELECTOR)];
  initLoadReveal(targets, (target) => {
    if (!target.classList.contains("designer-intro__text")) return;

    target.style.setProperty(
      "--scroll-reveal-stagger-delay",
      `${DESIGNER_INTRO_TEXT_DELAY_MS}ms`
    );
  });
}

function primeDesignerIntroIfVisible() {
  if (!document.body.classList.contains("designer-page")) return;

  document.querySelectorAll(DESIGNER_INTRO_SELECTOR).forEach((element) => {
    if (element.classList.contains(SCROLL_REVEAL.inviewClass)) return;
    if (!isScrollRevealIntersecting(element)) return;

    element.classList.add(SCROLL_REVEAL.inviewClass, SCROLL_REVEAL.revealedClass);
  });
}

function primeDesignerBlogIfVisible() {
  if (!document.body.classList.contains("designer-page")) return;

  document
    .querySelectorAll(`${DESIGNER_BLOG_HEAD_SELECTOR}, ${DESIGNER_BLOG_CARD_PARTS_SELECTOR}`)
    .forEach((element) => {
      if (element.classList.contains(SCROLL_REVEAL.inviewClass)) return;
      if (!isScrollRevealIntersecting(element)) return;

      element.classList.add(SCROLL_REVEAL.inviewClass, SCROLL_REVEAL.revealedClass);
    });
}

function setDesignerDetailStagger(section, target) {
  if (target.matches(".designer-hero__figure, .designer-blog__head.section-heading")) return;

  if (target.matches(".designer-skill")) {
    const items = [...section.querySelectorAll(".designer-skill")];
    target.style.setProperty(
      "--scroll-reveal-stagger-delay",
      `${items.indexOf(target) * DESIGNER_SKILL_STAGGER_MS}ms`
    );
    return;
  }

  if (target.matches(".designer-description__text")) {
    const items = [...section.querySelectorAll(".designer-description__text")];
    target.style.setProperty(
      "--scroll-reveal-stagger-delay",
      `${items.indexOf(target) * DESIGNER_DESCRIPTION_STAGGER_MS}ms`
    );
    return;
  }

  if (target.matches(".designer-positions__item")) {
    const items = [...section.querySelectorAll(".designer-positions__item")];
    target.style.setProperty(
      "--scroll-reveal-stagger-delay",
      `${items.indexOf(target) * DESIGNER_POSITION_STAGGER_MS}ms`
    );
    return;
  }

  if (!target.matches(".blog-card__figure, .blog-card__body")) return;

  const cards = [...section.querySelectorAll(".designer-blog .blog-card")];
  const card = target.closest(".blog-card");
  if (!card) return;

  const index = cards.indexOf(card);
  const columns = getDesignerBlogGridColumns();
  const staggerDelay =
    columns === 1 ? 0 : (index % columns) * BLOG_STAGGER_STEP_MS;

  target.style.setProperty("--scroll-reveal-stagger-delay", `${staggerDelay}ms`);
}

function initDesignerScrollReveal() {
  if (!document.body.classList.contains("designer-page")) return;

  const section = document.querySelector(DESIGNER_DETAIL_SELECTOR);
  if (!section) return;

  const contentParts = [...section.querySelectorAll(DESIGNER_DETAIL_CONTENT_REVEAL_SELECTOR)];
  if (contentParts.length > 0) {
    initScrollRevealAnimateVisible(contentParts, (target) => {
      setDesignerDetailStagger(section, target);
    });
  }

  const blogParts = [...section.querySelectorAll(".designer-blog .blog-card__figure, .designer-blog .blog-card__body")];
  if (blogParts.length > 0) {
    initScrollRevealAnimateVisible(blogParts, (target) => {
      setDesignerDetailStagger(section, target);
    });
  }
}

const DESIGNER_UX_INTRO_SELECTOR = ".designer-ux-page .designer-ux-intro__title.js-load-reveal";
const DESIGNER_UX_DETAIL_SELECTOR = ".designer-ux-page .designer-ux-detail.js-scroll-reveal";
const DESIGNER_UX_DETAIL_REVEAL_SELECTOR = [
  ".designer-ux-content__lead",
  ".designer-ux-content__block",
  ".designer-ux-entry",
].join(", ");
const DESIGNER_UX_BLOCK_STAGGER_MS = 80;
const DESIGNER_UX_ENTRY_STAGGER_MS = 120;

function initDesignerUxIntroReveal() {
  if (!document.body.classList.contains("designer-ux-page")) return;

  const targets = [...document.querySelectorAll(DESIGNER_UX_INTRO_SELECTOR)];
  initLoadReveal(targets);
}

function primeDesignerUxIntroIfVisible() {
  if (!document.body.classList.contains("designer-ux-page")) return;

  document.querySelectorAll(DESIGNER_UX_INTRO_SELECTOR).forEach((element) => {
    if (element.classList.contains(SCROLL_REVEAL.inviewClass)) return;
    if (!isScrollRevealIntersecting(element)) return;

    element.classList.add(SCROLL_REVEAL.inviewClass, SCROLL_REVEAL.revealedClass);
  });
}

function setDesignerUxDetailStagger(section, target) {
  if (target.matches(".designer-ux-content__lead")) return;

  if (target.matches(".designer-ux-content__block")) {
    const blocks = [...section.querySelectorAll(".designer-ux-content__block")];
    target.style.setProperty(
      "--scroll-reveal-stagger-delay",
      `${blocks.indexOf(target) * DESIGNER_UX_BLOCK_STAGGER_MS}ms`
    );
    return;
  }

  if (target.matches(".designer-ux-entry")) {
    target.style.setProperty(
      "--scroll-reveal-stagger-delay",
      `${DESIGNER_UX_ENTRY_STAGGER_MS}ms`
    );
  }
}

function initDesignerUxScrollReveal() {
  if (!document.body.classList.contains("designer-ux-page")) return;

  const section = document.querySelector(DESIGNER_UX_DETAIL_SELECTOR);
  if (!section) return;

  const parts = [...section.querySelectorAll(DESIGNER_UX_DETAIL_REVEAL_SELECTOR)];
  if (parts.length === 0) return;

  initScrollRevealAnimateVisible(parts, (target) => {
    setDesignerUxDetailStagger(section, target);
  });
}

const COMPANY_INTRO_SELECTOR =
  ".company-page .company-intro__title.js-load-reveal, .company-page .company-intro__text.js-load-reveal";
const COMPANY_INTRO_TEXT_DELAY_MS = 80;
const COMPANY_STATEMENTS_SELECTOR = ".company-page .company-statements.js-scroll-reveal";
const COMPANY_STATEMENT_LABEL_SELECTOR = ".company-statement__label";
const COMPANY_STATEMENT_COPY_SELECTOR = ".company-statement__copy";
const COMPANY_STATEMENT_DESC_SELECTOR = ".company-statement__desc";
const COMPANY_STATEMENT_STAGGER_MS = 120;
const COMPANY_STATEMENT_COPY_OFFSET_MS = 40;
const COMPANY_STATEMENT_DESC_OFFSET_MS = 80;
const COMPANY_MESSAGE_SELECTOR = ".company-page .company-message.js-scroll-reveal";
const COMPANY_MESSAGE_REVEAL_SELECTOR =
  ".company-message__quote, .company-message__text, .company-message__figure";
const COMPANY_MESSAGE_TEXT_OFFSET_MS = 80;
const COMPANY_MESSAGE_FIGURE_OFFSET_MS = 120;
const COMPANY_ABOUT_SELECTOR = ".company-page .company-about.js-scroll-reveal";
const COMPANY_ABOUT_REVEAL_SELECTOR = ".company-about__map, .company-about__row";
const COMPANY_ABOUT_ROW_STAGGER_MS = 60;
const COMPANY_HEADING_SELECTOR = ".company-page .section-heading.js-scroll-reveal";
const COMPANY_SCROLL_REVEAL_PARTS_SELECTOR = [
  `${COMPANY_STATEMENTS_SELECTOR} ${COMPANY_STATEMENT_LABEL_SELECTOR}`,
  `${COMPANY_STATEMENTS_SELECTOR} ${COMPANY_STATEMENT_COPY_SELECTOR}`,
  `${COMPANY_STATEMENTS_SELECTOR} ${COMPANY_STATEMENT_DESC_SELECTOR}`,
  `${COMPANY_MESSAGE_SELECTOR} ${COMPANY_MESSAGE_REVEAL_SELECTOR}`,
  `${COMPANY_ABOUT_SELECTOR} ${COMPANY_ABOUT_REVEAL_SELECTOR}`,
].join(", ");

function initCompanyIntroReveal() {
  if (!document.body.classList.contains("company-page")) return;

  const targets = [...document.querySelectorAll(COMPANY_INTRO_SELECTOR)];
  initLoadReveal(targets, (target) => {
    if (!target.classList.contains("company-intro__text")) return;

    target.style.setProperty(
      "--scroll-reveal-stagger-delay",
      `${COMPANY_INTRO_TEXT_DELAY_MS}ms`
    );
  });
}

function primeCompanyIntroIfVisible() {
  if (!document.body.classList.contains("company-page")) return;

  document.querySelectorAll(COMPANY_INTRO_SELECTOR).forEach((element) => {
    if (element.classList.contains(SCROLL_REVEAL.inviewClass)) return;
    if (!isScrollRevealIntersecting(element)) return;

    element.classList.add(SCROLL_REVEAL.inviewClass, SCROLL_REVEAL.revealedClass);
  });
}

function setCompanyStatementStagger(section, target) {
  const statements = [...section.querySelectorAll(".company-statement")];
  const statement = target.closest(".company-statement");
  if (!statement) return;

  const baseDelay = statements.indexOf(statement) * COMPANY_STATEMENT_STAGGER_MS;

  if (target.matches(COMPANY_STATEMENT_LABEL_SELECTOR)) {
    target.style.setProperty("--scroll-reveal-stagger-delay", `${baseDelay}ms`);
    return;
  }

  if (target.matches(COMPANY_STATEMENT_COPY_SELECTOR)) {
    target.style.setProperty(
      "--scroll-reveal-stagger-delay",
      `${baseDelay + COMPANY_STATEMENT_COPY_OFFSET_MS}ms`
    );
    return;
  }

  if (target.matches(COMPANY_STATEMENT_DESC_SELECTOR)) {
    target.style.setProperty(
      "--scroll-reveal-stagger-delay",
      `${baseDelay + COMPANY_STATEMENT_DESC_OFFSET_MS}ms`
    );
  }
}

function setCompanyMessageStagger(_section, target) {
  if (target.matches(".company-message__quote")) return;

  if (target.matches(".company-message__text")) {
    target.style.setProperty(
      "--scroll-reveal-stagger-delay",
      `${COMPANY_MESSAGE_TEXT_OFFSET_MS}ms`
    );
    return;
  }

  if (target.matches(".company-message__figure")) {
    target.style.setProperty(
      "--scroll-reveal-stagger-delay",
      `${COMPANY_MESSAGE_FIGURE_OFFSET_MS}ms`
    );
  }
}

function setCompanyAboutStagger(section, target) {
  if (target.matches(".company-about__map")) return;

  if (target.matches(".company-about__row")) {
    const rows = [...section.querySelectorAll(".company-about__row")];
    target.style.setProperty(
      "--scroll-reveal-stagger-delay",
      `${(rows.indexOf(target) + 1) * COMPANY_ABOUT_ROW_STAGGER_MS}ms`
    );
  }
}

function initCompanyScrollReveal() {
  if (!document.body.classList.contains("company-page")) return;

  const statementsSection = document.querySelector(COMPANY_STATEMENTS_SELECTOR);
  if (statementsSection) {
    const parts = [
      ...statementsSection.querySelectorAll(
        `${COMPANY_STATEMENT_LABEL_SELECTOR}, ${COMPANY_STATEMENT_COPY_SELECTOR}, ${COMPANY_STATEMENT_DESC_SELECTOR}`
      ),
    ];
    if (parts.length > 0) {
      initScrollRevealAnimateVisible(parts, (target) => {
        setCompanyStatementStagger(statementsSection, target);
      });
    }
  }

  const messageSection = document.querySelector(COMPANY_MESSAGE_SELECTOR);
  if (messageSection) {
    const parts = [
      ...messageSection.querySelectorAll(".section-heading.js-scroll-reveal"),
      ...messageSection.querySelectorAll(COMPANY_MESSAGE_REVEAL_SELECTOR),
    ];
    if (parts.length > 0) {
      initScrollRevealAnimateVisible(parts, (target) => {
        setCompanyMessageStagger(messageSection, target);
      });
    }
  }

  const aboutSection = document.querySelector(COMPANY_ABOUT_SELECTOR);
  if (aboutSection) {
    const parts = [
      ...aboutSection.querySelectorAll(".section-heading.js-scroll-reveal"),
      ...aboutSection.querySelectorAll(COMPANY_ABOUT_REVEAL_SELECTOR),
    ];
    if (parts.length > 0) {
      initScrollRevealAnimateVisible(parts, (target) => {
        setCompanyAboutStagger(aboutSection, target);
      });
    }
  }
}

function primeCompanyScrollRevealIfVisible() {
  if (!document.body.classList.contains("company-page")) return;

  [
    ...document.querySelectorAll(COMPANY_HEADING_SELECTOR),
    ...document.querySelectorAll(COMPANY_SCROLL_REVEAL_PARTS_SELECTOR),
  ].forEach((element) => {
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

function getDesignerBlogGridColumns() {
  if (window.matchMedia("(max-width: 768px)").matches) return 1;
  if (window.matchMedia("(max-width: 1445px)").matches) return 2;
  return 3;
}

function initBlogScrollRevealForSection(section, getColumns) {
  const cards = [...section.querySelectorAll(".blog-card")];
  const parts = [...section.querySelectorAll(BLOG_CARD_REVEAL_SELECTOR)];
  if (parts.length === 0) return;

  initScrollReveal(parts, (target) => {
    const card = target.closest(".blog-card");
    if (!card) return;

    const index = cards.indexOf(card);
    const columns = getColumns();
    const staggerDelay =
      columns === 1 ? 0 : (index % columns) * BLOG_STAGGER_STEP_MS;

    target.style.setProperty("--scroll-reveal-stagger-delay", `${staggerDelay}ms`);
  });
}

function initBlogScrollReveal() {
  const section = document.querySelector(".top-page .blog.js-scroll-reveal");
  if (!section) return;

  initBlogScrollRevealForSection(section, getBlogGridColumns);
}

const BLOG_PAGE_INTRO_SELECTOR =
  ".blog-page .blog-intro__title.js-load-reveal, .blog-page .blog-intro__text.js-load-reveal";
const BLOG_PAGE_INTRO_TEXT_DELAY_MS = 80;
const BLOG_FEATURED_SELECTOR = ".blog-page .blog-featured.js-scroll-reveal";
const BLOG_FEATURED_REVEAL_SELECTOR = ".blog-featured__figure, .blog-featured__body";
const BLOG_FEATURED_BODY_OFFSET_MS = 120;
const BLOG_FILTERS_SELECTOR = ".blog-page .blog-filters.js-scroll-reveal";
const BLOG_FILTERS_ITEM_SELECTOR = ".blog-filters__item";
const BLOG_FILTERS_STAGGER_MS = 80;
const BLOG_LISTING_SELECTOR = ".blog-page .blog--listing.js-scroll-reveal";
const BLOG_LISTING_HEADING_SELECTOR = ".blog-page .section-heading.js-scroll-reveal";
const BLOG_PAGE_SCROLL_REVEAL_PARTS_SELECTOR = [
  `${BLOG_FEATURED_SELECTOR} ${BLOG_FEATURED_REVEAL_SELECTOR}`,
  `${BLOG_FILTERS_SELECTOR} ${BLOG_FILTERS_ITEM_SELECTOR}`,
  `${BLOG_LISTING_SELECTOR} ${BLOG_LISTING_HEADING_SELECTOR}`,
  `${BLOG_LISTING_SELECTOR} ${BLOG_CARD_REVEAL_SELECTOR}`,
].join(", ");

function setBlogFeaturedStagger(_section, target) {
  if (target.matches(".blog-featured__figure")) return;

  if (target.matches(".blog-featured__body")) {
    target.style.setProperty(
      "--scroll-reveal-stagger-delay",
      `${BLOG_FEATURED_BODY_OFFSET_MS}ms`
    );
  }
}

function setBlogFiltersStagger(section, target) {
  if (!target.matches(BLOG_FILTERS_ITEM_SELECTOR)) return;

  const items = [...section.querySelectorAll(BLOG_FILTERS_ITEM_SELECTOR)];
  target.style.setProperty(
    "--scroll-reveal-stagger-delay",
    `${items.indexOf(target) * BLOG_FILTERS_STAGGER_MS}ms`
  );
}

function setBlogListingStagger(section, target) {
  if (target.matches(".section-heading")) return;

  const card = target.closest(".blog-card");
  if (!card) return;

  const cards = [...section.querySelectorAll(".blog-card")];
  const index = cards.indexOf(card);
  const columns = getBlogGridColumns();
  const staggerDelay =
    columns === 1 ? 0 : (index % columns) * BLOG_STAGGER_STEP_MS;

  target.style.setProperty("--scroll-reveal-stagger-delay", `${staggerDelay}ms`);
}

function initBlogPageIntroReveal() {
  if (!document.body.classList.contains("blog-page")) return;

  const targets = [...document.querySelectorAll(BLOG_PAGE_INTRO_SELECTOR)];
  initLoadReveal(targets, (target) => {
    if (!target.classList.contains("blog-intro__text")) return;

    target.style.setProperty(
      "--scroll-reveal-stagger-delay",
      `${BLOG_PAGE_INTRO_TEXT_DELAY_MS}ms`
    );
  });
}

function primeBlogPageIntroIfVisible() {
  if (!document.body.classList.contains("blog-page")) return;

  document.querySelectorAll(BLOG_PAGE_INTRO_SELECTOR).forEach((element) => {
    if (element.classList.contains(SCROLL_REVEAL.inviewClass)) return;
    if (!isScrollRevealIntersecting(element)) return;

    element.classList.add(SCROLL_REVEAL.inviewClass, SCROLL_REVEAL.revealedClass);
  });
}

function initBlogPageScrollReveal() {
  if (!document.body.classList.contains("blog-page")) return;

  const featuredSection = document.querySelector(BLOG_FEATURED_SELECTOR);
  if (featuredSection) {
    const parts = [...featuredSection.querySelectorAll(BLOG_FEATURED_REVEAL_SELECTOR)];
    if (parts.length > 0) {
      initScrollRevealAnimateVisible(parts, (target) => {
        setBlogFeaturedStagger(featuredSection, target);
      });
    }
  }

  const filtersSection = document.querySelector(BLOG_FILTERS_SELECTOR);
  if (filtersSection) {
    const parts = [...filtersSection.querySelectorAll(BLOG_FILTERS_ITEM_SELECTOR)];
    if (parts.length > 0) {
      initScrollRevealAnimateVisible(parts, (target) => {
        setBlogFiltersStagger(filtersSection, target);
      });
    }
  }

  const listingSection = document.querySelector(BLOG_LISTING_SELECTOR);
  if (listingSection) {
    const parts = [
      ...listingSection.querySelectorAll(".section-heading.js-scroll-reveal"),
      ...listingSection.querySelectorAll(BLOG_CARD_REVEAL_SELECTOR),
    ];
    if (parts.length > 0) {
      initScrollRevealAnimateVisible(parts, (target) => {
        setBlogListingStagger(listingSection, target);
      });
    }
  }
}

function primeBlogPageScrollRevealIfVisible() {
  if (!document.body.classList.contains("blog-page")) return;

  document.querySelectorAll(BLOG_PAGE_SCROLL_REVEAL_PARTS_SELECTOR).forEach((element) => {
    if (element.classList.contains(SCROLL_REVEAL.inviewClass)) return;
    if (!isScrollRevealIntersecting(element)) return;

    element.classList.add(SCROLL_REVEAL.inviewClass, SCROLL_REVEAL.revealedClass);
  });
}

const BLOG_CATEGORY_PAGES = [
  {
    bodyClass: "blog-news-page",
    introTitleSelector: ".blog-news-intro__title.js-load-reveal",
    listingSelector: ".blog-news-page .blog--news-listing.js-scroll-reveal",
  },
  {
    bodyClass: "blog-staff-page",
    introTitleSelector: ".blog-staff-intro__title.js-load-reveal",
    listingSelector: ".blog-staff-page .blog--staff-listing.js-scroll-reveal",
  },
  {
    bodyClass: "blog-interview-page",
    introTitleSelector: ".blog-interview-intro__title.js-load-reveal",
    listingSelector: ".blog-interview-page .blog--interview-listing.js-scroll-reveal",
  },
];

function getActiveBlogCategoryPage() {
  return BLOG_CATEGORY_PAGES.find((page) =>
    document.body.classList.contains(page.bodyClass)
  );
}

function initBlogCategoryIntroReveal() {
  const page = getActiveBlogCategoryPage();
  if (!page) return;

  const targets = [...document.querySelectorAll(page.introTitleSelector)];
  initLoadReveal(targets);
}

function primeBlogCategoryIntroIfVisible() {
  const page = getActiveBlogCategoryPage();
  if (!page) return;

  document.querySelectorAll(page.introTitleSelector).forEach((element) => {
    if (element.classList.contains(SCROLL_REVEAL.inviewClass)) return;
    if (!isScrollRevealIntersecting(element)) return;

    element.classList.add(SCROLL_REVEAL.inviewClass, SCROLL_REVEAL.revealedClass);
  });
}

function initBlogCategoryScrollReveal() {
  const page = getActiveBlogCategoryPage();
  if (!page) return;

  const filtersSection = document.querySelector(
    `.${page.bodyClass} .blog-filters.js-scroll-reveal`
  );
  if (filtersSection) {
    const filterParts = [...filtersSection.querySelectorAll(BLOG_FILTERS_ITEM_SELECTOR)];
    if (filterParts.length > 0) {
      initScrollRevealAnimateVisible(filterParts, (target) => {
        setBlogFiltersStagger(filtersSection, target);
      });
    }
  }

  const listingSection = document.querySelector(page.listingSelector);
  if (listingSection) {
    const parts = [...listingSection.querySelectorAll(BLOG_CARD_REVEAL_SELECTOR)];
    if (parts.length > 0) {
      initScrollRevealAnimateVisible(parts, (target) => {
        setBlogListingStagger(listingSection, target);
      });
    }
  }
}

function primeBlogCategoryScrollRevealIfVisible() {
  const page = getActiveBlogCategoryPage();
  if (!page) return;

  const selectors = [
    `.${page.bodyClass} .blog-filters.js-scroll-reveal ${BLOG_FILTERS_ITEM_SELECTOR}`,
    `${page.listingSelector} ${BLOG_CARD_REVEAL_SELECTOR}`,
  ].join(", ");

  document.querySelectorAll(selectors).forEach((element) => {
    if (element.classList.contains(SCROLL_REVEAL.inviewClass)) return;
    if (!isScrollRevealIntersecting(element)) return;

    element.classList.add(SCROLL_REVEAL.inviewClass, SCROLL_REVEAL.revealedClass);
  });
}

const BLOG_ARTICLE_HERO_SELECTOR = ".blog-article-page .blog-article-hero.js-scroll-reveal";
const BLOG_ARTICLE_HERO_FIGURE_SELECTOR = ".blog-article-hero__figure";
const BLOG_ARTICLE_BODY_SELECTOR = ".blog-article-page .blog-article-body.js-scroll-reveal";
const BLOG_ARTICLE_BODY_REVEAL_SELECTOR = [
  ".blog-article-meta__date",
  ".blog-article-meta__heading",
  ".blog-article-meta__actions",
  ".blog-article-content__lead",
  ".blog-article-content__block",
].join(", ");
const BLOG_ARTICLE_META_HEADING_OFFSET_MS = 80;
const BLOG_ARTICLE_META_ACTIONS_OFFSET_MS = 120;
const BLOG_ARTICLE_CONTENT_LEAD_OFFSET_MS = 160;
const BLOG_ARTICLE_CONTENT_BLOCK_STAGGER_MS = 80;
const BLOG_ARTICLE_RELATED_SELECTOR = ".blog-article-page .blog-article-related.js-scroll-reveal";
const BLOG_ARTICLE_RELATED_HEAD_SELECTOR =
  ".blog-article-page .blog-article-related__head.section-heading.js-scroll-reveal";
const BLOG_ARTICLE_SCROLL_REVEAL_PARTS_SELECTOR = [
  `${BLOG_ARTICLE_HERO_SELECTOR} ${BLOG_ARTICLE_HERO_FIGURE_SELECTOR}`,
  `${BLOG_ARTICLE_BODY_SELECTOR} ${BLOG_ARTICLE_BODY_REVEAL_SELECTOR}`,
  BLOG_ARTICLE_RELATED_HEAD_SELECTOR,
  `${BLOG_ARTICLE_RELATED_SELECTOR} ${BLOG_CARD_REVEAL_SELECTOR}`,
].join(", ");

function setBlogArticleBodyStagger(section, target) {
  if (target.matches(".blog-article-meta__date")) return;

  if (target.matches(".blog-article-meta__heading")) {
    target.style.setProperty(
      "--scroll-reveal-stagger-delay",
      `${BLOG_ARTICLE_META_HEADING_OFFSET_MS}ms`
    );
    return;
  }

  if (target.matches(".blog-article-meta__actions")) {
    target.style.setProperty(
      "--scroll-reveal-stagger-delay",
      `${BLOG_ARTICLE_META_ACTIONS_OFFSET_MS}ms`
    );
    return;
  }

  if (target.matches(".blog-article-content__lead")) {
    target.style.setProperty(
      "--scroll-reveal-stagger-delay",
      `${BLOG_ARTICLE_CONTENT_LEAD_OFFSET_MS}ms`
    );
    return;
  }

  if (target.matches(".blog-article-content__block")) {
    const blocks = [...section.querySelectorAll(".blog-article-content__block")];
    target.style.setProperty(
      "--scroll-reveal-stagger-delay",
      `${BLOG_ARTICLE_CONTENT_LEAD_OFFSET_MS + (blocks.indexOf(target) + 1) * BLOG_ARTICLE_CONTENT_BLOCK_STAGGER_MS}ms`
    );
  }
}

function initBlogArticleScrollReveal() {
  if (!document.body.classList.contains("blog-article-page")) return;

  const heroSection = document.querySelector(BLOG_ARTICLE_HERO_SELECTOR);
  if (heroSection) {
    const figure = heroSection.querySelector(BLOG_ARTICLE_HERO_FIGURE_SELECTOR);
    if (figure) {
      initScrollRevealAnimateVisible([figure]);
    }
  }

  const bodySection = document.querySelector(BLOG_ARTICLE_BODY_SELECTOR);
  if (bodySection) {
    const parts = [...bodySection.querySelectorAll(BLOG_ARTICLE_BODY_REVEAL_SELECTOR)];
    if (parts.length > 0) {
      initScrollRevealAnimateVisible(parts, (target) => {
        setBlogArticleBodyStagger(bodySection, target);
      });
    }
  }

  const relatedSection = document.querySelector(BLOG_ARTICLE_RELATED_SELECTOR);
  if (relatedSection) {
    const parts = [
      ...relatedSection.querySelectorAll(".blog-article-related__head.section-heading.js-scroll-reveal"),
      ...relatedSection.querySelectorAll(BLOG_CARD_REVEAL_SELECTOR),
    ];
    if (parts.length > 0) {
      initScrollRevealAnimateVisible(parts, (target) => {
        setBlogListingStagger(relatedSection, target);
      });
    }
  }
}

function primeBlogArticleScrollRevealIfVisible() {
  if (!document.body.classList.contains("blog-article-page")) return;

  document.querySelectorAll(BLOG_ARTICLE_SCROLL_REVEAL_PARTS_SELECTOR).forEach((element) => {
    if (element.classList.contains(SCROLL_REVEAL.inviewClass)) return;
    if (!isScrollRevealIntersecting(element)) return;

    element.classList.add(SCROLL_REVEAL.inviewClass, SCROLL_REVEAL.revealedClass);
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

const CTA_BODY_SELECTOR = ".top-cta__block-body.js-scroll-reveal";
const CTA_BTN_SELECTOR = ".top-cta .top-cta__btn.js-scroll-reveal";
const CTA_SCROLL_REVEAL_SELECTOR = `${CTA_BODY_SELECTOR}, ${CTA_BTN_SELECTOR}`;
const CTA_STAGGER_STEP_MS = 120;

function getCtaScrollRevealParts() {
  const section = document.querySelector(".top-cta");
  if (!section) return [];

  return [...section.querySelectorAll(CTA_SCROLL_REVEAL_SELECTOR)];
}

function setCtaScrollRevealStagger(target) {
  const parts = getCtaScrollRevealParts();
  const index = parts.indexOf(target);
  if (index === -1) return;

  target.style.setProperty(
    "--scroll-reveal-stagger-delay",
    `${index * CTA_STAGGER_STEP_MS}ms`
  );
}

function initCtaScrollReveal() {
  const parts = getCtaScrollRevealParts();
  if (parts.length === 0) return;

  initScrollRevealAnimateVisible(parts, setCtaScrollRevealStagger);
}

function primeCtaIfVisible() {
  document.querySelectorAll(CTA_SCROLL_REVEAL_SELECTOR).forEach((element) => {
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
