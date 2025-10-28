const { test, expect } = require('@playwright/test');

test.describe('Vulnerable App - Security Tests', () => {
  test('should detect XSS vulnerability in search', async ({ page }) => {
    const xssPayload = '<script>alert("xss")</script>';
    
    // Test XSS in URL parameter
    await page.goto(`/search?q=${encodeURIComponent(xssPayload)}`);
    
    const pageContent = await page.content();
    
    // This test expects the vulnerability to exist (since it's a vulnerable app)
    if (pageContent.includes(xssPayload)) {
      console.log('⚠️  XSS vulnerability detected as expected');
      // Log this as a finding but don't fail the test
      await page.screenshot({ path: 'test-results/xss-vulnerability.png' });
    }
    
    // Ensure page still loads despite XSS
    expect(await page.locator('body').isVisible()).toBeTruthy();
  });

  test('should test form submission vulnerabilities', async ({ page }) => {
    await page.goto('/contact');
    
    // Test malicious input in contact form
    const maliciousEmail = '<script>alert("email")</script>@test.com';
    const maliciousMessage = '<img src=x onerror=alert("xss")>';
    
    const emailField = page.locator('input[name="email"], input[type="email"]').first();
    const messageField = page.locator('textarea[name="message"], textarea').first();
    const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
    
    if (await emailField.isVisible()) {
      await emailField.fill(maliciousEmail);
    }
    
    if (await messageField.isVisible()) {
      await messageField.fill(maliciousMessage);
    }
    
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Wait for response
      await page.waitForTimeout(2000);
      
      // Take screenshot of result
      await page.screenshot({ path: 'test-results/form-submission-test.png' });
    }
  });

  test('should test admin command injection vulnerability', async ({ page }) => {
    await page.goto('/admin');
    
    // Test command injection
    const maliciousCommand = 'ls; cat /etc/passwd';
    
    const commandField = page.locator('input[name="command"], textarea[name="command"]').first();
    const executeButton = page.locator('button:has-text("Execute"), input[value*="Execute"]').first();
    
    if (await commandField.isVisible()) {
      await commandField.fill(maliciousCommand);
      
      if (await executeButton.isVisible()) {
        await executeButton.click();
        
        // Wait for response
        await page.waitForTimeout(3000);
        
        // Take screenshot of result
        await page.screenshot({ path: 'test-results/command-injection-test.png' });
        
        console.log('⚠️  Command injection test completed');
      }
    }
  });

  test('should check for sensitive information exposure', async ({ page }) => {
    // Check various endpoints for sensitive info
    const endpoints = ['/', '/about', '/contact', '/admin'];
    
    for (const endpoint of endpoints) {
      await page.goto(endpoint);
      
      const content = await page.content();
      
      // Check for common sensitive patterns
      const sensitivePatterns = [
        /password/i,
        /secret/i,
        /api[_-]?key/i,
        /token/i,
        /credential/i
      ];
      
      for (const pattern of sensitivePatterns) {
        if (pattern.test(content)) {
          console.log(`⚠️  Potential sensitive information found on ${endpoint}: ${pattern}`);
          await page.screenshot({ path: `test-results/sensitive-info-${endpoint.replace('/', '_')}.png` });
        }
      }
    }
  });
});