const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  console.log('Logging in...');
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  await page.waitForNavigation();
  console.log('Navigating to Standup...');

  await page.goto('http://localhost:3000/dashboard/standup');
  await page.waitForSelector('#standup-form');
  
  await page.screenshot({ path: 'C:\\Users\\mriga\\.gemini\\antigravity\\brain\\1c5c4150-2ab5-4f34-87d3-f001f233a561\\standup_form_ui.png' });
  console.log('Screenshot captured.');

  await browser.close();
})();
