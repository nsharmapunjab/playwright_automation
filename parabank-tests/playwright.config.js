// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright configuration for ParaBank test automation - FIXED VERSION
 * Improved stability and error handling
 */
module.exports = defineConfig({
  testDir: './tests',
  
  /* Run tests in files in parallel */
  fullyParallel: false, // Disabled for better stability
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 3 : 2, // Increased retries
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1, // Single worker for stability
  
  /* Reporter to use. */
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit-results.xml' }],
    ['json', { outputFile: 'test-results/json-results.json' }],
    ['list'] // Added for better console output
  ],
  
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL */
    baseURL: 'https://parabank.parasoft.com/parabank/',
    
    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
    
    /* Increased timeouts for stability */
    actionTimeout: 30000,
    navigationTimeout: 60000,
    
    /* Extra HTTP headers for better compatibility */
    extraHTTPHeaders: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 }
      },
    }
  ],

  /* Increased timeouts */
  timeout: 180000, // 3 minutes for comprehensive tests
  expect: {
    timeout: 15000
  },
  
  /* Output directory for test artifacts */
  outputDir: 'test-results/',
});
