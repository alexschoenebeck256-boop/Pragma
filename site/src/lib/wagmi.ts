import { http, createStorage, cookieStorage } from "wagmi";
import { mainnet, sepolia, baseSepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

const projectId = "PRAGMA_WALLET_CONNECT_PROJECT_ID"; // Replace with actual WalletConnect project ID

export const wagmiConfig = getDefaultConfig({
  appName: "Pragma",
  projectId,
  chains: [baseSepolia, sepolia, mainnet],
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: true,
});