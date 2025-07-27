/**
 * Test data and configuration constants
 * Centralized location for test data management
 */

const testData = {
  // Default test user credentials (for existing accounts)
  defaultUser: {
    username: 'john',
    password: 'demo'
  },
  
  // Banking configuration
  banking: {
    initialDeposit: '100.00',
    transferAmount: '50.00',
    billPayAmount: '25.00',
    accountTypes: {
      CHECKING: 'CHECKING',
      SAVINGS: 'SAVINGS'
    }
  },
  
  // Timeouts (in milliseconds)  
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000
  },
  
  // API endpoints
  api: {
    baseURL: 'https://parabank.parasoft.com/parabank/services/bank',
    endpoints: {
      accounts: '/accounts',
      transactions: '/transactions',
      customers: '/customers'
    }
  },
  
  // Test environment settings
  environment: {
    headless: process.env.HEADLESS === 'true',
    slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
    timeout: process.env.TIMEOUT ? parseInt(process.env.TIMEOUT) : 30000
  }
};

module.exports = testData;
