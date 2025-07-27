const BasePage = require('./BasePage');

/**
 * Open Account Page Object Model
 * Handles new account creation functionality
 */
class OpenAccountPage extends BasePage {
  
  constructor(page) {
    super(page);
    
    // Page elements
    this.selectors = {
      accountTypeSelect: '#type',
      fromAccountSelect: '#fromAccountId',
      openAccountButton: 'input[value="Open New Account"]',
      successMessage: '#openAccountResult h1',
      newAccountNumber: '#newAccountId',
      confirmationMessage: '#openAccountResult p'
    };
  }
  
  /**
   * Navigate to open account page
   */
  async navigateToOpenAccount() {
    await this.navigateTo('openaccount.htm');
  }
  
  /**
   * Select account type
   * @param {string} accountType - Type of account (SAVINGS, CHECKING)
   */
  async selectAccountType(accountType) {
    await this.waitForElement(this.selectors.accountTypeSelect);
    await this.page.selectOption(this.selectors.accountTypeSelect, accountType);
  }
  
  /**
   * Select source account for initial deposit
   * @param {string} accountNumber - Source account number
   */
  async selectFromAccount(accountNumber) {
    await this.waitForElement(this.selectors.fromAccountSelect);
    await this.page.selectOption(this.selectors.fromAccountSelect, { label: accountNumber });
  }
  
  /**
   * Submit new account creation
   */
  async submitAccountCreation() {
    await this.clickElement(this.selectors.openAccountButton);
    await this.page.waitForLoadState('networkidle');
  }
  
  /**
   * Get new account number after successful creation
   * @returns {Promise<string>} New account number
   */
  async getNewAccountNumber() {
    await this.waitForElement(this.selectors.newAccountNumber);
    return await this.getTextContent(this.selectors.newAccountNumber);
  }
  
  /**
   * Create new savings account
   * @param {string} fromAccount - Source account for initial deposit
   * @returns {Promise<string>} New account number
   */
  async createSavingsAccount(fromAccount) {
    try {
      await this.navigateToOpenAccount();
      await this.selectAccountType('SAVINGS');
      
      if (fromAccount) {
        await this.selectFromAccount(fromAccount);
      }
      
      await this.submitAccountCreation();
      
      // Verify success and get account number
      const successMessage = await this.getTextContent(this.selectors.successMessage);
      if (successMessage.includes('Account Opened!') || successMessage.includes('Congratulations')) {
        return await this.getNewAccountNumber();
      }
      
      throw new Error('Account creation failed');
      
    } catch (error) {
      console.error('Error creating savings account:', error);
      throw error;
    }
  }
  
  /**
   * Verify account creation success
   * @returns {Promise<boolean>} Success verification
   */
  async verifyAccountCreationSuccess() {
    try {
      const successMessage = await this.getTextContent(this.selectors.successMessage);
      return successMessage.includes('Account Opened!') || successMessage.includes('Congratulations');
    } catch {
      return false;
    }
  }
}

module.exports = OpenAccountPage;
