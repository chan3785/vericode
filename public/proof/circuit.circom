pragma circom 2.0.0;

// UserAuth template
template UserAuth() {
    signal input userId;       // User ID
    signal input secretKey;    // Secret Key
    signal output hashOut;     // Output hash

    // Internal signal for computation
    signal intermediate;

    // Compute a simple hash-like operation
    // Example: hashOut = (userId * secretKey) + userId
    intermediate <== userId * secretKey;
    hashOut <== intermediate + userId;
}

// Main component
component main = UserAuth();
