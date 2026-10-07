const c = require('fs').readFileSync('assets/js/app.1746999829739.js','utf8');

// Get the full sortAndInitialize function  
const i1 = c.indexOf('sortAndInitialize');
console.log('=== sortAndInitialize ===');
console.log(c.substring(i1-100, i1+1200));

// Get initRoute function
const i2 = c.indexOf('async function initRoute()');
console.log('\n\n=== initRoute ===');
console.log(c.substring(i2-50, i2+1000));
