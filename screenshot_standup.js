const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Logging in to local server...');
  await page.goto('http://localhost:3000/login');
  await page.type('input[type="email"]', 'test@example.com');
  await page.type('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  await page.waitForNavigation();
  console.log('Logged in. Navigating to Standup Form...');

  await page.goto('http://localhost:3000/dashboard/standup');
  await page.waitForSelector('#standup-form');
  
  // 1. Default State
  await page.screenshot({ path: 'C:\\Users\\mriga\\.gemini\\antigravity\\brain\\1c5c4150-2ab5-4f34-87d3-f001f233a561\\standup_default.png' });
  console.log('Captured Default state.');

  // 2. Field Error State (Submit without typing)
  await page.click('#standup-submit-btn');
  await page.waitForTimeout(500); // wait for state update
  await page.screenshot({ path: 'C:\\Users\\mriga\\.gemini\\antigravity\\brain\\1c5c4150-2ab5-4f34-87d3-f001f233a561\\standup_error.png' });
  console.log('Captured Field Error state.');

  // 3. Success State (Fill out and submit)
  await page.type('textarea[placeholder="e.g. Shipped the auth pages..."]', 'Finished Sprint Board UI');
  await page.type('textarea[placeholder="e.g. Working on the standup form UI..."]', 'Building Standup UI');
  await page.type('textarea[placeholder="None"]', 'None');
  await page.click('#standup-submit-btn');
  await page.waitForSelector('#standup-success');
  await page.screenshot({ path: 'C:\\Users\\mriga\\.gemini\\antigravity\\brain\\1c5c4150-2ab5-4f34-87d3-f001f233a561\\standup_success.png' });
  console.log('Captured Success state.');

  // 4. Time Window Blocked State
  // We added a debug flag checking localStorage
  await page.goto('http://localhost:3000/dashboard/standup');
  await page.evaluate(() => {
    localStorage.setItem('DEBUG_BLOCK_STANDUP', 'true');
  });
  await page.reload();
  await page.waitForSelector('#standup-warning');
  await page.screenshot({ path: 'C:\\Users\\mriga\\.gemini\\antigravity\\brain\\1c5c4150-2ab5-4f34-87d3-f001f233a561\\standup_blocked.png' });
  console.log('Captured Time Window Blocked state.');

  await browser.close();
})();
