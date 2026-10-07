const fs = require('fs');
const file = 'assets/data/uil.1746999829739.json';
const uil = JSON.parse(fs.readFileSync(file, 'utf8'));

uil['INPUT_Config_15_CleanRoom_geometry'] = {
    "filename": "PlaneGeometry",
    "prefix": "",
    "relative": "",
    "src": "PlaneGeometry"
};

fs.writeFileSync(file, JSON.stringify(uil));
console.log("Updated Element 15 to use PlaneGeometry");
