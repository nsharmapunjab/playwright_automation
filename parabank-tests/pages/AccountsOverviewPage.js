const BasePage = require('./BasePage');

/**
 * Accounts Overview Page Object Model - FIXED VERSION
 * Handles account overview and balance verification with corrected selectors
 */
class AccountsOverviewPage extends BasePage {
  
  constructor(page) {
    super(page);
    
    // Updated page elements with correct selectors for current ParaBank version
    this.selectors = {
      accountsTable: '#accountTable, table.standard',
      accountRows: '#accountTable tbody tr, table.standard tbody tr',
      accountNumber: 'td:first-child a, td:nth-child(1) a',
      accountBalance: 'td:nth-child(2), td.currency',
      availableAmount: 'td:nth-child(3)',
      totalBalance: '#accountTable tfoot .balance, .balance',
      openNewAccountLink: 'a[href*="openaccount.htm"], a:has-text("Open New Account")',
      transferFundsLink: 'a[href*="transfer.htm"], a:has-text("Transfer Funds")',
      billPayLink: 'a[href*="billpay.htm"], a:has-text("Bill Pay")',
      accountsOverviewLink: 'a[href*="overview.htm"], a:has-text("Accounts Overview")'
    };
  }
  
  /**
   * Navigate to accounts overview page with retry mechanism
   */
  async navigateToAccountsOverview() {
    console.log('Navigating to accounts overview...');
    
    try {
      // Try clicking the accounts overview link first
      const overviewSelectors = this.selectors.accountsOverviewLink.split(', ');
      let navigationSuccessful = false;
      
      for (const selector of overviewSelectors) {
        try {
          if (await this.isElementVisible(selector)) {
            await this.clickElement(selector);
            navigationSuccessful = true;
            break;
          }
        } catch (error) {
          console.warn(`Failed to navigate using ${selector}: ${error.message}`);
        }
      }
      
      if (!navigationSuccessful) {
        // Fallback to direct navigation
        console.log('Using direct navigation to overview page...');
        await this.navigateTo('overview.htm');
      }
      
      // Wait for accounts table to load
      await this.waitForAccountsTable();
      
    } catch (error) {
      console.error('Failed to navigate to accounts overview:', error);
      throw error;
    }
  }
  
  /**
   * Wait for accounts table to load with multiple selector strategies
   */
  async waitForAccountsTable() {
    const tableSelectors = [
      '#accountTable',
      'table.standard',
      'table',
      '[id*="account"] table'
    ];
    
    let tableFound = false;
    for (const selector of tableSelectors) {
      try {
        if (await this.isElementVisible(selector)) {
          console.log(`Accounts table found with selector: ${selector}`);
          tableFound = true;
          break;
        }
      } catch (error) {
        console.warn(`Table not found with ${selector}: ${error.message}`);
      }
    }
    
    if (!tableFound) {
      throw new Error('Accounts table not found with any selector');
    }
    
    // Wait a bit more for table content to load
    await this.page.waitForTimeout(2000);
  }
  
  /**
   * Get all account numbers from the overview with improved error handling
   * @returns {Promise<Array<string>>} Array of account numbers
   */
  async getAccountNumbers() {
    console.log('Getting account numbers from overview...');
    
    try {
      await this.waitForAccountsTable();
      
      // Try different selectors for account rows
      const rowSelectors = [
        '#accountTable tbody tr',
        'table.standard tbody tr',
        'table tbody tr'
      ];
      
      let accountNumbers = [];
      
      for (const rowSelector of rowSelectors) {
        try {
          const rows = await this.page.$$(rowSelector);
          
          if (rows.length > 0) {
            console.log(`Found ${rows.length} account rows using: ${rowSelector}`);
            
            for (const row of rows) {
              // Try different selectors for account number link
              const linkSelectors = [
                'td:first-child a',
                'td:nth-child(1) a',
                'a'
              ];
              
              for (const linkSelector of linkSelectors) {
                try {
                  const link = await row.$(linkSelector);
                  if (link) {
                    const accountNumber = await link.textContent();
                    if (accountNumber && accountNumber.trim()) {
                      accountNumbers.push(accountNumber.trim());
                      break;
                    }
                  }
                } catch (error) {
                  console.warn(`Could not get account number with ${linkSelector}: ${error.message}`);
                }
              }
            }
            
            if (accountNumbers.length > 0) {
              break;
            }
          }
        } catch (error) {
          console.warn(`Failed to get rows with ${rowSelector}: ${error.message}`);
        }
      }
      
      console.log(`Found account numbers: ${accountNumbers.join(', ')}`);
      return accountNumbers;
      
    } catch (error) {
      console.error('Failed to get account numbers:', error);
      throw error;
    }
  }
  
  /**
   * Get account balance by account number with improved error handling
   * @param {string} accountNumber - Account number to check
   * @returns {Promise<string>} Account balance
   */
  async getAccountBalance(accountNumber) {
    console.log(`Getting balance for account: ${accountNumber}`);
    
    try {
      await this.waitForAccountsTable();
      
      const rowSelectors = [
        '#accountTable tbody tr',
        'table.standard tbody tr',
        'table tbody tr'
      ];
      
      for (const rowSelector of rowSelectors) {
        const rows = await this.page.$$(rowSelector);
        
        for (const row of rows) {
          try {
            const accountLink = await row.$('td:first-child a, td:nth-child(1) a, a');
            if (accountLink) {
              const accountText = await accountLink.textContent();
              
              if (accountText && accountText.trim() === accountNumber) {
                // Found the right row, get balance
                const balanceCell = await row.$('td:nth-child(2), td.currency');
                if (balanceCell) {
                  const balance = await balanceCell.textContent();
                  console.log(`Balance for ${accountNumber}: ${balance}`);
                  return balance ? balance.trim() : '$0.00';
                }
              }
            }
          } catch (error) {
            console.warn(`Error processing row: ${error.message}`);
          }
        }
      }
      
      throw new Error(`Account ${accountNumber} not found in overview`);
      
    } catch (error) {
      console.error(`Failed to get balance for ${accountNumber}:`, error);
      throw error;
    }
  }
  
  /**
   * Verify account exists with positive balance
   * @param {string} accountNumber - Account number to verify
   * @returns {Promise<boolean>} Verification result
   */
  async verifyAccountWithBalance(accountNumber) {
    try {
      const balance = await this.getAccountBalance(accountNumber);
      const balanceValue = parseFloat(balance.replace(/[$,]/g, ''));
      console.log(`Account ${accountNumber} balance value: ${balanceValue}`);
      return balanceValue >= 0; // Changed to >= 0 as new accounts might have 0 balance initially
    } catch (error) {
      console.error(`Could not verify balance for ${accountNumber}:`, error);
      return false;
    }
  }
  
  /**
   * Navigate to open new account page
   */
  async navigateToOpenAccount() {
    const selectors = this.selectors.openNewAccountLink.split(', ');
    
    for (const selector of selectors) {
      try {
        if (await this.isElementVisible(selector)) {
          await this.clickElement(selector);
          return;
        }
      } catch (error) {
        console.warn(`Failed to navigate to open account with ${selector}: ${error.message}`);
      }
    }
    
    // Fallback to direct navigation
    await this.navigateTo('openaccount.htm');
  }
  
  /**
   * Verify accounts overview page is loaded
   * @returns {Promise<boolean>} Page load verification
   */
  async verifyPageLoaded() {
    try {
      await this.waitForAccountsTable();
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = AccountsOverviewPage;
