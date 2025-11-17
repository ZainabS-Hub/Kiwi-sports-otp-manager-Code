/**
 * One-Time Passcode Manager for Kiwi Sports Apparel
 * 
 * This class manages one-time passcodes for multi-factor authentication,
 * providing an additional security layer for user login processes.
 * 
 * Features:
 * - Stores passcodes with expiration times
 * - Automatically invalidates expired passcodes
 * - Updates duration for existing passcodes
 * - Validates passcodes before granting access
 */

class OTPManager {
  constructor() {
    // Store passcodes with their expiration timestamps
    this.passcodes = new Map();
  }

  /**
   * Adds or updates a one-time passcode with a specified duration
   * 
   * @param {number} passcode - The integer passcode (e.g., 123456)
   * @param {number} duration - Duration in milliseconds (default: 5 minutes)
   * @returns {boolean} - Returns true if passcode already existed, false if new
   */
  addPasscode(passcode, duration = 300000) { // Default 5 minutes (300000ms)
    // Validate input
    if (!Number.isInteger(passcode)) {
      throw new Error('Passcode must be an integer');
    }
    
    if (!Number.isInteger(duration) || duration <= 0) {
      throw new Error('Duration must be a positive integer in milliseconds');
    }

    // Check if passcode already exists
    const exists = this.passcodes.has(passcode);
    
    // Calculate expiration time (current time + duration)
    const expirationTime = Date.now() + duration;
    
    // Store or update the passcode with new expiration time
    this.passcodes.set(passcode, expirationTime);
    
    // Return true if existed, false if new
    return exists;
  }

  /**
   * Validates a passcode by checking if it exists and hasn't expired
   * 
   * @param {number} passcode - The passcode to validate
   * @returns {boolean} - Returns true if valid and not expired, false otherwise
   */
  validatePasscode(passcode) {
    // Check if passcode exists
    if (!this.passcodes.has(passcode)) {
      return false;
    }

    // Get expiration time
    const expirationTime = this.passcodes.get(passcode);
    const currentTime = Date.now();

    // Check if passcode has expired
    if (currentTime > expirationTime) {
      // Remove expired passcode
      this.passcodes.delete(passcode);
      return false;
    }

    return true;
  }

  /**
   * Removes a passcode after successful authentication
   * 
   * @param {number} passcode - The passcode to remove
   * @returns {boolean} - Returns true if removed, false if not found
   */
  removePasscode(passcode) {
    return this.passcodes.delete(passcode);
  }

  /**
   * Cleans up all expired passcodes from storage
   * This method can be called periodically to maintain memory efficiency
   */
  cleanupExpired() {
    const currentTime = Date.now();
    const expiredKeys = [];

    // Find all expired passcodes
    for (const [passcode, expirationTime] of this.passcodes.entries()) {
      if (currentTime > expirationTime) {
        expiredKeys.push(passcode);
      }
    }

    // Remove expired passcodes
    expiredKeys.forEach(key => this.passcodes.delete(key));
    
    return expiredKeys.length;
  }

  /**
   * Gets the remaining time for a passcode in milliseconds
   * 
   * @param {number} passcode - The passcode to check
   * @returns {number} - Remaining time in milliseconds, or 0 if expired/invalid
   */
  getRemainingTime(passcode) {
    if (!this.passcodes.has(passcode)) {
      return 0;
    }

    const expirationTime = this.passcodes.get(passcode);
    const remainingTime = expirationTime - Date.now();

    return remainingTime > 0 ? remainingTime : 0;
  }

  /**
   * Gets the total number of active (non-expired) passcodes
   * 
   * @returns {number} - Count of active passcodes
   */
  getActiveCount() {
    this.cleanupExpired();
    return this.passcodes.size;
  }
}


// ============================================
// USAGE EXAMPLES AND TESTING
// ============================================

// Initialize the OTP Manager
const otpManager = new OTPManager();

console.log('=== Kiwi Sports Apparel - OTP Manager Demo ===\n');

// Example 1: Add a new passcode with default 5-minute duration
console.log('Example 1: Adding new passcode');
const passcode1 = 123456;
const isExisting1 = otpManager.addPasscode(passcode1);
console.log(`Passcode ${passcode1} added. Already existed: ${isExisting1}`);
console.log(`Validation result: ${otpManager.validatePasscode(passcode1)}\n`);

// Example 2: Update existing passcode (overwrites duration)
console.log('Example 2: Updating existing passcode');
const isExisting2 = otpManager.addPasscode(passcode1, 180000); // 3 minutes
console.log(`Passcode ${passcode1} updated. Already existed: ${isExisting2}`);
console.log(`New remaining time: ${otpManager.getRemainingTime(passcode1)}ms\n`);

// Example 3: Add another passcode with custom duration
console.log('Example 3: Adding passcode with custom duration');
const passcode2 = 789012;
otpManager.addPasscode(passcode2, 60000); // 1 minute
console.log(`Passcode ${passcode2} added with 1-minute duration`);
console.log(`Validation result: ${otpManager.validatePasscode(passcode2)}\n`);

// Example 4: Simulate expired passcode
console.log('Example 4: Testing expired passcode');
const expiredPasscode = 111111;
otpManager.addPasscode(expiredPasscode, 1000); // 1 second
console.log(`Passcode ${expiredPasscode} added with 1-second duration`);
setTimeout(() => {
  console.log(`After 2 seconds - Validation result: ${otpManager.validatePasscode(expiredPasscode)}`);
  console.log(`Passcode is now inaccessible (expired)\n`);
}, 2000);

// Example 5: Remove passcode after successful login
setTimeout(() => {
  console.log('Example 5: Removing passcode after authentication');
  const removed = otpManager.removePasscode(passcode1);
  console.log(`Passcode ${passcode1} removed: ${removed}`);
  console.log(`Validation after removal: ${otpManager.validatePasscode(passcode1)}\n`);
  
  // Display active passcodes count
  console.log(`Active passcodes: ${otpManager.getActiveCount()}`);
}, 3000);


// Export for use in other modules (Node.js/ES6)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OTPManager;
}