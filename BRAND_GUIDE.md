# Pragma — Brand Identity Guide

## Brand Overview
Pragma tokenizes real-world assets (real estate, fine art, commodities, collectibles, private equity) into blockchain-based digital tokens, enabling fractional ownership and 24/7 liquidity.

**Tone**: Sophisticated, trustworthy, modern, approachable. Pragmatic in the best sense — grounded in real value, powered by smart technology.

**Tagline**: *Real Assets. Real Liquidity. Real Pragma.*

---

## Logo

The Pragma logo consists of a geometric **P** mark — a stylized hexagon fragment suggesting both blockchain nodes and a vault/strongbox — paired with the wordmark "Pragma" set in the brand typeface.

**Logo variations** (files in `/home/team/shared/design/`):
- `pragma-logo-horizontal.png` — Full logo with wordmark (preferred for header/hero)
- `pragma-logo-icon.png` — Icon-only mark (favicon, app icon, social avatar)
- `pragma-logo-vertical.png` — Stacked version for tight spaces

---

## Color Palette

### Primary Colors
| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--color-primary-900` | Midnight | `#0B1120` | Hero backgrounds, dark mode surfaces |
| `--color-primary-800` | Deep Navy | `#0F1B33` | Cards, sections |
| `--color-primary-700` | Cobalt | `#1A2D5D` | Interactive elements |
| `--color-primary-500` | Royal Blue | `#3B6BF0` | Primary buttons, links, active states |
| `--color-primary-400` | Sky Blue | `#6B93F5` | Hover states, highlights |

### Accent — Gold (Premium / Value)
| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--color-accent-500` | Pragma Gold | `#D4A84B` | CTAs, badges, premium highlights |
| `--color-accent-400` | Light Gold | `#E8C76A` | Hover states, decorative elements |
| `--color-accent-600` | Deep Gold | `#B8862E` | Darker accents |

### Accent — Teal (Growth / Modern)
| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--color-secondary-500` | Pragma Teal | `#0D9488` | Secondary actions, success states |
| `--color-secondary-400` | Light Teal | `#2DD4BF` | Hover, highlights |

### Neutral
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-neutral-50` | `#F8FAFC` | Page backgrounds (light) |
| `--color-neutral-100` | `#F1F5F9` | Card backgrounds (light) |
| `--color-neutral-200` | `#E2E8F0` | Borders, dividers |
| `--color-neutral-400` | `#94A3B8` | Muted text |
| `--color-neutral-600` | `#475569` | Body text |
| `--color-neutral-800` | `#1E293B` | Headings (light mode) |
| `--color-neutral-900` | `#0F172A` | Dark mode text |

### Semantic
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | `#059669` | Positive returns, confirmed transactions |
| `--color-warning` | `#D97706` | Price alerts, pending actions |
| `--color-error` | `#DC2626` | Losses, errors, declined transactions |

---

## Typography

### Headings
- **Font**: `Inter Tight` (Google Font)
- **Weights**: 600 (Semibold), 700 (Bold), 800 (Extrabold)
- **Tracking**: -0.02em for all headings
- **Scale**: 4xl (Hero), 3xl (Section), 2xl (Card), xl (Subsection)

### Body
- **Font**: `Inter` (Google Font)
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold)
- **Line height**: 1.6 (body), 1.4 (small text)
- **Size base**: 1rem / 16px

### Monospace (Data, Prices, Token IDs)
- **Font**: `JetBrains Mono` (Google Font)
- **Weights**: 400, 500
- **Usage**: Token prices, wallet addresses, contract IDs, numerical values

---

## Design Tokens (Tailwind CSS)

```css
/* In tailwind.config or CSS custom properties */
:root {
  /* Colors (as above) */
  --color-primary-900: #0B1120;
  --color-primary-800: #0F1B33;
  --color-primary-700: #1A2D5D;
  --color-primary-500: #3B6BF0;
  --color-primary-400: #6B93F5;
  --color-accent-500: #D4A84B;
  --color-accent-400: #E8C76A;
  --color-accent-600: #B8862E;
  --color-secondary-500: #0D9488;
  --color-secondary-400: #2DD4BF;

  /* Spacing */
  --space-section: 6rem;
  --space-container: 1280px;

  /* Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  /* Shadows */
  --shadow-card: 0 1px 3px rgba(11, 17, 32, 0.06), 0 1px 2px rgba(11, 17, 32, 0.04);
  --shadow-elevated: 0 10px 25px rgba(11, 17, 32, 0.08);
  --shadow-glow: 0 0 20px rgba(212, 168, 75, 0.15);
}
```

---

## Iconography
- **Style**: Line-art with rounded caps, 1.5px stroke
- **Size grid**: 16px, 20px, 24px, 32px
- **Library preference**: Lucide Icons (open-source, matches style)
- **Color**: Primary-500 or Accent-500 for emphasis

---

## Imagery / Photography
- **Style**: High-contrast, slightly underexposed, warm-tinted
- **Subjects**: Real architecture details, macro shots of materials (wood grain, canvas texture, metal finish), ambient shots of luxury spaces
- **Treatment**: Dark gradient overlays with gold accent light leaks
- **Avoid**: Stock-photo clichés (handshakes, graphs, generic city skylines)

---

## UI Component Patterns

### Cards
- Dark navy background (`primary-800`)
- Subtle border (`rgba(255,255,255,0.06)`)
- Gold accent line on top edge
- Hover: slight lift + glow

### Buttons
- **Primary**: Gold gradient background, dark text, rounded-lg
- **Secondary**: Outlined with primary-500, transparent bg
- **Ghost**: No bg, text only, subtle hover

### Data Display
- Monospace font for prices and token amounts
- Green for positive / Red for negative
- Small progress bars for ownership fractions