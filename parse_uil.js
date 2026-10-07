const fs = require('fs');
const uil = JSON.parse(fs.readFileSync('assets/data/uil.1746999829739.json', 'utf8'));
for (const key in uil) {
  if (key.includes('geometry') && uil[key] && uil[key].filename) {
     if (uil[key].filename.toLowerCase().includes('plane')) {
         console.log(key, uil[key]);
     }
  }
}
