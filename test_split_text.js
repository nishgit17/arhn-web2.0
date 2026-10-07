const fs = require('fs');
const file = '/home/nishant-pandey/arhn-web/arhn-web2.0/assets/data/uil.1746999829739.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

// Change AAROHAN size
const el15dataStr = data['INPUT_Element_15_CleanRoom_text3d_data'];
const el15data = JSON.parse(el15dataStr);
el15data.size = 0.07; // increase from 0.058
data['INPUT_Element_15_CleanRoom_text3d_data'] = JSON.stringify(el15data);

// Also maybe adjust scale if we want it bigger
data['MESH_Element_15_CleanRoomscale'] = [2.8, 2.31, 2];

// Change OVERRIDE size (Element 20)
const el20dataStr = data['INPUT_Element_20_CleanRoom_text3d_data'];
const el20data = JSON.parse(el20dataStr);
el20data.size = 0.035; // increase from 0.025 for OVERRIDE
data['INPUT_Element_20_CleanRoom_text3d_data'] = JSON.stringify(el20data);
data['INPUT_Element_20_CleanRoom_text3d_text'] = "OVERRIDE";
data['MESH_Element_20_CleanRoomscale'] = [2.2, 1.88, 1];
// Keep position around the same
data['MESH_Element_20_CleanRoomposition'] = [0.38, 0.45, -2]; 

// Create Element 24 for the rest
data['INPUT_Config_24_CleanRoom_transparent'] = true;
data['INPUT_Config_24_CleanRoom_blending'] = "shader_additive_blending";
data['INPUT_Config_24_CleanRoom_custom'] = "Text3D";
data['INPUT_Config_24_CleanRoom_depthTest'] = false;
data['INPUT_Config_24_CleanRoom_depthWrite'] = false;
data['INPUT_Config_24_CleanRoom_name'] = "text3";
data['INPUT_Config_24_CleanRoom_parent'] = "sl_CleanRoom_group_0";
data['INPUT_Config_24_CleanRoom_renderOrder'] = 1.15;
data['INPUT_Config_24_CleanRoom_sortIndex'] = 1;
data['INPUT_Config_24_CleanRoom_visible'] = true;

const el24data = Object.assign({}, el20data);
el24data.size = 0.020; // smaller than override
data['INPUT_Element_24_CleanRoom_text3d_data'] = JSON.stringify(el24data);
data['INPUT_Element_24_CleanRoom_text3d_fontStyle'] = `font: NBArchitektStd-Bold\nlineHeight: 2\nwidth: 0.45\nsize: 0.020\ncolor: #ffffff\nalign: left`;
data['INPUT_Element_24_CleanRoom_text3d_text'] = "Rise by Instinct.\nRule by Innovation";

data['MESH_Element_24_CleanRoomposition'] = [0.38, 0.38, -2]; // slightly below
data['MESH_Element_24_CleanRoomrotation'] = [0, 0, 0];
data['MESH_Element_24_CleanRoomscale'] = [2, 1.71, 1];

// Update layer count
const slData = JSON.parse(data['INPUT_scenelayout_CleanRoom_data']);
if (slData.layers < 24) {
    slData.layers = 24; // It uses 0 to layers, so if 24, it will go up to 24
}
data['INPUT_scenelayout_CleanRoom_data'] = JSON.stringify(slData);

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log("Done");
