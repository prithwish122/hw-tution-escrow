// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title TuitionEscrow
 * @notice Escrow contract for tuition payments using tUSDC tokens
 */
contract TuitionEscrow is AccessControl {
    IERC20 public immutable tusdcToken;                    // The tUSDC token contract
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");  // Admin role identifier

    enum EscrowState { NOT_INITIALIZED, INITIALIZED, DEPOSITED, RELEASED, REFUNDED }

    struct Escrow {
        address payer;        // Who pays the tuition
        address university;   // Who receives the payment
        uint256 amount;       // Amount in tUSDC tokens
        EscrowState state;    // Current escrow status
    }

    mapping(string => Escrow) private escrows; // invoiceRef => Escrow

    // Events
    event Initialized(string indexed invoiceRef, address indexed payer, address indexed university, uint256 amount);
    event Deposited(string indexed invoiceRef, address indexed payer, uint256 amount);
    event Released(string indexed invoiceRef, address indexed university, uint256 amount);
    event Refunded(string indexed invoiceRef, address indexed payer, uint256 amount);
    event AdminGranted(address indexed newAdmin);
    event AdminRevoked(address indexed oldAdmin);

    constructor(address _tusdcTokenAddress, address _initialAdmin) {
        require(_tusdcTokenAddress != address(0), "Token address cannot be zero");
        tusdcToken = IERC20(_tusdcTokenAddress);  // Set immutable token reference
        
        // Set up role hierarchy - initial admin gets both roles
        _grantRole(DEFAULT_ADMIN_ROLE, _initialAdmin);
        _grantRole(ADMIN_ROLE, _initialAdmin);
    }

    /**
     * @notice Initialize an escrow with payer, university, amount, and unique invoiceRef
     * @param invoiceRef Unique identifier for the invoice
     * @param _payer Address that will pay tuition
     * @param _university Address that will receive payment
     * @param _amount Amount of tUSDC tokens to escrow
     */
    function initializeEscrow(
        string calldata invoiceRef,
        address _payer,
        address _university,
        uint256 _amount
    ) external {
        require(_payer != address(0), "Invalid payer address");
        require(_university != address(0), "Invalid university address");
        require(_amount > 0, "Amount must be > 0");
        require(escrows[invoiceRef].state == EscrowState.NOT_INITIALIZED, "Invoice already used");

        escrows[invoiceRef] = Escrow({
            payer: _payer,
            university: _university,
            amount: _amount,
            state: EscrowState.INITIALIZED
        });

        emit Initialized(invoiceRef, _payer, _university, _amount);
    }

    /**
     * @notice Deposit tUSDC into escrow by invoiceRef
     * @dev Requires prior token approval
     */
    function deposit(string calldata invoiceRef) external {
        Escrow storage e = escrows[invoiceRef];
        require(e.state == EscrowState.INITIALIZED, "Escrow not initialized or already deposited");
        require(msg.sender == e.payer, "Only the payer can deposit");
        
        // Check payer's balance and allowance before transfer
        uint256 balance = tusdcToken.balanceOf(msg.sender);
        require(balance >= e.amount, "Insufficient token balance");
        
        uint256 allowance = tusdcToken.allowance(msg.sender, address(this));
        require(allowance >= e.amount, "Insufficient token allowance");

        bool success = tusdcToken.transferFrom(msg.sender, address(this), e.amount);
        require(success, "Token transfer failed");

        e.state = EscrowState.DEPOSITED;  // Mark as deposited
        emit Deposited(invoiceRef, msg.sender, e.amount);
    }

    /**
     * @notice Release funds to university
     * @dev Only callable by admin
     */
    function release(string calldata invoiceRef) external onlyRole(ADMIN_ROLE) {
        Escrow storage e = escrows[invoiceRef];
        require(e.state == EscrowState.DEPOSITED, "Escrow not deposited");

        bool success = tusdcToken.transfer(e.university, e.amount);  // Send to university
        require(success, "Transfer to university failed");

        e.state = EscrowState.RELEASED;  // Mark as released
        emit Released(invoiceRef, e.university, e.amount);
    }

    /**
     * @notice Refund funds to payer
     * @dev Only callable by admin
     */
    function refund(string calldata invoiceRef) external onlyRole(ADMIN_ROLE) {
        Escrow storage e = escrows[invoiceRef];
        require(e.state == EscrowState.DEPOSITED, "Escrow not deposited");

        bool success = tusdcToken.transfer(e.payer, e.amount);  // Send back to payer
        require(success, "Refund failed");
        e.state = EscrowState.REFUNDED;  // Mark as refunded
        emit Refunded(invoiceRef, e.payer, e.amount);
    }

    /// @notice Grant admin role to new address
    function grantAdmin(address newAdmin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newAdmin != address(0), "Invalid address");
        grantRole(ADMIN_ROLE, newAdmin);
        emit AdminGranted(newAdmin);
    }

    /// @notice Revoke admin role from an address
    function revokeAdmin(address oldAdmin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(oldAdmin != address(0), "Invalid address");
        revokeRole(ADMIN_ROLE, oldAdmin);
        emit AdminRevoked(oldAdmin);
    }

    /// @notice View the status of a specific invoice
    function getEscrowStatus(string calldata invoiceRef) external view returns (string memory) {
        EscrowState state = escrows[invoiceRef].state;

        if (state == EscrowState.NOT_INITIALIZED) return "Not initialized";
        if (state == EscrowState.INITIALIZED) return "Awaiting deposit";
        if (state == EscrowState.DEPOSITED) return "Funds in escrow";
        if (state == EscrowState.RELEASED) return "Funds released";
        if (state == EscrowState.REFUNDED) return "Funds refunded";
        return "Unknown state";
    }

    /// @notice Get full escrow details
    function getEscrowDetails(string calldata invoiceRef) external view returns (
        address payer,
        address university,
        uint256 amount,
        string memory status
    ) {
        Escrow memory e = escrows[invoiceRef];
        return (e.payer, e.university, e.amount, this.getEscrowStatus(invoiceRef));
    }

    /// @notice Check required allowance for an escrow
    function getRequiredAllowance(string calldata invoiceRef) external view returns (uint256) {
        require(escrows[invoiceRef].state != EscrowState.NOT_INITIALIZED, "Escrow not initialized");
        return escrows[invoiceRef].amount;
    }
}