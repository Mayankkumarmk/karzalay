const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  const artifactDir = 'C:\\Users\\mriga\\.gemini\\antigravity\\brain\\1c5c4150-2ab5-4f34-87d3-f001f233a561';

  console.log('Testing Full Flow on Vercel...');

  // 1. Go to login
  await page.goto('https://karzalaydesignsystemv2updated.vercel.app/login', { waitUntil: 'networkidle0' });
  await page.type('input[type="email"]', 'test@test.com');
  await page.type('input[type="password"]', 'password123');
  
  console.log('Logging in...');
  await page.click('button[type="submit"]');

  // 2. Wait for onboarding Gate 1
  await page.waitForSelector('input[placeholder="octocat"]', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1500)); // wait for crossfade animation
  await page.screenshot({ path: path.join(artifactDir, 'live_gate1.png') });
  console.log('Captured Gate 1.');

  // 3. Submit Gate 1
  await page.type('input[placeholder="octocat"]', 'mygithub');
  await page.click('button[type="submit"]');

  // 4. Wait for Gate 2
  await page.waitForFunction(() => document.body.innerText.includes('Join a Company'), { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1500)); // wait for animation
  await page.screenshot({ path: path.join(artifactDir, 'live_gate2.png') });
  console.log('Captured Gate 2.');

  // 5. Apply
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const applyBtn = buttons.find(b => b.innerText === 'Apply');
    if (applyBtn) applyBtn.click();
  });

  // 6. Wait for auto-advance to Gate 3
  console.log('Waiting for socket auto-advance...');
  await page.waitForFunction(() => document.body.innerText.includes('Your First Standup'), { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(artifactDir, 'live_gate3.png') });
  console.log('Captured Gate 3.');

  await browser.close();
})();
