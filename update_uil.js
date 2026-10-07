const fs = require('fs');
const file = 'assets/data/uil.1746999829739.json';
const uil = JSON.parse(fs.readFileSync(file, 'utf8'));

// Convert Element 15 to a standard PBR plane with the image
delete uil['INPUT_Config_15_CleanRoom_custom'];
delete uil['INPUT_Element_15_CleanRoom_text3d_data'];
delete uil['INPUT_Element_15_CleanRoom_text3d_fontStyle'];
delete uil['INPUT_Element_15_CleanRoom_text3d_text'];

uil['INPUT_Config_15_CleanRoom_visible'] = true;
uil['INPUT_Config_15_CleanRoom_geometry'] = {
    "filename": "caustic_plane.bin",
    "prefix": "",
    "relative": "bush.bin",
    "src": "bush.bin/caustic_plane.bin"
};

uil['PBR/PBR/Element_15_CleanRoom/_txtBaseColor'] = {
    "compressed": false,
    "filename": "arhn-full-logo.png",
    "prefix": "assets/images",
    "relative": "assets/images",
    "src": "assets/images/arhn-full-logo.png",
    "useCompressed": false
};

uil['PBR/PBR/Element_15_CleanRoom/_tx_tBaseColor'] = uil['PBR/PBR/Element_15_CleanRoom/_txtBaseColor'];
uil['PBR/PBR/Element_15_CleanRoom/uTint'] = "#ffffff";
uil['PBR/PBR/Element_15_CleanRoom/uMRON'] = [1, 1, 0, 1]; // Metallic, Roughness, Opacity/Occlusion, Normal?

// Adjust scale/position to fit the screen
uil['MESH_Element_15_CleanRoomscale'] = [2.0, 1.0, 2.0];
uil['MESH_Element_15_CleanRoomposition'] = [-0.4, 0.42, -2];
uil['MESH_Element_15_CleanRoomrotation'] = [0, 0, 0];

// Hide Element 20 completely
uil['INPUT_Config_20_CleanRoom_visible'] = false;

fs.writeFileSync(file, JSON.stringify(uil));
console.log("Updated Element 15 to use the image texture");
