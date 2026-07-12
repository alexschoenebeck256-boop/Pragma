import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-gray-800">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-900/20 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
              Tokenized Real-World Assets
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Unlock{" "}
              <span className="gradient-text">Liquidity</span> for
              Real-World Assets
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 sm:text-xl">
              Tokenize real estate, fine art, collectibles, commodities, and
              private equity into blockchain-based digital tokens. Fractional
              ownership, 24/7 liquidity, and transparent on-chain provenance.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/marketplace" className="btn-primary">
                Explore Assets
              </Link>
              <Link to="/admin" className="btn-outline">
                Tokenize Your Asset
              </Link>
            </div>
          </div>
        </div>
        {/* Stats Bar */}
        <div className="border-t border-gray-800 bg-gray-900/50">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-8 sm:grid-cols-4 sm:px-6 lg:px-8">
            <Stat value="$0" label="Total Value Tokenized" />
            <Stat value="$0" label="Assets Under Tokenization" />
            <Stat value="0" label="Active Traders" />
            <Stat value="24/7" label="Secondary Market" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-gray-800 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-gray-400">
              From asset onboarding to secondary trading in four simple steps.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-4">
            <StepCard
              number="01"
              title="Submit Asset"
              description="Asset owners submit real-world assets for verification — real estate, collectibles, art, or commodities."
            />
            <StepCard
              number="02"
              title="Valuation & KYC"
              description="Professional valuation, legal due diligence, and KYC/AML checks ensure compliance and trust."
            />
            <StepCard
              number="03"
              title="Tokenization"
              description="Assets are minted as blockchain-based tokens with verifiable ownership records and smart contract governance."
            />
            <StepCard
              number="04"
              title="Trade 24/7"
              description="Tokens trade on secondary markets with instant settlement, deep liquidity, and transparent pricing."
            />
          </div>
        </div>
      </section>

      {/* Asset Classes */}
      <section className="border-b border-gray-800 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Supported Asset Classes
            </h2>
            <p className="mt-4 text-gray-400">
              Diversify your portfolio with tokenized exposure to real-world
              assets across every major category.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AssetClassCard
              emoji="🏢"
              title="Real Estate"
              description="Commercial, residential, and industrial properties — invest in prime real estate from any budget."
            />
            <AssetClassCard
              emoji="🎨"
              title="Fine Art"
              description="Masterpieces from renowned artists, authenticated and vault-stored with full provenance on-chain."
            />
            <AssetClassCard
              emoji="👟"
              title="Collectibles"
              description="Luxury watches, rare sneakers, trading cards, memorabilia — turn your collection into capital."
            />
            <AssetClassCard
              emoji="🌾"
              title="Commodities"
              description="Gold, silver, oil, agricultural products — commodity exposure without physical storage."
            />
            <AssetClassCard
              emoji="🏛️"
              title="Private Equity"
              description="Access to pre-IPO companies, venture funds, and growth-stage investments with lower minimums."
            />
            <AssetClassCard
              emoji="🍷"
              title="Wine & Spirits"
              description="Rare vintages and allocated spirits, professionally stored and insured, tradeable on secondary markets."
            />
          </div>
        </div>
      </section>

      {/* Why Pragma */}
      <section className="border-b border-gray-800 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Why Pragma
            </h2>
            <p className="mt-4 text-gray-400">
              Built for asset owners, investors, and traders who demand more
              from their assets.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <WhyCard
              title="Fractional Ownership"
              description="Own a piece of a $10M property for as little as $100. Lower barriers, broader access."
            />
            <WhyCard
              title="24/7 Liquidity"
              description="Trade tokenized assets any time, any day. No lock-up periods, no waiting for quarter-end."
            />
            <WhyCard
              title="On-Chain Provenance"
              description="Every transaction recorded on the blockchain. Full transparency, verifiable ownership history."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="glass-card rounded-2xl p-12">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to Tokenize the{" "}
              <span className="gradient-text">Real World</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              Whether you're an asset owner looking to unlock capital or an
              investor seeking diversified exposure — Pragma is your platform.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/admin" className="btn-primary">
                Start Tokenizing
              </Link>
              <Link to="/marketplace" className="btn-outline">
                Browse Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-600">
              <span className="text-xs font-bold text-white">P</span>
            </div>
            Pragma &copy; {new Date().getFullYear()}
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Docs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-white sm:text-3xl">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{label}</div>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-card rounded-xl p-6 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-600/20 text-lg font-bold text-brand-400">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-400">{description}</p>
    </div>
  );
}

function AssetClassCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-card group cursor-pointer rounded-xl p-6 transition-all hover:border-brand-600/50 hover:shadow-lg hover:shadow-brand-600/5">
      <div className="mb-4 text-3xl">{emoji}</div>
      <h3 className="text-lg font-semibold text-white group-hover:text-brand-400">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-400">{description}</p>
    </div>
  );
}

function WhyCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="glass-card rounded-xl p-8">
      <div className="mb-4 h-1 w-12 rounded-full bg-brand-600" />
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-gray-400">{description}</p>
    </div>
  );
}