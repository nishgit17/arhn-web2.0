const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  await page.evaluate(() => {
    const fn = window.triggerSpineScroll;
    console.log("Is triggerSpineScroll defined?", typeof fn);
    if (typeof fn === 'function') {
        fn('-> Events');
    } else {
        console.log("Trying to find footer link and click it");
        const a = Array.from(document.querySelectorAll('a')).find(el => el.textContent.includes('[EVENTS]'));
        if (a) a.click();
    }
  });

  // wait a bit for any async things
  await new Promise(r => setTimeout(r, 1000));
  
  await browser.close();
})();
