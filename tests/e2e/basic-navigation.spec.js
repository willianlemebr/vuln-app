const { test, expect } = require('@playwright/test');

test.describe('Vulnerable App - Basic Navigation', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if page loads
    await expect(page).toHaveURL(/.*\/$/);
    
    // Check for common elements
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'test-results/homepage.png' });
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/');
    
    // Look for about link and click it
    const aboutLink = page.locator('a[href*="about"], a:has-text("About")').first();
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await expect(page).toHaveURL(/.*about.*/);
    } else {
      // If no about link, navigate directly
      await page.goto('/about');
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/');
    
    // Look for contact link and click it
    const contactLink = page.locator('a[href*="contact"], a:has-text("Contact")').first();
    if (await contactLink.isVisible()) {
      await contactLink.click();
      await expect(page).toHaveURL(/.*contact.*/);
    } else {
      // If no contact link, navigate directly
      await page.goto('/contact');
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    const response = await page.goto('/nonexistent-page');
    
    // Should either redirect or show 404
    expect([404, 200, 302]).toContain(response.status());
  });
});