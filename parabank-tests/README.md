# ParaBank Test Automation Framework

A comprehensive, enterprise-grade test automation framework built with **Playwright** and **JavaScript** for end-to-end testing of the ParaBank online banking application.

## 🌟 Framework Highlights

- **✅ Complete E2E Testing** - UI and API automation with real network capture
- **🏗️ Modular Architecture** - Page Object Model with reusable components
- **🔍 Smart API Testing** - Captures actual network calls during UI flow
- **📊 Comprehensive Reporting** - Detailed JSON response validation and logging
- **🚀 CI/CD Ready** - Jenkins pipeline integration with parameterized builds
- **🛡️ Bulletproof Registration** - Advanced username generation with conflict resolution
- **📱 Cross-Browser Support** - Chromium, Firefox, WebKit compatibility

## 📁 Project Structure

```
parabank-tests/
├── 📂 tests/                          # Test suites organized by type
│   ├── 📂 ui/                         # UI test cases
│   │   └── banking-workflow.spec.js   # Complete banking workflow test
│   └── 📂 api/                        # API test cases
│       └── transactions.spec.js       # Transaction API validation
├── 📂 pages/                          # Page Object Model classes
│   ├── BasePage.js                    # Base class with common functionality
│   ├── RegisterPage.js                # User registration operations
│   ├── LoginPage.js                   # Authentication and login handling
│   ├── AccountsOverviewPage.js        # Account overview and balance verification
│   ├── OpenAccountPage.js             # New account creation
│   ├── TransferFundsPage.js           # Money transfer operations
│   └── BillPayPage.js                 # Bill payment with network capture
├── 📂 utils/                          # Reusable utility classes
│   ├── DataGenerator.js               # Test data generation with uniqueness
│   └── ApiHelper.js                   # API testing with JSON validation
├── 📂 fixtures/                       # Test data and configuration
│   └── testData.js                    # Centralized test data management
├── 📂 jenkins/                        # CI/CD configuration
│   └── Jenkinsfile                    # Complete pipeline configuration
├── 📄 playwright.config.js            # Playwright configuration
├── 📄 package.json                    # Dependencies and scripts
└── 📄 README.md                       # This documentation
```

## 🏗️ Framework Architecture

### **1. Modular Design Principles**

#### **📐 Naming Conventions**
- **Classes**: PascalCase (`RegisterPage`, `ApiHelper`)
- **Methods**: camelCase (`navigateToLogin`, `verifyPaymentSuccess`)
- **Variables**: camelCase (`userData`, `accountNumber`, `paymentAmount`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`, `DEFAULT_TIMEOUT`)
- **Files**: kebab-case (`banking-workflow.spec.js`, `test-data.js`)

#### **🧩 Component Organization**
```javascript
// Example: Structured method organization
class RegisterPage extends BasePage {
  // 1. Constructor and selectors
  constructor(page) { /* ... */ }
  
  // 2. Navigation methods
  async navigateToRegister() { /* ... */ }
  
  // 3. Core functionality methods  
  async fillRegistrationForm() { /* ... */ }
  async submitRegistration() { /* ... */ }
  
  // 4. Validation methods
  async verifyRegistrationSuccess() { /* ... */ }
  
  // 5. Helper methods
  async handleUsernameConflict() { /* ... */ }
}
```

### **2. Reusability Features**

#### **🔄 Base Page Pattern**
```javascript
// Inherited by all page classes for common functionality
class BasePage {
  async navigateTo(path) { /* Common navigation */ }
  async waitForElement(selector) { /* Common waits */ }
  async clickElement(selector) { /* Common interactions */ }
  async fillInput(selector, value) { /* Common form filling */ }
}
```

#### **🛠️ Utility Classes**
```javascript
// Reusable across all tests
class DataGenerator {
  static generateUniqueUsername() { /* Bulletproof uniqueness */ }
  static generateUserData() { /* Complete user profiles */ }
  static generateRandomAmount() { /* Transaction amounts */ }
}
```

#### **📊 API Helper**
```javascript
// Comprehensive API testing capabilities
class ApiHelper {
  async findTransactionsByAmount() { /* Smart endpoint discovery */ }
  analyzeJsonResponse() { /* Detailed JSON validation */ }
  storeCapturedEndpoint() { /* Network call capture */ }
}
```

### **3. Readability Enhancements**

#### **📝 Self-Documenting Code**
```javascript
// Clear, descriptive method names
await registerPage.registerUser(userData);
await loginPage.ensureUserIsLoggedIn();
await accountsPage.verifyAccountWithBalance(newAccountNumber);
await billPayPage.payBillWithNetworkCapture(paymentData);
```

#### **📋 Comprehensive Logging**
```javascript
console.log('🚀 Starting test with user:', userData.username);
console.log('✅ User registered successfully');
console.log('📊 API Response Status:', response.status);
console.log('💰 Transaction validated: $', amount);
```

#### **🔍 Detailed Comments**
```javascript
/**
 * Complete user registration process with enhanced error handling
 * @param {Object} userData - User registration data
 * @returns {Promise<boolean>} Registration success status
 */
async registerUser(userData) {
  // Implementation with inline comments explaining complex logic
}
```

## 🚀 Installation & Setup

### **Prerequisites**
- **Node.js** 18+ (LTS recommended)
- **Git** for version control
- **VS Code** (recommended IDE)

### **Quick Setup**
```bash
# 1. Clone the repository
git clone <repository-url>
cd parabank-tests

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. Verify installation
npm test -- --help
```

### **Project Dependencies**
```json
{
  "devDependencies": {
    "@playwright/test": "^1.40.0"
  },
  "dependencies": {
    "faker": "^5.5.3"
  }
}
```

## ⚡ Execution Commands

### **Basic Test Execution**
```bash
# Run all tests
npm test

# Run UI tests only
npm run test:ui

# Run API tests only  
npm run test:api

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests headless (CI mode)
npm run test:headless
```

### **Advanced Execution Options**
```bash
# Run specific test file
npx playwright test tests/ui/banking-workflow.spec.js

# Run with specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox

# Debug mode
npm run test:debug

# Generate and view reports
npm run test:report
```

### **CI/CD Integration**
```bash
# Jenkins pipeline execution
npx playwright test --headed=false --reporter=junit

# Parallel execution control
npx playwright test --workers=2

# Custom timeout
npx playwright test --timeout=180000
```

## 🎯 Test Scenarios

### **1. Complete Banking Workflow (UI)**
```
✅ User Registration with unique username generation
✅ Auto-login detection and manual login fallback  
✅ Global navigation menu verification
✅ Savings account creation with balance validation
✅ Fund transfer between accounts
✅ Bill payment with confirmation
✅ Final account verification and cleanup
```

### **2. API Transaction Validation**
```
✅ Network call capture during UI operations
✅ Real API endpoint discovery and testing
✅ JSON response structure analysis
✅ Field-by-field validation with detailed logging
✅ Transaction data matching and verification
✅ Comprehensive API testing with fallbacks
```

## 📊 Framework Features

### **🔧 Technical Capabilities**

#### **Smart Username Generation**
- **Crypto-secure randomness** with multiple entropy sources
- **Automatic conflict resolution** with sequential generation
- **Bulletproof uniqueness** ensuring no registration failures

#### **Network Capture & API Testing**
- **Real-time request interception** during UI operations
- **Actual endpoint discovery** instead of guessing APIs
- **JSON response validation** with comprehensive analysis
- **Fallback strategies** for non-JSON responses

#### **Robust Error Handling**
- **Retry mechanisms** for flaky operations
- **Graceful degradation** when services are unavailable
- **Comprehensive logging** for debugging and analysis
- **Screenshot capture** on failures for investigation

### **📈 Reporting & Analysis**

#### **Test Reports**
- **HTML Reports** with screenshots and videos
- **JUnit XML** for CI/CD integration
- **JSON Results** for custom analysis
- **Console Logging** with detailed execution steps

#### **JSON Response Analysis**
```
📊 Response Type: Array with 5 transactions
📋 Fields: id, accountId, amount, date, type, description
✅ Account ID Match: PASS (Expected: 24000, Got: 24000)
💰 Amount Match: PASS (Expected: $35.68, Got: $35.68)
📅 Date Validation: PASS (2024-01-01 - valid date)
```

## 🔧 Configuration

### **Playwright Configuration**
```javascript
// playwright.config.js highlights
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,        // Sequential for stability
  retries: process.env.CI ? 3 : 2,
  workers: 1,                  // Single worker for demo environment
  timeout: 180000,             // 3 minutes for comprehensive tests
  
  use: {
    baseURL: 'https://parabank.parasoft.com/parabank/',
    actionTimeout: 30000,
    navigationTimeout: 60000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
});
```

### **Test Data Management**
```javascript
// Centralized configuration
const testData = {
  banking: {
    transferAmount: '50.00',
    billPayAmount: '25.00'
  },
  timeouts: {
    short: 5000,
    medium: 10000,  
    long: 30000
  }
};
```

## 🔄 Jenkins Integration

### **Pipeline Features**
- **Parameterized builds** with browser/test suite selection
- **Multi-browser execution** with parallel support
- **Comprehensive reporting** with HTML/JUnit integration
- **Artifact management** with screenshots and videos
- **Email notifications** for build status

### **Pipeline Parameters**
```groovy
// Available build parameters
choice(name: 'TEST_SUITE', choices: ['all', 'ui', 'api'])
choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit'])
booleanParam(name: 'PARALLEL_EXECUTION', defaultValue: true)
```

## 🧪 Test Data Strategy

### **Dynamic Data Generation**
```javascript
// Unique data for each test run
const userData = {
  username: `usr${crypto.hash}${timestamp}`,  // Guaranteed unique
  firstName: faker.name.firstName(),          // Realistic data
  amount: faker.random.number({min: 25, max: 75}) // Variable amounts
};
```

### **Data Isolation**
- **Independent test runs** with unique usernames
- **Clean state** for each test execution
- **No data dependencies** between test cases

## 🔍 Debugging & Troubleshooting

### **Debug Mode**
```bash
# Run single test with debugging
npx playwright test --debug tests/ui/banking-workflow.spec.js

# Headed mode for visual debugging
npx playwright test --headed

# Trace viewer for step-by-step analysis
npx playwright show-trace trace.zip
```

### **Common Issues & Solutions**

#### **Registration Failures**
- **Username conflicts**: Automatic retry with new username
- **Form validation**: Enhanced field filling with verification
- **Network issues**: Increased timeouts and retry logic

#### **API Testing Challenges**  
- **404 errors**: Uses captured endpoints instead of guessing
- **Non-JSON responses**: Graceful handling with HTML analysis
- **Rate limiting**: Built-in delays and retry mechanisms

## 📚 Best Practices Implemented

### **🏗️ Architecture Patterns**
- **Page Object Model** for maintainable UI automation
- **Factory Pattern** for test data generation
- **Strategy Pattern** for multiple API endpoint attempts
- **Observer Pattern** for network request capture

### **🔧 Code Quality**
- **Single Responsibility** - Each class has one clear purpose
- **DRY Principle** - Common functionality in base classes
- **Error Handling** - Comprehensive try-catch with logging
- **Async/Await** - Proper promise handling throughout

### **🧪 Testing Strategy**
- **Test Independence** - No dependencies between tests
- **Data Isolation** - Unique data for each execution
- **Comprehensive Coverage** - UI, API, and integration testing
- **Realistic Scenarios** - End-to-end user journeys

### **Getting Help**
- Review test execution logs for detailed error information
- Check screenshots in `test-results/` for visual debugging
- Use `--debug` flag for step-by-step execution analysis
- Refer to inline code comments for implementation details

---

## 🏆 Framework Benefits

✅ **Production Ready** - Enterprise-grade reliability and error handling  
✅ **Maintainable** - Clear structure with modular, reusable components  
✅ **Scalable** - Easy to extend with new test cases and functionality  
✅ **Debuggable** - Comprehensive logging and failure analysis  
✅ **CI/CD Ready** - Complete Jenkins integration with reporting  
✅ **Educational** - Well-documented code demonstrating best practices  

Built by Nitin Sharma
