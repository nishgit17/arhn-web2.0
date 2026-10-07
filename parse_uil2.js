const fs = require('fs');
const uil = JSON.parse(fs.readFileSync('assets/data/uil.1746999829739.json', 'utf8'));
console.log(uil['INPUT_Config_1_CleanRoom_geometry']);
