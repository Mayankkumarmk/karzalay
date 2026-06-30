const fs = require('fs');
const { chromium } = require('playwright');
const { marked } = require('marked');

(async () => {
  try {
    const mdContent = fs.readFileSync('C:\\Users\\mriga\\.gemini\\antigravity\\brain\\1c5c4150-2ab5-4f34-87d3-f001f233a561\\Lead_Dashboard_Implementation_Notes.md', 'utf8');
    
    // Read the image and convert to base64
    const imgPath1 = 'C:\\Users\\mriga\\.gemini\\antigravity\\brain\\1c5c4150-2ab5-4f34-87d3-f001f233a561\\lead_dashboard.png';
    let base64Image1 = '';
    
    if (fs.existsSync(imgPath1)) {
      base64Image1 = 'data:image/png;base64,' + fs.readFileSync(imgPath1).toString('base64');
    }

    // Replace the markdown image paths with the base64 strings
    let fixedMd = mdContent.replace('![Lead Dashboard](/C:\\Users\\mriga\\.gemini\\antigravity\\brain\\1c5c4150-2ab5-4f34-87d3-f001f233a561\\lead_dashboard.png)', `![Lead Dashboard](${base64Image1})`);

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
            img { max-width: 100%; border-radius: 8px; border: 1px solid #ddd; margin: 20px 0; }
            h1, h2, h3 { color: #111; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 24px; }
            code { background: #f4f4f4; padding: 2px 4px; border-radius: 4px; font-family: monospace; }
            pre { background: #f4f4f4; padding: 16px; border-radius: 8px; overflow-x: auto; }
            ul, ol { padding-left: 20px; }
            li { margin-bottom: 8px; }
          </style>
        </head>
        <body>
          ${marked.parse(fixedMd)}
        </body>
      </html>
    `;

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle' });
    await page.pdf({ 
      path: 'C:\\Users\\mriga\\.gemini\\antigravity\\brain\\1c5c4150-2ab5-4f34-87d3-f001f233a561\\Lead_Dashboard_Implementation_Notes.pdf', 
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });
    await browser.close();
    console.log('PDF created successfully.');
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
})();
