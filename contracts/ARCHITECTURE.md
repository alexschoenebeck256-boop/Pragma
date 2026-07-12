# Pragma — Smart Contract Architecture v1

> **Status:** Proposed  
> **Author:** Smart Contract Engineer  
> **Date:** 2026-07-12  
> **Applies to:** v1 (MVP) tokenization platform

---

## 1. Overview

Pragma tokenizes real-world assets (RWAs) — real estate, commodities, fine art, private equity, and high-ticket collectibles — into blockchain-based digital tokens. The smart contract layer is responsible for:

- Representing fractional ownership of RWAs as on-chain tokens
- Enforcing regulatory compliance (KYC/AML, accredited investor checks, transfer restrictions)
- Providing a standardized factory for deploying new asset tokens
- Collecting protocol fees (issuance, management, trading, custody)

**Security and auditability are the top priorities.** Every contract uses battle-tested OpenZeppelin implementations, and all state-changing functions include access control and reentrancy guards.

### Guiding Principles

1. **Compliance-first** — transfer restrictions and identity verification are enforced at the contract level, not off-chain
2. **Upgradable by design** — regulatory requirements evolve; contracts use OpenZeppelin UUPS proxies
3. **Gas-efficient** — batch operations, minimal storage reads/writes, ERC-1155 for multi-token efficiency
4. **Progressive decentralization** — v1 starts with controlled admin roles; future versions decentralize authority

---

## 2. Token Standard Decision

### Considered Options

| Standard | Pros | Cons |
|----------|------|------|
| **ERC-1400** (Security Token) | Built-in transfer restrictions, document management, partition support | Poor ecosystem support, limited tooling, no modern audit patterns |
| **ERC-3643** (T-REX) | Production-ready RWA standard, modular compliance, used by real issuers | Heavy deployment, complex on-chain identity, overkill for v1 |
| **ERC-1155** (Multi-Token) | Gas-efficient batching, single contract for many assets, battle-tested with OpenZeppelin | No built-in compliance — must layer on access control |
| **ERC-721** (NFT) | Simple, widely supported | One token type per contract, poor for fractionalization |

### Recommendation: ERC-1155 + Access Control (v1)

**Start with ERC-1155** combined with custom access control and compliance modules. Rationale:

1. **Single contract for all assets** — a single ERC-1155 contract can represent many different asset classes (token ID 1 = "123 Main St Real Estate", token ID 2 = "Rare Rolex Daytona", etc.)
2. **Gas-efficient batching** — users can mint/burn/transfer multiple token types in one transaction
3. **Battle-tested** — OpenZeppelin's ERC-1155 is audited and widely deployed
4. **Progressive enhancement** — compliance can be added as modifier checks without forking the token contract
5. **Easier upgrading** — one proxy for all token types, not one per asset

**Evolve to ERC-3643 in v2** when regulatory requirements demand a more formal framework (e.g., on-chain identity, claim issuance, investor accreditation oracles).

---

## 3. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     User / Client Layer                      │
│  (Web App, SDK, Ethers.js, Wagmi)                           │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                     Proxy / Relayer                          │
│  (Meta-transactions, gas sponsorship for non-custodial UX)   │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    Smart Contract Layer                       │
│                                                              │
│  ┌──────────────────┐   ┌──────────────────┐                 │
│  │   Asset Token    │   │   Compliance     │                 │
│  │   (ERC-1155)     │──▶│   Registry       │                 │
│  │   UUPS Proxy     │   │   (Identity +    │                 │
│  │                  │   │    Allowlist)     │                 │
│  │  - mint()        │   │                  │                 │
│  │  - burn()        │   │  - isAllowed()   │                 │
│  │  - safeTransfer()│   │  - addInvestor() │                 │
│  │  - uri()         │   │  - removeInvestor│                 │
│  └────────┬─────────┘   └────────┬─────────┘                 │
│           │                      │                           │
│           │         ┌────────────▼────────────┐              │
│           │         │    Token Factory         │              │
│           ├────────▶│                          │              │
│           │         │  - createAssetToken()    │              │
│           │         │  - setCompliance()       │              │
│           │         │  - setFeeCollector()     │              │
│           │         └────────────┬────────────┘              │
│           │                      │                           │
│           │         ┌────────────▼────────────┐              │
│           └────────▶│    Fee Distributor      │              │
│                     │                          │              │
│                     │  - collectIssuanceFee()  │              │
│                     │  - collectTradingFee()   │              │
│                     │  - distributeToTreasury()│              │
│                     └──────────────────────────┘              │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. Core Contract Specifications

### 4.1 AssetToken (PragmaAssetToken.sol)

An ERC-1155 token contract representing fractional ownership in real-world assets.

#### Key Design Decisions

- **UUPS Upgradeable** — uses OpenZeppelin's `UUPSUpgradeable` pattern (cheaper than Transparent Proxy for most use cases)
- **AccessControl** — OpenZeppelin's `AccessControlUpgradeable` with roles:
  - `DEFAULT_ADMIN_ROLE` — contract admin (multi-sig in production)
  - `MINTER_ROLE` — can mint tokens (Factory contract, issuer)
  - `BURNER_ROLE` — can burn tokens (Factory, issuer)
  - `PAUSER_ROLE` — can pause transfers (emergency only)
  - `COMPLIANCE_ROLE` — can update compliance configuration
- **Compliance hook** — every transfer checks against the ComplianceRegistry via `_beforeTokenTransfer`
- **URI storage** — each token ID can have an independent metadata URI pointing to off-chain asset documentation

#### Interface

```solidity
interface IPragmaAssetToken {
    // --- Asset Management ---
    function mint(
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes memory data
    ) external;

    function mintBatch(
        address to,
        uint256[] calldata tokenIds,
        uint256[] calldata amounts,
        bytes memory data
    ) external;

    function burn(
        address from,
        uint256 tokenId,
        uint256 amount
    ) external;

    // --- Asset Configuration ---
    function setTokenURI(uint256 tokenId, string memory uri_) external;

    function setComplianceRegistry(address registry) external;

    // --- Pausing ---
    function pause() external;
    function unpause() external;
}
```

### 4.2 ComplianceRegistry (PragmaComplianceRegistry.sol)

The central compliance engine that governs who can hold and transfer tokens.

#### Key Features

- **Investor whitelist** — only KYC-approved addresses can hold tokens
- **Investor tiers** — accredited, qualified, or retail (each with different holding limits)
- **Asset-class restrictions** — certain assets may have additional restrictions (e.g., 30-day holding period)
- **Jurisdiction gating** — geo-fencing by jurisdiction code
- **Transfer allow/block** — fine-grained rules for each token ID

#### Interface

```solidity
interface IComplianceRegistry {
    // --- Identity Management ---
    function addInvestor(
        address investor,
        bytes32 countryCode,
        InvestorTier tier,
        uint256 expiry
    ) external;

    function removeInvestor(address investor) external;

    function isInvestorAllowed(
        address investor,
        uint256 tokenId,
        uint256 amount
    ) external view returns (bool);

    // --- Transfer Check (called by AssetToken) ---
    function canTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount
    ) external view returns (bool, bytes memory reason);

    // --- Asset Config ---
    function setAssetRestriction(
        uint256 tokenId,
        AssetRestriction calldata restriction
    ) external;

    // --- Role Management ---
    function addComplianceOfficer(address officer) external;
    function removeComplianceOfficer(address officer) external;
}
```

#### Data Structures

```solidity
enum InvestorTier { Retail, Accredited, Qualified }

struct AssetRestriction {
    bool requiresAccreditation;       // only accredited investors
    uint256 minHoldingPeriod;         // seconds before resale allowed
    uint256 maxHoldPerAddress;        // max tokens per address
    bool jurisdictionLimited;         // geo-fenced?
    bytes32[] allowedJurisdictions;   // country codes if geo-fenced
}

struct Investor {
    bool active;
    InvestorTier tier;
    bytes32 countryCode;
    uint256 kycExpiry;
}
```

### 4.3 TokenFactory (PragmaTokenFactory.sol)

The factory contract that standardizes the deployment and configuration of new asset tokens.

#### Key Features

- **Clones the AssetToken implementation** via minimal proxy (ERC-1167) for cheap deployment
- **Configures the new token** with its ComplianceRegistry and FeeDistributor
- **Emits an event** for off-chain indexers to track new asset deployments
- **Admin limited** — only `DEFAULT_ADMIN_ROLE` can create new tokens

#### Interface

```solidity
interface ITokenFactory {
    event AssetCreated(
        uint256 indexed assetId,
        address indexed tokenContract,
        string name,
        string symbol,
        uint256 totalSupply,
        address issuer
    );

    function createAssetToken(
        string calldata name,
        string calldata symbol,
        string calldata uri,
        address complianceRegistry,
        address feeDistributor
    ) external returns (address tokenContract);

    function setImplementation(address newImpl) external;

    function setDefaultCompliance(address complianceRegistry) external;

    // --- Fee Configuration ---
    function setIssuanceFeeBps(uint256 bps) external;
    function setTreasury(address treasury) external;
}
```

### 4.4 FeeDistributor (PragmaFeeDistributor.sol)

Collects and distributes protocol fees.

#### Fee Types

| Fee Type | Rate (bps) | Payer | Description |
|----------|-----------|-------|-------------|
| **Issuance** | 100 bps (1%) | Asset issuer | Paid when minting tokens |
| **Management** | 50 bps (0.5%) / yr | Asset holder | Accrued continuously on AUT |
| **Trading** | 25 bps (0.25%) | Buyer + Seller | Paid on secondary market swaps |
| **Custody** | Variable | Asset issuer | Optional, for physical asset storage |

#### Interface

```solidity
interface IFeeDistributor {
    function collectIssuanceFee(uint256 tokenId, uint256 amount) external payable;

    function collectTradingFee(
        address buyer,
        address seller,
        uint256 tokenId,
        uint256 amount,
        uint256 price
    ) external payable;

    function distributeToTreasury() external;

    // --- Admin ---
    function setFeeRates(
        uint256 issuanceBps,
        uint256 managementBps,
        uint256 tradingBps
    ) external;

    function setTreasury(address treasury) external;

    function setAssetToken(address token) external;
}
```

---

## 5. Compliance & Regulatory Design

### 5.1 Transfer Flow

```
  User A                    AssetToken              ComplianceRegistry
    │                          │                          │
    │ approveTransfer(to, id)  │                          │
    │─────────────────────────▶│                          │
    │                          │ canTransfer(from, to,    │
    │                          │            id, amount)   │
    │                          │─────────────────────────▶│
    │                          │                          │
    │                          │◀── (allowed, reason) ───│
    │                          │                          │
    │   ┌─── if rejected ──────┤                          │
    │   │                      │                          │
    │   │ revert("Transfer     │                          │
    │   │ not compliant")     │                          │
    │   │                      │                          │
    │   └──────────────────────┤                          │
    │                          │                          │
    │   ┌─── if allowed ───────┤                          │
    │   │                      │                          │
    │   │ _mint(to, id, amt)   │                          │
    │   │ emit TransferSingle  │                          │
    │   │                      │                          │
    │◀──│──────────────────────│                          │
    │   │                      │                          │
    │   └──────────────────────┤                          │
    │                          │                          │
```

### 5.2 KYC/AML Integration Points

The ComplianceRegistry is designed to work with both:

1. **Off-chain KYC provider** — an admin/relayer calls `addInvestor()` after off-chain verification completes
2. **On-chain oracle** (v2) — a DID/verifiable-credentials oracle feeds identity attestations on-chain

### 5.3 Jurisdiction Gating

Each investor's `countryCode` (ISO 3166-1 alpha-2) is set during onboarding. Asset restrictions can limit transfers to specific jurisdictions. This is critical for:

- **OFAC sanctions compliance** — block addresses from sanctioned countries
- **Securities registration** — restrict to countries where the offering is registered (e.g., Reg D 506(c) in the US, STO framework in the EU)

---

## 6. Upgradability Strategy

### 6.1 UUPS Pattern

All core contracts use the **UUPS (Universal Upgradeable Proxy Standard)** pattern:

- **Cheaper than Transparent Proxy** — upgrade logic lives in the implementation, not a separate admin contract
- **EIP-1822 compliant** — standard proxy bytecode
- **OpenZeppelin audited** — `UUPSUpgradeable` from `@openzeppelin/contracts-upgradeable`

### 6.2 Upgrade Governance

| Phase | Upgrade Authority | Notes |
|-------|-------------------|-------|
| v1 (MVP) | Multi-sig (3/5) | Team-controlled, fast iteration |
| v2 (Growth) | Timelock + Multi-sig | 48-hour timelock for transparency |
| v3 (Mature) | DAO vote | Token holders vote on upgrades |

### 6.3 Storage Layout

Storage is append-only per OpenZeppelin's upgradeable guidelines. Each contract version adds new storage variables after existing ones, using gaps (`__gap`) for forward compatibility.

```solidity
contract PragmaAssetToken is
    ERC1155Upgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    // v1 storage
    IComplianceRegistry public complianceRegistry;
    mapping(uint256 => string) private _tokenURIs;

    // gap for future upgrades
    uint256[48] private __gap;
}
```

---

## 7. Implementation Plan

### Phase 1: Core Contracts (v1 MVP)

| Contract | Complexity | Dependencies | Estimated Effort |
|----------|-----------|-------------|-----------------|
| PragmaAssetToken | Medium | OpenZeppelin: ERC-1155, AccessControl, Pausable, UUPSUpgradeable | 2 days |
| PragmaComplianceRegistry | Medium | OpenZeppelin: AccessControl | 2 days |
| PragmaTokenFactory | Low | OpenZeppelin: Clones, AccessControl | 1 day |
| PragmaFeeDistributor | Low | OpenZeppelin: ReentrancyGuard | 1 day |

### Phase 2: Testing & Security

- **Unit tests** (Hardhat/Foundry) — 90%+ coverage on all contracts
- **Fuzz testing** — invariant testing with Foundry fuzzing
- **Integration tests** — multi-contract scenarios (mint → comply → transfer → fee)
- **Slither static analysis** — automated security review
- **Gas benchmarks** — optimize hot paths (transfers, batch mints)

### Phase 3: Deployment & Verification

- **Ethereum Sepolia testnet** — thorough staging deployment
- **Mainnet deployment** — via Hardhat deploy scripts with multi-sig
- **Contract verification** — Etherscan (or Blockscout) source verification
- **Subgraph / Indexer** — The Graph for off-chain querying

---

## 8. Deployment Target Recommendation

Choosing the right chain is critical for RWA tokenization — the balance of security, cost, ecosystem maturity, and regulatory posture directly impacts product viability.

### Evaluation Criteria

| Criterion | Weight | Rationale |
|-----------|--------|-----------|
| **Security & finality** | Critical | RWA tokens represent real assets; chain reorgs or downtime are unacceptable |
| **Gas cost** | High | Fractional ownership means frequent small transfers; sub-$0.10 per tx is ideal |
| **Ecosystem & composability** | Medium | DeFi integrations (DEXs, lending) add value but are v2 concerns |
| **Regulatory posture** | High | Chain/validator alignment with合规 compliance norms reduces legal risk |
| **Retail onboarding** | High | Fiat on-ramps, smart wallet support, and low barriers draw investors |
| **Bridge / L1 settlement** | Medium | Settlement security of the L1 the L2 settles to matters for long-term trust |

### Chain Comparison

| Chain | Gas (per tx) | Security Model | Ecosystem | Regulatory Fit | Verdict |
|-------|-------------|----------------|-----------|---------------|---------|
| **Ethereum L1** | $5–50 | Maximum (L1) | Largest | Neutral — fully permissionless | ❌ Too expensive for fraction trading |
| **Arbitrum One** | $0.01–0.10 | L2 optimistic rollup (Ethereum) | Very large (3B+ TVL) | Neutral | ✅ Great secondary option |
| **Optimism** | $0.01–0.10 | L2 optimistic rollup (Ethereum) | Large (1B+ TVL) | Neutral | ✅ Good, slightly less TVL than Arbitrum |
| **Base** | $0.01–0.10 | L2 optimistic rollup (Ethereum, OP Stack) | Large, fast-growing | **Strong** — Coinbase-regulated | ✅✅ **Primary recommendation** |
| **Polygon POS** | $0.001–0.01 | Sidechain (checkpoint to Ethereum) | Very large | Mixed — past reorgs raise concerns | ⚠️ Cheap but security trade-offs |
| **Arbitrum Nova** | < $0.01 | AnyTrust (off-chain data availability) | Small | Neutral | ❌ Too niche for v1 |
| **zkSync Era** | $0.05–0.20 | L2 zk-rollup (Ethereum) | Medium | Neutral | ⏳ Emerging — consider for v2 |
| **Scroll** | $0.05–0.20 | L2 zk-rollup (Ethereum) | Small | Neutral | ⏳ Too early |

### Recommendation: Base (Primary) + Arbitrum (Secondary)

#### Why Base is the Primary Choice

1. **Regulatory alignment with Coinbase** — Base is incubated by Coinbase, a US-regulated public company. For a platform tokenizing securities-adjacent RWAs, having the chain backed by a regulated entity reduces counterparty risk and aligns with Pragma's compliance-first approach. Coinbase's compliance infrastructure (blockchain analytics, KYC tooling) is a natural integration point.

2. **Retail onboarding** — Coinbase's 100M+ verified users can onboard to Base natively. Coinbase Smart Wallet (account abstraction) removes the seed-phrase barrier for non-crypto-native investors — critical for Pragma's target audience of collectors and traditional investors.

3. **OP Stack versatility** — Base runs on the OP Stack, meaning it inherits Optimism's ecosystem while remaining independent. It can also bridge to Superchain ecosystem for future cross-chain liquidity.

4. **Gas costs** — Sub-cent transactions make fraction trading economically viable. At $0.01/tx, even small-dollar trades (<$100) are practical.

5. **Growing RWA ecosystem** — Projects like BlackRock's BUIDL, Ondo Finance, and Centrifuge are on or expanding to Base. This signals growing institutional confidence.

#### Why Arbitrum is the Secondary (Cold-Standby)

1. **Largest L2 by TVL** ($3B+) — deepest liquidity and most DeFi integrations for when Pragma expands to lending/borrowing
2. **Battle-tested** — longest-running optimistic rollup with no major incidents
3. **Fallback deployment** — deploy to Arbitrum if regulatory headwinds emerge on Base, or for multi-chain v2

#### Why Not Ethereum L1
Gas costs make it economically infeasible for sub-$10,000 fraction trades. Even a simple ERC-1155 transfer at $10 in gas would be 1% of a $1,000 position — excessive for frequent trading. L1 is reserved for high-value assets (entire property deeds, etc.) if at all.

### Rollout Plan

```
Phase 1 (MVP)          Phase 2 (Growth)        Phase 3 (Scale)
     │                      │                       │
     ▼                      ▼                       ▼
┌──────────┐         ┌──────────────┐        ┌────────────────┐
│  Base    │         │  Base +      │        │  Base +        │
│  Sepolia │  ───→   │  Arbitrum    │  ───→  │  Arbitrum +    │
│  (test)  │         │  (mainnet)   │        │  Ethereum L1   │
└──────────┘         └──────────────┘        │  (high-value)  │
                                             └────────────────┘
```

### Bridge Strategy
Base uses the native **Base Bridge** (powered by the OP Stack bridge) for deposits/withdrawals. Security inherits from Ethereum L1 with a ~7-day fraud proof window (standard optimistic rollup).

For v1, all liquidity is native to Base. Cross-chain bridging to Arbitrum is a v2 feature using LayerZero or Wormhole.

---

## 9. Tooling & Environment

| Tool | Purpose |
|------|---------|
| **Foundry (forge)** | Smart contract development & testing |
| **OpenZeppelin Contracts** | Audited base implementations |
| **OpenZeppelin Contracts-Upgradeable** | Upgradeable contract base classes |
| **Solhint** | Solidity linting |
| **Slither** | Static analysis |
| **Hardhat** (optional) | Deployment scripts & task runner |
| **Ethers.js / viem** | Contract interaction from JS/TS |

### Project Structure

```
contracts/
├── ARCHITECTURE.md          # This document
├── foundry.toml             # Foundry config
├── remappings.txt           # Solidity remappings
├── lib/
│   ├── forge-std/           # Foundry standard library
│   └── openzeppelin-contracts/  # OpenZeppelin (git submodule / npm)
├── src/
│   ├── PragmaAssetToken.sol
│   ├── PragmaComplianceRegistry.sol
│   ├── PragmaTokenFactory.sol
│   └── PragmaFeeDistributor.sol
├── script/
│   ├── Deploy.s.sol         # Deployment script
│   └── Upgrade.s.sol        # Upgrade script
└── test/
    ├── PragmaAssetToken.t.sol
    ├── PragmaComplianceRegistry.t.sol
    ├── PragmaTokenFactory.t.sol
    └── PragmaFeeDistributor.t.sol
```

---

## 10. Gas Estimates (Preliminary)

| Operation | Estimated Gas | Notes |
|-----------|--------------|-------|
| Create asset token (factory) | ~150k | ERC-1167 clone + config |
| Mint tokens | ~80k | Single token type |
| Batch mint (5 types) | ~120k | ERC-1155 batch efficiency |
| Transfer (compliant) | ~65k | Includes compliance check |
| Add investor to whitelist | ~45k | Admin operation |
| Collect issuance fee | ~30k | Simple ETH transfer |

---

## 11. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Regulatory change** | High - contract becomes non-compliant | UUPS proxies allow upgrades; ComplianceRegistry is hot-swappable |
| **Compromised admin key** | Critical - attacker upgrades contracts or mints tokens | Multi-sig from day 1; timelock in v2 |
| **KYC oracle failure** | Medium - legitimate users blocked | Admin override for emergency; off-chain fallback process |
| **Flash loan attack** | Low - no lending/borrowing in v1 | ReentrancyGuard on fee collection; pause mechanism |
| **Token holder concentration** | Medium - single holder owns >50% | Optional max-hold-per-address restriction per asset |
| **Oracle manipulation** | Low - no price oracles in v1 | All valuations off-chain initially |

---

## 12. Future Considerations (v2+)

- **ERC-3643 (T-REX) migration** — formal on-chain identity with `OnchainID` and `ClaimIssuer`
- **Airdrop / dividend distribution** — automatic revenue sharing to token holders
- **Lending & borrowing** — allow token holders to use fractions as collateral
- **Layer 2 deployment** — Arbitrum/Optimism for lower gas costs
- **Cross-chain bridges** — Wormhole or LayerZero for multi-chain liquidity
- **DAO governance** — token holders vote on protocol parameters
- **Verifiable credentials** — decentralized identity with DIDs
- **Token-gated content** — exclusive access to asset performance reports, valuation updates

---

## 13. Approval Checklist

- [ ] Architecture reviewed by cross-functional team
- [ ] Token standard decision approved (ERC-1155 + Access Control)
- [ ] Compliance model reviewed by legal counsel
- [ ] Upgrade governance model approved
- [ ] Fee structure aligned with revenue model (business plan)
- [ ] Deployment target approved (Base → Arbitrum → L1 rollout plan)
- [ ] Multi-sig signers identified
- [ ] Base Sepolia testnet deployment confirmed
- [ ] Mainnet funding secured (Base native ETH for gas)
