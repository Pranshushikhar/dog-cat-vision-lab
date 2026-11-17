import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const viewports = [
  { name: 'desktop_1487', width: 1487, height: 900 },
  { name: 'desktop_1440', width: 1440, height: 900 },
  { name: 'laptop_1366', width: 1366, height: 800 },
  { name: 'tablet_1024', width: 1024, height: 768 },
  { name: 'tablet_768', width: 768, height: 1024 },
  { name: 'mobile_390', width: 390, height: 844 }
];

async function captureAll() {
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle0', timeout: 15000 });
    // wait slightly for React mounting and fonts
    await new Promise(r => setTimeout(r, 600));

    // Capture header bounding box and full page
    const outputPath = path.join('screenshots', `${vp.name}.png`);
    await page.screenshot({ path: outputPath });
    console.log(`Saved screenshot: ${outputPath} (${vp.width}x${vp.height})`);

    // Measure navbar dimensions
    const navbarDims = await page.evaluate(() => {
      const el = document.querySelector('.navbar');
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const brand = document.querySelector('.navbar-brand-section')?.getBoundingClientRect();
      const nav = document.querySelector('.navbar-nav-section')?.getBoundingClientRect();
      const actions = document.querySelector('.navbar-actions-section')?.getBoundingClientRect();
      const feedback = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Feedback'))?.getBoundingClientRect();
      return {
        height: rect.height,
        width: rect.width,
        brandWidth: brand?.width,
        navWidth: nav?.width,
        actionsWidth: actions?.width,
        feedbackRight: feedback ? feedback.right : null,
        viewportWidth: window.innerWidth
      };
    });
    console.log(`Navbar stats for ${vp.name}:`, JSON.stringify(navbarDims));

    await page.close();
  }

  await browser.close();
  console.log('All viewports captured successfully!');
}

captureAll().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
