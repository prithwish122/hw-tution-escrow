// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title TestUSDC
 * @notice Test token that mimics USDC for development and testing
 */
contract TestUSDC is ERC20 {
    uint8 private _decimals;  // Custom decimal precision
    
    constructor() ERC20("Test USDC", "tUSDC") {
        _decimals = 6;  // Same decimals as real USDC
        _mint(msg.sender, 1000000 * 10**decimals());  // Initial mint: 1M tokens to deployer
    }

    /**
     * @notice Anyone can mint tokens (for testing only)
     * @param to Address to receive minted tokens
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) public {
        _mint(to, amount);  // No restrictions for testing
    }

    /// @notice Override decimals to match real USDC (6 decimals)
    function decimals() public view override returns (uint8) {
        return _decimals;  // Return custom decimals instead of default 18
    }
}