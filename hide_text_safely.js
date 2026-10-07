const fs = require('fs');
const file = 'assets/data/uil.1746999829739.json';
const uil = JSON.parse(fs.readFileSync(file, 'utf8'));

uil['INPUT_Config_15_CleanRoom_visible'] = false;
uil['INPUT_Config_20_CleanRoom_visible'] = false;

fs.writeFileSync(file, JSON.stringify(uil));
console.log("Hid text elements in uil.json safely");
