import type { Address } from "viem";
import { baseSepolia, sepolia } from "viem/chains";

/**
 * Pragma contract addresses per chain.
 * Placeholders — update with real addresses after deployment.
 */
export const addresses: Record<number, { assetToken: Address; complianceRegistry: Address; tokenFactory: Address; feeDistributor: Address }> = {
  // Base Sepolia (primary testnet)
  [baseSepolia.id]: {
    assetToken: "0x0000000000000000000000000000000000000000", // TODO: deploy & update
    complianceRegistry: "0x0000000000000000000000000000000000000000", // TODO: deploy & update
    tokenFactory: "0x0000000000000000000000000000000000000000", // TODO: deploy & update
    feeDistributor: "0x0000000000000000000000000000000000000000", // TODO: deploy & update
  },
  // Sepolia (fallback testnet)
  [sepolia.id]: {
    assetToken: "0x0000000000000000000000000000000000000000",
    complianceRegistry: "0x0000000000000000000000000000000000000000",
    tokenFactory: "0x0000000000000000000000000000000000000000",
    feeDistributor: "0x0000000000000000000000000000000000000000",
  },
};

/**
 * Get contract addresses for a given chain ID.
 * Throws if the chain is not supported.
 */
export function getAddresses(chainId: number) {
  const entry = addresses[chainId];
  if (!entry) throw new Error(`Unsupported chain: ${chainId}. Supported: ${Object.keys(addresses).join(", ")}`);
  return entry;
}