const puppeteer = require('puppeteer-core');
const os = require('os');
const path = require('path');
(async () => {
    const executablePath = path.join(os.homedir(), '.cache', 'puppeteer', 'chrome', 'linux-127.0.6533.119', 'chrome-linux64', 'chrome');
    const browser = await puppeteer.launch({ executablePath, headless: 'new' });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a')).map(a => ({
            text: a.textContent,
            className: a.className,
            href: a.href,
            title: a.title
        }));
    });
    console.log(JSON.stringify(links, null, 2));
    await browser.close();
})();
