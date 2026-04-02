/**
 * Protech GSAP Animations
 *
 * Requires: gsap, ScrollTrigger, SplitText
 *
 * Usage (Bricks Attributes panel):
 *   data-gsap="fade-load"        — Fade + rise on page load (no scroll trigger)
 *   data-gsap="fade-up"          — Fade + rise on scroll enter
 *   data-gsap="fade-up-scrub"    — Fade + rise scrubbed to scroll position
 *   data-gsap="slide-right"      — Slide in from left on scroll enter
 *   data-gsap="slide-left"       — Slide in from right on scroll enter
 *   data-gsap="text-fade"        — Text fade-in on scroll enter
 *   data-gsap="stagger-up"       — Stagger children upward on scroll enter (set on PARENT)
 *   data-gsap="hero-lines"       — SplitText line-by-line mask reveal (hero headlines)
 *   data-gsap="hero-chars"       — SplitText character stagger reveal (hero headlines)
 *   data-gsap="hero-words"       — SplitText word-by-word reveal (hero headlines)
 *
 * Breakpoint behaviour:
 *   Desktop (768px+) — Full animations with movement, longer durations
 *   Mobile  (<768px) — Lighter fades, shorter durations, no horizontal slides
 *   Reduced motion   — No animation, elements shown at final state
 */
(function () {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const mm = gsap.matchMedia();

  // ── Page-load animations (all breakpoints) ──
  mm.add(
    {
      isMobile: "(max-width: 767px)",
      reduceMotion: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      const { isMobile, reduceMotion } = context.conditions;

      // ── Fade Load ──
      const fadeLoadEls = document.querySelectorAll('[data-gsap="fade-load"]');
      if (fadeLoadEls.length) {
        if (reduceMotion) {
          gsap.set(fadeLoadEls, { autoAlpha: 1 });
        } else {
          gsap.set(fadeLoadEls, { autoAlpha: 0, y: isMobile ? 15 : 30 });
          gsap.to(fadeLoadEls, {
            autoAlpha: 1,
            y: 0,
            duration: isMobile ? 0.6 : 1.2,
            delay: 0.2,
            ease: "power2.out",
            stagger: isMobile ? 0.06 : 0.1,
          });
        }
      }

      // ── Hero Lines (page-load, no scroll trigger) ──
      document.querySelectorAll('[data-gsap="hero-lines"]').forEach((el) => {
        if (reduceMotion) return;
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            gsap.set(self.lines, { y: "100%" });
            return gsap.to(self.lines, {
              y: "0%",
              duration: isMobile ? 0.6 : 1,
              stagger: isMobile ? 0.08 : 0.12,
              ease: "power3.out",
              delay: 0.3,
            });
          },
        });
      });

      // ── Hero Chars (page-load, no scroll trigger) ──
      document.querySelectorAll('[data-gsap="hero-chars"]').forEach((el) => {
        if (reduceMotion) return;
        SplitText.create(el, {
          type: "words, chars",
          autoSplit: true,
          onSplit(self) {
            gsap.set(self.chars, { autoAlpha: 0, y: 20, rotation: isMobile ? 0 : 5 });
            return gsap.to(self.chars, {
              autoAlpha: 1,
              y: 0,
              rotation: 0,
              duration: isMobile ? 0.3 : 0.5,
              stagger: isMobile ? 0.02 : 0.03,
              ease: "power2.out",
              delay: 0.3,
            });
          },
        });
      });

      // ── Hero Words (page-load, no scroll trigger) ──
      document.querySelectorAll('[data-gsap="hero-words"]').forEach((el) => {
        if (reduceMotion) return;
        SplitText.create(el, {
          type: "words",
          mask: "words",
          autoSplit: true,
          onSplit(self) {
            gsap.set(self.words, { y: "100%" });
            return gsap.to(self.words, {
              y: "0%",
              duration: isMobile ? 0.5 : 0.8,
              stagger: isMobile ? 0.06 : 0.1,
              ease: "power3.out",
              delay: 0.3,
            });
          },
        });
      });
    }
  );

  // ── Scroll-triggered animations (responsive, respects reduced motion) ──
  mm.add(
    {
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)",
      reduceMotion: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      const { isDesktop, isMobile, reduceMotion } = context.conditions;

      // Reduced motion: show everything at final state, no animation
      if (reduceMotion) {
        gsap.set(
          [
            '[data-gsap="fade-up"]',
            '[data-gsap="fade-up-scrub"]',
            '[data-gsap="slide-right"]',
            '[data-gsap="slide-left"]',
            '[data-gsap="text-fade"]',
          ].join(","),
          { autoAlpha: 1, x: 0, y: 0 }
        );
        document.querySelectorAll('[data-gsap="stagger-up"]').forEach((parent) => {
          gsap.set(parent.children, { autoAlpha: 1, y: 0 });
        });
        return;
      }

      // ── Fade Up ──
      gsap.set('[data-gsap="fade-up"]', { autoAlpha: 0, y: isDesktop ? 50 : 20 });
      ScrollTrigger.batch('[data-gsap="fade-up"]', {
        onEnter: (els) =>
          gsap.to(els, {
            autoAlpha: 1,
            y: 0,
            duration: isDesktop ? 1 : 0.5,
            ease: "circ.out",
            stagger: isDesktop ? 0.12 : 0.06,
            overwrite: true,
          }),
        start: isDesktop ? "top 80%" : "top 90%",
        once: true,
      });

      // ── Fade Up Scrub ──
      // Per-element ScrollTrigger — progress tied to individual scroll range
      document.querySelectorAll('[data-gsap="fade-up-scrub"]').forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: isDesktop ? 50 : 20 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: isDesktop ? "top 80%" : "top 90%",
              end: isDesktop ? "top 20%" : "top 40%",
              scrub: true,
            },
          }
        );
      });

      // ── Slide Right (from left) ──
      if (isDesktop) {
        gsap.set('[data-gsap="slide-right"]', { autoAlpha: 0, x: -80 });
        ScrollTrigger.batch('[data-gsap="slide-right"]', {
          onEnter: (els) =>
            gsap.to(els, {
              autoAlpha: 1,
              x: 0,
              duration: 1,
              ease: "circ.out",
              stagger: 0.12,
              overwrite: true,
            }),
          start: "top 75%",
          once: true,
        });
      } else {
        gsap.set('[data-gsap="slide-right"]', { autoAlpha: 0 });
        ScrollTrigger.batch('[data-gsap="slide-right"]', {
          onEnter: (els) =>
            gsap.to(els, {
              autoAlpha: 1,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.06,
              overwrite: true,
            }),
          start: "top 90%",
          once: true,
        });
      }

      // ── Slide Left (from right) ──
      if (isDesktop) {
        gsap.set('[data-gsap="slide-left"]', { autoAlpha: 0, x: 80 });
        ScrollTrigger.batch('[data-gsap="slide-left"]', {
          onEnter: (els) =>
            gsap.to(els, {
              autoAlpha: 1,
              x: 0,
              duration: 1,
              ease: "circ.out",
              stagger: 0.12,
              overwrite: true,
            }),
          start: "top 75%",
          once: true,
        });
      } else {
        gsap.set('[data-gsap="slide-left"]', { autoAlpha: 0 });
        ScrollTrigger.batch('[data-gsap="slide-left"]', {
          onEnter: (els) =>
            gsap.to(els, {
              autoAlpha: 1,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.06,
              overwrite: true,
            }),
          start: "top 90%",
          once: true,
        });
      }

      // ── Text Fade ──
      gsap.set('[data-gsap="text-fade"]', { autoAlpha: 0 });
      ScrollTrigger.batch('[data-gsap="text-fade"]', {
        onEnter: (els) =>
          gsap.to(els, {
            autoAlpha: 1,
            duration: isDesktop ? 1.8 : 0.6,
            ease: "circ.out",
            stagger: isDesktop ? 0.1 : 0.05,
            overwrite: true,
          }),
        start: isDesktop ? "top 70%" : "top 90%",
        once: true,
      });

      // ── Stagger Up (set on parent, animates children) ──
      document.querySelectorAll('[data-gsap="stagger-up"]').forEach((parent) => {
        const children = parent.children;
        if (!children.length) return;

        gsap.set(children, { autoAlpha: 0, y: isDesktop ? 50 : 20 });
        ScrollTrigger.create({
          trigger: parent,
          start: isDesktop ? "top 80%" : "top 90%",
          once: true,
          onEnter: () =>
            gsap.to(children, {
              autoAlpha: 1,
              y: 0,
              duration: isDesktop ? 0.8 : 0.4,
              stagger: isDesktop ? 0.15 : 0.08,
              ease: "circ.out",
              overwrite: true,
            }),
        });
      });
    }
  );
})();
