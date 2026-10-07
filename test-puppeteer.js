const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:\\Users\\soham\\.cache\\puppeteer\\chrome\\win64-154.0.8037.57\\chrome-win64\\chrome.exe' });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('http://localhost:3000', {waitUntil: 'networkidle0'});
  
  // Try to find what global variables exist and their values
  const result = await page.evaluate(() => {
     let logs = [];
     logs.push("window.bind exists: " + (typeof window.bind));
     if (typeof window.bind === 'function') {
         window.bind("Work/scrollProgress", v => window._debugScroll = v);
     }
     return logs;
  });
  console.log("Initial state:", result);
  
  // Simulate mouse wheel
  console.log("Simulating wheel scroll...");
  await page.mouse.wheel({ deltaY: 2000 });
  await new Promise(r => setTimeout(r, 1000));
  
  const result2 = await page.evaluate(() => {
     return {
        scrollY: window.scrollY,
        debugScroll: window._debugScroll,
        footerTransform: document.getElementById('ar-footer') ? document.getElementById('ar-footer').style.transform : 'no footer'
     };
  });
  console.log("After scroll:", result2);
  
  await browser.close();
})();
