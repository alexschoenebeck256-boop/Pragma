import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/marketplace")({
  component: Marketplace,
});

const ASSET_CATEGORIES = [
  "All Categories",
  "Real Estate",
  "Fine Art",
  "Collectibles",
  "Commodities",
  "Private Equity",
  "Wine & Spirits",
];

const SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "apy", label: "Highest APY" },
  { value: "price", label: "Lowest Price" },
];

// Sample/mock data for the marketplace
const MOCK_ASSETS = [
  {
    id: "1",
    name: "Luxury Tower Manhattan",
    category: "Real Estate",
    emoji: "🏢",
    description:
      "Fractional ownership in a premium commercial tower in Midtown Manhattan. AAA tenant roster, 12% cap rate.",
    totalValue: 85_000_000,
    tokenPrice: 850,
    totalSupply: 100_000,
    availableTokens: 45_000,
    apy: "12%",
  },
  {
    id: "2",
    name: "Basquiat 'Untitled' 1982",
    category: "Fine Art",
    emoji: "🎨",
    description:
      "Fractional ownership of a certified Basquiat painting. Professionally vaulted, fully insured.",
    totalValue: 12_000_000,
    tokenPrice: 120,
    totalSupply: 100_000,
    availableTokens: 30_000,
    apy: "8.5%",
  },
  {
    id: "3",
    name: "Rolex Daytona 'Paul Newman'",
    category: "Collectibles",
    emoji: "⌚",
    description:
      "Tokenized ownership of a rare Rolex Daytona 6239 'Paul Newman' dial. Graded, authenticated, and insured.",
    totalValue: 950_000,
    tokenPrice: 95,
    totalSupply: 10_000,
    availableTokens: 4_200,
    apy: "15%",
  },
  {
    id: "4",
    name: "Gold Bullion Reserve",
    category: "Commodities",
    emoji: "🥇",
    description:
      "Tokenized LBMA-accredited gold bullion stored in Zurich. Fully allocated and audited monthly.",
    totalValue: 25_000_000,
    tokenPrice: 250,
    totalSupply: 100_000,
    availableTokens: 60_000,
    apy: "4%",
  },
  {
    id: "5",
    name: "Tech Unicorn Pre-IPO Fund",
    category: "Private Equity",
    emoji: "🏛️",
    description:
      "Diversified exposure to 12 pre-IPO tech companies. Managed by top-tier VC firm.",
    totalValue: 50_000_000,
    tokenPrice: 500,
    totalSupply: 100_000,
    availableTokens: 25_000,
    apy: "22%",
  },
  {
    id: "6",
    name: "Château Margaux 2005 Collection",
    category: "Wine & Spirits",
    emoji: "🍷",
    description:
      "A curated 120-bottle collection of Château Margaux 2005. Professionally stored, insured, and tradeable.",
    totalValue: 480_000,
    tokenPrice: 48,
    totalSupply: 10_000,
    availableTokens: 5_500,
    apy: "11%",
  },
];

function Marketplace() {
  const [category, setCategory] = useState("All Categories");
  const [sort, setSort] = useState("trending");

  const filteredAssets = MOCK_ASSETS.filter(
    (a) => category === "All Categories" || a.category === category,
  );

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sort) {
      case "apy":
        return (
          parseFloat(b.apy.replace("%", "")) -
          parseFloat(a.apy.replace("%", ""))
        );
      case "price":
        return a.tokenPrice - b.tokenPrice;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-dvh pt-16">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl font-heading">
              Marketplace
            </h1>
            <p className="mt-2 text-gray-400">
              Browse and invest in tokenized real-world assets.
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-dark"
            >
              {ASSET_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-dark"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Empty State */}
        {sortedAssets.length === 0 && (
          <div className="mt-24 text-center animate-fade-in">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800">
              <svg
                className="h-8 w-8 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">
              No assets match your filters
            </h3>
            <p className="mt-2 text-gray-400">
              Try adjusting your category or sort selection.
            </p>
            <button
              type="button"
              onClick={() => setCategory("All Categories")}
              className="btn-ghost mt-4 !text-accent-400"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedAssets.map((asset) => (
            <Link
              key={asset.id}
              to="/assets/$id"
              params={{ id: asset.id }}
              className="glass-card card-hover group block rounded-xl overflow-hidden"
            >
              {/* Gold top accent line */}
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-accent-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg text-2xl ${
                        asset.category === "Real Estate"
                          ? "gradient-real-estate"
                          : asset.category === "Fine Art"
                            ? "gradient-fine-art"
                            : asset.category === "Collectibles"
                              ? "gradient-collectibles"
                              : asset.category === "Commodities"
                                ? "gradient-commodities"
                                : asset.category === "Private Equity"
                                  ? "gradient-private-equity"
                                  : "gradient-wine"
                      }`}
                    >
                      {asset.emoji}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white font-heading group-hover:text-accent-400 transition-colors">
                        {asset.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {asset.category}
                      </span>
                    </div>
                  </div>
                  <span className="badge-gold">{asset.apy} APY</span>
                </div>

                <p className="mb-4 line-clamp-2 text-sm text-gray-400 leading-relaxed">
                  {asset.description}
                </p>

                <div className="mb-4 grid grid-cols-2 gap-2">
                  <div className="data-cell">
                    <div className="text-xs text-gray-500 font-medium">Token Price</div>
                    <div className="text-sm font-semibold text-white font-mono mt-0.5">
                      ${asset.tokenPrice.toLocaleString()}
                    </div>
                  </div>
                  <div className="data-cell">
                    <div className="text-xs text-gray-500 font-medium">Total Value</div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      ${(asset.totalValue / 1_000_000).toFixed(1)}M
                    </div>
                  </div>
                  <div className="data-cell">
                    <div className="text-xs text-gray-500 font-medium">Available</div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      {asset.availableTokens.toLocaleString()} /{" "}
                      {asset.totalSupply.toLocaleString()}
                    </div>
                  </div>
                  <div className="data-cell">
                    <div className="text-xs text-gray-500 font-medium">Progress</div>
                    <div className="mt-1.5 progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${((asset.totalSupply - asset.availableTokens) / asset.totalSupply) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="text-xs text-accent-400 mt-0.5">
                      {Math.round(
                        ((asset.totalSupply - asset.availableTokens) /
                          asset.totalSupply) *
                          100,
                      )}
                      % filled
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full rounded-lg border border-accent-500/30 py-2.5 text-sm font-medium text-accent-400 transition-all duration-200 hover:bg-accent-500 hover:text-surface-darker hover:shadow-gold"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `/assets/${asset.id}`;
                  }}
                >
                  Buy Tokens
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}