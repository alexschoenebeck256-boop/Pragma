# Pragma — Dashboard Design Spec

## Overview
This document specifies the design for Pragma's investor dashboard — the personal portfolio hub where users track their tokenized asset holdings, performance, and transaction history.

**Brand**: midnight blue `#0B1120` / gold `#D4A84B` / teal `#0D9488`
**Typography**: Inter Tight (headings), Inter (body), JetBrains Mono (data/prices)
**Route**: `/dashboard`

---

## States

### State 1: Disconnected / Wallet Not Connected
Shown when no wallet is connected. This is the default landing state.

```
┌─────────────────────────────────────────────────────────┐
│  Dashboard                                               │
│  Manage your portfolio, track performance, and view...   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│      ┌──────────────────────────────────────┐            │
│      │           [Wallet Icon]               │            │
│      │                                      │            │
│      │  Connect Your Wallet                  │            │
│      │  Connect your wallet to view your     │            │
│      │  portfolio of tokenized assets, track │            │
│      │  performance, and manage investments. │            │
│      │                                      │            │
│      │  [Connect Wallet] → top-right corner  │            │
│      └──────────────────────────────────────┘            │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Portfolio   │  │ Transaction │  │ Yield &     │     │
│  │ Overview    │  │ History     │  │ Rewards     │     │
│  │ Coming Soon │  │ Coming Soon │  │ Coming Soon │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

**Components**:
- **Wallet icon**: 80px circle with `bg-accent-500/10`, gold SVG wallet icon
- **Title**: "Connect Your Wallet" — font-heading, text-2xl, white
- **Body**: max-w-lg, gray-400
- **Helper text**: "Click 'Connect Wallet' in the top-right corner" — gold accent
- **Feature cards**: 3-column grid of glass cards with "Coming Soon" badges

### State 2: Loading / Portfolio Fetching
Shown while blockchain data is loading after wallet connects.

- All data sections show skeleton loading placeholders
- Use `animate-pulse` on gray-800 rectangles
- No shimmer animation needed — simple pulse is cleaner

### State 3: Connected — Full Dashboard
The primary state after wallet connection. Full layout described below.

### State 4: Empty Portfolio
Shown when wallet is connected but has no token holdings.

- Same structure as full dashboard
- Holdings area shows empty state with:
  - "No assets yet" heading
  - "Browse the marketplace to find your first investment" text
  - Gold "Explore Marketplace" CTA button linking to `/marketplace`

---

## Full Dashboard Layout (Connected)

```
┌─────────────────────────────────────────────────────────┐
│  Dashboard                          [Wallet Address ▼]  │
│  Track your portfolio and manage investments.           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┬──────────────────────────────────────┐ │
│  │              │                                       │ │
│  │  Portfolio   │  ┌──────────┐  ┌──────────┐          │ │
│  │  Snapshot    │  │ $XX,XXX  │  │ +X.XX%   │          │ │
│  │              │  │ Total    │  │ All Time │          │ │
│  │              │  │ Invested │  │ Return   │          │ │
│  │              │  └──────────┘  └──────────┘          │ │
│  │              │  ┌──────────┐  ┌──────────┐          │ │
│  │              │  │ X assets │  │ X.XX%    │          │ │
│  │              │  │ Holdings │  │ Avg APY  │          │ │
│  │              │  └──────────┘  └──────────┘          │ │
│  └──────────────┴──────────────────────────────────────┘ │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Portfolio Value Over Time           [1M] [3M] [1Y] │ │
│  │                                                     │ │
│  │  ┌─────────────────────────────────────────┐        │ │
│  │  │                                         │        │ │
│  │  │         [Area Chart Placeholder]        │        │ │
│  │  │     Smooth gradient fill gold→teal      │        │ │
│  │  │                                         │        │ │
│  │  └─────────────────────────────────────────┘        │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Holdings                          "View All →"     │ │
│  │                                                     │ │
│  │  ┌───┬──────────┬─────────┬────────┬──────┬───────┐│ │
│  │  │   │ Asset    │ Tokens  │ Value  │ APY  │ Actions││ │
│  │  ├───┼──────────┼─────────┼────────┼──────┼───────┤│ │
│  │  │ 🏢│ Luxury.. │ 150     │ $127K  │ 12%  │ [Sell]││ │
│  │  │ 🎨│ Basquiat │ 42      │ $5K     │ 8.5%│ [Sell]││ │
│  │  │ ⌚│ Rolex..  │ 10      │ $950    │ 15%  │ [Sell]││ │
│  │  └───┴──────────┴─────────┴────────┴──────┴───────┘│ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Recent Transactions          "View All →"           │ │
│  │                                                     │ │
│  │  ┌──────┬──────────┬──────────┬────────┬──────────┐│ │
│  │  │ Date │ Type     │ Asset    │ Amount │ Status   ││ │
│  │  ├──────┼──────────┼──────────┼────────┼──────────┤│ │
│  │  │ Jul12│ Purchase │ Luxury..│ 50 tok │ ✅ Done  ││ │
│  │  │ Jul10│ Sale     │ Basquiat│ 10 tok │ ✅ Done  ││ │
│  │  │ Jul5 │ Dividend │ Tower.. │ $2,400 │ ✅ Paid  ││ │
│  │  └──────┴──────────┴──────────┴────────┴──────────┘│ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌──────────────────┐  ┌───────────────────────────────┐ │
│  │ Asset Allocation │  │ Quick Actions                 │ │
│  │                  │  │                               │ │
│  │  ┌────────────┐  │  │ [Buy Tokens] → Marketplace   │ │
│  │  │            │  │  │ [Deposit]    → Add Funds     │ │
│  │  │   Pie      │  │  │ [Tokenize]   → Admin Portal  │ │
│  │  │   Chart    │  │  │                               │ │
│  │  │            │  │  └───────────────────────────────┘ │
│  │  └────────────┘  │                                   │
│  │                  │                                   │
│  │  ● Real Estate   │                                   │
│  │  ● Fine Art      │                                   │
│  │  ● Collectibles  │                                   │
│  └──────────────────┘                                   │
└─────────────────────────────────────────────────────────┘
```

---

## Section-by-Section Spec

### 1. Header Bar
```
Dashboard                          [0x7a2...b4f1 ▼]
Track your portfolio and manage investments.
```
- **Title**: "Dashboard" — `font-heading`, `text-3xl sm:text-4xl`, bold, white
- **Subtitle**: gray-400, default Inter
- **Wallet address**: Right-aligned, `font-mono`, `text-sm`, gray-400
  - Truncated format: `0x7a2...b4f1`
  - Click to copy (show tooltip "Copied!")
  - Dropdown for disconnect

### 2. Portfolio Snapshot Bar
A row of 4 stat cards showing portfolio overview:

| Stat | Format | Example |
|------|--------|---------|
| Total Invested | `$XX,XXX` | `$132,950` |
| All-Time Return | `+X.XX%` green | `+12.4%` |
| Holdings Count | `X assets` | `3 assets` |
| Average APY | `X.XX%` gold | `11.8%` |

**Card design**:
- `data-cell` background with `p-4`
- Label: `text-xs text-gray-500 font-medium uppercase tracking-wider`
- Value: `text-2xl font-bold font-heading`
  - Total Invested: white
  - Return: `text-success` (green) or `text-error` (red)
  - Count: white
  - Avg APY: `text-accent-400` gold

**Layout**: 4-column grid on desktop, 2-col on tablet, 2-col on mobile

### 3. Portfolio Value Chart
```
┌─────────────────────────────────────────────────────┐
│ Portfolio Value Over Time     [1M] [3M] [1Y] [All] │
│                                                     │
│  ┌─────────────────────────────────────────┐        │
│  │                                         │        │
│  │         [Area Chart — Recharts]         │        │
│  │                                         │        │
│  └─────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────┘
```

- **Title**: "Portfolio Value Over Time" — `text-lg font-semibold font-heading`
- **Time period pills**: `[1M] [3M] [1Y] [All]`
  - Active: `badge-gold` style
  - Inactive: `input-dark` style
- **Chart area**: 300px height minimum
- **Chart lib**: Recharts AreaChart
- **Gradient fill**: From `rgba(212,168,75,0.15)` to transparent
- **Line color**: `#D4A84B` gold
- **Grid lines**: `rgba(255,255,255,0.05)`
- **X-axis**: Date labels — gray-500, text-xs
- **Y-axis**: Dollar amounts — font-mono, gray-500, text-xs
- **Tooltip**: Dark glass card on hover showing exact value + date

### 4. Holdings Table
A full-width table showing all tokenized assets the user owns.

**Columns**:

| Col | Content | Style |
|-----|---------|-------|
| Icon | 32px emoji/icon with category gradient bg | `rounded-lg` |
| Asset Name | Asset name + category below | bold white + gray-500 xs |
| Tokens | Token balance | font-mono, white |
| Value | Current USD value | font-mono, white |
| APY | Yield rate | `badge-gold` |
| Actions | "Sell" button | `btn-ghost` style CTA |

**Row design**:
- `data-cell` background, alternate subtle shade
- Hover: `bg-white/[0.05]`
- Border-bottom: `border-white/5`

**Empty portfolio**:
- Same table structure but single row: "No assets yet — [Explore Marketplace]"
- Gold link to `/marketplace`

### 5. Recent Transactions Table

**Columns**:

| Col | Content | Style |
|-----|---------|-------|
| Date | Short date format | `text-sm text-gray-300` |
| Type | Purchase/Sale/Dividend/Yield | Badge: Purchase = green, Sale = teal, Dividend = gold |
| Asset | Asset name with emoji icon | White text |
| Amount | Token count or USD | font-mono |
| Status | ✅ Done / ⏳ Pending / ❌ Failed | Status with icon |

**Status colors**:
- Done: `text-success` green
- Pending: `text-warning` amber
- Failed: `text-error` red

**Layout**: Scrollable container with max-height, internal scroll if >5 rows

### 6. Asset Allocation (Donut Chart)
```
┌──────────────────┐
│ Asset Allocation │
│                  │
│     ┌──────┐     │
│     │ Pie  │     │
│     │ Chart│     │
│     └──────┘     │
│                  │
│  ● Real Estate   │
│  ● Fine Art      │
│  ● Collectibles  │
└──────────────────┘
```

- **Chart lib**: Recharts PieChart (donut variant)
- **Inner radius**: 60% of outer
- **Colors**: Match category gradients
  - Real Estate: `#3B6BF0`
  - Fine Art: `#D4A84B`
  - Collectibles: `#0D9488`
  - Commodities: `#64748B`
  - Private Equity: `#1A2D5D`
  - Wine & Spirits: `#B8862E`
- **Legend**: Below chart with colored dots + category name + percentage
- **Center text**: Total value in font-mono

### 7. Quick Actions Panel
```
┌───────────────────────────────┐
│ Quick Actions                 │
│                               │
│ [Buy Tokens]  → Marketplace   │
│ [Deposit]     → Add Funds     │
│ [Tokenize]    → Admin Portal  │
└───────────────────────────────┘
```

- 3 action rows, each with icon + label + gold arrow
- Each row is clickable, links to respective page
- Hover: `bg-white/[0.03]`

---

## Responsive Behavior

| Breakpoint | Layout Changes |
|------------|---------------|
| ≥1024px (desktop) | Full 2-column chart + allocations side-by-side, full-width tables |
| 640-1023px (tablet) | Stack layout, 2-column stat cards, scrollable tables |
| <640px (mobile) | Single column, stat cards go 2x2, tables become scrollable horizontally |

---

## Component Breakdown for Engineer

### New CSS Utilities Needed
```css
/* Stat card for dashboard */
.dashboard-stat {
  @apply data-cell p-4;
}

/* Mini table */
.table-dashboard {
  @apply w-full;
}
.table-dashboard th {
  @apply text-xs text-gray-500 font-medium uppercase tracking-wider text-left pb-3;
}
.table-dashboard td {
  @apply py-3 text-sm border-b border-white/5;
}

/* Wallet address chip */
.wallet-chip {
  @apply inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
}

/* Chart container */
.chart-container {
  @apply w-full rounded-xl p-4;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
}

/* Status badge */
.badge-status {
  @apply inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium;
}
.badge-status-success { @apply bg-success/10 text-success; }
.badge-status-pending { @apply bg-warning/10 text-warning; }
.badge-status-error { @apply bg-error/10 text-error; }
```

### States to Handle
1. **Not connected**: Connect wallet prompt + coming soon cards
2. **Connecting**: Loading spinner while wallet connects
3. **Connected + Loading**: Skeleton pulse on all sections
4. **Connected + Populated**: Full dashboard
5. **Connected + Empty Portfolio**: Full dashboard but holdings empty state + explore marketplace CTA
6. **Connected + Error**: Error state if blockchain call fails, with "Retry" button
7. **Reconnecting on page change**: Brief loading overlay

### Data Dependencies (to be implemented by Full-Stack Engineer)
- Wallet address → fetch portfolio from smart contract
- Token balances per user → map to asset metadata
- Historical value → chart data (on-chain or indexed)
- Transaction history → events from contract

### API Route Spec (for Engineer)
Ideally, the dashboard fetches from:
```
GET /api/portfolio?wallet=0x... → { totalInvested, return%, holdings[], chartData[], transactions[] }
```

### Color Coding for Asset Allocation
Map each asset category to its chart/icon color:
```
const CATEGORY_COLORS = {
  "Real Estate": "#3B6BF0",
  "Fine Art": "#D4A84B",
  "Collectibles": "#0D9488",
  "Commodities": "#64748B",
  "Private Equity": "#1A2D5D",
  "Wine & Spirits": "#B8862E",
};
```

---

## Accessibility
- All table rows have hover and focus states
- Charts have fallback text descriptions
- Color is never the only indicator (shapes + labels + colors)
- Wallet copy action announces "Copied to clipboard"
- Keyboard navigable table with arrow key row selection