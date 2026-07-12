import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="min-h-dvh pt-16">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 animate-fade-in">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white sm:text-4xl font-heading">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-400">
            Manage your portfolio, track performance, and view transaction
            history.
          </p>
        </div>

        {/* Connect Wallet CTA */}
        <div className="glass-card rounded-xl p-12 text-center mb-12 max-w-2xl mx-auto">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-accent-500/20"
            style={{ background: "rgba(212, 168, 75, 0.08)" }}
          >
            <svg
              className="h-10 w-10 text-accent-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">
            Connect Your Wallet
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-gray-400">
            Connect your wallet to view your portfolio of tokenized assets,
            track performance, manage investments, and participate in
            secondary market trading.
          </p>
          <div className="gold-accent-line mx-auto mt-6" />
          <p className="mt-6 text-sm text-accent-400 font-medium">
            Click "Connect Wallet" in the top-right corner to get started.
          </p>
        </div>

        {/* Dashboard Sections Coming Soon */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <SectionCard
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
              </svg>
            }
            title="Portfolio Overview"
            description="View your total invested value, realized and unrealized gains, and asset allocation across all tokenized assets."
          />
          <SectionCard
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Transaction History"
            description="Browse your complete history of token purchases, sales, transfers, and dividend payouts."
          />
          <SectionCard
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Yield & Rewards"
            description="Track your earned APY, dividend distributions, and staking rewards in real time."
          />
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-card card-hover relative rounded-xl p-6 group">
      {/* Coming soon badge */}
      <span className="badge-gold absolute right-4 top-4">Coming Soon</span>

      {/* Icon */}
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500/10 text-accent-400">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-white font-heading">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-400 leading-relaxed">
        {description}
      </p>

      {/* Skeleton preview */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-white/5" />
          <div className="h-3 flex-1 animate-pulse rounded bg-white/5" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-white/5" />
          <div className="h-3 flex-1 animate-pulse rounded bg-white/5" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-white/5" />
          <div className="h-3 flex-1 animate-pulse rounded bg-white/5" />
        </div>
      </div>
    </div>
  );
}