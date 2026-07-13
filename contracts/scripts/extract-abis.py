#!/usr/bin/env python3
"""
Extract ABIs from Forge build artifacts and generate TypeScript definitions.

Usage: python3 scripts/extract-abis.py
Output: site/src/lib/contracts/abis.ts

Run after: forge build
"""

import json
import os

CONTRACTS = [
    "PragmaAssetToken",
    "PragmaComplianceRegistry",
    "PragmaTokenFactory",
    "PragmaFeeDistributor",
]

OUT_DIR = os.path.join("out")
OUTPUT_FILE = os.path.join("..", "site", "src", "lib", "contracts", "abis.ts")


def extract_abis() -> dict:
    """Extract ABIs from forge build artifacts."""
    abis = {}
    for name in CONTRACTS:
        path = os.path.join(OUT_DIR, f"{name}.sol", f"{name}.json")
        try:
            with open(path) as f:
                data = json.load(f)
            abis[name] = data["abi"]
        except (FileNotFoundError, KeyError) as e:
            print(f"Warning: could not load {name}: {e}")

    # Also include IComplianceRegistry interface if available
    iface_path = os.path.join(OUT_DIR, "PragmaAssetToken.sol", "IComplianceRegistry.json")
    try:
        with open(iface_path) as f:
            data = json.load(f)
        abis["IComplianceRegistry"] = data["abi"]
    except (FileNotFoundError, KeyError):
        pass

    return abis


def to_ts_var(name: str) -> str:
    """Convert contract name to camelCase variable name."""
    return name[0].lower() + name[1:] + "Abi"


def generate_ts(abis: dict) -> str:
    """Generate TypeScript file content."""
    lines = [
        "// Auto-generated from Forge build artifacts",
        "// Do not edit directly. Run: forge build && python3 scripts/extract-abis.py",
        "",
        'import type { Abi } from "viem";',
        "",
    ]

    for name, abi in abis.items():
        var_name = to_ts_var(name)
        abi_str = json.dumps(abi, indent=2)
        lines.append(f"export const {var_name} = {abi_str} as const satisfies Abi;")
        lines.append("")

    return "\n".join(lines)


def main():
    os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    abis = extract_abis()
    ts_content = generate_ts(abis)

    with open(OUTPUT_FILE, "w") as f:
        f.write(ts_content)

    count = len([k for k in abis])
    print(f"✅ Generated {OUTPUT_FILE} ({count} ABIs, {ts_content.count(chr(10))} lines)")


if __name__ == "__main__":
    main()