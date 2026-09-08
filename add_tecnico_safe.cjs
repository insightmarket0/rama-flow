const fs = require('fs');
const file = 'src/pages/Equipe.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update Anderson's children
content = content.replace('children: ["william", "alyson", "mara"]', 'children: ["william", "alyson", "mara", "tecnico_gas"]');

// Create the new member object
const newMember = `      {
      departmentBadge: "Serviços em Campo",
      id: "tecnico_gas",
        name: "Técnico Instalador",
        role: "Instalação & Manutenção",
        focus: "Mangueiras de Gás e Visitas",
        icon: ActivitySquare,
        color: "from-orange-400 to-red-500",
        textColor: "text-orange-400",
        bgColor: "bg-orange-400/10",
        borderColor: "border-orange-400/20",
        description: "Técnico responsável pela instalação de mangueiras de gás na rua, garantindo segurança e qualidade no atendimento aos clientes finais.",
        tags: ["Instalação", "Serviços", "Segurança"],
        email: "vaga_aberta@ramaflow.com",
        phone: "(11) 90000-0000",
        joined: "Em breve",
        autonomy: "Serviços externos e roteamento",
        careerPlan: "Líder de Equipe Técnica, supervisionando outros instaladores.",
        strategicFocus: ["Qualidade da Instalação", "Segurança", "Satisfação do Cliente"],
        goals: ["Zerar vazamentos ou retornos", "Cumprir 100% da agenda de visitas", "Manter avaliação 5 estrelas"],
        children: []
      },
`;

const maraRegex = /id: "mara"[\s\S]*?children: \[\]\s*\}/;
const match = content.match(maraRegex);
if (match) {
    const splitIndex = match.index + match[0].length;
    content = content.substring(0, splitIndex) + ',\n' + newMember + content.substring(splitIndex);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Added Tecnico Gas safely!');
} else {
    console.log('Could not match Mara section');
}
