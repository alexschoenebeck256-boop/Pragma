import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/assets/$id")({
  component: AssetDetail,
});

// Mock data — in production, fetch from API
function getAsset(id: string) {
  const assets: Record<
    string,
    {
      name: string;
      category: string;
      emoji: string;
      description: string;
      longDescription: string;
      totalValue: number;
      tokenPrice: number;
      totalSupply: number;
      availableTokens: number;
      apy: string;
      minInvestment: number;
      owner: string;
      location: string;
      year: string;
    }
  > = {
    "1": {
      name: "Luxury Tower Manhattan",
      category: "Real Estate",
      emoji: "🏢",
      description:
        "Fractional ownership in a premium commercial tower in Midtown Manhattan.",
      longDescription:
        "A 45-story Class A office tower in the heart of Midtown Manhattan, featuring AAA-rated tenants with long-term leases. The property underwent a $120M renovation in 2022 and boasts LEED Platinum certification. With 98% occupancy and 12% cap rate, this asset offers stable yield with strong appreciation potential.",
      totalValue: 85_000_000,
      tokenPrice: 850,
      totalSupply: 100_000,
      availableTokens: 45_000,
      apy: "12%",
      minInvestment: 850,
      owner: "Pragma Property Trust",
      location: "Manhattan, New York",
      year: "2024",
    },
    "2": {
      name: "Basquiat 'Untitled' 1982",
      category: "Fine Art",
      emoji: "🎨",
      description:
        "Fractional ownership of a certified Basquiat painting.",
      longDescription:
        "A stunning Basquiat 'Untitled' (Skull) painting from 1982, authenticated by the Basquiat Authentication Committee. The work has been featured in multiple exhibitions and is currently held in a climate-controlled vault in Geneva. Provenance is fully documented on-chain.",
      totalValue: 12_000_000,
      tokenPrice: 120,
      totalSupply: 100_000,
      availableTokens: 30_000,
      apy: "8.5%",
      minInvestment: 120,
      owner: "Pragma Art Holdings",
      location: "Geneva, Switzerland",
      year: "2024",
    },
    "3": {
      name: "Rolex Daytona 'Paul Newman'",
      category: "Collectibles",
      emoji: "⌚",
      description:
        "Tokenized ownership of a rare Rolex Daytona 6239 'Paul Newman' dial.",
      longDescription:
        "An exceptional Rolex Daytona Reference 6239 with the iconic 'Paul Newman' exotic dial, manufactured circa 1968. Professionally graded and authenticated by the world's leading watch authentication service. The watch is stored in a secured, insured vault in Zurich.",
      totalValue: 950_000,
      tokenPrice: 95,
      totalSupply: 10_000,
      availableTokens: 4_200,
      apy: "15%",
      minInvestment: 95,
      owner: "Pragma Collectibles Fund",
      location: "Zurich, Switzerland",
      year: "2024",
    },
  };

  return (
    assets[id] ?? {
      name: "Unknown Asset",
      category: "Unknown",
      emoji: "❓",
      description: "Asset not found",
      longDescription: "",
      totalValue: 0,
      tokenPrice: 0,
      totalSupply: 0,
      availableTokens: 0,
      apy: "0%",
      minInvestment: 0,
      owner: "N/A",
      location: "N/A",
      year: "N/A",
    }
  );
}

function AssetDetail() {
  const { id } = Route.useParams();
  const asset = getAsset(id);
  const [buyAmount, setBuyAmount] = useState(1);
  const purchaseCost = buyAmount * asset.tokenPrice;

  const progressPercent =
    ((asset.totalSupply - asset.availableTokens) / asset.totalSupply) * 100;

  return (
    <div className="min-h-dvh pt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/marketplace" className="hover:text-white">
            Marketplace
          </Link>
          <span>/</span>
          <span className="text-gray-300">{asset.name}</span>
        </div>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Left — Asset Info */}
          <div className="lg:col-span-3">
            <div className="glass-card rounded-xl p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-800 text-3xl">
                  {asset.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-white sm:text-3xl">
                      {asset.name}
                    </h1>
                    <span className="rounded-full bg-brand-600/10 px-3 py-1 text-xs font-medium text-brand-400">
                      {asset.apy} APY
                    </span>
                  </div>
                  <p className="mt-1 text-gray-400">{asset.category}</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {asset.longDescription}
              </p>

              {/* Details Table */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <DetailRow label="Total Value" value={`$${(asset.totalValue / 1_000_000).toFixed(1)}M`} />
                <DetailRow label="Token Price" value={`$${asset.tokenPrice.toLocaleString()}`} />
                <DetailRow label="Total Supply" value={asset.totalSupply.toLocaleString()} />
                <DetailRow label="Available" value={asset.availableTokens.toLocaleString()} />
                <DetailRow label="Min Investment" value={`$${asset.minInvestment.toLocaleString()}`} />
                <DetailRow label="Owner" value={asset.owner} />
                <DetailRow label="Location" value={asset.location} />
                <DetailRow label="Year" value={asset.year} />
              </div>

              {/* Progress */}
              <div className="mt-8">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-gray-500">Funding Progress</span>
                  <span className="text-gray-300">
                    {progressPercent.toFixed(1)}% Filled
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right — Buy Panel */}
          <div className="lg:col-span-2">
            <div className="glass-card sticky top-24 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white">
                Buy Tokens
              </h2>
              <div className="mt-6">
                <label className="text-sm text-gray-500">
                  Number of Tokens
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setBuyAmount(Math.max(1, buyAmount - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700 text-gray-400 transition-colors hover:border-brand-600 hover:text-white"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={buyAmount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!Number.isNaN(val) && val > 0) {
                        setBuyAmount(val);
                      }
                    }}
                    className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-center text-white outline-none focus:border-brand-600"
                    min={1}
                    max={asset.availableTokens}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setBuyAmount(Math.min(asset.availableTokens, buyAmount + 1))
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700 text-gray-400 transition-colors hover:border-brand-600 hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-3 border-t border-gray-800 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price per token</span>
                  <span className="text-white">
                    ${asset.tokenPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Quantity</span>
                  <span className="text-white">{buyAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Protocol fee (1%)</span>
                  <span className="text-white">
                    ${(purchaseCost * 0.01).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-800 pt-3 text-base font-semibold">
                  <span className="text-gray-300">Total</span>
                  <span className="text-white">
                    ${(purchaseCost * 1.01).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="btn-primary mt-6 w-full"
                disabled={asset.availableTokens === 0}
              >
                {asset.availableTokens === 0
                  ? "Sold Out"
                  : "Connect Wallet to Buy"}
              </button>

              <p className="mt-4 text-center text-xs text-gray-500">
                Powered by smart contracts on Ethereum blockchain.
                <br />
                KYC/AML verification required for all transactions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-800/50 p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-gray-200">{value}</div>
    </div>
  );
}