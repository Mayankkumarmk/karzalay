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

  console.log('Navigating to sprint board preview...');
  await page.goto('http://localhost:3000/preview/sprint-board', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Full board
  await page.screenshot({ path: path.join(artifactDir, 'sprint_board_full.png') });
  console.log('Captured full board.');

  // 2. Empty board (clip the empty column specifically, or just use full board? Spec says "Screenshot: empty board". Let's clip the empty column)
  const emptyBoardHandle = await page.$('#empty-board');
  await emptyBoardHandle.screenshot({ path: path.join(artifactDir, 'sprint_board_empty.png') });
  console.log('Captured empty board.');

  // 3. Single ticket card
  const singleTicketHandle = await page.$('#single-ticket');
  await singleTicketHandle.screenshot({ path: path.join(artifactDir, 'sprint_ticket_card.png') });
  console.log('Captured single ticket.');

  // 4. Dragged ticket card
  const dragTicketHandle = await page.$('#drag-ticket');
  await dragTicketHandle.screenshot({ path: path.join(artifactDir, 'sprint_ticket_drag.png') });
  console.log('Captured dragged ticket.');

  await browser.close();
})();
