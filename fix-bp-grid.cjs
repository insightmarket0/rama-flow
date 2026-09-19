const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf8');

// Replace all huge rounded corners with sharp brutalist edges
content = content.replace(/rounded-\[2rem\]/g, 'rounded-none');
content = content.replace(/rounded-\[1\.5rem\]/g, 'rounded-none');
content = content.replace(/rounded-lg/g, 'rounded-none');
content = content.replace(/rounded-2xl/g, 'rounded-none');
content = content.replace(/rounded-full/g, 'rounded-none');

// Replace muted/soft colors with stark brutalist colors
content = content.replace(/#D6F599/g, '#CCFF00'); // the pale green to neon green
content = content.replace(/#1A2421/g, '#000000'); // dark green to pure black
content = content.replace(/#161B19/g, '#111111'); // very dark green to dark gray
content = content.replace(/#24302A/g, '#111111'); // medium dark green to dark gray
content = content.replace(/#2A3831/g, '#222222'); // slightly lighter green to gray
content = content.replace(/#E8FCC3/g, '#FFFFFF'); // very pale green to white

// Replace gradients
content = content.replace(/bg-gradient-to-tr from-\[\#161B19\] to-\[\#1A2421\]/g, 'bg-[#111111]');
content = content.replace(/bg-gradient-to-br from-\[\#1A2421\] to-\[\#161B19\]/g, 'bg-[#111111]');
content = content.replace(/bg-gradient-to-br from-\[\#24302A\] to-\[\#1A2421\]/g, 'bg-[#111111]');
content = content.replace(/bg-gradient-to-br from-\[\#D6F599\] to-\[\#E8FCC3\]/g, 'bg-[#CCFF00]');

// Add stark thick borders everywhere
content = content.replace(/border border-\[\#CCFF00\]\/30/g, 'border-4 border-[#CCFF00]');
content = content.replace(/border border-white\/5/g, 'border-2 border-white/20');
content = content.replace(/border border-white\/10/g, 'border-2 border-white/20');
content = content.replace(/border-2 border-white\/10/g, 'border-4 border-white/10');

// Make text extremely bold (replace any font-medium with font-black where appropriate, though we did some before)
content = content.replace(/font-medium/g, 'font-bold');
content = content.replace(/font-light/g, 'font-black');
content = content.replace(/font-semibold/g, 'font-black');

// For the specific green cards, ensure the text is black for maximum contrast
content = content.replace(/className="md:col-span-1 bg-\[\#CCFF00\] rounded-none p-6 flex flex-col justify-center relative overflow-hidden group"/g, 'className="md:col-span-1 bg-[#CCFF00] rounded-none p-8 flex flex-col justify-center relative overflow-hidden group border-4 border-black"');
content = content.replace(/text-\[\#000000\]\/90/g, 'text-black');
content = content.replace(/text-\[\#000000\]/g, 'text-black');

fs.writeFileSync('src/pages/BusinessPlan.tsx', content);
