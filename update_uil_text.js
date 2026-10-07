const fs = require('fs');
const file = 'assets/data/uil.1746999829739.json';
const uil = JSON.parse(fs.readFileSync(file, 'utf8'));

uil['INPUT_Element_15_CleanRoom_text3d_text'] = " AR \nAAROHAN";
uil['INPUT_Element_20_CleanRoom_text3d_text'] = " ";

fs.writeFileSync(file, JSON.stringify(uil));
console.log("Updated Text3D elements in uil.json");
