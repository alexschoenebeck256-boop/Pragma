/**
 * Pragma Smart Contract Integration Layer
 *
 * Provides typed ABIs, contract addresses, and wagmi hooks for interacting
 * with Pragma's on-chain RWA tokenization contracts.
 *
 * Usage:
 *   import { useTokenBalance, pragmaAssetTokenAbi } from "~/lib/contracts";
 *   import { getAddresses } from "~/lib/contracts/addresses";
 */

// ABIs (auto-generated from forge build)
export {
  pragmaAssetTokenAbi,
  pragmaComplianceRegistryAbi,
  pragmaTokenFactoryAbi,
  pragmaFeeDistributorAbi,
} from "./abis";

// Contract addresses
export { addresses, getAddresses } from "./addresses";

// Wagmi hooks
export {
  useAssetToken,
  useTokenBalance,
  useTokenURI,
  useMint,
  useComplianceRegistry,
  useCanTransfer,
  useIsInvestorAllowed,
  useTokenFactory,
  usePredictAddress,
  useAssetCount,
  useFeeDistributor,
  useFeeRates,
  useTotalFeesCollected,
  buildMintArgs,
  buildBurnArgs,
  buildIssuanceFeeArgs,
  calculateIssuanceFee,
} from "./hooks";