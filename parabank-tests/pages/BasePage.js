// ===== pages/BasePage.js - MINIMAL CHANGES =====

/**
 * Base Page Object Model class - OPTIMIZED VERSION
 * Streamlined for better reliability
 */
class BasePage {
  
  constructor(page) {
    this.page = page;
    this.baseURL = 'https://parabank.parasoft.com/parabank/';
  }
  
  /**
   * Navigate to a specific path
   * @param {string} path - Path to navigate to
   */
  async navigateTo(path = '') {
    const fullURL = `${this.baseURL}${path}`;
    console.log(`Navigating to: ${fullURL}`);
    
    try {
      await this.page.goto(fullURL, { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });
      
      await this.page.waitForLoadState('networkidle', { timeout: 30000 });
      await this.page.waitForTimeout(1000);
      
    } catch (error) {
      console.error(`Navigation failed to ${fullURL}:`, error.message);
      throw new Error(`Failed to navigate to ${fullURL}: ${error.message}`);
    }
  }
  
  /**
   * Wait for element to be visible
   * @param {string} selector - Element selector
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForElement(selector, timeout = 15000) {
    try {
      await this.page.waitForSelector(selector, { timeout, state: 'visible' });
    } catch (error) {
      throw new Error(`Element not found within ${timeout}ms: ${selector}`);
    }
  }
  
  /**
   * Click element
   * @param {string} selector - Element selector
   */
  async clickElement(selector) {
    await this.waitForElement(selector);
    await this.page.click(selector);
  }
  
  /**
   * Fill input field
   * @param {string} selector - Input selector
   * @param {string} value - Value to fill
   */
  async fillInput(selector, value) {
    await this.waitForElement(selector);
    await this.page.fill(selector, value);
  }
  
  /**
   * Get text content of element
   * @param {string} selector - Element selector
   * @returns {Promise<string>} Text content
   */
  async getTextContent(selector) {
    try {
      await this.waitForElement(selector);
      const text = await this.page.textContent(selector);
      return text ? text.trim() : '';
    } catch (error) {
      return '';
    }
  }
  
  /**
   * Check if element is visible
   * @param {string} selector - Element selector
   * @returns {Promise<boolean>} Visibility status
   */
  async isElementVisible(selector) {
    try {
      await this.page.waitForSelector(selector, { timeout: 3000, state: 'visible' });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = BasePage;
