const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });

    console.log('Logging in...');
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.click('button[type="submit"]')
    ]);

    await page.waitForTimeout(2000);

    console.log('Navigating to Onboarding Gate 1...');
    await page.goto('http://localhost:3000/onboarding?debug_gate=1', { waitUntil: 'networkidle' });
    
    await page.waitForTimeout(1000);
    // Fill out Gate 1 as LEAD
    await page.fill('input[required]', 'Test Lead Name');
    
    // Select the "Lead" radio button
    const leadRadio = page.locator('input[type="radio"]').nth(1);
    await leadRadio.click();
    
    // Fill Github
    const githubInput = page.locator('input[placeholder="octocat"]');
    await githubInput.fill('lead-github');
    
    // Submit Gate 1
    await page.click('button[type="submit"]');
    
    console.log('Waiting for Gate 2...');
    await page.waitForTimeout(2000); // Give it time to animate to Gate 2

    // Take screenshot of Gate 2
    await page.screenshot({ path: 'C:\\Users\\mriga\\.gemini\\antigravity\\brain\\1c5c4150-2ab5-4f34-87d3-f001f233a561\\lead_gate2.png' });
    console.log('Gate 2 captured.');

    console.log('Navigating to Onboarding Gate 3 (Lead)...');
    await page.goto('http://localhost:3000/onboarding?debug_gate=3', { waitUntil: 'networkidle' });
    
    await page.waitForTimeout(1000);
    // Take screenshot of Gate 3
    await page.screenshot({ path: 'C:\\Users\\mriga\\.gemini\\antigravity\\brain\\1c5c4150-2ab5-4f34-87d3-f001f233a561\\lead_gate3.png' });
    console.log('Gate 3 captured.');

    await browser.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
