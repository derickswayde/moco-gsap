# Moco AI — GSAP Animation System

Data-attribute driven animations for Webflow. No native Webflow interactions needed.

## Setup

### 1. Head Code (Site Settings > Custom Code > Head Code)
Paste the contents of `webflow-head.html`. This prevents FOUC (flash of unstyled content) by hiding animated elements before GSAP initialises.

### 2. Body Code (Site Settings > Custom Code > Footer Code)
Paste the contents of `webflow-body.html`. This loads GSAP from CDN and initialises all animations.

### 3. Applying Animations
In the Webflow Designer, select an element and go to **Element Settings (D) > Custom Attributes**.
Add the attribute name and value from the tables below.

---

## Utilities — `data-gsap`

| Value | Behaviour | Trigger |
|-------|-----------|---------|
| `fade-load` | Fade + rise on page load | Page load |
| `fade-up` | Fade + rise on scroll enter | Scroll (batch) |
| `fade-up-scrub` | Fade + rise scrubbed to scroll position | Scroll (per-element) |
| `slide-right` | Slide in from left (fade-only on mobile) | Scroll (batch) |
| `slide-left` | Slide in from right (fade-only on mobile) | Scroll (batch) |
| `text-fade` | Opacity fade on scroll enter | Scroll (batch) |
| `scramble` | Scramble text on scroll enter | Scroll (per-element) |
| `stagger-up` | Stagger children upward — **set on the parent** | Scroll (per-parent) |
| `hero-lines` | SplitText line-by-line mask reveal | Page load |
| `hero-chars` | SplitText character stagger with rotation | Page load |
| `hero-words` | SplitText word-by-word mask reveal | Page load |

### Utility modifiers

| Attribute | Used with | Purpose |
|-----------|-----------|---------|
| `data-gsap-chars` | `scramble` | Character set ("01", "upperCase", etc.) |
| `data-gsap-stagger` | `stagger-up` | Custom stagger timing (e.g. "0.2") |

---

## Scenes — `data-gsap-scene`

| Value | Behaviour | Notes |
|-------|-----------|-------|
| `image-reveal` | Pinned image scales from 10% to fullscreen, headline fades in | — |
| `svg-draw` | SVG strokes draw on scroll | Uses DrawSVGPlugin |
| `horizontal-scroll` | Vertical scroll drives horizontal panels | Desktop only |
| `parallax` | Multi-speed parallax layers within a section | — |
| `counter` | Numbers count up from 0 on scroll enter | — |
| `magnetic` | Elements pull toward cursor on hover | Desktop only |
| `flip-grid` | Animated filter grid with smooth repositioning | Uses Flip |

### Scene child roles — `data-gsap-role`

| Role | Used in | Purpose |
|------|---------|---------|
| `image` | `image-reveal` | The image that scales |
| `headline` | `image-reveal` | Overlay text that fades in |
| `panel` | `horizontal-scroll` | Each horizontal panel (set width: 100vw) |
| `layer` | `parallax` | A parallax layer |
| `counter` | `counter` | Number element |
| `filter` | `flip-grid` | Filter button |
| `grid-item` | `flip-grid` | Filterable item |

### Scene modifiers

| Attribute | Used in | Purpose |
|-----------|---------|---------|
| `data-gsap-speed` | `parallax` | Layer speed: negative = slower, positive = faster |
| `data-gsap-target` | `counter` | Target number to count to |
| `data-gsap-prefix` | `counter` | Text before number (e.g. "$") |
| `data-gsap-suffix` | `counter` | Text after number (e.g. "%", "+") |
| `data-gsap-strength` | `magnetic` | Pull strength 0–1 (default 0.3) |
| `data-gsap-filter` | `flip-grid` | Category to filter by ("all" shows everything) |
| `data-gsap-category` | `flip-grid` | Category this item belongs to |

---

## Eyebrow Scramble Example

To apply the scramble effect to the Typography - Eyebrow component:

1. Select the eyebrow **text element** (`u-eyebrow-text`)
2. Element Settings > Custom Attributes
3. Add: `data-gsap` = `scramble`
4. Optionally add: `data-gsap-chars` = `upperCase` (or `"01"` for binary, etc.)

---

## Breakpoint Behaviour

| | Desktop (768px+) | Mobile (<768px) |
|---|---|---|
| Movement | Full transforms (50px rise, 80px slides) | Reduced (20px rise, no slides) |
| Duration | Longer (0.8–1.8s) | Shorter (0.4–0.6s) |
| Stagger | 0.10–0.15s | 0.05–0.08s |
| Horizontal scroll | Active | Disabled |
| Magnetic hover | Active | Disabled |

## Reduced Motion

When `prefers-reduced-motion: reduce` is active:
- All elements are shown at their final state instantly
- No transforms, no scrambles, no parallax
- Counters show final numbers without animation
- FOUC prevention CSS is still cleared by GSAP
