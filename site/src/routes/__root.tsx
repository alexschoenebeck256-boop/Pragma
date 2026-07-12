import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  Link,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "~/styles/app.css?url";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Providers } from "~/lib/providers";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "Pragma — Real-World Asset Tokenization",
      },
      {
        name: "description",
        content:
          "Tokenize real estate, fine art, collectibles, and commodities into blockchain-based digital tokens. Unlock fractional ownership and 24/7 liquidity.",
      },
      { name: "theme-color", content: "#0B1120" },
      {
        property: "og:title",
        content: "Pragma — Real-World Asset Tokenization",
      },
      {
        property: "og:description",
        content:
          "Unlock liquidity from real-world assets. Fractional ownership, 24/7 trading, on-chain transparency.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/pragma-logo-icon.png" },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="text-center">
        <div className="text-6xl font-bold text-accent-500">404</div>
        <p className="mt-4 text-gray-400">Page not found</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Go home
        </Link>
      </div>
    </div>
  ),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <HeadContent />
      </head>
      <body>
        <Providers>
          <NavBar />
          {children}
        </Providers>
        <Scripts />
      </body>
    </html>
  );
}

function NavBar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-surface-darker/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gold-gradient">
              <span className="text-sm font-bold text-surface-darker font-heading">
                P
              </span>
            </div>
            <span className="text-lg font-bold text-white font-heading">
              Pragma
            </span>
          </Link>
        </div>
        <div className="hidden items-center gap-6 md:flex">
          <Link
            to="/marketplace"
            className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            activeProps={{ className: "text-white" }}
          >
            Marketplace
          </Link>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            activeProps={{ className: "text-white" }}
          >
            Dashboard
          </Link>
          <Link
            to="/admin"
            className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            activeProps={{ className: "text-white" }}
          >
            Tokenize
          </Link>
          <ConnectButton />
        </div>
        <MobileMenu />
      </div>
    </nav>
  );
}

function MobileMenu() {
  return (
    <div className="flex items-center gap-3 md:hidden">
      <ConnectButton accountStatus="avatar" chainStatus="none" />
    </div>
  );
}