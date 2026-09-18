# DugsiHub DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 20 · Fonts: 1 · Components: 0
> Icon library: not detected · State: not detected
> Primary theme: light · Dark mode toggle: no · Motion: subtle

---

## 1. Visual Theme & Atmosphere

This is a **light-themed** interface with a cool, approachable feel. The light background emphasizes content clarity. Typography uses **DM Sans** throughout — a clean, modern choice that maintains consistency. Spacing follows a **5px base grid** (standard density), with scale: 5, 10, 15, 20, 25, 30, 35, 40px. The accent color **#92b8ff** anchors interactive elements (buttons, links, focus rings). Motion is subtle — smooth transitions (150-300ms) ease state changes without drawing attention.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| background | `#f6f8fb` | background | Page background, darkest surface |
| surface | `#eeeaff` | surface | Card and panel backgrounds |
| text-primary | `#172033` | text-primary | Headings and body text |
| text-muted | `#9da8b9` | text-muted | Captions, placeholders, secondary info |
| accent | `#92b8ff` | accent | CTAs, links, focus rings, active states |
| success | `#0b9d62` | success | Success states, positive indicators |
| warning | `#fff0dd` | warning | Warning states, caution indicators |
| info | `#2563eb` | info | Informational highlights |
| unknown | `#8a95a8` | unknown | Palette color |
| unknown | `#d8e6ff` | unknown | Palette color |
| unknown | `#748096` | unknown | Palette color |
| unknown | `#7057c5` | unknown | Palette color |
| unknown | `#364257` | unknown | Palette color |
| unknown | `#c5d5f9` | unknown | Palette color |
| unknown | `#d9f7e9` | unknown | Palette color |
| unknown | `#67dca6` | unknown | Palette color |
| unknown | `#f59e0b` | unknown | Palette color |
| unknown | `#6ea4ff` | unknown | Palette color |
| unknown | `#d17c22` | unknown | Palette color |
| unknown | `#c8bef5` | unknown | Palette color |


---

## 3. Typography Rules

**Font Stack:**
- **DM Sans** — Heading 1, Heading 2, Heading 3, Body, Caption

**Font Sources:**

```css
@font-face {
  font-family: "DM Sans";
  src: url("fonts/DMSans-SemiBold.ttf") format("truetype");
  font-weight: 600;
}
@font-face {
  font-family: "DM Sans";
  src: url("fonts/DMSans-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "DM Sans";
  src: url("fonts/DMSans-Regular.ttf") format("truetype");
  font-weight: 400;
}
```

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | DM Sans | 48px / 3rem | 700 |
| Heading 2 | DM Sans | 32px / 2rem | 600 |
| Heading 3 | DM Sans | 24px / 1.5rem | 600 |
| Body | DM Sans | 16px / 1rem | 400 |
| Caption | DM Sans | 12px / 0.75rem | 400 |

**Typographic Rules:**
- Use **DM Sans** for all text — do not mix font families
- Maintain consistent hierarchy: no more than 3-4 font sizes per screen
- Headings use bold (600-700), body uses regular (400)
- Line height: 1.5 for body text, 1.2 for headings
- Use color and opacity for secondary hierarchy, not additional font sizes


---

## 4. Component Stylings

No components detected. Scan `src/components/` or `components/` to populate this section.

---

## 5. Layout Principles

- **Base spacing unit:** 5px
- **Spacing scale:** 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 70, 110
- **Border radius:** 2px, 3px, 4px, 4px 4px 1px 1px, 6px, 7px, 8px, 9px, 10px, 12px, 13px, 18px, 20px, inherit
- **Max content width:** 1260px

**Spacing as Meaning:**
| Spacing | Use |
|---|---|
| 2.5-5px | Tight: related items within a group |
| 10px | Medium: between groups |
| 15-20px | Wide: between sections |
| 30px+ | Vast: major section breaks |


---

## 6. Depth & Elevation

### Floating — dropdowns, popovers, modals

- `0 7px 15px rgba(37,99,235,.21)`
- `0 8px 16px rgba(37,99,235,.16)`
- `0 8px 20px rgba(37,99,235,.26)`

### Overlay — full-screen overlays, top-level dialogs

- `0 16px 28px rgba(24,59,146,.15)`
- `0 12px 22px rgba(10,39,105,.2)`
- `0 10px 24px rgba(23,32,51,.2)`

### Z-Index Scale

`1, 2, 3, 10, 11, 20, 30`



---

## 7. Animation & Motion

This project uses **subtle motion**. Transitions smooth state changes without demanding attention.

### CSS Animations

- `@keyframes slide-in`

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#92b8ff` for interactive elements (buttons, links, focus rings)
- Use `#f6f8fb` as the primary page background
- Use **DM Sans** for all UI text
- Follow the **5px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: 2px, 3px, 4px, 4px 4px 1px 1px, 6px

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't mix font families — use DM Sans consistently
- Don't use arbitrary spacing values — stick to multiples of 5px
- Don't create custom box-shadow values outside the system tokens
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't use backdrop-blur or blur effects

### Anti-Patterns (detected from codebase)

- No blur or backdrop-blur effects
- No zebra striping on tables/lists


---

## 9. Responsive Behavior

No breakpoints detected. Consider adding responsive breakpoints to the design system.

---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #eeeaff
Border: 1px solid var(--border)
Radius: 9px
Padding: 20px
Font: DM Sans
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg #92b8ff, text white
Ghost: bg transparent, border var(--border)
Padding: 10px 20px
Radius: 9px
Hover: opacity 0.9 or lighter shade
Focus: ring with #92b8ff
```

### Build a Page Layout

```
Background: #f6f8fb
Max-width: 1260px, centered
Grid: 5px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #eeeaff
Label: #9da8b9 (muted, 12px, uppercase)
Value: #172033 (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #f6f8fb
Input border: 1px solid var(--border)
Focus: border-color #92b8ff
Label: #9da8b9 12px
Spacing: 20px between fields
Radius: 9px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: DM Sans, type scale from Section 3
4. Spacing: 5px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```
