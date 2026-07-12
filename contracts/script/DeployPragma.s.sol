import {console} from "forge-std/console.sol";
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Script} from "forge-std/Script.sol";
import {PragmaAssetToken} from "../src/PragmaAssetToken.sol";
import {PragmaComplianceRegistry} from "../src/PragmaComplianceRegistry.sol";
import {PragmaTokenFactory} from "../src/PragmaTokenFactory.sol";
import {PragmaFeeDistributor} from "../src/PragmaFeeDistributor.sol";

/// @title DeployPragma
/// @notice Deployment script for Pragma RWA tokenization contracts.
/// Usage: forge script script/DeployPragma.s.sol --rpc-url <rpc> --broadcast
contract DeployPragma is Script {
    function run() external {
        // Read deployer private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        address treasury = vm.envOr("TREASURY", deployer);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy ComplianceRegistry (not upgradeable in v1)
        PragmaComplianceRegistry compliance = new PragmaComplianceRegistry(deployer);

        // 2. Deploy AssetToken implementation (for UUPS proxy)
        PragmaAssetToken tokenImpl = new PragmaAssetToken();

        // 3. Deploy FeeDistributor
        PragmaFeeDistributor feeDistributor = new PragmaFeeDistributor(deployer, treasury);

        // Set initial fee rates (matching business plan)
        // issuance: 100bps (1%), trading: 25bps (0.25%), management: 50bps (0.5%), custody: 0
        feeDistributor.setFeeRates(100, 25, 50, 0);

        // 4. Deploy TokenFactory
        PragmaTokenFactory factory = new PragmaTokenFactory(
            deployer,
            address(tokenImpl),
            address(compliance),
            treasury
        );

        // Set issuance fee
        factory.setIssuanceFeeBps(100);

        vm.stopBroadcast();

        // Log addresses
        string memory log = string.concat(
            "Pragma Contracts Deployed:\n",
            "ComplianceRegistry: ", vm.toString(address(compliance)), "\n",
            "AssetToken (impl): ", vm.toString(address(tokenImpl)), "\n",
            "FeeDistributor: ", vm.toString(address(feeDistributor)), "\n",
            "TokenFactory: ", vm.toString(address(factory))
        );
        console.log(log);
    }
}