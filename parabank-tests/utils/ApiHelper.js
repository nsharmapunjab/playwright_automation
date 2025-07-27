// ===== utils/ApiHelper.js - COMPLETE VERSION WITH ALL METHODS =====

const { request } = require('@playwright/test');

/**
 * API Helper class for ParaBank API interactions - COMPLETE VERSION
 * All methods properly implemented with JSON validation
 */
class ApiHelper {
  
  constructor() {
    this.baseURL = 'https://parabank.parasoft.com/parabank';
    this.requestContext = null;
    this.capturedEndpoints = [];
    this.jsonResponses = [];
  }
  
  /**
   * Initialize API request context
   */
  async init() {
    this.requestContext = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
  }
  
  /**
   * Store captured API endpoint with response data
   * @param {string} endpoint - Captured API endpoint
   * @param {string} method - HTTP method
   * @param {Object} data - Response data if available
   */
  storeCapturedEndpoint(endpoint, method, data = null) {
    const capturedData = {
      endpoint,
      method,
      data,
      timestamp: Date.now()
    };
    
    this.capturedEndpoints.push(capturedData);
    
    if (data) {
      this.jsonResponses.push({
        endpoint,
        method,
        response: data,
        timestamp: Date.now()
      });
    }
    
    console.log(`📡 Captured API call: ${method} ${endpoint}`);
    if (data) {
      console.log(`📄 Response data captured: ${typeof data} ${Array.isArray(data) ? `(${data.length} items)` : ''}`);
    }
  }
  
  /**
   * Get captured endpoints - REQUIRED METHOD
   * @returns {Array} List of captured endpoints
   */
  getCapturedEndpoints() {
    console.log(`📡 Returning ${this.capturedEndpoints.length} captured endpoints`);
    return this.capturedEndpoints;
  }
  
  /**
   * Get captured JSON responses - REQUIRED METHOD
   * @returns {Array} List of captured JSON responses
   */
  getJsonResponses() {
    console.log(`📄 Returning ${this.jsonResponses.length} JSON responses`);
    return this.jsonResponses;
  }
  
  /**
   * Log detailed JSON response analysis
   * @param {Object} jsonData - JSON response data
   * @param {string} endpoint - API endpoint
   * @returns {Object} Analysis results
   */
  analyzeJsonResponse(jsonData, endpoint = 'unknown') {
    console.log('\n🔍 ===== JSON RESPONSE ANALYSIS =====');
    console.log(`📡 Endpoint: ${endpoint}`);
    console.log(`📊 Response Type: ${typeof jsonData}`);
    console.log(`📄 Is Array: ${Array.isArray(jsonData)}`);
    
    const analysis = {
      endpoint,
      type: typeof jsonData,
      isArray: Array.isArray(jsonData),
      structure: {},
      validations: [],
      data: jsonData
    };
    
    if (jsonData === null) {
      console.log('❌ Response is null');
      analysis.validations.push({ field: 'response', status: 'FAIL', reason: 'Response is null' });
      return analysis;
    }
    
    if (Array.isArray(jsonData)) {
      console.log(`📈 Array Length: ${jsonData.length}`);
      analysis.arrayLength = jsonData.length;
      
      if (jsonData.length > 0) {
        console.log('\n📋 ARRAY STRUCTURE ANALYSIS:');
        const firstItem = jsonData[0];
        const fields = Object.keys(firstItem);
        
        console.log(`📝 Fields in first item: ${fields.join(', ')}`);
        analysis.structure.fields = fields;
        
        // Analyze each field in the first item
        fields.forEach(field => {
          const value = firstItem[field];
          const valueType = typeof value;
          console.log(`  📄 ${field}: ${valueType} = ${value}`);
          analysis.structure[field] = { type: valueType, value: value };
        });
        
        // Check for common transaction fields
        const transactionFields = ['id', 'accountId', 'amount', 'date', 'type', 'description'];
        console.log('\n✅ TRANSACTION FIELD VALIDATION:');
        
        transactionFields.forEach(field => {
          if (fields.includes(field)) {
            console.log(`  ✅ ${field}: PRESENT (${typeof firstItem[field]})`);
            analysis.validations.push({ field, status: 'PASS', value: firstItem[field] });
          } else {
            console.log(`  ❌ ${field}: MISSING`);
            analysis.validations.push({ field, status: 'MISSING', reason: 'Field not found in response' });
          }
        });
        
        // Validate data types and values
        if (firstItem.amount !== undefined) {
          const amount = parseFloat(firstItem.amount);
          if (!isNaN(amount)) {
            console.log(`  💰 Amount validation: ${amount} (valid number)`);
            analysis.validations.push({ field: 'amount', status: 'PASS', value: amount, validation: 'valid_number' });
          } else {
            console.log(`  ❌ Amount validation: ${firstItem.amount} (invalid number)`);
            analysis.validations.push({ field: 'amount', status: 'FAIL', value: firstItem.amount, reason: 'not_a_number' });
          }
        }
        
        if (firstItem.accountId !== undefined) {
          const accountId = parseInt(firstItem.accountId);
          if (!isNaN(accountId)) {
            console.log(`  🏦 Account ID validation: ${accountId} (valid number)`);
            analysis.validations.push({ field: 'accountId', status: 'PASS', value: accountId, validation: 'valid_number' });
          } else {
            console.log(`  ❌ Account ID validation: ${firstItem.accountId} (invalid number)`);
            analysis.validations.push({ field: 'accountId', status: 'FAIL', value: firstItem.accountId, reason: 'not_a_number' });
          }
        }
        
        if (firstItem.date !== undefined) {
          const dateValue = firstItem.date;
          const isValidDate = !isNaN(Date.parse(dateValue));
          if (isValidDate) {
            console.log(`  📅 Date validation: ${dateValue} (valid date)`);
            analysis.validations.push({ field: 'date', status: 'PASS', value: dateValue, validation: 'valid_date' });
          } else {
            console.log(`  ❌ Date validation: ${dateValue} (invalid date)`);
            analysis.validations.push({ field: 'date', status: 'FAIL', value: dateValue, reason: 'invalid_date' });
          }
        }
        
      } else {
        console.log('ℹ️ Array is empty');
        analysis.validations.push({ field: 'array', status: 'INFO', reason: 'Empty array response' });
      }
      
    } else if (typeof jsonData === 'object') {
      console.log('\n📋 OBJECT STRUCTURE ANALYSIS:');
      const fields = Object.keys(jsonData);
      console.log(`📝 Object fields: ${fields.join(', ')}`);
      analysis.structure.fields = fields;
      
      // Analyze each field
      fields.forEach(field => {
        const value = jsonData[field];
        const valueType = typeof value;
        console.log(`  📄 ${field}: ${valueType} = ${value}`);
        analysis.structure[field] = { type: valueType, value: value };
      });
      
      // Check for account-related fields
      const accountFields = ['id', 'customerId', 'type', 'balance'];
      console.log('\n✅ ACCOUNT FIELD VALIDATION:');
      
      accountFields.forEach(field => {
        if (fields.includes(field)) {
          console.log(`  ✅ ${field}: PRESENT (${typeof jsonData[field]})`);
          analysis.validations.push({ field, status: 'PASS', value: jsonData[field] });
        } else {
          console.log(`  ❌ ${field}: MISSING`);
          analysis.validations.push({ field, status: 'MISSING', reason: 'Field not found in response' });
        }
      });
      
    } else {
      console.log(`📊 Primitive type: ${typeof jsonData} = ${jsonData}`);
      analysis.structure.value = jsonData;
      analysis.validations.push({ field: 'response', status: 'INFO', value: jsonData, type: typeof jsonData });
    }
    
    console.log('\n📊 VALIDATION SUMMARY:');
    const passed = analysis.validations.filter(v => v.status === 'PASS').length;
    const failed = analysis.validations.filter(v => v.status === 'FAIL').length;
    const missing = analysis.validations.filter(v => v.status === 'MISSING').length;
    const info = analysis.validations.filter(v => v.status === 'INFO').length;
    
    console.log(`  ✅ Passed: ${passed}`);
    console.log(`  ❌ Failed: ${failed}`);
    console.log(`  ⚠️ Missing: ${missing}`);
    console.log(`  ℹ️ Info: ${info}`);
    
    analysis.summary = { passed, failed, missing, info };
    
    console.log('🔍 ===== END JSON ANALYSIS =====\n');
    
    return analysis;
  }
  
  /**
   * Find transactions with detailed JSON response validation
   * @param {string} accountId - Account ID
   * @param {string} amount - Transaction amount
   * @returns {Promise<Object>} API response with detailed analysis
   */
  async findTransactionsByAmount(accountId, amount) {
    if (!this.requestContext) {
      await this.init();
    }
    
    console.log(`\n🔍 SEARCHING FOR TRANSACTIONS`);
    console.log(`📋 Account: ${accountId}`);
    console.log(`💰 Amount: $${amount}`);
    
    // First try captured endpoints
    const transactionEndpoints = this.capturedEndpoints.filter(ep => 
      ep.endpoint.includes('transaction') || 
      ep.endpoint.includes('findtrans') ||
      ep.endpoint.includes('account') && ep.endpoint.includes(accountId)
    );
    
    if (transactionEndpoints.length > 0) {
      console.log(`\n📡 FOUND ${transactionEndpoints.length} CAPTURED ENDPOINTS`);
      
      for (const captured of transactionEndpoints) {
        try {
          console.log(`\n🔍 TRYING CAPTURED ENDPOINT: ${captured.method} ${captured.endpoint}`);
          
          let response;
          if (captured.method === 'GET') {
            response = await this.requestContext.get(captured.endpoint);
          } else if (captured.method === 'POST') {
            response = await this.requestContext.post(captured.endpoint);
          }
          
          const status = response.status();
          console.log(`📊 HTTP Status: ${status}`);
          
          if (status === 200) {
            try {
              const jsonData = await response.json();
              console.log(`\n📄 JSON RESPONSE RECEIVED`);
              console.log(`📊 Raw JSON: ${JSON.stringify(jsonData, null, 2)}`);
              
              // Perform detailed analysis
              const analysis = this.analyzeJsonResponse(jsonData, captured.endpoint);
              
              // Filter for matching transactions if it's an array
              let filteredData = jsonData;
              if (Array.isArray(jsonData)) {
                const matches = jsonData.filter(transaction => {
                  if (transaction.amount) {
                    const transactionAmount = Math.abs(parseFloat(transaction.amount));
                    const searchAmount = parseFloat(amount);
                    return Math.abs(transactionAmount - searchAmount) < 0.01;
                  }
                  return false;
                });
                
                if (matches.length > 0) {
                  console.log(`\n🎯 AMOUNT MATCHING RESULTS:`);
                  console.log(`📈 Found ${matches.length} transactions matching amount $${amount}`);
                  matches.forEach((match, index) => {
                    console.log(`  ${index + 1}. Transaction ID: ${match.id || 'N/A'}, Amount: ${match.amount}, Date: ${match.date || 'N/A'}`);
                  });
                  filteredData = matches;
                } else {
                  console.log(`\nℹ️ NO AMOUNT MATCHES FOUND`);
                  console.log(`📋 Total transactions: ${jsonData.length}`);
                  if (jsonData.length > 0) {
                    console.log(`💰 Sample amounts: ${jsonData.slice(0, 3).map(t => t.amount).join(', ')}`);
                  }
                }
              }
              
              return {
                status: status,
                data: filteredData,
                headers: response.headers(),
                endpoint: captured.endpoint,
                analysis: analysis,
                originalData: jsonData
              };
              
            } catch (jsonError) {
              console.warn(`⚠️ JSON parsing failed: ${jsonError.message}`);
              const textContent = await response.text();
              console.log(`📄 Raw response text: ${textContent.substring(0, 500)}...`);
            }
          }
          
        } catch (error) {
          console.warn(`⚠️ Request failed for ${captured.endpoint}: ${error.message}`);
        }
      }
    }
    
    // Try fallback endpoints - ParaBank specific patterns
    console.log(`\n🔄 TRYING FALLBACK ENDPOINTS`);
    const fallbackEndpoints = [
      `/services/bank/accounts/${accountId}/transactions`,
      `/services/bank/transactions/account/${accountId}`,
      `/activity.htm?id=${accountId}`,
      `/overview.htm`,
      `/findtrans.htm`
    ];
    
    for (const endpoint of fallbackEndpoints) {
      try {
        console.log(`\n🔍 TRYING FALLBACK: ${endpoint}`);
        const response = await this.requestContext.get(endpoint);
        const status = response.status();
        console.log(`📊 HTTP Status: ${status}`);
        
        if (status === 200) {
          try {
            const jsonData = await response.json();
            console.log(`\n📄 JSON RESPONSE FROM FALLBACK`);
            console.log(`📊 Raw JSON: ${JSON.stringify(jsonData, null, 2)}`);
            
            const analysis = this.analyzeJsonResponse(jsonData, endpoint);
            
            return {
              status: status,
              data: jsonData,
              headers: response.headers(),
              endpoint: endpoint,
              analysis: analysis
            };
            
          } catch (jsonError) {
            const textContent = await response.text();
            console.log(`📄 Non-JSON response (first 200 chars): ${textContent.substring(0, 200)}...`);
            
            // For HTML responses, check if they contain transaction data
            const containsAccount = textContent.includes(accountId);
            const containsAmount = textContent.includes(amount);
            
            return {
              status: status,
              data: { 
                html: textContent,
                containsAccount,
                containsAmount
              },
              headers: response.headers(),
              endpoint: endpoint,
              analysis: { 
                type: 'html', 
                validations: [
                  { field: 'response', status: 'INFO', reason: 'HTML response' },
                  { field: 'accountReference', status: containsAccount ? 'PASS' : 'FAIL', value: containsAccount },
                  { field: 'amountReference', status: containsAmount ? 'PASS' : 'FAIL', value: containsAmount }
                ],
                summary: { passed: 0, failed: 0, missing: 0, info: 1 }
              }
            };
          }
        }
        
      } catch (error) {
        console.warn(`⚠️ Fallback request failed for ${endpoint}: ${error.message}`);
      }
    }
    
    console.log(`\n❌ NO SUCCESSFUL API RESPONSES FOUND`);
    return {
      status: 404,
      data: null,
      headers: {},
      endpoint: 'none',
      analysis: { 
        validations: [{ field: 'response', status: 'FAIL', reason: 'No API endpoints returned data' }],
        summary: { passed: 0, failed: 1, missing: 0, info: 0 }
      }
    };
  }
  
  /**
   * Get account details with JSON validation
   * @param {string} accountId - Account ID
   * @returns {Promise<Object>} API response with analysis
   */
  async getAccountDetails(accountId) {
    if (!this.requestContext) {
      await this.init();
    }
    
    console.log(`\n🔍 GETTING ACCOUNT DETAILS: ${accountId}`);
    
    const endpoints = [
      `/services/bank/accounts/${accountId}`,
      `/activity.htm?id=${accountId}`,
      `/overview.htm`
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`\n🔍 TRYING: ${endpoint}`);
        const response = await this.requestContext.get(endpoint);
        const status = response.status();
        console.log(`📊 HTTP Status: ${status}`);
        
        if (status === 200) {
          try {
            const jsonData = await response.json();
            console.log(`\n📄 ACCOUNT JSON RESPONSE`);
            console.log(`📊 Raw JSON: ${JSON.stringify(jsonData, null, 2)}`);
            
            const analysis = this.analyzeJsonResponse(jsonData, endpoint);
            
            return {
              status,
              data: jsonData,
              endpoint,
              analysis
            };
            
          } catch (jsonError) {
            const textContent = await response.text();
            console.log(`📄 Non-JSON account response (first 200 chars): ${textContent.substring(0, 200)}...`);
            
            return {
              status,
              data: { html: textContent },
              endpoint,
              analysis: { 
                type: 'html', 
                validations: [{ field: 'response', status: 'INFO', reason: 'HTML response' }],
                summary: { passed: 0, failed: 0, missing: 0, info: 1 }
              }
            };
          }
        }
      } catch (error) {
        console.warn(`⚠️ Account request failed: ${error.message}`);
      }
    }
    
    return {
      status: 404,
      data: null,
      endpoint: 'none',
      analysis: { 
        validations: [{ field: 'response', status: 'FAIL', reason: 'No account endpoints returned data' }],
        summary: { passed: 0, failed: 1, missing: 0, info: 0 }
      }
    };
  }
  
  /**
   * Get all transactions for an account
   * @param {string} accountId - Account ID
   * @returns {Promise<Object>} API response with analysis
   */
  async getTransactions(accountId) {
    if (!this.requestContext) {
      await this.init();
    }
    
    console.log(`\n🔍 GETTING ALL TRANSACTIONS: ${accountId}`);
    
    const endpoints = [
      `/services/bank/accounts/${accountId}/transactions`,
      `/activity.htm?id=${accountId}`,
      `/findtrans.htm`
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`\n🔍 TRYING: ${endpoint}`);
        const response = await this.requestContext.get(endpoint);
        const status = response.status();
        console.log(`📊 HTTP Status: ${status}`);
        
        if (status === 200) {
          try {
            const jsonData = await response.json();
            console.log(`\n📄 TRANSACTIONS JSON RESPONSE`);
            console.log(`📊 Raw JSON: ${JSON.stringify(jsonData, null, 2)}`);
            
            const analysis = this.analyzeJsonResponse(jsonData, endpoint);
            
            return {
              status,
              data: jsonData,
              endpoint,
              analysis
            };
            
          } catch (jsonError) {
            const textContent = await response.text();
            console.log(`📄 Non-JSON transactions response (first 200 chars): ${textContent.substring(0, 200)}...`);
            
            return {
              status,
              data: { html: textContent },
              endpoint,
              analysis: { 
                type: 'html', 
                validations: [{ field: 'response', status: 'INFO', reason: 'HTML response' }],
                summary: { passed: 0, failed: 0, missing: 0, info: 1 }
              }
            };
          }
        }
      } catch (error) {
        console.warn(`⚠️ Transactions request failed: ${error.message}`);
      }
    }
    
    return {
      status: 404,
      data: [],
      endpoint: 'none',
      analysis: { 
        validations: [{ field: 'response', status: 'FAIL', reason: 'No transaction endpoints returned data' }],
        summary: { passed: 0, failed: 1, missing: 0, info: 0 }
      }
    };
  }
  
  /**
   * Clean up resources
   */
  async dispose() {
    if (this.requestContext) {
      await this.requestContext.dispose();
    }
  }
}

module.exports = ApiHelper;
