import { useAccount, useReadContract, useWriteContract, usePublicClient } from "wagmi";
import { getAddresses } from "./addresses";
import { pragmaAssetTokenAbi, pragmaComplianceRegistryAbi, pragmaTokenFactoryAbi, pragmaFeeDistributorAbi } from "./abis";
import type { Address } from "viem";
import { parseEther } from "viem";

// ===========================
// PragmaAssetToken hooks
// ===========================

export function useAssetToken() {
  const { chainId } = useAccount();
  if (!chainId) return { address: undefined as Address | undefined, abi: pragmaAssetTokenAbi };
  const { assetToken } = getAddresses(chainId);
  return { address: assetToken as Address, abi: pragmaAssetTokenAbi };
}

/** Get token balance for an address */
export function useTokenBalance(account?: Address, tokenId?: bigint) {
  const { address, abi } = useAssetToken();
  return useReadContract({
    address,
    abi,
    functionName: "balanceOf",
    args: account && tokenId ? [account, tokenId] : undefined,
    query: { enabled: !!account && !!tokenId && !!address },
  });
}

/** Get token URI / metadata URL */
export function useTokenURI(tokenId?: bigint) {
  const { address, abi } = useAssetToken();
  return useReadContract({
    address,
    abi,
    functionName: "uri",
    args: tokenId ? [tokenId] : undefined,
    query: { enabled: !!tokenId && !!address },
  });
}

/** Mint tokens (requires MINTER_ROLE) */
export function useMint() {
  const { address, abi } = useAssetToken();
  return useWriteContract();
}

export function mintTokens(write: ReturnType<typeof useWriteContract>, to: Address, tokenId: bigint, amount: bigint) {
  const { address, abi } = useAssetToken();
  return write.writeContract({
    address: address!,
    abi,
    functionName: "mint",
    args: [to, tokenId, amount, "0x"],
  });
}

// ===========================
// PragmaComplianceRegistry hooks
// ===========================

export function useComplianceRegistry() {
  const { chainId } = useAccount();
  if (!chainId) return { address: undefined as Address | undefined, abi: pragmaComplianceRegistryAbi };
  const { complianceRegistry } = getAddresses(chainId);
  return { address: complianceRegistry as Address, abi: pragmaComplianceRegistryAbi };
}

/** Check if a transfer is allowed */
export function useCanTransfer(from: Address, to: Address, tokenId: bigint, amount: bigint) {
  const { address, abi } = useComplianceRegistry();
  return useReadContract({
    address,
    abi,
    functionName: "canTransfer",
    args: [from, to, tokenId, amount],
    query: { enabled: !!address },
  });
}

/** Check if an investor is allowed to hold a token */
export function useIsInvestorAllowed(investor: Address, tokenId: bigint, amount: bigint) {
  const { address, abi } = useComplianceRegistry();
  return useReadContract({
    address,
    abi,
    functionName: "isInvestorAllowed",
    args: [investor, tokenId, amount],
    query: { enabled: !!address },
  });
}

// ===========================
// PragmaTokenFactory hooks
// ===========================

export function useTokenFactory() {
  const { chainId } = useAccount();
  if (!chainId) return { address: undefined as Address | undefined, abi: pragmaTokenFactoryAbi };
  const { tokenFactory } = getAddresses(chainId);
  return { address: tokenFactory as Address, abi: pragmaTokenFactoryAbi };
}

/** Predict address for a new asset token */
export function usePredictAddress(salt: `0x${string}`) {
  const { address, abi } = useTokenFactory();
  return useReadContract({
    address,
    abi,
    functionName: "predictAddress",
    args: [salt],
    query: { enabled: !!address },
  });
}

/** Get asset count */
export function useAssetCount() {
  const { address, abi } = useTokenFactory();
  return useReadContract({
    address,
    abi,
    functionName: "assetCount",
    query: { enabled: !!address },
  });
}

// ===========================
// PragmaFeeDistributor hooks
// ===========================

export function useFeeDistributor() {
  const { chainId } = useAccount();
  if (!chainId) return { address: undefined as Address | undefined, abi: pragmaFeeDistributorAbi };
  const { feeDistributor } = getAddresses(chainId);
  return { address: feeDistributor as Address, abi: pragmaFeeDistributorAbi };
}

/** Get current fee rates */
export function useFeeRates() {
  const { address, abi } = useFeeDistributor();
  return useReadContract({
    address,
    abi,
    functionName: "feeRates",
    query: { enabled: !!address },
  });
}

/** Get total fees collected */
export function useTotalFeesCollected() {
  const { address, abi } = useFeeDistributor();
  return useReadContract({
    address,
    abi,
    functionName: "totalFeesCollected",
    query: { enabled: !!address },
  });
}

// ===========================
// PragmaAssetToken write helpers
// ===========================

/** Build args for a mint call */
export function buildMintArgs(to: Address, tokenId: bigint, amount: bigint) {
  return [to, tokenId, amount, "0x" as `0x${string}`] as const;
}

/** Build args for a burn call */
export function buildBurnArgs(from: Address, tokenId: bigint, amount: bigint) {
  return [from, tokenId, amount] as const;
}

/** Build args for issuance fee */
export function buildIssuanceFeeArgs(assetId: bigint, amount: bigint) {
  return [assetId, amount] as const;
}

/** Calculate issuance fee in ETH (based on current rate) */
export function calculateIssuanceFee(tradeAmount: bigint, issuanceBps: bigint): bigint {
  return (tradeAmount * issuanceBps) / 10000n;
}