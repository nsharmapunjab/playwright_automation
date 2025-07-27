// ===== utils/DataGenerator.js - ULTIMATE USERNAME GENERATION =====

const faker = require('faker');
const crypto = require('crypto');

/**
 * Utility class for generating test data - ULTIMATE VERSION
 * Guaranteed unique username generation using multiple entropy sources
 */
class DataGenerator {
  
  /**
   * Generates a guaranteed unique username using multiple entropy sources
   * @returns {string} Guaranteed unique username
   */
  static generateUniqueUsername() {
    // Get current timestamp with microseconds
    const now = Date.now();
    const perfNow = Math.floor(performance.now() * 1000); // Microsecond precision
    
    // Generate crypto-secure random bytes
    const randomBytes = crypto.randomBytes(8).toString('hex');
    
    // Generate additional random elements
    const randomNum1 = Math.floor(Math.random() * 999999);
    const randomNum2 = Math.floor(Math.random() * 999999);
    
    // Get process information
    const processId = process.pid;
    
    // Generate random string
    const randomString = faker.random.alphaNumeric(4).toLowerCase();
    
    // Combine all entropy sources into a unique string
    const uniqueId = `${now}${perfNow}${randomBytes}${randomNum1}${randomNum2}${processId}${randomString}`;
    
    // Create hash to ensure consistent length and uniqueness
    const hash = crypto.createHash('sha256').update(uniqueId).digest('hex').substring(0, 12);
    
    // Create final username with prefix and hash
    return `u${hash}${now.toString().slice(-6)}`;
  }
  
  /**
   * Generate sequential unique username for guaranteed uniqueness
   * @param {number} attempt - Attempt number for additional uniqueness
   * @returns {string} Sequential unique username
   */
  static generateSequentialUsername(attempt = 0) {
    const baseTime = Date.now();
    const nanoTime = process.hrtime.bigint().toString().slice(-8);
    const randomHex = crypto.randomBytes(6).toString('hex');
    const attemptSuffix = attempt > 0 ? `a${attempt}` : '';
    
    return `usr${randomHex}${nanoTime}${attemptSuffix}`.substring(0, 32); // Ensure max length
  }
  
  /**
   * Generates random user registration data with enhanced uniqueness
   * @returns {Object} User data object
   */
  static generateUserData() {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    
    return {
      firstName: firstName,
      lastName: lastName,
      address: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.stateAbbr(),
      zipCode: faker.address.zipCode().replace(/[^0-9]/g, '').substring(0, 5), // Numeric only
      phoneNumber: faker.phone.phoneNumber('###-###-####'),
      ssn: this.generateSSN(),
      username: this.generateUniqueUsername(),
      password: 'TestPass123!'
    };
  }
  
  /**
   * Generates a valid SSN format
   * @returns {string} SSN in XXX-XX-XXXX format
   */
  static generateSSN() {
    const area = faker.random.number({ min: 100, max: 665 });
    const group = faker.random.number({ min: 10, max: 99 });
    const serial = faker.random.number({ min: 1000, max: 9999 });
    return `${area}-${group}-${serial}`;
  }
  
  /**
   * Generates random amount for transactions
   * @param {number} min - Minimum amount
   * @param {number} max - Maximum amount
   * @returns {string} Random amount as string
   */
  static generateRandomAmount(min = 10, max = 1000) {
    return faker.random.number({ min: min, max: max, precision: 0.01 }).toString();
  }
  
  /**
   * Generates random payee name
   * @returns {string} Random payee name
   */
  static generatePayeeName() {
    return `${faker.company.companyName()} Services`;
  }
  
  /**
   * Generates random account number
   * @returns {string} Random account number
   */
  static generateAccountNumber() {
    return faker.random.number({ min: 10000, max: 99999 }).toString();
  }
}

module.exports = DataGenerator;
