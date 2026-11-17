import puppeteer from 'puppeteer-core';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1487, height: 900 });
  await page.goto('https://pawvision-ai.pages.dev', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'screenshots/current_1487.png' });
  await browser.close();
  console.log('Captured screenshots/current_1487.png successfully');
}

capture().catch(err => {
  console.error('Error capturing screenshot:', err);
  process.exit(1);
});
