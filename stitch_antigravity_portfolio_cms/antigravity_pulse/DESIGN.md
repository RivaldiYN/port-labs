```markdown
# Design System Document: The Kinetic Void

## 1. Overview & Creative North Star: "The Kinetic Void"
This design system is built upon the concept of **The Kinetic Void**. We are moving away from the static, "boxed-in" nature of traditional web portfolios. The goal is to simulate a state of weightlessness—where elements don't just sit on a page; they orbit a central narrative.

Through the use of high-energy "Spotify Green" accents against a deep, multi-layered obsidian canvas, we create a sense of infinite depth. By leveraging intentional asymmetry, overlapping containers, and glassmorphism, we ensure the UI feels like a sophisticated HUD (Heads-Up Display) for a digital craftsperson. We do not use grids to "contain" content; we use them to "anchor" floating objects.

---

## 2. Colors: The Obsidian Spectrum
Our palette is rooted in the Material Design convention but applied with an editorial, high-contrast lens.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections or containers. Separation must be achieved through:
1.  **Tonal Shifts:** Placing a `surface_container_high` element against a `surface` background.
2.  **Negative Space:** Using the Spacing Scale to create "islands" of content.
3.  **Shadow Depth:** Using ambient, tinted glows to imply separation.

### Surface Hierarchy & Nesting
To achieve the "Antigravity" effect, we treat the UI as a series of physical layers floating in space. 
- **Base Layer:** `surface` (#131313) – The infinite void.
- **Mid Layer:** `surface_container_low` (#1c1b1b) – Secondary sections or background shifts.
- **Top Layer:** `surface_container_high` (#2a2a2a) – Primary cards and interactive modules.
- **Overlay Layer:** `surface_bright` (#393939) – Floating tooltips and active modals.

### The "Glass & Gradient" Rule
Standard flat surfaces are for templates. To create a premium feel:
- **Glassmorphism:** Use `surface_container_highest` at 60% opacity with a `backdrop-filter: blur(20px)`. This allows the "glow pulses" in the background to bleed through, maintaining the sense of depth.
- **Signature Textures:** Apply a subtle linear gradient to primary actions, transitioning from `primary` (#53e076) to `primary_container` (#1db954) at a 135-degree angle.

---

## 3. Typography: Editorial Authority
The typography system uses a high-contrast scale to separate technical data from creative expression.

*   **Display & Headlines (`epilogue`):** These are your "statements." Use `display-lg` with tight letter-spacing (-0.02em) for hero sections. The goal is a bold, architectural look that feels heavy enough to anchor the floating UI.
*   **Body & Titles (`plusJakartaSans`):** Designed for maximum readability. The `body-lg` (1rem) is the workhorse. It provides a human, approachable counterpoint to the brutalist headlines.
*   **Labels & Stats (`spaceGrotesk`):** Used for metadata, tags, and "code-like" stats. This monospaced-adjacent feel adds a layer of technical precision, perfect for the JetBrains-inspired request.

---

## 4. Elevation & Depth: The Antigravity Principle
We reject traditional shadows. Instead, we use **Tonal Layering** and **Ambient Light**.

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface_container_lowest` card sitting on a `surface` background creates a natural, soft recession. 
*   **Ambient Shadows:** For "floating" items, use an ultra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4)`. The shadow should be tinted with the `on_surface` color at 4% opacity to mimic real-world physics where dark surfaces still reflect ambient light.
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke, use a "Ghost Border": the `outline_variant` token at 15% opacity. Never use 100% opaque borders.
*   **Glow Pulses:** Use `primary` with a 20% opacity and a 100px blur behind key CTA areas to simulate energy radiating from the element.

---

## 5. Components

### Buttons: Kinetic Actuators
*   **Primary:** Solid `primary` background. No border. Soft-glam "glow" on hover using a 10px spread shadow of the same color. 
*   **Secondary:** Glassmorphic base (`surface_container_high` at 40% opacity) with a `surface_variant` ghost border.
*   **Rounding:** Use `full` (9999px) for a sleek, pill-shaped aesthetic that feels modern and aerodynamic.

### Cards: Floating Modules
*   **Structure:** No dividers. Use `title-md` and `body-sm` with a 24px vertical gap.
*   **Interaction:** On hover, a card should translate -8px Y-axis and increase its `backdrop-filter` intensity.

### Chips: Metadata Tags
*   **Style:** `label-md` using `spaceGrotesk`. 
*   **Visuals:** Use `surface_container_highest` with a 0.5rem radius. For "active" states, use `primary_fixed` text on a `primary_container` background.

### Input Fields: Minimalist HUD
*   **Style:** Bottom-border only (the "Ghost Border" at 20% opacity). When focused, the border transitions to 100% `primary` and a subtle `primary` glow appears behind the text.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical margins. If the left margin is 80px, try a 120px right margin to create a dynamic "editorial" flow.
*   **Do** overlap elements. Let a high-res image container slightly overlap a typography block to create physical depth.
*   **Do** ensure all text on `surface` meets WCAG 2.1 AA by using `on_surface` (#e5e2e1).

### Don't:
*   **Don't** use pure white (#FFFFFF). It breaks the "Kinetic Void" immersion. Use `on_surface` for the brightest highlights.
*   **Don't** use standard 1px dividers. If you need to separate content, use a 48px or 64px vertical space.
*   **Don't** use heavy, opaque shadows. If a shadow feels "muddy," reduce its opacity and increase the blur radius.
*   **Don't** use standard "bounce" animations. Use "expo-out" easing for a more sophisticated, premium movement.

---

*This design system is a living document intended to push the boundaries of the digital portfolio. Every pixel should feel like it is defying gravity.*