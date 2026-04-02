/**
 * Protech GSAP — Bespoke Scenes
 *
 * Premium treatments for per-project use. Load only the plugins you need.
 *
 * Requires: gsap, ScrollTrigger (always)
 * Optional: DrawSVGPlugin, ScrambleTextPlugin, Flip (per scene)
 *
 * Usage (Bricks Attributes panel):
 *   data-gsap-scene="image-reveal"       — Pinned image scale-to-fullscreen
 *   data-gsap-scene="svg-draw"           — SVG stroke draw on scroll
 *   data-gsap-scene="horizontal-scroll"  — Horizontal scroll section
 *   data-gsap-scene="parallax"           — Multi-speed parallax layers
 *   data-gsap-scene="counter"            — Number counter roll-up
 *   data-gsap-scene="scramble"           — Scramble text reveal
 *   data-gsap-scene="magnetic"           — Magnetic hover effect
 *   data-gsap-scene="flip-grid"          — Animated filter grid (Flip)
 *
 * Element roles (children of scene containers):
 *   data-gsap-role="image"               — Target image (image-reveal)
 *   data-gsap-role="headline"            — Overlay headline (image-reveal)
 *   data-gsap-role="panel"               — Horizontal scroll panel
 *   data-gsap-role="layer"               — Parallax layer (set data-gsap-speed="-0.3" to "0.5")
 *   data-gsap-role="counter"             — Counter element (set data-gsap-target="1234")
 *   data-gsap-role="filter"              — Filter button (set data-gsap-filter="category|all")
 *   data-gsap-role="grid-item"           — Filterable grid item (set data-gsap-category="category")
 */
(function () {
  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add(
    {
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)",
      reduceMotion: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      const { isDesktop, isMobile, reduceMotion } = context.conditions;

      // ─────────────────────────────────────────────
      // 1. IMAGE SCALE REVEAL
      //    Pinned section, image scales from 10% to
      //    fullscreen, headline fades in, unpins.
      //
      //    Structure:
      //      <section data-gsap-scene="image-reveal" style="height:100vh; overflow:hidden; position:relative;">
      //        <img data-gsap-role="image" style="width:100%; height:100%; object-fit:cover;" />
      //        <div data-gsap-role="headline" style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center;">
      //          <h1>Headline</h1>
      //        </div>
      //      </section>
      // ─────────────────────────────────────────────
      document.querySelectorAll('[data-gsap-scene="image-reveal"]').forEach((section) => {
        const img = section.querySelector('[data-gsap-role="image"]');
        const headline = section.querySelector('[data-gsap-role="headline"]');
        if (!img) return;

        if (reduceMotion) {
          gsap.set(img, { scale: 1 });
          if (headline) gsap.set(headline, { autoAlpha: 1 });
          return;
        }

        gsap.set(img, { scale: 0.1, transformOrigin: "center center" });
        if (headline) gsap.set(headline, { autoAlpha: 0, y: 30 });

        const tl = gsap.timeline({
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

      // ─────────────────────────────────────────────
      // 2. SVG LINE DRAW
      //    Draws SVG strokes on scroll. Set the
      //    attribute on the <svg> or a wrapper.
      //    All <path>, <line>, <polyline>, <polygon>,
      //    <rect>, <ellipse>, <circle> inside will draw.
      //
      //    Structure:
      //      <div data-gsap-scene="svg-draw">
      //        <svg><path d="..." stroke="#000" stroke-width="2" fill="none" /></svg>
      //      </div>
      // ─────────────────────────────────────────────
      if (typeof DrawSVGPlugin !== "undefined") {
        gsap.registerPlugin(DrawSVGPlugin);

        document.querySelectorAll('[data-gsap-scene="svg-draw"]').forEach((wrapper) => {
          const paths = wrapper.querySelectorAll(
            "path, line, polyline, polygon, rect, ellipse, circle"
          );
          if (!paths.length || reduceMotion) return;

          gsap.set(paths, { drawSVG: "0%" });

          const tl = gsap.timeline({
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
      }

      // ─────────────────────────────────────────────
      // 3. HORIZONTAL SCROLL
      //    Pin a section, scroll vertically but panels
      //    move horizontally. Each panel should be
      //    100vw wide.
      //
      //    Structure:
      //      <section data-gsap-scene="horizontal-scroll" style="overflow:hidden;">
      //        <div style="display:flex; flex-wrap:nowrap; width:max-content;">
      //          <div data-gsap-role="panel" style="width:100vw;">Panel 1</div>
      //          <div data-gsap-role="panel" style="width:100vw;">Panel 2</div>
      //          <div data-gsap-role="panel" style="width:100vw;">Panel 3</div>
      //        </div>
      //      </section>
      // ─────────────────────────────────────────────
      if (isDesktop) {
        document.querySelectorAll('[data-gsap-scene="horizontal-scroll"]').forEach((section) => {
          const track = section.querySelector(":scope > *");
          if (!track || reduceMotion) return;

          const panels = track.querySelectorAll('[data-gsap-role="panel"]');
          if (panels.length < 2) return;

          gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              pin: true,
              scrub: 1,
              start: "top top",
              end: () => "+=" + (track.scrollWidth - window.innerWidth),
              invalidateOnRefresh: true,
            },
          });
        });
      }

      // ─────────────────────────────────────────────
      // 4. PARALLAX DEPTH LAYERS
      //    Elements inside move at different speeds.
      //    Set data-gsap-speed on each layer:
      //      negative = moves slower (background feel)
      //      positive = moves faster (foreground feel)
      //      0 = no parallax
      //
      //    Structure:
      //      <section data-gsap-scene="parallax">
      //        <img data-gsap-role="layer" data-gsap-speed="-0.3" />
      //        <h2 data-gsap-role="layer" data-gsap-speed="0.2" />
      //        <div data-gsap-role="layer" data-gsap-speed="0.5" />
      //      </section>
      // ─────────────────────────────────────────────
      document.querySelectorAll('[data-gsap-scene="parallax"]').forEach((section) => {
        const layers = section.querySelectorAll('[data-gsap-role="layer"]');
        if (!layers.length || reduceMotion) return;

        layers.forEach((layer) => {
          const speed = parseFloat(layer.getAttribute("data-gsap-speed") || "0");
          if (speed === 0) return;

          gsap.to(layer, {
            y: () => speed * (isDesktop ? 200 : 100),
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

      // ─────────────────────────────────────────────
      // 5. NUMBER COUNTER ROLL
      //    Counts from 0 to target value on scroll.
      //    Set the target number as data-gsap-target.
      //    Optionally set data-gsap-suffix (e.g. "+", "%")
      //    and data-gsap-prefix (e.g. "$", "#").
      //
      //    Structure:
      //      <div data-gsap-scene="counter">
      //        <span data-gsap-role="counter" data-gsap-target="1500" data-gsap-suffix="+">0</span>
      //        <span data-gsap-role="counter" data-gsap-target="98" data-gsap-suffix="%">0</span>
      //      </div>
      // ─────────────────────────────────────────────
      document.querySelectorAll('[data-gsap-scene="counter"]').forEach((section) => {
        const counters = section.querySelectorAll('[data-gsap-role="counter"]');
        if (!counters.length) return;

        counters.forEach((el) => {
          const target = parseFloat(el.getAttribute("data-gsap-target") || "0");
          const suffix = el.getAttribute("data-gsap-suffix") || "";
          const prefix = el.getAttribute("data-gsap-prefix") || "";
          const isDecimal = target % 1 !== 0;

          if (reduceMotion) {
            el.textContent = prefix + (isDecimal ? target.toFixed(1) : Math.round(target)) + suffix;
            return;
          }

          const obj = { val: 0 };
          ScrollTrigger.create({
            trigger: section,
            start: isDesktop ? "top 75%" : "top 85%",
            once: true,
            onEnter: () =>
              gsap.to(obj, {
                val: target,
                duration: isDesktop ? 2 : 1.2,
                ease: "power2.out",
                onUpdate: () => {
                  el.textContent =
                    prefix + (isDecimal ? obj.val.toFixed(1) : Math.round(obj.val)) + suffix;
                },
              }),
          });
        });
      });

      // ─────────────────────────────────────────────
      // 6. SCRAMBLE TEXT REVEAL
      //    Text scrambles through random characters
      //    before resolving. Techy / cyber feel.
      //
      //    Structure:
      //      <p data-gsap-scene="scramble">Your text here</p>
      //    Optional: data-gsap-chars="01" (default: upperCase)
      // ─────────────────────────────────────────────
      if (typeof ScrambleTextPlugin !== "undefined") {
        gsap.registerPlugin(ScrambleTextPlugin);

        document.querySelectorAll('[data-gsap-scene="scramble"]').forEach((el) => {
          if (reduceMotion) return;

          const finalText = el.textContent;
          const chars = el.getAttribute("data-gsap-chars") || "upperCase";

          gsap.set(el, { autoAlpha: 1 });
          ScrollTrigger.create({
            trigger: el,
            start: isDesktop ? "top 75%" : "top 85%",
            once: true,
            onEnter: () =>
              gsap.to(el, {
                duration: isDesktop ? 1.5 : 0.8,
                scrambleText: {
                  text: finalText,
                  chars: chars,
                  revealDelay: 0.3,
                  speed: 0.5,
                },
              }),
          });
        });
      }

      // ─────────────────────────────────────────────
      // 7. MAGNETIC HOVER
      //    Elements subtly pull toward the cursor.
      //    Desktop only — no hover on touch devices.
      //
      //    Structure:
      //      <button data-gsap-scene="magnetic">Click me</button>
      //    Optional: data-gsap-strength="0.3" (0-1, default 0.3)
      // ─────────────────────────────────────────────
      if (isDesktop && !reduceMotion) {
        document.querySelectorAll('[data-gsap-scene="magnetic"]').forEach((el) => {
          const strength = parseFloat(el.getAttribute("data-gsap-strength") || "0.3");
          const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });

          el.addEventListener("mousemove", (e) => {
            const rect = el.getBoundingClientRect();
            const relX = e.clientX - rect.left - rect.width / 2;
            const relY = e.clientY - rect.top - rect.height / 2;
            xTo(relX * strength);
            yTo(relY * strength);
          });

          el.addEventListener("mouseleave", () => {
            xTo(0);
            yTo(0);
          });
        });
      }

      // ─────────────────────────────────────────────
      // 8. FLIP GRID FILTER
      //    Animate items to new positions when
      //    filtering by category. Desktop only.
      //
      //    Structure:
      //      <div data-gsap-scene="flip-grid">
      //        <div><!-- filter buttons -->
      //          <button data-gsap-role="filter" data-gsap-filter="all" class="active">All</button>
      //          <button data-gsap-role="filter" data-gsap-filter="web">Web</button>
      //          <button data-gsap-role="filter" data-gsap-filter="brand">Brand</button>
      //        </div>
      //        <div><!-- grid -->
      //          <div data-gsap-role="grid-item" data-gsap-category="web">...</div>
      //          <div data-gsap-role="grid-item" data-gsap-category="brand">...</div>
      //        </div>
      //      </div>
      // ─────────────────────────────────────────────
      if (typeof Flip !== "undefined") {
        gsap.registerPlugin(Flip);

        document.querySelectorAll('[data-gsap-scene="flip-grid"]').forEach((scene) => {
          const filters = scene.querySelectorAll('[data-gsap-role="filter"]');
          const items = scene.querySelectorAll('[data-gsap-role="grid-item"]');
          if (!filters.length || !items.length) return;

          filters.forEach((btn) => {
            btn.addEventListener("click", () => {
              const category = btn.getAttribute("data-gsap-filter");

              // Update active state
              filters.forEach((f) => f.classList.remove("active"));
              btn.classList.add("active");

              // Capture state before changes
              const state = Flip.getState(items);

              // Show/hide items
              items.forEach((item) => {
                if (category === "all" || item.getAttribute("data-gsap-category") === category) {
                  item.style.display = "";
                } else {
                  item.style.display = "none";
                }
              });

              // Animate from old state to new
              Flip.from(state, {
                duration: reduceMotion ? 0 : (isDesktop ? 0.6 : 0.35),
                ease: "power2.inOut",
                scale: true,
                absolute: true,
                onEnter: (elements) =>
                  gsap.fromTo(elements, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.4 }),
                onLeave: (elements) =>
                  gsap.to(elements, { autoAlpha: 0, scale: 0.8, duration: 0.3 }),
              });
            });
          });
        });
      }
    }
  );
})();
