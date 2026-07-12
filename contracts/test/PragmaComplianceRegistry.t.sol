// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Test} from "forge-std/Test.sol";
import {PragmaComplianceRegistry} from "../src/PragmaComplianceRegistry.sol";

contract PragmaComplianceRegistryTest is Test {
    PragmaComplianceRegistry public compliance;

    address public admin = address(0x1);
    address public officer = address(0x2);
    address public investor1 = address(0x3);
    address public investor2 = address(0x4);

    bytes32 public constant COMPLIANCE_OFFICER_ROLE = keccak256("COMPLIANCE_OFFICER_ROLE");

    function setUp() public {
        compliance = new PragmaComplianceRegistry(admin);
        vm.prank(admin);
        compliance.grantRole(COMPLIANCE_OFFICER_ROLE, officer);
    }

    function test_InitialState() public view {
        assertTrue(compliance.hasRole(0x00, admin));
        assertTrue(compliance.hasRole(COMPLIANCE_OFFICER_ROLE, admin));
    }

    function test_AddInvestor() public {
        vm.prank(officer);
        compliance.addInvestor(investor1, bytes32("US"), PragmaComplianceRegistry.InvestorTier.Accredited, type(uint256).max);

        (bool active, PragmaComplianceRegistry.InvestorTier tier, bytes32 countryCode, uint256 kycExpiry) = compliance.investors(investor1);
        assertTrue(active);
        assertEq(uint256(tier), uint256(PragmaComplianceRegistry.InvestorTier.Accredited));
        assertEq(countryCode, bytes32("US"));
        assertEq(kycExpiry, type(uint256).max);
    }

    function test_RemoveInvestor() public {
        vm.prank(officer);
        compliance.addInvestor(investor1, bytes32("US"), PragmaComplianceRegistry.InvestorTier.Accredited, type(uint256).max);

        vm.prank(officer);
        compliance.removeInvestor(investor1);

        (bool active,,,) = compliance.investors(investor1);
        assertFalse(active);
    }

    function test_AddInvestorNonOfficer() public {
        vm.prank(investor1);
        vm.expectRevert();
        compliance.addInvestor(investor2, bytes32("US"), PragmaComplianceRegistry.InvestorTier.Accredited, type(uint256).max);
    }

    function test_UpdateInvestorTier() public {
        vm.prank(officer);
        compliance.addInvestor(investor1, bytes32("US"), PragmaComplianceRegistry.InvestorTier.Retail, type(uint256).max);

        vm.prank(officer);
        compliance.updateInvestorTier(investor1, PragmaComplianceRegistry.InvestorTier.Accredited);

        (bool active, PragmaComplianceRegistry.InvestorTier tier,,) = compliance.investors(investor1);
        assertTrue(active);
        assertEq(uint256(tier), uint256(PragmaComplianceRegistry.InvestorTier.Accredited));
    }

    function test_ExpiredKYC() public {
        vm.prank(officer);
        compliance.addInvestor(investor1, bytes32("US"), PragmaComplianceRegistry.InvestorTier.Accredited, block.timestamp + 1);

        // Fast forward past expiry
        vm.warp(block.timestamp + 1);

        (bool active,,,) = compliance.investors(investor1);
        assertTrue(active); // Still active in storage

        // But isInvestorAllowed should return false
        vm.prank(officer);
        assertFalse(compliance.isInvestorAllowed(investor1, 1, 100));
    }

    function test_AssetRestriction() public {
        PragmaComplianceRegistry.AssetRestriction memory restriction = PragmaComplianceRegistry.AssetRestriction({
            requiresAccreditation: true,
            minHoldingPeriod: 0,
            maxHoldPerAddress: 1000,
            jurisdictionLimited: false,
            allowedJurisdictions: new bytes32[](0)
        });

        vm.prank(officer);
        compliance.setAssetRestriction(1, restriction);

        // Retail investor should be blocked
        vm.prank(officer);
        compliance.addInvestor(investor1, bytes32("US"), PragmaComplianceRegistry.InvestorTier.Retail, type(uint256).max);

        vm.prank(officer);
        assertFalse(compliance.isInvestorAllowed(investor1, 1, 100));
    }

    function test_JurisdictionGating() public {
        bytes32[] memory allowed = new bytes32[](2);
        allowed[0] = bytes32("US");
        allowed[1] = bytes32("EU");

        PragmaComplianceRegistry.AssetRestriction memory restriction = PragmaComplianceRegistry.AssetRestriction({
            requiresAccreditation: false,
            minHoldingPeriod: 0,
            maxHoldPerAddress: 0,
            jurisdictionLimited: true,
            allowedJurisdictions: allowed
        });

        vm.prank(officer);
        compliance.setAssetRestriction(1, restriction);

        vm.prank(officer);
        compliance.addInvestor(investor1, bytes32("CN"), PragmaComplianceRegistry.InvestorTier.Accredited, type(uint256).max);

        vm.prank(officer);
        assertFalse(compliance.isInvestorAllowed(investor1, 1, 100));
    }

    function test_SupportedInterfaces() public view {
        assertTrue(compliance.supportsInterface(0x7965db0b)); // AccessControl
    }
}