const fs = require('fs');

function fixEncoding(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // ISO-8859-1 / UTF-8 double-encoding artifacts
    content = content.replace(/Ã£/g, 'ã');
    content = content.replace(/Ã§/g, 'ç');
    content = content.replace(/Ã©/g, 'é');
    content = content.replace(/Ã³/g, 'ó');
    content = content.replace(/Ã¡/g, 'á');
    content = content.replace(/Ã­/g, 'í');
    content = content.replace(/Ãº/g, 'ú');
    content = content.replace(/Ã¢/g, 'â');
    content = content.replace(/Ãª/g, 'ê');
    content = content.replace(/Ãµ/g, 'õ');
    
    // Powershell weird unicode artifacts
    content = content.replace(/ǭ/g, 'á');
    content = content.replace(/Ǹ/g, 'é');
    content = content.replace(/Ǧ/g, 'ê');
    content = content.replace(/ǜ/g, 'ã');
    content = content.replace(/ǽ/g, 'â');
    content = content.replace(/ǟ/g, 'á'); // as seen in MeuDia.tsx before
    
    // Context-specific replacements for 
    content = content.replace(/Vdeo/g, 'Vídeo');
    content = content.replace(/Oramento/g, 'Orçamento');
    content = content.replace(/ORAMENTO/g, 'ORÇAMENTO');
    content = content.replace(/Injeã/g, 'Injeçã');
    content = content.replace(/reunio/g, 'reunião');
    content = content.replace(/mo/g, 'mão');
    content = content.replace(/expresso/g, 'expressão');
    content = content.replace(/lanado/g, 'lançado');
    content = content.replace(/macia/g, 'maciça');
    content = content.replace(/Aprovaã/g, 'Aprovaçã');
    content = content.replace(/Aprovaes/g, 'Aprovações');
    content = content.replace(/Aprova/g, 'Aprovaç'); // for general
    content = content.replace(/Refaã/g, 'Refaçã');
    content = content.replace(/Evoluã/g, 'Evoluçã');
    content = content.replace(/Aes/g, 'Ações');
    content = content.replace(/Solicitaã/g, 'Solicitaçã');
    content = content.replace(/Ttulo/g, 'Título');
    content = content.replace(/Lanar/g, 'Lançar');
    content = content.replace(/Histrico/g, 'Histórico');
    content = content.replace(/Maro/g, 'Março');
    content = content.replace(/ms/g, 'mês');
    content = content.replace(/Ms/g, 'Mês');
    content = content.replace(//g, 'ç'); // Fallback for most common remaining

    fs.writeFileSync(filePath, content, 'utf8');
}

fixEncoding('src/pages/Marketing.tsx');
