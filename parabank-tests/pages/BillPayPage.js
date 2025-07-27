// ===== pages/BillPayPage.js - WITH NETWORK INTERCEPTION =====

const BasePage = require('./BasePage');

/**
 * Bill Pay Page Object Model - WITH NETWORK CAPTURE
 * Enhanced to capture actual API calls during bill payment
 */
class BillPayPage extends BasePage {
  
  constructor(page) {
    super(page);
    
    this.selectors = {
      payeeNameInput: 'input[name="payee.name"]',
      payeeAddressInput: 'input[name="payee.address.street"]',
      payeeCityInput: 'input[name="payee.address.city"]',
      payeeStateInput: 'input[name="payee.address.state"]',
      payeeZipInput: 'input[name="payee.address.zipCode"]',
      payeePhoneInput: 'input[name="payee.phoneNumber"]',
      payeeAccountInput: 'input[name="payee.accountNumber"]',
      verifyAccountInput: 'input[name="verifyAccount"]',
      amountInput: 'input[name="amount"]',
      fromAccountSelect: 'select[name="fromAccountId"]',
      sendPaymentButton: 'input[value="Send Payment"]',
      successMessage: '#billpayResult h1',
      confirmationMessage: '#billpayResult p'
    };
    
    this.capturedRequests = [];
    this.apiHelper = null;
  }
  
  /**
   * Set API helper for capturing network calls
   * @param {ApiHelper} apiHelper - API helper instance
   */
  setApiHelper(apiHelper) {
    this.apiHelper = apiHelper;
  }
  
  /**
   * Setup network interception to capture API calls
   */
  async setupNetworkCapture() {
    console.log('🔍 Setting up network request capture...');
    
    // Intercept all network requests
    this.page.on('request', request => {
      const url = request.url();
      const method = request.method();
      
      // Capture API-related requests
      if (url.includes('/services/') || 
          url.includes('/api/') || 
          url.includes('transaction') ||
          url.includes('account') ||
          url.includes('billpay') ||
          url.includes('transfer')) {
        
        console.log(`📡 Captured request: ${method} ${url}`);
        this.capturedRequests.push({
          url,
          method,
          timestamp: Date.now()
        });
        
        if (this.apiHelper) {
          this.apiHelper.storeCapturedEndpoint(url, method);
        }
      }
    });
    
    // Intercept responses for additional data
    this.page.on('response', async response => {
      const url = response.url();
      const status = response.status();
      
      if ((url.includes('/services/') || 
           url.includes('/api/') || 
           url.includes('transaction') ||
           url.includes('account')) && 
          status === 200) {
        
        try {
          const data = await response.json();
          console.log(`📊 Captured response: ${status} ${url}`);
          console.log(`📄 Response data type: ${Array.isArray(data) ? 'Array' : typeof data}`);
          
          if (this.apiHelper) {
            this.apiHelper.storeCapturedEndpoint(url, 'GET', data);
          }
        } catch (error) {
          console.log(`📊 Captured non-JSON response: ${status} ${url}`);
        }
      }
    });
  }
  
  /**
   * Navigate to bill pay page with network capture
   */
  async navigateToBillPay() {
    await this.setupNetworkCapture();
    await this.navigateTo('billpay.htm');
  }
  
  /**
   * Fill payee information
   * @param {Object} payeeData - Payee information
   */
  async fillPayeeInformation(payeeData) {
    await this.fillInput(this.selectors.payeeNameInput, payeeData.name);
    await this.fillInput(this.selectors.payeeAddressInput, payeeData.address);
    await this.fillInput(this.selectors.payeeCityInput, payeeData.city);
    await this.fillInput(this.selectors.payeeStateInput, payeeData.state);
    await this.fillInput(this.selectors.payeeZipInput, payeeData.zipCode);
    await this.fillInput(this.selectors.payeePhoneInput, payeeData.phoneNumber);
    await this.fillInput(this.selectors.payeeAccountInput, payeeData.accountNumber);
    await this.fillInput(this.selectors.verifyAccountInput, payeeData.accountNumber);
  }
  
  /**
   * Enter payment amount
   * @param {string} amount - Payment amount
   */
  async enterPaymentAmount(amount) {
    await this.fillInput(this.selectors.amountInput, amount);
  }
  
  /**
   * Select account to pay from
   * @param {string} accountNumber - Source account number
   */
  async selectPaymentAccount(accountNumber) {
    await this.waitForElement(this.selectors.fromAccountSelect);
    await this.page.selectOption(this.selectors.fromAccountSelect, { label: accountNumber });
  }
  
  /**
   * Submit payment with network monitoring
   */
  async submitPayment() {
    console.log('💳 Submitting payment and monitoring network calls...');
    
    // Click submit and wait for network activity
    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      this.clickElement(this.selectors.sendPaymentButton)
    ]);
    
    // Give extra time for any background API calls
    await this.page.waitForTimeout(3000);
    
    console.log(`📡 Total captured requests: ${this.capturedRequests.length}`);
    for (const req of this.capturedRequests) {
      console.log(`  📋 ${req.method} ${req.url}`);
    }
  }
  
  /**
   * Complete bill payment process with network capture
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} Payment result with captured network calls
   */
  async payBill(paymentData) {
    try {
      await this.navigateToBillPay();
      await this.fillPayeeInformation(paymentData.payee);
      await this.enterPaymentAmount(paymentData.amount);
      await this.selectPaymentAccount(paymentData.fromAccount);
      await this.submitPayment();
      
      const success = await this.verifyPaymentSuccess();
      
      return {
        success: success,
        amount: paymentData.amount,
        payee: paymentData.payee.name,
        fromAccount: paymentData.fromAccount,
        capturedRequests: this.capturedRequests
      };
      
    } catch (error) {
      console.error('Bill payment failed:', error);
      return {
        success: false,
        error: error.message,
        capturedRequests: this.capturedRequests
      };
    }
  }
  
  /**
   * Verify payment success
   * @returns {Promise<boolean>} Payment verification result
   */
  async verifyPaymentSuccess() {
    try {
      const successMessage = await this.getTextContent(this.selectors.successMessage);
      return successMessage.includes('Bill Payment Complete') || 
             successMessage.includes('Payment Complete') ||
             successMessage.includes('Bill Payment Service');
    } catch {
      return false;
    }
  }
  
  /**
   * Get payment confirmation details
   * @returns {Promise<string>} Confirmation message
   */
  async getPaymentConfirmation() {
    try {
      return await this.getTextContent(this.selectors.confirmationMessage);
    } catch {
      return 'No confirmation message found';
    }
  }
  
  /**
   * Get captured network requests
   * @returns {Array} List of captured requests
   */
  getCapturedRequests() {
    return this.capturedRequests;
  }
}

module.exports = BillPayPage;
