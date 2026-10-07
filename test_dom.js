const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(a => ({
      text: a.textContent.trim(),
      title: a.getAttribute('title'),
      className: a.className,
      href: a.href,
      html: a.outerHTML
    }));
  });
  
  console.log(JSON.stringify(links, null, 2));
  await browser.close();
})();
