const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

const map = {
    'Ã£': 'ã', 'Ã§': 'ç', 'Ã©': 'é', 'Ã³': 'ó', 'Ã¡': 'á', 'Ã­': 'í', 'Ãº': 'ú', 'Ã¢': 'â', 'Ãª': 'ê', 'Ãµ': 'õ',
    'ǭ': 'á', 'Ǹ': 'é', 'Ǧ': 'ê', 'ǜ': 'ã', 'ǽ': 'â', 'ǟ': 'á'
};

for (const [bad, good] of Object.entries(map)) {
    content = content.split(bad).join(good);
}

// powershell replaced unknown unicode with the replacement character 
// U+FFFD.
content = content.split('\ufffd').join('ç');

content = content.replace(/Vçdeo/g, 'Vídeo');
content = content.replace(/Injeãç/g, 'Injeção');
content = content.replace(/Aprovaãç/g, 'Aprovação');
content = content.replace(/Refaãç/g, 'Refação');
content = content.replace(/Evoluãç/g, 'Evolução');
content = content.replace(/Solicitaãç/g, 'Solicitação');
content = content.replace(/Aprovaçes/g, 'Aprovações');
content = content.replace(/Açes/g, 'Ações');
content = content.replace(/Tçtulo/g, 'Título');
content = content.replace(/Histçrico/g, 'Histórico');
content = content.replace(/cçmera/g, 'câmera');
content = content.replace(/Março/g, 'Março');
content = content.replace(/Lançar/g, 'Lançar');
content = content.replace(/reunião/g, 'reunião');
content = content.replace(/mão/g, 'mão');
content = content.replace(/expressão/g, 'expressão');
content = content.replace(/lançado/g, 'lançado');
content = content.replace(/maciça/g, 'maciça');
content = content.replace(/Cachê/g, 'Cachê');

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
