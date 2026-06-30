const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  const artifactDir = 'C:\\Users\\mriga\\.gemini\\antigravity\\brain\\1c5c4150-2ab5-4f34-87d3-f001f233a561';

  // Set mockGate cookie directly
  await page.setCookie({
    name: 'mockGate',
    value: '4',
    domain: 'localhost'
  });

  console.log('Logging in to local server...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await page.type('input[type="email"]', 'test@test.com');
  await page.type('input[type="password"]', 'password');
  await page.click('button[type="submit"]');

  console.log('Waiting for navigation to dashboard/sprint...');
  await page.waitForSelector('a[href="/dashboard/sprint"]', { timeout: 10000 });
  await page.click('a[href="/dashboard/sprint"]');

  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: path.join(artifactDir, 'functional_sprint_board.png') });
  console.log('Captured functional sprint board.');

  // Click a ticket to open the drawer
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div'));
    const ticketCard = cards.find(el => el.innerText.includes('Auth pages shipped'));
    if (ticketCard) ticketCard.click();
  });

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'functional_ticket_drawer.png') });
  console.log('Captured ticket drawer.');

  await browser.close();
})();
