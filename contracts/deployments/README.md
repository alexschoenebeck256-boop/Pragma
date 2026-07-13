# Pragma Contract Deployments

This directory tracks deployed contract addresses across environments.
Update after each deployment.

## Base Sepolia (primary testnet)

| Contract | Address | Deploy Tx | Notes |
|----------|---------|-----------|-------|
| PragmaComplianceRegistry | TBD | TBD | Deploy first |
| PragmaAssetToken (impl) | TBD | TBD | UUPS implementation |
| PragmaFeeDistributor | TBD | TBD | Treasury set at deploy |
| PragmaTokenFactory | TBD | TBD | References impl+compliance |

## Base (mainnet)

| Contract | Address | Notes |
|----------|---------|-------|
| PragmaComplianceRegistry | TBD | |
| PragmaAssetToken (impl) | TBD | |
| PragmaFeeDistributor | TBD | |
| PragmaTokenFactory | TBD | |

## Deployment Steps

```bash
# 1. Set env vars
export PRIVATE_KEY=0x...
export TREASURY=0x...  # defaults to deployer

# 2. Deploy to Base Sepolia
cd contracts
forge script script/DeployPragma.s.sol \
  --rpc-url https://sepolia.base.org \
  --broadcast \
  --verify

# 3. Update addresses in site/src/lib/contracts/addresses.ts
# 4. Verify on BaseScan
```