import puppeteer from 'puppeteer-core';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function testDrawer() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));

  // Click hamburger toggle
  await page.click('.navbar-mobile-toggle');
  await new Promise(r => setTimeout(r, 400));

  await page.screenshot({ path: 'screenshots/mobile_drawer_390.png' });
  console.log('Saved screenshots/mobile_drawer_390.png');

  await browser.close();
}

testDrawer().catch(err => {
  console.error(err);
  process.exit(1);
});
