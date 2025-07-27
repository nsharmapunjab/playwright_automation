const BasePage = require('./BasePage');

/**
 * Transfer Funds Page Object Model
 * Handles money transfer functionality between accounts
 */
class TransferFundsPage extends BasePage {
  
  constructor(page) {
    super(page);
    
    // Page elements
    this.selectors = {
      amountInput: '#amount',
      fromAccountSelect: '#fromAccountId',
      toAccountSelect: '#toAccountId',
      transferButton: 'input[value="Transfer"]',
      successMessage: '#showResult h1',
      confirmationDetails: '#showResult p',
      transferAmount: '#amount',
      fromAccount: '#fromAccount',
      toAccount: '#toAccount'
    };
  }
  
  /**
   * Navigate to transfer funds page
   */
  async navigateToTransferFunds() {
    await this.navigateTo('transfer.htm');
  }
  
  /**
   * Fill transfer amount
   * @param {string} amount - Amount to transfer
   */
  async enterTransferAmount(amount) {
    await this.fillInput(this.selectors.amountInput, amount);
  }
  
  /**
   * Select source account for transfer
   * @param {string} accountNumber - Source account number
   */
  async selectFromAccount(accountNumber) {
    await this.waitForElement(this.selectors.fromAccountSelect);
    await this.page.selectOption(this.selectors.fromAccountSelect, { label: accountNumber });
  }
  
  /**
   * Select destination account for transfer
   * @param {string} accountNumber - Destination account number
   */
  async selectToAccount(accountNumber) {
    await this.waitForElement(this.selectors.toAccountSelect);
    await this.page.selectOption(this.selectors.toAccountSelect, { label: accountNumber });
  }
  
  /**
   * Submit transfer
   */
  async submitTransfer() {
    await this.clickElement(this.selectors.transferButton);
    await this.page.waitForLoadState('networkidle');
  }
  
  /**
   * Perform complete fund transfer
   * @param {string} amount - Amount to transfer
   * @param {string} fromAccount - Source account
   * @param {string} toAccount - Destination account
   * @returns {Promise<boolean>} Transfer success status
   */
  async transferFunds(amount, fromAccount, toAccount) {
    try {
      await this.navigateToTransferFunds();
      await this.enterTransferAmount(amount);
      await this.selectFromAccount(fromAccount);
      await this.selectToAccount(toAccount);
      await this.submitTransfer();
      
      // Verify transfer success
      return await this.verifyTransferSuccess();
      
    } catch (error) {
      console.error('Transfer failed:', error);
      return false;
    }
  }
  
  /**
   * Verify transfer completion
   * @returns {Promise<boolean>} Transfer verification result
   */
  async verifyTransferSuccess() {
    try {
      const successMessage = await this.getTextContent(this.selectors.successMessage);
      return successMessage.includes('Transfer Complete') || successMessage.includes('Transfer Successful');
    } catch {
      return false;
    }
  }
  
  /**
   * Get transfer confirmation details
   * @returns {Promise<Object>} Transfer details
   */
  async getTransferDetails() {
    try {
      const confirmationText = await this.getTextContent(this.selectors.confirmationDetails);
      return {
        success: true,
        message: confirmationText
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = TransferFundsPage;
