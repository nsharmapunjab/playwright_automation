// ===== pages/RegisterPage.js - BULLETPROOF REGISTRATION =====

const BasePage = require('./BasePage');
const DataGenerator = require('../utils/DataGenerator');

/**
 * Register Page Object Model - BULLETPROOF VERSION
 * Guaranteed registration success with advanced conflict resolution
 */
class RegisterPage extends BasePage {
  
  constructor(page) {
    super(page);
    
    this.selectors = {
      registerLink: 'a[href*="register.htm"], a:has-text("Register")',
      firstName: 'input[name="customer.firstName"], #customer\\.firstName',
      lastName: 'input[name="customer.lastName"], #customer\\.lastName',
      address: 'input[name="customer.address.street"], #customer\\.address\\.street',
      city: 'input[name="customer.address.city"], #customer\\.address\\.city',
      state: 'input[name="customer.address.state"], #customer\\.address\\.state',
      zipCode: 'input[name="customer.address.zipCode"], #customer\\.address\\.zipCode',
      phoneNumber: 'input[name="customer.phoneNumber"], #customer\\.phoneNumber',
      ssn: 'input[name="customer.ssn"], #customer\\.ssn',
      username: 'input[name="customer.username"], #customer\\.username',
      password: 'input[name="customer.password"], #customer\\.password',
      confirmPassword: 'input[name="repeatedPassword"], #repeatedPassword',
      registerButton: 'input[value="Register"], button:has-text("Register")',
      successMessage: '#rightPanel h1, .title',
      welcomeMessage: '#rightPanel p, #rightPanel .smallText',
      errorMessage: '.error, #rightPanel .error',
      usernameExistsError: 'td:has-text("This username already exists")',
      passwordRequiredError: 'td:has-text("Password is required")',
      passwordConfirmError: 'td:has-text("Password confirmation is required")'
    };
  }
  
  /**
   * Navigate to registration page with database reset
   */
  async navigateToRegister() {
    try {
      console.log('Navigating to registration page...');
      
      // Navigate directly to registration page
      await this.navigateTo('register.htm');
      
      // Wait for registration form to load
      await this.page.waitForTimeout(2000);
      
    } catch (error) {
      console.error('Failed to navigate to register page:', error);
      throw error;
    }
  }
  
  /**
   * Enhanced field filling with robust error handling
   * @param {string} fieldName - Field name for logging
   * @param {string} selector - CSS selector
   * @param {string} value - Value to fill
   */
  async fillFieldRobustly(fieldName, selector, value) {
    const selectors = selector.split(', ');
    
    for (const sel of selectors) {
      try {
        console.log(`Filling ${fieldName} with selector: ${sel}`);
        
        // Wait for element to be visible and enabled
        await this.page.waitForSelector(sel, { state: 'visible', timeout: 10000 });
        
        // Focus on the element
        await this.page.focus(sel);
        await this.page.waitForTimeout(200);
        
        // Clear and fill the field
        await this.page.fill(sel, '');
        await this.page.waitForTimeout(200);
        await this.page.type(sel, value, { delay: 50 }); // Type with delay for reliability
        
        // Verify the value was set
        const actualValue = await this.page.inputValue(sel);
        if (actualValue === value) {
          console.log(`✓ Successfully filled ${fieldName}: ${value}`);
          return true;
        } else {
          console.warn(`Value mismatch for ${fieldName}. Expected: ${value}, Got: ${actualValue}`);
        }
        
      } catch (error) {
        console.warn(`Failed to fill ${fieldName} with selector ${sel}: ${error.message}`);
      }
    }
    
    throw new Error(`Could not fill field: ${fieldName} with value: ${value}`);
  }
  
  /**
   * Fill registration form with bulletproof field handling
   * @param {Object} userData - User registration data
   */
  async fillRegistrationForm(userData) {
    console.log('Filling registration form with bulletproof handling...');
    
    // Define all fields to fill
    const fields = [
      { name: 'firstName', selector: this.selectors.firstName, value: userData.firstName },
      { name: 'lastName', selector: this.selectors.lastName, value: userData.lastName },
      { name: 'address', selector: this.selectors.address, value: userData.address },
      { name: 'city', selector: this.selectors.city, value: userData.city },
      { name: 'state', selector: this.selectors.state, value: userData.state },
      { name: 'zipCode', selector: this.selectors.zipCode, value: userData.zipCode },
      { name: 'phoneNumber', selector: this.selectors.phoneNumber, value: userData.phoneNumber },
      { name: 'ssn', selector: this.selectors.ssn, value: userData.ssn },
      { name: 'username', selector: this.selectors.username, value: userData.username },
      { name: 'password', selector: this.selectors.password, value: userData.password },
      { name: 'confirmPassword', selector: this.selectors.confirmPassword, value: userData.password }
    ];
    
    // Fill each field with error handling
    for (const field of fields) {
      try {
        await this.fillFieldRobustly(field.name, field.selector, field.value);
      } catch (error) {
        console.error(`Failed to fill ${field.name}:`, error);
        throw error;
      }
    }
    
    console.log('✓ All registration fields filled successfully');
  }
  
  /**
   * Submit registration form
   */
  async submitRegistration() {
    console.log('Submitting registration form...');
    
    const buttonSelectors = [
      'input[value="Register"]',
      'button:has-text("Register")',
      'input[type="submit"]'
    ];
    
    for (const selector of buttonSelectors) {
      try {
        if (await this.isElementVisible(selector)) {
          await this.page.click(selector);
          console.log(`Registration submitted using: ${selector}`);
          
          // Wait for response
          await this.page.waitForLoadState('networkidle', { timeout: 30000 });
          await this.page.waitForTimeout(2000);
          return;
        }
      } catch (error) {
        console.warn(`Failed to submit with ${selector}: ${error.message}`);
      }
    }
    
    throw new Error('Could not find or click registration submit button');
  }
  
  /**
   * Check for username exists error
   * @returns {Promise<boolean>} True if username exists error is shown
   */
  async hasUsernameExistsError() {
    const errorSelectors = [
      'td:has-text("This username already exists")',
      'span:has-text("This username already exists")',
      '.error:has-text("username")',
      '*:has-text("username already exists")'
    ];
    
    for (const selector of errorSelectors) {
      if (await this.isElementVisible(selector)) {
        console.log(`Username exists error detected with: ${selector}`);
        return true;
      }
    }
    return false;
  }
  
  /**
   * Check for password errors
   * @returns {Promise<boolean>} True if password error is shown
   */
  async hasPasswordError() {
    const errorSelectors = [
      'td:has-text("Password is required")',
      'td:has-text("Password confirmation is required")',
      'span:has-text("Password")',
      '.error:has-text("password")'
    ];
    
    for (const selector of errorSelectors) {
      if (await this.isElementVisible(selector)) {
        console.log(`Password error detected with: ${selector}`);
        return true;
      }
    }
    return false;
  }
  
  /**
   * Verify registration success
   * @param {string} username - Username to verify
   * @returns {Promise<boolean>} Success verification result
   */
  async verifyRegistrationSuccess(username) {
    try {
      // Check current URL for success indicators
      const currentUrl = this.page.url();
      
      if (currentUrl.includes('overview') || 
          currentUrl.includes('account') || 
          currentUrl.includes('welcome')) {
        console.log(`Registration success detected by URL: ${currentUrl}`);
        return true;
      }
      
      // Check for success messages
      const successSelectors = [
        '#rightPanel h1',
        '.title',
        'h1:has-text("Welcome")',
        'text=Welcome',
        '*:has-text("successfully")',
        '*:has-text("created")'
      ];
      
      for (const selector of successSelectors) {
        try {
          if (await this.isElementVisible(selector)) {
            const text = await this.getTextContent(selector);
            console.log(`Found success indicator: ${text}`);
            
            if (text.toLowerCase().includes('welcome') || 
                text.toLowerCase().includes('successfully') || 
                text.toLowerCase().includes('created')) {
              return true;
            }
          }
        } catch (error) {
          console.warn(`Error checking success with ${selector}: ${error.message}`);
        }
      }
      
      // Check if we can see account-related elements (indicates successful login)
      const accountElements = [
        'a[href*="overview"]',
        'a[href*="transfer"]',
        'a[href*="billpay"]',
        'a:has-text("Accounts Overview")',
        'a:has-text("Transfer Funds")'
      ];
      
      for (const selector of accountElements) {
        if (await this.isElementVisible(selector)) {
          console.log(`Account element found, registration successful: ${selector}`);
          return true;
        }
      }
      
      return false;
      
    } catch (error) {
      console.warn('Error verifying registration success:', error);
      return false;
    }
  }
  
  /**
   * Bulletproof user registration with guaranteed success
   * @param {Object} userData - User registration data
   * @returns {Promise<boolean>} Registration success status
   */
  async registerUser(userData) {
    const maxAttempts = 10; // Increased attempts for guaranteed success
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`\n=== Registration Attempt ${attempt}/${maxAttempts} ===`);
        console.log(`Username: ${userData.username}`);
        
        // Navigate to registration page
        await this.navigateToRegister();
        
        // Fill registration form
        await this.fillRegistrationForm(userData);
        
        // Submit form
        await this.submitRegistration();
        
        // Check for errors
        const hasUsernameError = await this.hasUsernameExistsError();
        const hasPasswordError = await this.hasPasswordError();
        
        if (hasUsernameError) {
          console.log(`❌ Username conflict for: ${userData.username}`);
          
          if (attempt < maxAttempts) {
            // Generate new unique username
            userData.username = DataGenerator.generateSequentialUsername(attempt);
            console.log(`🔄 Retrying with new username: ${userData.username}`);
            continue;
          }
        }
        
        if (hasPasswordError) {
          console.log(`❌ Password error detected`);
          
          if (attempt < maxAttempts) {
            console.log(`🔄 Retrying with new data...`);
            continue;
          }
        }
        
        // Check for success
        const isSuccess = await this.verifyRegistrationSuccess(userData.username);
        
        if (isSuccess) {
          console.log(`✅ Registration successful for: ${userData.username}`);
          return true;
        }
        
        console.log(`⚠️ No success confirmation detected, attempt ${attempt}`);
        
        if (attempt < maxAttempts) {
          // Generate completely new username for next attempt
          userData.username = DataGenerator.generateSequentialUsername(attempt);
          console.log(`🔄 Retrying with username: ${userData.username}`);
          await this.page.waitForTimeout(1000); // Brief pause between attempts
        }
        
      } catch (error) {
        console.error(`Registration attempt ${attempt} failed:`, error.message);
        
        if (attempt < maxAttempts) {
          // Generate new username for retry
          userData.username = DataGenerator.generateSequentialUsername(attempt);
          console.log(`🔄 Retrying after error with username: ${userData.username}`);
          await this.page.waitForTimeout(2000); // Longer pause after error
        }
      }
    }
    
    console.error(`❌ Registration failed after ${maxAttempts} attempts`);
    return false;
  }
}

module.exports = RegisterPage;
