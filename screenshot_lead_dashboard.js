const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setViewportSize({ width: 1400, height: 900 });

    console.log('Logging in...');
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.click('button[type="submit"]')
    ]);

    console.log('Intercepting profile API to force LEAD role...');
    await page.route('**/api/users/me', async route => {
      const response = await route.fetch();
      const json = await response.json();
      json.role = 'LEAD';
      await route.fulfill({ response, json });
    });

    console.log('Navigating to Dashboard (Lead View)...');
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
    
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ path: 'C:\\Users\\mriga\\.gemini\\antigravity\\brain\\1c5c4150-2ab5-4f34-87d3-f001f233a561\\lead_dashboard.png' });
    console.log('Lead Dashboard captured.');

    await browser.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
