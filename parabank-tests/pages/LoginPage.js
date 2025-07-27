// ===== pages/LoginPage.js - FIXED AUTO-LOGIN HANDLING =====

const BasePage = require('./BasePage');

/**
 * Login Page Object Model - FIXED VERSION
 * Handles auto-login after registration and proper state detection
 */
class LoginPage extends BasePage {
  
  constructor(page) {
    super(page);
    
    // Updated page elements with comprehensive selectors
    this.selectors = {
      usernameInput: 'input[name="username"], #username, input[type="text"]',
      passwordInput: 'input[name="password"], #password, input[type="password"]',
      loginButton: 'input[value="Log In"], button:has-text("Log In"), input[type="submit"]',
      logoutLink: 'a[href*="logout.htm"], a:has-text("Log Out")',
      accountsOverviewLink: 'a[href*="overview.htm"], a:has-text("Accounts Overview")',
      welcomeMessage: '#leftPanel h2, .welcome, p:has-text("Welcome")',
      errorMessage: '.error, #rightPanel .error',
      // Logged-in state indicators
      accountServicesHeading: 'h2:has-text("Account Services")',
      loggedInWelcome: 'p:has-text("Welcome")',
      accountMenuLinks: 'a[href*="openaccount"], a[href*="overview"], a[href*="transfer"]'
    };
  }
  
  /**
   * Navigate to login page (home page)
   */
  async navigateToLogin() {
    await this.navigateTo('');
  }
  
  /**
   * Check if user is already logged in
   * @returns {Promise<boolean>} True if already logged in
   */
  async isAlreadyLoggedIn() {
    try {
      // Check for multiple logged-in indicators
      const loggedInIndicators = [
        this.selectors.accountServicesHeading,
        this.selectors.loggedInWelcome,
        this.selectors.logoutLink,
        this.selectors.accountsOverviewLink,
        this.selectors.accountMenuLinks
      ];
      
      for (const indicator of loggedInIndicators) {
        if (await this.isElementVisible(indicator)) {
          console.log(`User already logged in - detected via: ${indicator}`);
          return true;
        }
      }
      
      // Check URL for logged-in pages
      const currentUrl = this.page.url();
      if (currentUrl.includes('overview') || 
          currentUrl.includes('account') || 
          currentUrl.includes('welcome')) {
        console.log(`User already logged in - detected via URL: ${currentUrl}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.warn('Error checking login status:', error);
      return false;
    }
  }
  
  /**
   * Check if login form is visible
   * @returns {Promise<boolean>} True if login form is visible
   */
  async isLoginFormVisible() {
    try {
      const usernameVisible = await this.isElementVisible(this.selectors.usernameInput);
      const passwordVisible = await this.isElementVisible(this.selectors.passwordInput);
      const loginButtonVisible = await this.isElementVisible(this.selectors.loginButton);
      
      return usernameVisible && passwordVisible && loginButtonVisible;
    } catch {
      return false;
    }
  }
  
  /**
   * Enhanced login method that handles auto-login scenarios
   * @param {string} username - Username
   * @param {string} password - Password
   */
  async login(username, password) {
    console.log(`Attempting to login with username: ${username}`);
    
    try {
      // First check if user is already logged in
      const alreadyLoggedIn = await this.isAlreadyLoggedIn();
      
      if (alreadyLoggedIn) {
        console.log('✅ User is already logged in, skipping login process');
        return;
      }
      
      // Navigate to login page if not already there
      await this.navigateToLogin();
      
      // Wait a moment for page to load
      await this.page.waitForTimeout(2000);
      
      // Check again if login form is visible
      const formVisible = await this.isLoginFormVisible();
      
      if (!formVisible) {
        // Check if we're already logged in after navigation
        const nowLoggedIn = await this.isAlreadyLoggedIn();
        if (nowLoggedIn) {
          console.log('✅ User is already logged in after navigation');
          return;
        }
        
        throw new Error('Login form is not visible and user is not logged in');
      }
      
      // Proceed with normal login process
      await this.performLogin(username, password);
      
    } catch (error) {
      console.error('Login process failed:', error);
      throw error;
    }
  }
  
  /**
   * Perform the actual login process
   * @param {string} username - Username
   * @param {string} password - Password
   */
  async performLogin(username, password) {
    console.log('Performing login with form fields...');
    
    // Fill username with enhanced selectors
    const usernameSelectors = this.selectors.usernameInput.split(', ');
    let usernameFilled = false;
    
    for (const selector of usernameSelectors) {
      try {
        if (await this.isElementVisible(selector)) {
          await this.page.focus(selector);
          await this.page.fill(selector, username);
          
          // Verify the value was set
          const actualValue = await this.page.inputValue(selector);
          if (actualValue === username) {
            console.log(`✓ Username filled with selector: ${selector}`);
            usernameFilled = true;
            break;
          }
        }
      } catch (error) {
        console.warn(`Failed to fill username with ${selector}: ${error.message}`);
      }
    }
    
    if (!usernameFilled) {
      // Try alternative approach - look for any text input
      try {
        const textInputs = await this.page.$$('input[type="text"]');
        if (textInputs.length > 0) {
          await textInputs[0].fill(username);
          console.log('✓ Username filled using first text input');
          usernameFilled = true;
        }
      } catch (error) {
        console.warn('Failed to fill username with alternative approach:', error);
      }
    }
    
    if (!usernameFilled) {
      throw new Error('Could not find or fill username input field');
    }
    
    // Fill password with enhanced selectors
    const passwordSelectors = this.selectors.passwordInput.split(', ');
    let passwordFilled = false;
    
    for (const selector of passwordSelectors) {
      try {
        if (await this.isElementVisible(selector)) {
          await this.page.focus(selector);
          await this.page.fill(selector, password);
          
          // Verify the value was set
          const actualValue = await this.page.inputValue(selector);
          if (actualValue === password) {
            console.log(`✓ Password filled with selector: ${selector}`);
            passwordFilled = true;
            break;
          }
        }
      } catch (error) {
        console.warn(`Failed to fill password with ${selector}: ${error.message}`);
      }
    }
    
    if (!passwordFilled) {
      // Try alternative approach - look for any password input
      try {
        const passwordInputs = await this.page.$$('input[type="password"]');
        if (passwordInputs.length > 0) {
          await passwordInputs[0].fill(password);
          console.log('✓ Password filled using first password input');
          passwordFilled = true;
        }
      } catch (error) {
        console.warn('Failed to fill password with alternative approach:', error);
      }
    }
    
    if (!passwordFilled) {
      throw new Error('Could not find or fill password input field');
    }
    
    // Click login button
    const loginSelectors = this.selectors.loginButton.split(', ');
    let loginClicked = false;
    
    for (const selector of loginSelectors) {
      try {
        if (await this.isElementVisible(selector)) {
          await this.page.click(selector);
          console.log(`✓ Login button clicked with selector: ${selector}`);
          loginClicked = true;
          break;
        }
      } catch (error) {
        console.warn(`Failed to click login with ${selector}: ${error.message}`);
      }
    }
    
    if (!loginClicked) {
      // Try alternative approach - look for any submit button
      try {
        const submitButtons = await this.page.$$('input[type="submit"], button[type="submit"]');
        if (submitButtons.length > 0) {
          await submitButtons[0].click();
          console.log('✓ Login button clicked using first submit button');
          loginClicked = true;
        }
      } catch (error) {
        console.warn('Failed to click login with alternative approach:', error);
      }
    }
    
    if (!loginClicked) {
      throw new Error('Could not find or click login button');
    }
    
    // Wait for login response
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
    await this.page.waitForTimeout(2000);
    
    console.log('✓ Login process completed');
  }
  
  /**
   * Verify successful login with comprehensive indicators
   * @returns {Promise<boolean>} Login success status
   */
  async verifyLoginSuccess() {
    try {
      // Check multiple success indicators
      const successIndicators = [
        this.selectors.accountServicesHeading,
        this.selectors.loggedInWelcome,
        this.selectors.logoutLink,
        this.selectors.accountsOverviewLink,
        'a[href*="overview.htm"]',
        'a:has-text("Accounts Overview")',
        'a[href*="logout.htm"]',
        'a:has-text("Log Out")',
        'h2:has-text("Account Services")',
        'p:has-text("Welcome")'
      ];
      
      for (const indicator of successIndicators) {
        if (await this.isElementVisible(indicator)) {
          console.log(`✓ Login success verified with: ${indicator}`);
          return true;
        }
      }
      
      // Check URL for success
      const currentUrl = this.page.url();
      if (currentUrl.includes('overview') || 
          currentUrl.includes('account') || 
          currentUrl.includes('welcome')) {
        console.log(`✓ Login success verified by URL: ${currentUrl}`);
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  }
  
  /**
   * Verify login error
   * @returns {Promise<boolean>} Error presence status
   */
  async verifyLoginError() {
    return await this.isElementVisible(this.selectors.errorMessage);
  }
  
  /**
   * Perform logout
   */
  async logout() {
    const logoutSelectors = this.selectors.logoutLink.split(', ');
    
    for (const selector of logoutSelectors) {
      if (await this.isElementVisible(selector)) {
        await this.clickElement(selector);
        await this.page.waitForLoadState('networkidle');
        console.log('✓ User logged out successfully');
        return;
      }
    }
    
    console.warn('Could not find logout link');
  }
  
  /**
   * Check if user is logged in
   * @returns {Promise<boolean>} Login status
   */
  async isLoggedIn() {
    return await this.isAlreadyLoggedIn();
  }
}

module.exports = LoginPage;
