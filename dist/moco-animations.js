/**
 * Moco AI — GSAP Animation System v1.0.0
 *
 * Data-attribute driven animations for Webflow.
 * Apply via Element Settings > Custom Attributes in the Webflow Designer.
 *
 * ── UTILITIES (data-gsap) ──────────────────────────
 *   "fade-load"       — Fade + rise on page load (no scroll trigger)
 *   "fade-up"         — Fade + rise on scroll enter
 *   "fade-up-scrub"   — Fade + rise scrubbed to scroll position
 *   "slide-right"     — Slide in from left on scroll enter
 *   "slide-left"      — Slide in from right on scroll enter
 *   "text-fade"       — Opacity fade on scroll enter
 *   "stagger-up"      — Stagger children upward on scroll (set on PARENT)
 *   "mask-up"         — Masked stagger reveal with optional scramble (set on PARENT)
 *   "scramble"        — Scramble text on scroll enter
 *   "mask-lines"      — SplitText line-by-line mask reveal (scroll trigger)
 *   "hero-lines"      — SplitText line-by-line mask reveal (page load)
 *   "hero-chars"      — SplitText character stagger reveal (page load)
 *   "hero-words"      — SplitText word-by-word mask reveal (page load)
 *
 * ── SCENES (data-gsap-scene) ───────────────────────
 *   "hero"            — Premium hero: clip-path image wipe, heading line reveal, paragraph mask-up scramble, parallax
 *   "image-reveal"    — Pinned image scale-to-fullscreen
 *   "svg-draw"        — SVG stroke draw on scroll
 *   "horizontal-scroll" — Horizontal scroll section (desktop only)
 *   "parallax"        — Multi-speed parallax layers
 *   "counter"         — Number counter roll-up
 *   "magnetic"        — Magnetic hover effect (desktop only)
 *   "glow-track"      — Mouse-following radial glow (desktop only, container > 50em)
 *   "flip-grid"       — Animated filter grid
 *
 * ── MODIFIERS ──────────────────────────────────────
 *   data-gsap-stagger="0.15"      — Custom stagger (stagger-up)
 *   data-gsap-chars="01"          — Scramble character set
 *   data-gsap-speed="-0.3"        — Parallax layer speed
 *   data-gsap-target="1500"       — Counter target number
 *   data-gsap-prefix="$"          — Counter prefix
 *   data-gsap-suffix="%"          — Counter suffix
 *   data-gsap-strength="0.3"      — Magnetic pull strength (0–1)
 *   data-gsap-filter="category"   — Flip grid filter value
 *   data-gsap-category="category" — Flip grid item category
 *
 * Breakpoints: Desktop 768px+, Mobile <768px
 * Reduced motion: Elements shown at final state, no animation.
 * FOUC prevention: CSS in <head> sets visibility:hidden on animated elements.
 *
 * https://github.com/derickswayde/moco-gsap
 */
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, Flip);

  // Force a ScrollTrigger refresh after Webflow CMS renders
  ScrollTrigger.config({ ignoreMobileResize: true });
  requestAnimationFrame(function () {
    ScrollTrigger.refresh();
  });

  var mm = gsap.matchMedia();

  // ================================================================
  //  PAGE-LOAD ANIMATIONS
  // ================================================================
  mm.add(
    {
      isMobile: "(max-width: 767px)",
      reduceMotion: "(prefers-reduced-motion: reduce)",
    },
    function (context) {
      var isMobile = context.conditions.isMobile;
      var reduceMotion = context.conditions.reduceMotion;

      // ── Fade Load ──
      var fadeLoadEls = document.querySelectorAll('[data-gsap="fade-load"]');
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

      // ── Hero Lines (page load) ──
      document.querySelectorAll('[data-gsap="hero-lines"]').forEach(function (el) {
        if (reduceMotion) {
          gsap.set(el, { autoAlpha: 1 });
          return;
        }
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: function (self) {
            gsap.set(self.lines, { y: "100%" });
            gsap.set(el, { autoAlpha: 1 });
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

      // ── Hero Chars (page load) ──
      document.querySelectorAll('[data-gsap="hero-chars"]').forEach(function (el) {
        if (reduceMotion) {
          gsap.set(el, { autoAlpha: 1 });
          return;
        }
        SplitText.create(el, {
          type: "words, chars",
          autoSplit: true,
          onSplit: function (self) {
            gsap.set(self.chars, { autoAlpha: 0, y: 20, rotation: isMobile ? 0 : 5 });
            gsap.set(el, { autoAlpha: 1 });
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

      // ── Hero Words (page load) ──
      document.querySelectorAll('[data-gsap="hero-words"]').forEach(function (el) {
        if (reduceMotion) {
          gsap.set(el, { autoAlpha: 1 });
          return;
        }
        SplitText.create(el, {
          type: "words",
          mask: "words",
          autoSplit: true,
          onSplit: function (self) {
            gsap.set(self.words, { y: "100%" });
            gsap.set(el, { autoAlpha: 1 });
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

  // ================================================================
  //  SCROLL-TRIGGERED UTILITIES + SCENES
  // ================================================================
  mm.add(
    {
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)",
      reduceMotion: "(prefers-reduced-motion: reduce)",
    },
    function (context) {
      var isDesktop = context.conditions.isDesktop;
      var isMobile = context.conditions.isMobile;
      var reduceMotion = context.conditions.reduceMotion;

      // ────────────────────────────────────────────
      //  REDUCED MOTION — instant reveal, no animation
      // ────────────────────────────────────────────
      if (reduceMotion) {
        gsap.set(
          [
            '[data-gsap="fade-up"]',
            '[data-gsap="fade-up-scrub"]',
            '[data-gsap="slide-right"]',
            '[data-gsap="slide-left"]',
            '[data-gsap="text-fade"]',
            '[data-gsap="scramble"]',
          ].join(","),
          { autoAlpha: 1, x: 0, y: 0 }
        );
        document.querySelectorAll('[data-gsap="stagger-up"]').forEach(function (parent) {
          gsap.set(parent.children, { autoAlpha: 1, y: 0 });
        });
        document.querySelectorAll('[data-gsap="mask-up"]').forEach(function (parent) {
          gsap.set(parent, { autoAlpha: 1 });
          gsap.set(parent.children, { autoAlpha: 1, y: 0 });
        });
        // Hero scene: show final state
        document.querySelectorAll('[data-gsap-scene="hero"]').forEach(function (section) {
          var heading = section.querySelector('[data-gsap-role="hero-heading"]');
          var paragraph = section.querySelector('[data-gsap-role="hero-paragraph"]');
          var image = section.querySelector('[data-gsap-role="hero-image"]');
          var eyebrow = section.querySelector('[data-gsap-role="hero-eyebrow"]');
          if (heading) gsap.set(heading, { autoAlpha: 1 });
          if (paragraph) { gsap.set(paragraph, { autoAlpha: 1 }); gsap.set(paragraph.children, { autoAlpha: 1, y: 0 }); }
          if (image) gsap.set(image, { autoAlpha: 1, clipPath: "inset(0 0% 0 0)" });
          if (eyebrow) { gsap.set(eyebrow, { autoAlpha: 1 }); gsap.set(eyebrow.children, { autoAlpha: 1, y: 0 }); }
        });
        // Scenes: show final state
        document.querySelectorAll('[data-gsap-scene="image-reveal"]').forEach(function (section) {
          var img = section.querySelector('[data-gsap-role="image"]');
          var headline = section.querySelector('[data-gsap-role="headline"]');
          if (img) gsap.set(img, { scale: 1 });
          if (headline) gsap.set(headline, { autoAlpha: 1 });
        });
        document.querySelectorAll('[data-gsap-scene="counter"]').forEach(function (section) {
          section.querySelectorAll('[data-gsap-role="counter"]').forEach(function (el) {
            var target = parseFloat(el.getAttribute("data-gsap-target") || "0");
            var suffix = el.getAttribute("data-gsap-suffix") || "";
            var prefix = el.getAttribute("data-gsap-prefix") || "";
            el.textContent = prefix + (target % 1 !== 0 ? target.toFixed(1) : Math.round(target)) + suffix;
          });
        });
        return;
      }

      // ════════════════════════════════════════════
      //  UTILITIES
      // ════════════════════════════════════════════

      // ── Fade Up ──
      gsap.set('[data-gsap="fade-up"]', { autoAlpha: 0, y: isDesktop ? 50 : 20 });
      ScrollTrigger.batch('[data-gsap="fade-up"]', {
        onEnter: function (els) {
          gsap.to(els, {
            autoAlpha: 1,
            y: 0,
            duration: isDesktop ? 1 : 0.5,
            ease: "circ.out",
            stagger: isDesktop ? 0.12 : 0.06,
            overwrite: true,
          });
        },
        start: isDesktop ? "top 80%" : "top 90%",
        once: true,
      });

      // ── Fade Up Scrub ──
      document.querySelectorAll('[data-gsap="fade-up-scrub"]').forEach(function (el) {
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
          onEnter: function (els) {
            gsap.to(els, {
              autoAlpha: 1,
              x: 0,
              duration: 1,
              ease: "circ.out",
              stagger: 0.12,
              overwrite: true,
            });
          },
          start: "top 75%",
          once: true,
        });
      } else {
        gsap.set('[data-gsap="slide-right"]', { autoAlpha: 0 });
        ScrollTrigger.batch('[data-gsap="slide-right"]', {
          onEnter: function (els) {
            gsap.to(els, {
              autoAlpha: 1,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.06,
              overwrite: true,
            });
          },
          start: "top 90%",
          once: true,
        });
      }

      // ── Slide Left (from right) ──
      if (isDesktop) {
        gsap.set('[data-gsap="slide-left"]', { autoAlpha: 0, x: 80 });
        ScrollTrigger.batch('[data-gsap="slide-left"]', {
          onEnter: function (els) {
            gsap.to(els, {
              autoAlpha: 1,
              x: 0,
              duration: 1,
              ease: "circ.out",
              stagger: 0.12,
              overwrite: true,
            });
          },
          start: "top 75%",
          once: true,
        });
      } else {
        gsap.set('[data-gsap="slide-left"]', { autoAlpha: 0 });
        ScrollTrigger.batch('[data-gsap="slide-left"]', {
          onEnter: function (els) {
            gsap.to(els, {
              autoAlpha: 1,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.06,
              overwrite: true,
            });
          },
          start: "top 90%",
          once: true,
        });
      }

      // ── Text Fade ──
      gsap.set('[data-gsap="text-fade"]', { autoAlpha: 0 });
      ScrollTrigger.batch('[data-gsap="text-fade"]', {
        onEnter: function (els) {
          gsap.to(els, {
            autoAlpha: 1,
            duration: isDesktop ? 1.8 : 0.6,
            ease: "circ.out",
            stagger: isDesktop ? 0.1 : 0.05,
            overwrite: true,
          });
        },
        start: isDesktop ? "top 70%" : "top 90%",
        once: true,
      });

      // ── Scramble (utility level) ──
      // Targets inner text element if inside a rich text wrapper (preserves <p> tags)
      document.querySelectorAll('[data-gsap="scramble"]').forEach(function (el) {
        var textTarget = el.querySelector("p, span, h1, h2, h3, h4, h5, h6") || el;
        var finalText = textTarget.textContent;
        var chars = el.getAttribute("data-gsap-chars") || "upperCase";

        gsap.set(el, { autoAlpha: 1 });
        ScrollTrigger.create({
          trigger: el,
          start: isDesktop ? "top 85%" : "top 90%",
          once: true,
          onEnter: function () {
            gsap.to(textTarget, {
              duration: isDesktop ? 1.5 : 0.8,
              scrambleText: {
                text: finalText,
                chars: chars,
                revealDelay: 0.3,
                speed: 0.5,
              },
            });
          },
        });
      });

      // ── Mask Up (masked stagger reveal with optional scramble on children) ──
      // Set on parent. Children rise up from behind a clip mask, staggered.
      // Add data-gsap-scramble (optionally with chars value) on any child to scramble its text.
      document.querySelectorAll('[data-gsap="mask-up"]').forEach(function (parent) {
        var children = Array.prototype.slice.call(parent.children);
        if (!children.length) return;

        var staggerVal = parseFloat(parent.getAttribute("data-gsap-stagger") || "0") || (isDesktop ? 0.12 : 0.08);

        // clipPath masks reliably on any display type (inline-flex, flex, etc.)
        gsap.set(parent, { clipPath: "inset(0 0 0 0)", autoAlpha: 1 });
        gsap.set(children, { yPercent: 110, autoAlpha: 1 });

        ScrollTrigger.create({
          trigger: parent,
          start: isDesktop ? "top 85%" : "top 90%",
          once: true,
          onEnter: function () {
            // Stagger children up into view
            children.forEach(function (child, index) {
              var delay = staggerVal * index;

              gsap.to(child, {
                yPercent: 0,
                duration: isDesktop ? 0.7 : 0.45,
                delay: delay,
                ease: "power3.out",
              });

              // If child has data-gsap-scramble, trigger scramble after it starts rising
              if (child.hasAttribute("data-gsap-scramble")) {
                var textTarget = child.querySelector("p, span, h1, h2, h3, h4, h5, h6") || child;
                var finalText = textTarget.textContent;
                var chars = child.getAttribute("data-gsap-scramble") || child.getAttribute("data-gsap-chars") || "upperCase";
                if (chars === "") chars = "upperCase";

                gsap.to(textTarget, {
                  delay: delay + 0.05,
                  duration: isDesktop ? 2 : 1,
                  scrambleText: {
                    text: finalText,
                    chars: chars,
                    revealDelay: 0.4,
                    speed: 0.4,
                  },
                });
              }
            });
          },
        });
      });

      // ── Stagger Up (set on parent, animates children) ──
      document.querySelectorAll('[data-gsap="stagger-up"]').forEach(function (parent) {
        var children = parent.children;
        if (!children.length) return;

        var customStagger = parseFloat(parent.getAttribute("data-gsap-stagger") || "0");

        gsap.set(children, { autoAlpha: 0, y: isDesktop ? 50 : 20 });
        ScrollTrigger.create({
          trigger: parent,
          start: isDesktop ? "top 80%" : "top 90%",
          once: true,
          onEnter: function () {
            gsap.to(children, {
              autoAlpha: 1,
              y: 0,
              duration: isDesktop ? 0.8 : 0.4,
              stagger: customStagger || (isDesktop ? 0.15 : 0.08),
              ease: "circ.out",
              overwrite: true,
            });
          },
        });
      });

      // ── Mask Lines (scroll-triggered line-by-line mask reveal) ──
      document.querySelectorAll('[data-gsap="mask-lines"]').forEach(function (el) {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: function (self) {
            self.lines.forEach(function (line) {
              if (line.parentElement && line.parentElement !== el) {
                line.parentElement.style.paddingBottom = "0.2em";
              }
            });
            gsap.set(self.lines, { y: "130%" });
            gsap.set(el, { autoAlpha: 1 });

            ScrollTrigger.create({
              trigger: el,
              start: isDesktop ? "top 85%" : "top 90%",
              once: true,
              onEnter: function () {
                gsap.to(self.lines, {
                  y: "0%",
                  duration: isDesktop ? 0.8 : 0.55,
                  stagger: isDesktop ? 0.12 : 0.08,
                  ease: "power3.out",
                });
              },
            });
          },
        });
      });

      // ── Nav Background Fade ──
      // Transparent at top, fades to --_theme---nav--background on scroll.
      var navContain = document.querySelector(".nav_desktop_contain");
      if (navContain) {
        var navBg = getComputedStyle(document.documentElement)
          .getPropertyValue("--_theme---nav--background")
          .trim();

        if (navBg) {
          gsap.set(navContain, { backgroundColor: "rgba(255,255,255,0)" });

          gsap.to(navContain, {
            backgroundColor: navBg,
            ease: "none",
            scrollTrigger: {
              trigger: document.documentElement,
              start: "top -1",
              end: "top -80",
              scrub: true,
            },
          });
        }
      }

      // ════════════════════════════════════════════
      //  SCENES
      // ════════════════════════════════════════════

      // ── 0. Hero Scene ──
      // Premium page-load hero animation with staggered timeline.
      // Set data-gsap-scene="hero" on the hero section wrapper.
      // Roles:
      //   data-gsap-role="hero-heading"   — the heading element (SplitText line reveal)
      //   data-gsap-role="hero-paragraph" — the styled paragraph parent (mask-up + scramble)
      //   data-gsap-role="hero-image"     — the image/visual element (clip-path wipe + scale settle)
      //   data-gsap-role="hero-eyebrow"   — optional eyebrow (mask-up)
      document.querySelectorAll('[data-gsap-scene="hero"]').forEach(function (section) {
        var heading = section.querySelector('[data-gsap-role="hero-heading"]');
        var paragraph = section.querySelector('[data-gsap-role="hero-paragraph"]');
        var image = section.querySelector('[data-gsap-role="hero-image"]');
        var eyebrow = section.querySelector('[data-gsap-role="hero-eyebrow"]');

        // ── Set initial states ──
        if (heading) gsap.set(heading, { autoAlpha: 1 });
        if (paragraph) {
          gsap.set(paragraph, { autoAlpha: 0, y: isDesktop ? 30 : 15 });
        }
        // Image wipes in via clip-path from left to right
        if (image) {
          gsap.set(image, {
            clipPath: "inset(0 100% 0 0)",
            autoAlpha: 1,
          });
        }
        if (eyebrow) {
          gsap.set(eyebrow, { clipPath: "inset(0 0 0 0)", autoAlpha: 1 });
          gsap.set(eyebrow.children, { yPercent: 110, autoAlpha: 1 });
        }

        // ── Build timeline ──
        var tl = gsap.timeline({ delay: 0.1 });

        // Image: clip-path wipe from left to right (time-based only, no scale here)
        if (image) {
          tl.to(image, {
            clipPath: "inset(0 0% 0 0)",
            duration: isDesktop ? 1.2 : 0.8,
            ease: "power2.inOut",
          }, 0);
        }

        // Eyebrow: mask-up stagger (if present)
        if (eyebrow) {
          var eyebrowChildren = Array.prototype.slice.call(eyebrow.children);
          eyebrowChildren.forEach(function (child, index) {
            tl.to(child, {
              yPercent: 0,
              duration: isDesktop ? 0.7 : 0.45,
              ease: "power3.out",
            }, isDesktop ? 0.2 + (index * 0.1) : 0.15 + (index * 0.08));

            if (child.hasAttribute("data-gsap-scramble")) {
              var textTarget = child.querySelector("p, span, h1, h2, h3, h4, h5, h6") || child;
              var finalText = textTarget.textContent;
              var chars = child.getAttribute("data-gsap-scramble") || child.getAttribute("data-gsap-chars") || "upperCase";
              if (chars === "") chars = "upperCase";
              tl.to(textTarget, {
                duration: isDesktop ? 2 : 1,
                scrambleText: {
                  text: finalText,
                  chars: chars,
                  revealDelay: 0.4,
                  speed: 0.4,
                },
              }, isDesktop ? 0.25 + (index * 0.1) : 0.2 + (index * 0.08));
            }
          });
        }

        // Heading: SplitText line-by-line mask reveal
        if (heading) {
          SplitText.create(heading, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: function (self) {
              // Add padding to mask wrappers to prevent descender clipping (p, y, g, etc.)
              // Target parent of each line (the mask wrapper) rather than a class name
              self.lines.forEach(function (line) {
                if (line.parentElement && line.parentElement !== heading) {
                  line.parentElement.style.paddingBottom = "0.2em";
                }
              });
              gsap.set(self.lines, { y: "130%" });
              gsap.set(heading, { autoAlpha: 1 });
              self.lines.forEach(function (line, i) {
                tl.to(line, {
                  y: "0%",
                  duration: isDesktop ? 0.8 : 0.55,
                  ease: "power3.out",
                }, (isDesktop ? 0.3 : 0.2) + (i * (isDesktop ? 0.12 : 0.08)));
              });
            },
          });
        }

        // Paragraph: simple fade in with slight rise
        if (paragraph) {
          gsap.set(paragraph.children, { visibility: "inherit" });
          gsap.set(paragraph, { autoAlpha: 0, y: isDesktop ? 30 : 15 });
          var paraStart = isDesktop ? 0.9 : 0.6;
          tl.to(paragraph, {
            autoAlpha: 1,
            y: 0,
            duration: isDesktop ? 1 : 0.6,
            ease: "power2.out",
          }, paraStart);
        }

      });

      // ── 1. Image Scale Reveal ──
      document.querySelectorAll('[data-gsap-scene="image-reveal"]').forEach(function (section) {
        var img = section.querySelector('[data-gsap-role="image"]');
        var headline = section.querySelector('[data-gsap-role="headline"]');
        if (!img) return;

        gsap.set(img, { scale: 0.1, transformOrigin: "center center" });
        if (headline) gsap.set(headline, { autoAlpha: 0, y: 30 });

        var tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: isDesktop ? "+=200%" : "+=150%",
            pin: true,
            scrub: 1,
          },
        });

        tl.to(img, { scale: 1, ease: "none", duration: 1 });
        if (headline) {
          tl.to(headline, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.8);
        }
      });

      // ── 2. SVG Line Draw ──
      document.querySelectorAll('[data-gsap-scene="svg-draw"]').forEach(function (wrapper) {
        var paths = wrapper.querySelectorAll(
          "path, line, polyline, polygon, rect, ellipse, circle"
        );
        if (!paths.length) return;

        gsap.set(paths, { drawSVG: "0%" });

        var tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: isDesktop ? "top 70%" : "top 85%",
            end: isDesktop ? "bottom 30%" : "bottom 50%",
            scrub: 1,
          },
        });

        tl.to(paths, {
          drawSVG: "100%",
          duration: 1,
          ease: "none",
          stagger: 0.2,
        });
      });

      // ── 3. Horizontal Scroll (desktop only) ──
      if (isDesktop) {
        document.querySelectorAll('[data-gsap-scene="horizontal-scroll"]').forEach(function (section) {
          var track = section.querySelector(":scope > *");
          if (!track) return;

          var panels = track.querySelectorAll('[data-gsap-role="panel"]');
          if (panels.length < 2) return;

          gsap.to(track, {
            x: function () { return -(track.scrollWidth - window.innerWidth); },
            ease: "none",
            scrollTrigger: {
              trigger: section,
              pin: true,
              scrub: 1,
              start: "top top",
              end: function () { return "+=" + (track.scrollWidth - window.innerWidth); },
              invalidateOnRefresh: true,
            },
          });
        });
      }

      // ── 4. Parallax Depth Layers ──
      document.querySelectorAll('[data-gsap-scene="parallax"]').forEach(function (section) {
        var layers = section.querySelectorAll('[data-gsap-role="layer"]');
        if (!layers.length) return;

        layers.forEach(function (layer) {
          var speed = parseFloat(layer.getAttribute("data-gsap-speed") || "0");
          if (speed === 0) return;

          gsap.to(layer, {
            y: function () { return speed * (isDesktop ? 200 : 100); },
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        });
      });

      // ── 5. Number Counter ──
      document.querySelectorAll('[data-gsap-scene="counter"]').forEach(function (section) {
        var counters = section.querySelectorAll('[data-gsap-role="counter"]');
        if (!counters.length) return;

        counters.forEach(function (el) {
          var target = parseFloat(el.getAttribute("data-gsap-target") || "0");
          var suffix = el.getAttribute("data-gsap-suffix") || "";
          var prefix = el.getAttribute("data-gsap-prefix") || "";
          var isDecimal = target % 1 !== 0;

          var obj = { val: 0 };
          ScrollTrigger.create({
            trigger: section,
            start: isDesktop ? "top 75%" : "top 85%",
            once: true,
            onEnter: function () {
              gsap.to(obj, {
                val: target,
                duration: isDesktop ? 2 : 1.2,
                ease: "power2.out",
                onUpdate: function () {
                  el.textContent = prefix + (isDecimal ? obj.val.toFixed(1) : Math.round(obj.val)) + suffix;
                },
              });
            },
          });
        });
      });

      // ── 6. Magnetic Hover (desktop only) ──
      if (isDesktop) {
        document.querySelectorAll('[data-gsap-scene="magnetic"]').forEach(function (el) {
          var strength = parseFloat(el.getAttribute("data-gsap-strength") || "0.3");
          var xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
          var yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });

          el.addEventListener("mousemove", function (e) {
            var rect = el.getBoundingClientRect();
            var relX = e.clientX - rect.left - rect.width / 2;
            var relY = e.clientY - rect.top - rect.height / 2;
            xTo(relX * strength);
            yTo(relY * strength);
          });

          el.addEventListener("mouseleave", function () {
            xTo(0);
            yTo(0);
          });
        });
      }

      // ── 7. Glow Track ──
      // Mouse-following radial gradient spotlight. Desktop only, container > 50em.
      // Set data-gsap-scene="glow-track" on the grid wrapper.
      // Optional: data-gsap-glow-color="rgba(232,189,164,0.1)" to customise the glow colour.
      // Optional: data-gsap-glow-size="600" to customise the glow radius in px.
      if (isDesktop && !reduceMotion) {
        document.querySelectorAll('[data-gsap-scene="glow-track"]').forEach(function (el) {
          if (el.offsetWidth < 800) return;

          var pos = getComputedStyle(el).position;
          if (pos === "static") el.style.position = "relative";

          var glowColor = el.getAttribute("data-gsap-glow-color") || "color-mix(in srgb, var(--_theme---card-data-heading) 10%, transparent)";
          var glowSize = el.getAttribute("data-gsap-glow-size") || "600";

          var glowPos = { x: 0, y: 0 };

          var glow = document.createElement("div");
          glow.style.cssText = "position:absolute;inset:0;pointer-events:none;opacity:0;border-radius:inherit;overflow:hidden;z-index:1;";
          el.insertBefore(glow, el.firstChild);

          function renderGlow() {
            glow.style.background = "radial-gradient(" + glowSize + "px circle at " + glowPos.x + "px " + glowPos.y + "px, " + glowColor + " 0%, " + glowColor + " 10%, transparent 70%)";
          }

          var xTo = gsap.quickTo(glowPos, "x", { duration: 1.6, ease: "power3.out", onUpdate: renderGlow });
          var yTo = gsap.quickTo(glowPos, "y", { duration: 1.6, ease: "power3.out", onUpdate: renderGlow });

          el.addEventListener("mousemove", function (e) {
            var rect = el.getBoundingClientRect();
            xTo(e.clientX - rect.left);
            yTo(e.clientY - rect.top);
          });

          el.addEventListener("mouseenter", function () {
            gsap.to(glow, { opacity: 1, duration: 0.3, ease: "power2.out" });
          });

          el.addEventListener("mouseleave", function () {
            gsap.to(glow, { opacity: 0, duration: 0.5, ease: "power2.out" });
          });
        });
      }

      // ── 8. Flip Grid Filter ──
      document.querySelectorAll('[data-gsap-scene="flip-grid"]').forEach(function (scene) {
        var filters = scene.querySelectorAll('[data-gsap-role="filter"]');
        var items = scene.querySelectorAll('[data-gsap-role="grid-item"]');
        if (!filters.length || !items.length) return;

        filters.forEach(function (btn) {
          btn.addEventListener("click", function () {
            var category = btn.getAttribute("data-gsap-filter");

            filters.forEach(function (f) { f.classList.remove("active"); });
            btn.classList.add("active");

            var state = Flip.getState(items);

            items.forEach(function (item) {
              if (category === "all" || item.getAttribute("data-gsap-category") === category) {
                item.style.display = "";
              } else {
                item.style.display = "none";
              }
            });

            Flip.from(state, {
              duration: isDesktop ? 0.6 : 0.35,
              ease: "power2.inOut",
              scale: true,
              absolute: true,
              onEnter: function (elements) {
                gsap.fromTo(elements, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.4 });
              },
              onLeave: function (elements) {
                gsap.to(elements, { autoAlpha: 0, scale: 0.8, duration: 0.3 });
              },
            });
          });
        });
      });
    }
  );
});
