# Pragma — Marketplace & Asset Detail Design Spec

## Overview
This document specifies the design system for Pragma's marketplace (browse) page and asset detail page. These specs complement the existing implementation and ensure visual consistency with the Pragma brand identity.

**Brand Colors**: Midnight Blue `#0B1120` / Gold `#D4A84B` / Teal `#0D9488`
**Typography**: Inter Tight (headings), Inter (body), JetBrains Mono (data/prices)

---

## Marketplace Page (`/marketplace`)

### Layout
- **Header**: Page title + subtitle + filter bar
- **Filter bar**: Two dropdowns — "All Categories" and sort by (Trending, Newest, Highest APY, Lowest Price)
- **Grid**: 3-column responsive grid → 2-col tablet → 1-col mobile
- **Empty state**: "No assets match your filters" with illustration

### Asset Card Spec
Each card in the grid follows this layout (top to bottom):

```
┌─────────────────────────────────┐
│  ┌──────┐  Asset Name    [APY] │
│  │ icon │  Category             │
│  └──────┘                       │
│                                 │
│  Description (2-line clamp)     │
│                                 │
│  ┌─────────┬──────────────────┐ │
│  │ $Price  │ Total Value      │ │
│  │ Token   │ $XX.XM           │ │
│  ├─────────┼──────────────────┤ │
│  │ Avail   │ ████████░░ 55%   │ │
│  │ N / M   │ Progress         │ │
│  └─────────┴──────────────────┘ │
│                                 │
│  [Buy Tokens]                   │
└─────────────────────────────────┘
```

**Card Design**:
- Glass-morphism background (`bg-surface-dark/60`, `border-white/5`)
- Rounded `xl` (12px)
- Gold top accent line on hover (transition)
- Icon: 48px rounded container with gradient background matching asset class
- Badge: Pill with `bg-accent-500/10 text-accent-400` for APY
- Data grid: 2x2 mini-table with `bg-white/[0.03]` subtle background
- Progress bar: Gold gradient fill
- CTA button: Outlined gold (border variant) with gold text, fills solid gold on hover
- Full card is clickable (wrapped in `<Link>`)

### Filter Dropdown Design
- Dark input: `bg-surface-dark`, `border-white/10`, `text-gray-300`
- Focus: `border-accent-500/50` with gold ring
- Chevron icon: custom gold SVG

### Responsive Behavior
- Desktop (≥1024px): 3-column grid
- Tablet (640-1023px): 2-column grid  
- Mobile (<640px): 1-column, filters stack vertically, smaller card padding

---

## Asset Detail Page (`/assets/$id`)

### Layout — Desktop (≥1024px)

```
┌─────────────────────────────────────────────────────┐
│  Marketplace / Asset Name (breadcrumb)               │
├────────────────────────────┬────────────────────────┤
│                            │  ┌──────────────────┐  │
│  ┌──┐                     │  │  Buy Tokens        │  │
│  │  │  Asset Name   [APY] │  │                    │  │
│  └──┘  Category            │  │  ┌─┐ [  N  ] ┌─┐ │  │
│                            │  │  │-│ │      │ │+│ │  │
│  Description paragraph     │  │  └─┘ └──────┘ └─┘ │  │
│  (long form)               │  │                    │  │
│                            │  │  Price:   $XXX    │  │
│  ┌────────────┬──────────┐ │  │  Qty:     N      │  │
│  │ Total Val  │ Token $  │ │  │  Fee:     $X     │  │
│  ├────────────┼──────────┤ │  │  ─────────────── │  │
│  │ Supply     │ Avail    │ │  │  Total:   $XX    │  │
│  ├────────────┼──────────┤ │  │                    │  │
│  │ Min Inv    │ Owner    │ │  │  [Connect Wallet] │  │
│  ├────────────┼──────────┤ │  │                    │  │
│  │ Location   │ Year     │ │  │  Powered by...     │  │
│  └────────────┴──────────┘ │  └──────────────────┘  │
│                            │                         │
│  Funding Progress          │  (sticky on scroll)     │
│  ████████████░░░░ 55%      │                         │
└────────────────────────────┴────────────────────────┘
```

### Layout — Mobile (<1024px)
- Info panel stacks above buy panel
- Buy panel becomes full-width below info

### Hero Section
- Emoji/icon: 64px in rounded-xl container
- Title: 2xl/3xl font-heading bold white  
- APY badge: pill with gold gradient text/bg
- Category label: gray-400 small text

### Detail Table (8 data points in 2x4 grid)
Each cell:
- Background: `bg-white/[0.03]` or `bg-surface-dark`
- Label: uppercase text-xs gray-500
- Value: font-medium white
- Grid: 2 columns on desktop, 1 on mobile

### Buy Panel (Sticky Sidebar)
- Title: "Buy Tokens" in font-heading
- Quantity selector: decrement/increment buttons + centered input
- Cost breakdown: Price, Quantity, Fee (1%), Total
- CTA button: Full-width `btn-primary` (gold gradient)
- Disabled state: "Sold Out" when `availableTokens === 0`
- Powered by notice with smart contract link

### Funding Progress Bar
- Full-width track: `h-2.5 bg-gray-800` rounded
- Fill: `bg-gradient-to-r from-accent-500 to-accent-400` with subtle animation
- Label: "XX.X% Filled" with gold accent color
- On 100%: "Fully Funded" with green success text

### Breadcrumb
- "Marketplace / Asset Name"
- Separator: gold `→` arrow
- Marketplace link back to `/marketplace`

---

## Empty/Loading/Error States

### Loading (Skeleton)
- Cards show pulsing gray rectangles (already implemented via `animate-pulse`)
- Data values hide behind skeleton placeholders

### Empty Filters
```
┌─────────────────────────────────┐
│         🔍                       │
│  No assets match your filters    │
│  Try adjusting your search or    │
│  clearing the filters.           │
│                                 │
│  [Clear Filters]                 │
└─────────────────────────────────┘
```

### Asset Not Found (in detail)
- Use the same 404 style from `__root.tsx`
- "Asset not found" with link back to marketplace

---

## New CSS Components Needed

### Progress Bar (Gold)
```css
.progress-gold {
  @apply h-2.5 w-full overflow-hidden rounded-full bg-gray-800;
}
.progress-gold-fill {
  background: linear-gradient(90deg, #d4a84b, #e8c76a);
  @apply h-full rounded-full transition-all duration-500;
}
```

### Category Gradient Icons
Each asset class gets a gradient swatch:
- Real Estate: `from-royal to-sky`
- Fine Art: `from-accent-500 to-accent-400`
- Collectibles: `from-teal to-teal-light`
- Commodities: `from-neutral-400 to-neutral-600`
- Private Equity: `from-cobalt to-royal`
- Wine & Spirits: `from-accent-600 to-accent-500`

### Gold Badge
```css
.badge-gold {
  @apply rounded-full px-2.5 py-1 text-xs font-medium;
  background: rgba(212, 168, 75, 0.1);
  color: #d4a84b;
}
```

### Hover Card Lift
All interactive cards get:
```css
transition: all 0.2s ease;
&:hover {
  transform: translateY(-2px);
  border-color: rgba(212, 168, 75, 0.3);
  box-shadow: 0 8px 25px rgba(11, 17, 32, 0.12);
}
```

---

## Token Price Display Pattern
- All prices use the `font-mono` class (JetBrains Mono)
- Large values: abbreviate as $XX.XM / $XXXK
- Token amounts: show integer with comma separators
- Percentage changes: green for positive (`text-success`), red for negative (`text-error`)
- APY always shown with gold badge styling

---

## Accessibility Notes
- All interactive elements must have `type="button"` (already done)
- Color contrast: Gold text on dark bg passes WCAG AA (4.5:1)
- Focus states: `outline-2 outline-accent-500` on all interactive elements
- Alt text for all icons and images
- Keyboard navigation: Tab order follows visual layout (left panel → right panel)