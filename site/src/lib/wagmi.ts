import { http, createStorage, cookieStorage } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

const projectId = "PRAGMA_WALLET_CONNECT_PROJECT_ID"; // Replace with actual WalletConnect project ID

export const wagmiConfig = getDefaultConfig({
  appName: "Pragma",
  projectId,
  chains: [mainnet, sepolia],
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
});