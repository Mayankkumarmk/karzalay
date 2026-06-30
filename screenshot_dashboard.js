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

    await page.waitForTimeout(2000);

    console.log('Navigating to Dashboard...');
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
    
    await page.waitForTimeout(2000);
    
    // Cropped screenshot to match user's requested view
    await page.screenshot({ 
      path: 'C:\\Users\\mriga\\.gemini\\antigravity\\brain\\1c5c4150-2ab5-4f34-87d3-f001f233a561\\dashboard_members.png',
      clip: { x: 0, y: 0, width: 1400, height: 750 } 
    });
    console.log('Cropped Screenshot captured.');

    // Mobile screenshot
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'C:\\Users\\mriga\\.gemini\\antigravity\\brain\\1c5c4150-2ab5-4f34-87d3-f001f233a561\\dashboard_members_mobile.png', fullPage: true });
    console.log('Mobile Screenshot captured.');

    await browser.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
