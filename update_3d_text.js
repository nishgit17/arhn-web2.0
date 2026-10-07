const fs = require('fs');
const file = 'assets/data/uil.1746999829739.json';
const uil = JSON.parse(fs.readFileSync(file, 'utf8'));

// Make them visible
uil['INPUT_Config_15_CleanRoom_visible'] = true;
uil['INPUT_Config_20_CleanRoom_visible'] = true;

// Update left text (Element 15)
uil['INPUT_Element_15_CleanRoom_text3d_text'] = "AAROHAN";

// Update right text (Element 20)
uil['INPUT_Element_20_CleanRoom_text3d_text'] = "OVERRIDE\nRise by Instinct.\nRule by Innovation";

fs.writeFileSync(file, JSON.stringify(uil));
console.log("Updated Text3D elements in uil.json");
