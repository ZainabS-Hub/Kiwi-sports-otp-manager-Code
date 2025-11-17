# One-Time Passcode Manager - Kiwi Sports Apparel

## Overview
A JavaScript-based One-Time Passcode (OTP) management system designed to enhance login security for the Kiwi Sports Apparel web application through multi-factor authentication.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Examples](#examples)
- [Requirements Met](#requirements-met)
- [Testing](#testing)
- [Security Considerations](#security-considerations)

## Features
- ✅ Generates and manages one-time passcodes with expiration times
- ✅ Default 5-minute passcode duration (configurable)
- ✅ Automatic expiration and invalidation of passcodes
- ✅ Duration overwriting for existing passcodes
- ✅ Validates passcodes before authentication
- ✅ Memory-efficient cleanup of expired passcodes

## Installation

### Option 1: Direct Download
Download the `OTPManager.js` file and include it in your project:

```html
<script src="path/to/OTPManager.js"></script>
```

### Option 2: ES6 Module Import
```javascript
import OTPManager from './OTPManager.js';
```

### Option 3: Node.js
```javascript
const OTPManager = require('./OTPManager.js');
```

## Usage

### Basic Implementation

```javascript
// Initialize the OTP Manager
const otpManager = new OTPManager();

// Generate a passcode for a user
const userPasscode = 123456;

// Add passcode with default 5-minute duration
const existed = otpManager.addPasscode(userPasscode);
console.log(`Passcode existed: ${existed}`); // false (new passcode)

// Validate passcode during login
if (otpManager.validatePasscode(userPasscode)) {
  console.log('Access granted!');
  // Proceed with login
  otpManager.removePasscode(userPasscode); // Remove after use
} else {
  console.log('Invalid or expired passcode');
}
```

### Integration with Login Flow

```javascript
// Step 1: User requests login - Generate OTP
function initiateLogin(userId) {
  const otp = generateRandomOTP(); // Your OTP generation function
  const existed = otpManager.addPasscode(otp, 300000); // 5 minutes
  
  // Send OTP to user via email/SMS
  sendOTPToUser(userId, otp);
  
  return otp;
}

// Step 2: User submits OTP - Verify
function verifyLoginOTP(submittedOTP) {
  if (otpManager.validatePasscode(submittedOTP)) {
    // OTP is valid and not expired
    otpManager.removePasscode(submittedOTP); // One-time use
    return { success: true, message: 'Authentication successful' };
  } else {
    return { success: false, message: 'Invalid or expired OTP' };
  }
}
```

## API Documentation

### Class: `OTPManager`

#### Constructor
```javascript
const otpManager = new OTPManager();
```
Creates a new instance of the OTP Manager.

---

#### Method: `addPasscode(passcode, duration)`
Adds or updates a one-time passcode with a specified duration.

**Parameters:**
- `passcode` (number): The integer passcode
- `duration` (number, optional): Duration in milliseconds (default: 300000 = 5 minutes)

**Returns:**
- `boolean`: `true` if passcode already existed, `false` if new

**Example:**
```javascript
// Add new passcode with default 5-minute duration
const existed = otpManager.addPasscode(123456);

// Add passcode with custom 10-minute duration
const existed = otpManager.addPasscode(789012, 600000);
```

---

#### Method: `validatePasscode(passcode)`
Validates a passcode by checking if it exists and hasn't expired.

**Parameters:**
- `passcode` (number): The passcode to validate

**Returns:**
- `boolean`: `true` if valid and not expired, `false` otherwise

**Example:**
```javascript
if (otpManager.validatePasscode(123456)) {
  console.log('Valid passcode');
} else {
  console.log('Invalid or expired');
}
```

---

#### Method: `removePasscode(passcode)`
Removes a passcode after successful authentication (one-time use).

**Parameters:**
- `passcode` (number): The passcode to remove

**Returns:**
- `boolean`: `true` if removed, `false` if not found

**Example:**
```javascript
otpManager.removePasscode(123456);
```

---

#### Method: `getRemainingTime(passcode)`
Gets the remaining validity time for a passcode.

**Parameters:**
- `passcode` (number): The passcode to check

**Returns:**
- `number`: Remaining time in milliseconds, or 0 if expired/invalid

**Example:**
```javascript
const timeLeft = otpManager.getRemainingTime(123456);
console.log(`Time remaining: ${timeLeft / 1000} seconds`);
```

---

#### Method: `cleanupExpired()`
Removes all expired passcodes from storage.

**Returns:**
- `number`: Count of removed expired passcodes

**Example:**
```javascript
const removedCount = otpManager.cleanupExpired();
console.log(`Removed ${removedCount} expired passcodes`);
```

---

#### Method: `getActiveCount()`
Gets the total number of active (non-expired) passcodes.

**Returns:**
- `number`: Count of active passcodes

**Example:**
```javascript
const activeCount = otpManager.getActiveCount();
console.log(`Active passcodes: ${activeCount}`);
```

## Examples

### Example 1: Standard 5-Minute OTP
```javascript
const otp = 456789;
otpManager.addPasscode(otp); // Uses default 5-minute duration

// Check validity after some time
if (otpManager.validatePasscode(otp)) {
  console.log('OTP is still valid');
}
```

### Example 2: Custom Duration OTP
```javascript
const quickOTP = 111222;
otpManager.addPasscode(quickOTP, 60000); // 1-minute duration

setTimeout(() => {
  console.log(otpManager.validatePasscode(quickOTP)); // false after 1 minute
}, 70000);
```

### Example 3: Overwriting Existing OTP Duration
```javascript
const otp = 333444;

// Add with 5-minute duration
otpManager.addPasscode(otp); // Returns false (new)

// Update with 10-minute duration
const existed = otpManager.addPasscode(otp, 600000); // Returns true (existed)
console.log(`Duration updated: ${existed}`);
```

### Example 4: Complete Login Flow
```javascript
class LoginManager {
  constructor() {
    this.otpManager = new OTPManager();
  }

  // Request OTP for user
  requestOTP(email) {
    const otp = this.generateOTP();
    this.otpManager.addPasscode(otp, 300000); // 5 minutes
    
    // Send OTP via email
    this.sendEmail(email, otp);
    
    return { success: true, message: 'OTP sent to your email' };
  }

  // Verify OTP submission
  verifyOTP(otp) {
    if (this.otpManager.validatePasscode(otp)) {
      this.otpManager.removePasscode(otp); // One-time use
      return { success: true, message: 'Login successful' };
    }
    return { success: false, message: 'Invalid or expired OTP' };
  }

  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  }

  sendEmail(email, otp) {
    // Email sending logic
    console.log(`Sending OTP ${otp} to ${email}`);
  }
}
```

## Requirements Met

✅ **Requirement 1**: Function accepts integer passcode and duration in milliseconds  
✅ **Requirement 2**: Default 5-minute (300000ms) duration for passcode validity  
✅ **Requirement 3**: Passcodes automatically become inaccessible after expiration  
✅ **Requirement 4**: Returns `true` if unexpired passcode already exists, `false` otherwise  
✅ **Requirement 5**: Duration is overwritten when same passcode is added again  

## Testing

### Manual Testing
Run the provided examples in the main file to see the OTP Manager in action:

```bash
node OTPManager.js
```

### Unit Testing Example (Jest)
```javascript
describe('OTPManager', () => {
  let otpManager;

  beforeEach(() => {
    otpManager = new OTPManager();
  });

  test('should add new passcode and return false', () => {
    const existed = otpManager.addPasscode(123456);
    expect(existed).toBe(false);
  });

  test('should return true for existing passcode', () => {
    otpManager.addPasscode(123456);
    const existed = otpManager.addPasscode(123456, 180000);
    expect(existed).toBe(true);
  });

  test('should validate unexpired passcode', () => {
    otpManager.addPasscode(123456);
    expect(otpManager.validatePasscode(123456)).toBe(true);
  });

  test('should reject expired passcode', (done) => {
    otpManager.addPasscode(123456, 100); // 100ms
    setTimeout(() => {
      expect(otpManager.validatePasscode(123456)).toBe(false);
      done();
    }, 150);
  });

  test('should overwrite duration for existing passcode', () => {
    otpManager.addPasscode(123456, 60000);
    const time1 = otpManager.getRemainingTime(123456);
    
    otpManager.addPasscode(123456, 300000);
    const time2 = otpManager.getRemainingTime(123456);
    
    expect(time2).toBeGreaterThan(time1);
  });
});
```

## Security Considerations

### Best Practices
1. **One-Time Use**: Always remove passcodes after successful authentication
2. **Secure Generation**: Use cryptographically secure random number generators for OTP creation
3. **Rate Limiting**: Implement rate limiting to prevent brute force attacks
4. **Secure Transmission**: Send OTPs over encrypted channels (HTTPS, encrypted email)
5. **Storage Security**: In production, consider encrypting stored passcodes
6. **Logging**: Log authentication attempts for security monitoring

### Production Recommendations
```javascript
// Use crypto for secure OTP generation
const crypto = require('crypto');

function generateSecureOTP() {
  return crypto.randomInt(100000, 999999);
}

// Implement rate limiting
const attemptTracker = new Map();

function checkRateLimit(userId) {
  const attempts = attemptTracker.get(userId) || 0;
  if (attempts >= 5) {
    throw new Error('Too many attempts. Please try again later.');
  }
  attemptTracker.set(userId, attempts + 1);
}
```

### Cleanup Strategy
Periodically clean up expired passcodes to maintain memory efficiency:

```javascript
// Run cleanup every 10 minutes
setInterval(() => {
  const removed = otpManager.cleanupExpired();
  console.log(`Cleaned up ${removed} expired passcodes`);
}, 600000);
```

## Technical Specifications

- **Language**: JavaScript (ES6+)
- **Data Structure**: Map (key-value pairs)
- **Time Complexity**: O(1) for add, validate, remove operations
- **Space Complexity**: O(n) where n is number of active passcodes
- **Browser Compatibility**: All modern browsers supporting ES6
- **Node.js Compatibility**: Node.js 12+

## License
MIT License - Free to use and modify for Kiwi Sports Apparel

## Support
For issues or questions, contact the IT Development Team at Kiwi Sports Apparel.

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Author**: Kiwi Sports Apparel IT Team
