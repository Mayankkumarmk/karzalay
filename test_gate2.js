const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log("Navigating to login...");
    await page.goto('http://localhost:3000/login');
    
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    console.log("Waiting for navigation to onboarding...");
    await page.waitForURL('http://localhost:3000/onboarding');
    
    console.log("Gate 1: Selecting Member...");
    // Assuming Gate 1 is member by default, just click continue
    await page.click('button[type="submit"]');
    
    console.log("Gate 2: Filling out Member form...");
    // Wait for gate 2 to appear
    await page.waitForSelector('text=Your Details');
    
    await page.fill('input[placeholder="https://..."]', 'http://resume.com');
    await page.fill('input[placeholder="e.g. Stanford University"]', 'MIT');
    await page.fill('input[placeholder="e.g. B.Tech CS"]', 'B.S.');
    await page.fill('input[placeholder="e.g. 2024"]', '2024');
    
    console.log("Gate 2: Submitting Member form...");
    await page.click('button[type="submit"]');
    
    // Check if error message appears
    try {
      const errorDiv = await page.waitForSelector('text=Please fill all required fields', { timeout: 2000 });
      if (errorDiv) {
        console.log("ERROR: Form validation failed!");
        await page.screenshot({ path: 'gate2_error.png' });
        process.exit(1);
      }
    } catch (e) {
      console.log("No validation error seen.");
    }
    
    console.log("Waiting for Gate 3...");
    await page.waitForSelector('text=Join a Company', { timeout: 5000 });
    console.log("SUCCESS: Reached Gate 3!");
    
  } catch (error) {
    console.error("Test failed:", error);
    await page.screenshot({ path: 'gate2_crash.png' });
  } finally {
    await browser.close();
  }
})();
