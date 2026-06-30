const { chromium } = require('playwright');

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
    
    console.log("Waiting for onboarding redirect...");
    await page.waitForURL('http://localhost:3000/onboarding');
    
    console.log("Forcing Gate 2...");
    await page.goto('http://localhost:3000/onboarding?debug_gate=2');
    
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'debug_gate2.png' });
    console.log("Screenshot saved to debug_gate2.png");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await browser.close();
  }
})();
