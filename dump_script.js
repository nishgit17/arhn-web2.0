const fs = require('fs');
const content = fs.readFileSync('assets/js/app.1746999829739.js', 'utf8');
const idx = content.indexOf('NavUIItem",refName:"work"');
if(idx !== -1) {
    console.log(content.substring(idx - 150, idx + 400));
} else {
    console.log('Not found');
}
