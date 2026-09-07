const fs = require('fs');
const file = 'src/pages/Equipe.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<li key=\{member\.id\}>/;
const replacement = `<li key={member.id} className="relative">
          {member.departmentBadge && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-white/10 text-gray-300 px-3 py-1 rounded-full text-[8px] font-bold tracking-[0.2em] uppercase z-20 whitespace-nowrap shadow-lg flex items-center gap-1.5 backdrop-blur-md">
              <div className={\`w-1.5 h-1.5 rounded-full \${member.bgColor.replace('bg-', 'bg-').replace('/10', '')} shadow-[0_0_8px_currentColor]\`} style={{ color: 'inherit' }} />
              {member.departmentBadge}
            </div>
          )}`;

content = content.replace(regex, replacement);

const regex2 = /<div className="inline-block relative z-10 transition-transform duration-300 hover:-translate-y-1 group">/;
const replacement2 = `<div className="inline-block relative z-10 transition-transform duration-300 hover:-translate-y-1 group pt-4">`;

content = content.replace(regex2, replacement2);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed renderNode for badges');
